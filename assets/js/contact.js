function selectByInternalId(contacts_internal_id, what, where) {
    var db;
    var result_id = -1;
    var result_data;
    db = window.openDatabase("phonetest", "1.0", "phonetest", 1*1024*1024);
    sql_main = "SELECT " + what + " FROM " + where + " WHERE internal_id = " + contacts_internal_id;
    console.log("select sql by internal id => "+sql_main);
    
    db.transaction(
        function(tx) {
            tx.executeSql(
                sql_main,
                [],
                function(tx, result) {
                    result_data = result.rows.item(0);
                    result_id = result_data.id;
                    console.log("result.rows.item(0).id = " + result_data.id);
                },
                function(tx,error) {
                    console.log("error = "+ error);
                }
            )
        }
    );
    
    db = null;
    return result_id;
}


function exec_sql(sql) {
    gSql = sql;
    db = window.openDatabase("phonetest", "1.0", "phonetest", 1*1024*1024);
    db.transaction(operate_db, transaction_error, operate_db_success);
}

function operate_db(tx) {
    tx.executeSql(gSql);
}

function transaction_error(tx, error) {
    console.log("Database Error: " + error);
    db = null;
}

function operate_db_success() {
    db = null;
}
