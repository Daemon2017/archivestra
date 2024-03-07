import json

from flask import Flask, request, Response
from flask_cors import CORS
from lxml import etree
from waitress import serve

from back import db

app = Flask(__name__)
cors = CORS(app)
pool = db.get_session_pool()


@app.route('/contents', methods=['GET'])
def get_contents():
    request_data_json = json.loads(request.data)
    archive = request_data_json['archive']
    fund = request_data_json['fund']
    inventory = request_data_json['inventory']
    value = request_data_json['value']
    page = request_data_json['page']
    content = pool.retry_operation_sync(
        db.select_contents_content,
        None, archive, fund, inventory, value, page
    )[0]['content']
    data = json.loads(content)
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
                width = int(vertices[2]['x']) - int(vertices[0]['x'])
                height = int(vertices[2]['y']) - int(vertices[0]['y'])
                element = etree.Element(
                    'text',
                    x=vertices[0]['x'],
                    y=vertices[0]['y'],
                    textLength=str(width),
                    lengthAdjust='spacingAndGlyphs',
                    style='font-size: {0}'.format(str(height))
                )
                element.text = word['text']
                root.append(element)
    svg_string = etree.tostring(root, pretty_print=True, encoding='utf-8')
    return Response(svg_string, mimetype='image/svg+xml')


if __name__ == '__main__':
    print('archivestra ready!')
    serve(app,
          host='0.0.0.0',
          port=8080)
