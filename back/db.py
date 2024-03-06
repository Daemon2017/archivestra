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
    query = """
        DECLARE $id AS Utf8;
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        DECLARE $description AS Utf8;
        UPSERT INTO descriptions (id, archive, fund, inventory, value, description) 
        VALUES ($id, $archive, $fund, $inventory, $value, $description);
        """.format(uuid.uuid4(), archive, fund, inventory, value, description)
    prepared_query = session.prepare(query)
    session.transaction().execute(
        prepared_query,
        {
            '$id': uuid.uuid4(),
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
            '$description': description,
        },
        commit_tx=True,
    )


def select_descriptions_description(session, archive, fund, inventory, value):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        SELECT description
        FROM descriptions
        WHERE archive = $archive
        and fund = $fund
        and inventory = $inventory
        and value = $value;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def upsert_contents(session, archive, fund, inventory, value, page, content):
    query = """
        DECLARE $id AS Utf8;
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        DECLARE $page AS Utf8;
        DECLARE $content AS Utf8;
        UPSERT INTO contents (id, archive, fund, inventory, value, page, content) 
        VALUES ($id, $archive, $fund, $inventory, $value, $page, $content);
        """
    prepared_query = session.prepare(query)
    session.transaction().execute(
        prepared_query,
        {
            '$id': uuid.uuid4(),
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
            '$page': page,
            '$content': content,
        },
        commit_tx=True,
    )


def select_contents_page(session, archive, fund, inventory, value):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        SELECT page
        FROM contents
        WHERE archive = $archive
        and fund = $fund
        and inventory = $inventory
        and value = $value;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def select_contents_content(session, archive, fund, inventory, value, page):
    query = f"""
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        DECLARE $page AS Utf8;
        SELECT content
        FROM contents
        WHERE archive = $archive
        and fund = $fund
        and inventory = $inventory
        and value = $value
        and page = $page;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
            '$page': page,
        },
        commit_tx=True,
    )
    return result_sets[0].rows[0]['content'].strip('\"')
