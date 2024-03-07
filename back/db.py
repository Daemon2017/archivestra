import uuid

import ydb

db_key_path = 'key.json'
database = '/ru-central1/b1gq47q3820jil5087ik/etn40a53g48m08r3759h'


def get_session_pool():
    driver = ydb.Driver(
        endpoint='grpcs://ydb.serverless.yandexcloud.net:2135',
        database=database,
        credentials=ydb.iam.ServiceAccountCredentials.from_file(db_key_path),
    )
    driver.wait(fail_fast=True, timeout=5)
    pool = ydb.SessionPool(driver)
    return pool


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
            '$id': str(uuid.uuid4()),
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
            '$description': description,
        },
        commit_tx=True,
    )


def select_descriptions_archives(session):
    query = """
        SELECT DISTINCT archive
        FROM descriptions;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {},
        commit_tx=True,
    )
    return result_sets[0].rows


def select_descriptions_funds(session, archive):
    query = """
        DECLARE $archive AS Utf8;
        SELECT DISTINCT fund
        FROM descriptions
        WHERE archive = $archive;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def select_descriptions_inventories(session, archive, fund):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        SELECT DISTINCT inventory
        FROM descriptions
        WHERE archive = $archive
        and fund = $fund;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def select_descriptions_values(session, archive, fund, inventory):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        SELECT DISTINCT value
        FROM descriptions
        WHERE archive = $archive
        and fund = $fund
        and inventory = $inventory;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


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
            '$id': str(uuid.uuid4()),
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
            '$page': page,
            '$content': content,
        },
        commit_tx=True,
    )


def select_contents_archive(session):
    query = """
        SELECT DISTINCT page
        FROM contents;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {},
        commit_tx=True,
    )
    return result_sets[0].rows


def select_contents_fund(session, archive):
    query = """
        DECLARE $archive AS Utf8;
        SELECT DISTINCT page
        FROM contents
        WHERE archive = $archive;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def select_contents_inventory(session, archive, fund):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        SELECT DISTINCT page
        FROM contents
        WHERE archive = $archive
        and fund = $fund;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def select_contents_value(session, archive, fund, inventory):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        SELECT DISTINCT page
        FROM contents
        WHERE archive = $archive
        and fund = $fund
        and inventory = $inventory;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def select_contents_page(session, archive, fund, inventory, value):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        SELECT DISTINCT page
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
        SELECT DISTINCT content
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
    return result_sets[0].rows
