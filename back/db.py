import uuid

import ydb

db_key_path = 'key.json'
database = '/ru-central1/b1gq47q3820jil5087ik/etn40a53g48m08r3759h'


def get_driver():
    return ydb.Driver(
        endpoint='grpcs://ydb.serverless.yandexcloud.net:2135',
        database=database,
        credentials=ydb.iam.ServiceAccountCredentials.from_file(db_key_path),
    )


def upsert_descriptions(session, archive, fund, inventory, value, description):
    session.transaction().execute(
        """
        UPSERT INTO descriptions (id, archive, fund, inventory, value, description) 
        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}');
        """.format(uuid.uuid4(), archive, fund, inventory, value, description),
        commit_tx=True,
    )


def select_descriptions_description(session, archive, fund, inventory, value):
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


def upsert_contents(session, archive, fund, inventory, value, page, content):
    session.transaction().execute(
        """
        UPSERT INTO contents (id, archive, fund, inventory, value, page, content) 
        VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}');
        """.format(uuid.uuid4(), archive, fund, inventory, value, page, content),
        commit_tx=True,
    )


def select_contents_page(session, archive, fund, inventory, value):
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
