import json

import ydb
from flask import Flask, request, Response
from flask_cors import CORS
from lxml import etree
from waitress import serve

app = Flask(__name__)
cors = CORS(app)

db_key_path = 'key.json'
database = '/ru-central1/b1gq47q3820jil5087ik/etn40a53g48m08r3759h'


def select_contents_content(session, archive, fund, inventory, value, page):
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        """
        SELECT content
        FROM contents
        WHERE archive = '{0}'
        and fund = '{1}'
        and inventory = '{2}'
        and value = '{3}'
        and page = '{4}';
        """.format(archive, fund, inventory, value, page),
        commit_tx=True,
    )
    return result_sets[0].rows[0]['content'].strip('\"')


@app.route('/svg', methods=['GET'])
def get_svg():
    request_data_json = json.loads(request.data)
    archive = request_data_json['archive']
    fund = request_data_json['fund']
    inventory = request_data_json['inventory']
    value = request_data_json['value']
    page = request_data_json['page']
    driver = ydb.Driver(
        endpoint='grpcs://ydb.serverless.yandexcloud.net:2135',
        database=database,
        credentials=ydb.iam.ServiceAccountCredentials.from_file(db_key_path),
    )
    with driver:
        driver.wait(fail_fast=True, timeout=5)
        session = driver.table_client.session().create()
        contents = select_contents_content(session, archive, fund, inventory, value, page)
        data = json.loads(contents)
        text_annotation = data['result']['textAnnotation']
        root = etree.Element(
            'svg',
            height=text_annotation['height'],
            width=text_annotation['width'],
            xmlns='http://www.w3.org/2000/svg'
        )
        for block in data['result']['textAnnotation']['blocks']:
            for line in block['lines']:
                for word in line['words']:
                    vertices = word['boundingBox']['vertices']
                    sub_element = etree.SubElement(
                        root,
                        'text',
                        x=vertices[0]['x'],
                        y=vertices[0]['y'],
                        textLength=str(int(vertices[2]['x']) - int(vertices[0]['x'])),
                        lengthAdjust='spacingAndGlyphs',
                        style='font-size: {0}'.format(str(int(vertices[2]['y']) - int(vertices[0]['y'])))
                    )
                    sub_element.text = word['text']
        return Response(etree.tostring(root, pretty_print=True, encoding='utf-8'), mimetype='image/svg+xml')


if __name__ == '__main__':
    print('archivestra ready!')
    serve(app,
          host='0.0.0.0',
          port=8080)
