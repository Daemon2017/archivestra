import json

from flask import Flask, request, Response
from flask_cors import CORS
from lxml import etree
from waitress import serve

from back import db

app = Flask(__name__)
cors = CORS(app)


@app.route('/svg', methods=['GET'])
def get_svg():
    request_data_json = json.loads(request.data)
    archive = request_data_json['archive']
    fund = request_data_json['fund']
    inventory = request_data_json['inventory']
    value = request_data_json['value']
    page = request_data_json['page']
    driver = db.get_driver()
    with driver:
        driver.wait(fail_fast=True, timeout=5)
        session = driver.table_client.session().create()
        contents = db.select_contents_content(session, archive, fund, inventory, value, page)
        data = json.loads(contents)
        text_annotation = data['result']['textAnnotation']
        root = etree.Element(
            'svg',
            height=text_annotation['height'],
            width=text_annotation['width'],
            xmlns='http://www.w3.org/2000/svg'
        )
        elements = []
        for block in data['result']['textAnnotation']['blocks']:
            for line in block['lines']:
                for word in line['words']:
                    vertices = word['boundingBox']['vertices']
                    element = etree.Element(
                        'text',
                        x=vertices[0]['x'],
                        y=vertices[0]['y'],
                        textLength=str(int(vertices[2]['x']) - int(vertices[0]['x'])),
                        lengthAdjust='spacingAndGlyphs',
                        style='font-size: {0}'.format(str(int(vertices[2]['y']) - int(vertices[0]['y'])))
                    )
                    element.text = word['text']
                    elements.append(element)
        for element in elements:
            root.append(element)
        return Response(etree.tostring(root, pretty_print=True, encoding='utf-8'), mimetype='image/svg+xml')


if __name__ == '__main__':
    print('archivestra ready!')
    serve(app,
          host='0.0.0.0',
          port=8080)
