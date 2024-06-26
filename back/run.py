import json
from math import ceil

import natsort
import pandas as pd
from flask import Flask, request, Response
from flask_cors import CORS
from lxml import etree
from waitress import serve

import db

app = Flask(__name__)
cors = CORS(app)
pool = db.get_session_pool()


@app.route('/descriptions_archive', methods=['POST'])
def get_descriptions_archive():
    response = pool.retry_operation_sync(
        db.select_descriptions_archive,
        None
    )
    pages = natsort.natsorted([row['archive'] for row in response])
    return Response(json.dumps(pages), mimetype='application/json')


@app.route('/descriptions_fund', methods=['POST'])
def get_descriptions_fund():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_descriptions_fund,
        None, rq_json['archive']
    )
    funds = natsort.natsorted([row['fund'] for row in response])
    return Response(json.dumps(funds), mimetype='application/json')


@app.route('/descriptions_inventory', methods=['POST'])
def get_descriptions_inventory():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_descriptions_inventory,
        None, rq_json['archive'], rq_json['fund']
    )
    inventories = natsort.natsorted([row['inventory'] for row in response])
    return Response(json.dumps(inventories), mimetype='application/json')


@app.route('/descriptions_value', methods=['POST'])
def get_descriptions_value():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_descriptions_value,
        None, rq_json['archive'], rq_json['fund'], rq_json['inventory']
    )
    values = natsort.natsorted([row['value'] for row in response])
    return Response(json.dumps(values), mimetype='application/json')


@app.route('/descriptions_description', methods=['POST'])
def get_descriptions_description():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_descriptions_description,
        None, rq_json['archive'], rq_json['fund'], rq_json['inventory'], rq_json['value']
    )[0]['description']
    return Response(json.dumps(response), mimetype='application/json')


@app.route('/descriptions', methods=['POST'])
def get_descriptions():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_descriptions,
        None,
        '%{0}%'.format(rq_json['description']),
        get_json_value(rq_json, 'archive'),
        get_json_value(rq_json, 'fund'),
        get_json_value(rq_json, 'inventory')
    )
    response_json = json.dumps(response)
    df = pd.read_json(response_json)
    pages = ceil(len(df) / 10)
    current_page = 1
    if 'currentPage' in rq_json and rq_json['currentPage'] != '':
        current_page = int(rq_json['currentPage'])
    from_row = (current_page - 1) * 10
    to_row = current_page * 10
    df = df[from_row:to_row]
    df.rename(
        columns=
        {
            'archive': 'Архив',
            'fund': 'Фонд',
            'inventory': 'Опись',
            'value': 'Дело',
            'description': 'Заголовок',
        },
        inplace=True
    )
    csv = df.to_csv(sep=',', index=False, header=True)
    response = {
        'body': csv,
        'pages': pages
    }
    return Response(json.dumps(response), mimetype='application/json')


@app.route('/contents_archive', methods=['POST'])
def get_contents_archive():
    response = pool.retry_operation_sync(
        db.select_contents_archive,
        None
    )
    archives = natsort.natsorted([row['archive'] for row in response])
    return Response(json.dumps(archives), mimetype='application/json')


@app.route('/contents_fund', methods=['POST'])
def get_contents_fund():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_contents_fund,
        None, rq_json['archive']
    )
    funds = natsort.natsorted([row['fund'] for row in response])
    return Response(json.dumps(funds), mimetype='application/json')


@app.route('/contents_inventory', methods=['POST'])
def get_contents_inventory():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_contents_inventory,
        None, rq_json['archive'], rq_json['fund']
    )
    inventories = natsort.natsorted([row['inventory'] for row in response])
    return Response(json.dumps(inventories), mimetype='application/json')


@app.route('/contents_value', methods=['POST'])
def get_contents_value():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_contents_value,
        None, rq_json['archive'], rq_json['fund'], rq_json['inventory']
    )
    values = natsort.natsorted([row['value'] for row in response])
    return Response(json.dumps(values), mimetype='application/json')


@app.route('/contents_page', methods=['POST'])
def get_contents_page():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_contents_page,
        None, rq_json['archive'], rq_json['fund'], rq_json['inventory'], rq_json['value']
    )
    pages = natsort.natsorted([row['page'] for row in response])
    return Response(json.dumps(pages), mimetype='application/json')


@app.route('/contents_short', methods=['POST'])
def get_contents_short():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_contents_short,
        None, rq_json['archive'], rq_json['fund'], rq_json['inventory'], rq_json['value'], rq_json['page']
    )[0]['short']
    return Response(json.dumps(response), mimetype='application/json')


@app.route('/contents_content', methods=['POST'])
def get_contents_content():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_contents_content,
        None, rq_json['archive'], rq_json['fund'], rq_json['inventory'], rq_json['value'], rq_json['page']
    )[0]['content']
    data = json.loads(response)
    text_annotation = data['result']['textAnnotation']
    root = etree.Element(
        'svg',
        height='100%',
        width='100%',
        viewBox="0 0 {0} {1}".format(text_annotation['width'], text_annotation['height']),
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


@app.route('/contents', methods=['POST'])
def get_contents():
    rq_json = request.json
    response = pool.retry_operation_sync(
        db.select_contents,
        None,
        '%{0}%'.format(rq_json['short']),
        get_json_value(rq_json, 'archive'),
        get_json_value(rq_json, 'fund'),
        get_json_value(rq_json, 'inventory'),
        get_json_value(rq_json, 'value')
    )
    response_json = json.dumps(response)
    df = pd.read_json(response_json)
    pages = ceil(len(df) / 10)
    current_page = 1
    if 'currentPage' in rq_json and rq_json['currentPage'] != '':
        current_page = int(rq_json['currentPage'])
    from_row = (current_page - 1) * 10
    to_row = current_page * 10
    df = df[from_row:to_row]
    df.rename(
        columns=
        {
            'archive': 'Архив',
            'fund': 'Фонд',
            'inventory': 'Опись',
            'value': 'Дело',
            'page': 'Страница',
            'short': 'Содержание'
        },
        inplace=True
    )
    csv = df.to_csv(sep=',', index=False, header=True)
    response = {
        'body': csv,
        'pages': pages
    }
    return Response(json.dumps(response), mimetype='application/json')


def get_json_value(rq_json, key):
    if key in rq_json and rq_json[key] != '':
        return rq_json[key]
    else:
        return ''


if __name__ == '__main__':
    print('archivestra ready!')
    serve(app,
          host='0.0.0.0',
          port=8080)
