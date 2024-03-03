import base64
import json
import os
import uuid

import requests
import yaml
import ydb

data_dir = 'data'
x_folder_id = 'b1ge7l6307kuksqnm13c'
db_key_path = 'key.json'
database = '/ru-central1/b1gq47q3820jil5087ik/etn40a53g48m08r3759h'
ocr_key_path = 'api-key.yaml'


def get_api_key(key_file_path):
    with open(key_file_path) as key_file:
        key_yaml = yaml.safe_load(key_file)
        api_key = key_yaml['secret']
        return api_key


def read_description(path):
    with open(os.path.join(path, 'description.txt'), mode='r', encoding='utf-8') as file:
        description = file.read()
        return description[:64]


def select_descriptions(session, archive, fund, inventory, value):
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        """
        SELECT description
        FROM descriptions
        WHERE archive = '{0}'
        and fund = '{1}'
        and inventory = '{2}'
        and value = '{3}';
        """.format(archive, fund, inventory, value),
        commit_tx=True,
    )
    return result_sets[0].rows


def upsert_descriptions(session, archive, fund, inventory, value, description):
    session.transaction().execute(
        """
        UPSERT INTO descriptions (id, archive, fund, inventory, value, description) 
        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}');
        """.format(uuid.uuid4(), archive, fund, inventory, value, description),
        commit_tx=True,
    )


def select_contents(session, archive, fund, inventory, value):
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        """
        SELECT page
        FROM contents
        WHERE archive = '{0}'
        and fund = '{1}'
        and inventory = '{2}'
        and value = '{3}';
        """.format(archive, fund, inventory, value),
        commit_tx=True,
    )
    return result_sets[0].rows


def upsert_contents(session, archive, fund, inventory, value, page, content):
    session.transaction().execute(
        """
        UPSERT INTO contents (id, archive, fund, inventory, value, page, content) 
        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}');
        """.format(uuid.uuid4(), archive, fund, inventory, value, page, content),
        commit_tx=True,
    )


def send_request(content, api_key):
    url = "https://ocr.api.cloud.yandex.net/ocr/v1/recognizeText"
    payload = json.dumps({
        "mimeType": "image",
        "languageCodes": ["ru"],
        "model": "handwritten",
        "content": content
    })
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Api-Key {0}'.format(api_key),
        'x-folder-id': x_folder_id,
        'x-data-logging-enabled': 'true'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    return response.text


def main():
    api_key = get_api_key(ocr_key_path)
    driver = ydb.Driver(
        endpoint='grpcs://ydb.serverless.yandexcloud.net:2135',
        database=database,
        credentials=ydb.iam.ServiceAccountCredentials.from_file(db_key_path),
    )
    with driver:
        driver.wait(fail_fast=True, timeout=5)
        session = driver.table_client.session().create()
        for archive in os.listdir(os.path.join(data_dir)):
            for fund in os.listdir(os.path.join(data_dir, archive)):
                for inventory in os.listdir(os.path.join(data_dir, archive, fund)):
                    for value in os.listdir(os.path.join(data_dir, archive, fund, inventory)):
                        print('\nПереключаюсь на архив {0} фонд {1} опись {2} дело {3}...'
                              .format(archive, fund, inventory, value))
                        path = os.path.join(data_dir, archive, fund, inventory, value)
                        print('Выгружаю содержимое файла description.txt...')
                        if 'description.txt' not in os.listdir(path):
                            print('ОШИБКА: отсутствует файл description.txt! '
                                  'Перехожу к следующему делу...')
                            continue
                        if select_descriptions(session, archive, fund, inventory, value):
                            print('Содержимое файла description.txt уже загружено в БД! '
                                  'Повторная выгрузка не будет осуществлена.')
                        else:
                            description = read_description(path)
                            upsert_descriptions(session, archive, fund, inventory, value, description)
                            print('Содержимое файла description.txt успешно выгружено.')
                        print('Распознаю и выгружаю страницы дела...')
                        contents = select_contents(session, archive, fund, inventory, value)
                        filenames = list(filter(lambda f: f.endswith('.jpg') or f.endswith('.png'), os.listdir(path)))
                        for filename in filenames:
                            page = os.path.splitext(filename)[0]
                            if page in [row['page'] for row in contents]:
                                print('Страница {0} уже распознана и выгружена в БД! '
                                      'Перехожу к следующей странице...'.format(page))
                                continue
                            file_path = os.path.join(data_dir, archive, fund, inventory, value, filename)
                            with open(file_path, 'rb') as image:
                                content_base64 = base64.b64encode(image.read()).decode()
                                content = send_request(content_base64, api_key)
                                if 'error' in json.loads(content):
                                    print('Ошибка в ходе распознавания страницы {0}! '
                                          'Перехожу к следующей странице...'.format(page))
                                    continue
                                else:
                                    upsert_contents(session, archive, fund, inventory, value, page, content)
                                    print('Страница {0} успешно выгружена.'.format(page))


if __name__ == '__main__':
    main()
