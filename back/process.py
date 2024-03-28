import base64
import json
import os

import requests
import yaml

import db

data_dir = 'data'
ocr_key_path = 'api-key.yaml'
x_folder_id = 'b1ge7l6307kuksqnm13c'


def get_api_key(key_file_path):
    with open(key_file_path) as key_file:
        key_yaml = yaml.safe_load(key_file)
        api_key = key_yaml['secret']
        return api_key


def read_description(path):
    with open(os.path.join(path, 'description.txt'), mode='r', encoding='utf-8') as file:
        description = file.read()
        return description[:128]


def get_content(content, api_key):
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
    pool = db.get_session_pool()
    print('Создаю таблицу descriptions...')
    pool.retry_operation_sync(
        db.create_descriptions,
        None
    )
    print('Создаю таблицу contents...')
    pool.retry_operation_sync(
        db.create_contents,
        None
    )
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
                    if pool.retry_operation_sync(
                            db.select_descriptions_description,
                            None, archive, fund, inventory, value
                    ):
                        print('Содержимое файла description.txt уже загружено в БД! '
                              'Повторная выгрузка не будет осуществлена.')
                    else:
                        description = read_description(path)
                        pool.retry_operation_sync(
                            db.upsert_descriptions,
                            None, archive, fund, inventory, value, description
                        )
                        print('Содержимое файла description.txt успешно выгружено.')
                    print('Распознаю и выгружаю страницы дела...')
                    response = pool.retry_operation_sync(
                        db.select_contents_page,
                        None, archive, fund, inventory, value
                    )
                    filenames = list(filter(lambda f: f.endswith('.jpg'), os.listdir(path)))
                    pages = [int(os.path.splitext(filename)[0]) for filename in filenames]
                    pages.sort()
                    for page in pages:
                        if page in [int(row['page']) for row in response]:
                            print('Страница {0} уже распознана и выгружена в БД! '
                                  'Перехожу к следующей странице...'.format(page))
                            continue
                        file_path = os.path.join(data_dir, archive, fund, inventory, value, '{0}.jpg'.format(str(page)))
                        with open(file_path, 'rb') as image:
                            content_base64 = base64.b64encode(image.read()).decode()
                            content = get_content(content_base64, api_key)
                            content_json = json.loads(content)
                            if 'error' in content_json:
                                print('Ошибка в ходе распознавания страницы {0}! '
                                      'Перехожу к следующей странице...'.format(page))
                                continue
                            else:
                                short = content_json['result']['textAnnotation']['fullText'].replace('\n', ' ')
                                pool.retry_operation_sync(
                                    db.upsert_contents,
                                    None, archive, fund, inventory, value, page, short, content
                                )
                                print('Страница {0} успешно выгружена.'.format(page))


if __name__ == '__main__':
    main()
