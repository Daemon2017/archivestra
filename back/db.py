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


def create_descriptions(session):
    query = """
        CREATE TABLE descriptions (
        archive Utf8 NOT NULL, 
        fund Utf8 NOT NULL, 
        inventory Utf8 NOT NULL, 
        value Utf8 NOT NULL, 
        description Utf8,
        PRIMARY KEY (archive, fund, inventory, value)
        );
        """
    session.execute_scheme(query)


def upsert_descriptions(session, archive, fund, inventory, value, description):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        DECLARE $description AS Utf8;
        UPSERT INTO descriptions (archive, fund, inventory, value, description) 
        VALUES ($archive, $fund, $inventory, $value, $description);
        """
    prepared_query = session.prepare(query)
    session.transaction().execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
            '$description': description,
        },
        commit_tx=True,
    )


def select_descriptions_archive(session):
    query = """
        SELECT DISTINCT archive
        FROM descriptions
        ORDER BY archive ASC;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {},
        commit_tx=True,
    )
    return result_sets[0].rows


def select_descriptions_fund(session, archive):
    query = """
        DECLARE $archive AS Utf8;
        SELECT DISTINCT fund
        FROM descriptions
        WHERE archive = $archive
        ORDER BY fund ASC;
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


def select_descriptions_inventory(session, archive, fund):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        SELECT DISTINCT inventory
        FROM descriptions
        WHERE archive = $archive
        and fund = $fund
        ORDER BY inventory ASC;
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


def select_descriptions_value(session, archive, fund, inventory):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        SELECT DISTINCT value
        FROM descriptions
        WHERE archive = $archive
        and fund = $fund
        and inventory = $inventory
        ORDER BY value ASC;
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
        SELECT DISTINCT description
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


def select_descriptions(session, description, archive, fund, inventory):
    where_query = 'WHERE description ILIKE $description\n'
    if archive != '':
        where_query += 'AND archive = $archive\n'
        if fund != '':
            where_query += 'AND fund = $fund\n'
            if inventory != '':
                where_query += 'AND inventory = $inventory\n'
    query = f"""
        DECLARE $description AS Utf8;
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        SELECT archive, fund, inventory, value, description
        FROM descriptions
        {where_query}
        ORDER BY archive ASC, fund ASC, inventory ASC, value ASC, description ASC;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$description': description,
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
        },
        commit_tx=True,
    )
    return result_sets[0].rows


def create_contents(session):
    query = """
        CREATE TABLE contents (
        archive Utf8 NOT NULL, 
        fund Utf8 NOT NULL, 
        inventory Utf8 NOT NULL, 
        value Utf8 NOT NULL, 
        page Uint64 NOT NULL,
        short Utf8,
        content Utf8,
        PRIMARY KEY (archive, fund, inventory, value, page)
        );
        """
    session.execute_scheme(query)


def upsert_contents(session, archive, fund, inventory, value, page, short, content):
    query = """
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        DECLARE $page AS Uint64;
        DECLARE $short AS Utf8;
        DECLARE $content AS Utf8;
        UPSERT INTO contents (archive, fund, inventory, value, page, short, content) 
        VALUES ($archive, $fund, $inventory, $value, $page, $short, $content);
        """
    prepared_query = session.prepare(query)
    session.transaction().execute(
        prepared_query,
        {
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
            '$page': page,
            '$short': short,
            '$content': content,
        },
        commit_tx=True,
    )


def select_contents_archive(session):
    query = """
        SELECT DISTINCT archive
        FROM contents
        ORDER BY archive ASC;
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
        SELECT DISTINCT fund
        FROM contents
        WHERE archive = $archive
        ORDER BY fund ASC;
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
        SELECT DISTINCT inventory
        FROM contents
        WHERE archive = $archive
        and fund = $fund
        ORDER BY inventory ASC;
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
        SELECT DISTINCT value
        FROM contents
        WHERE archive = $archive
        and fund = $fund
        and inventory = $inventory
        ORDER BY value ASC;
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
        and value = $value
        ORDER BY page ASC;
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


def select_contents_short(session, archive, fund, inventory, value, page):
    query = f"""
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        DECLARE $page AS Uint64;
        SELECT DISTINCT short
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


def select_contents_content(session, archive, fund, inventory, value, page):
    query = f"""
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        DECLARE $page AS Uint64;
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


def select_contents(session, short, archive, fund, inventory, value):
    where_query = 'WHERE short ILIKE $short\n'
    if archive != '':
        where_query += 'AND archive = $archive\n'
        if fund != '':
            where_query += 'AND fund = $fund\n'
            if inventory != '':
                where_query += 'AND inventory = $inventory\n'
                if value != '':
                    where_query += 'AND value = $value\n'
    query = f"""
        DECLARE $short AS Utf8;
        DECLARE $archive AS Utf8;
        DECLARE $fund AS Utf8;
        DECLARE $inventory AS Utf8;
        DECLARE $value AS Utf8;
        SELECT archive, fund, inventory, value, page, short
        FROM contents
        {where_query}
        ORDER BY archive ASC, fund ASC, inventory ASC, value ASC, page ASC, short ASC;
        """
    prepared_query = session.prepare(query)
    result_sets = session.transaction(ydb.SerializableReadWrite()).execute(
        prepared_query,
        {
            '$short': short,
            '$archive': archive,
            '$fund': fund,
            '$inventory': inventory,
            '$value': value,
        },
        commit_tx=True,
    )
    return result_sets[0].rows
