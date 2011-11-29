// Wait for PhoneGap to load
// 
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
//
function onDeviceReady() {
    delete onDeviceReady;
}

var db;
var dbCreated = false;

function init_db() {
    $('body').addClass('ui-loading');
    db = window.openDatabase("phonetest", "1.0", "phonetest", 5*1024*1024);
    db.transaction(populate_db, transaction_error, populate_db_success);
    $('body').removeClass('ui-loading');
    delete init_db;
}

function transaction_error(tx, error) {
    console.log("Database Error: " + error);
    db = null;
}

function populate_db_success() {
    dbCreated = true;
    db = null;
    delete pupulate_db_success;
}

function populate_db(tx) {
    var sql_names    = "CREATE TABLE IF NOT EXISTS names (" +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "contact_id INTEGER, " +
                        "formatted VARCHAR(128), " +
                        "familyName VARCHAR(128), " +
                        "givenName VARCHAR(128), " +
                        "middleName VARCHAR(128), " +
                        "honorificPrefix VARCHAR(128), " +
                        "honorificSuffix VARCHAR(128))";
    tx.executeSql(sql_names);

    var sql_numbers  = "CREATE TABLE IF NOT EXISTS numbers (" +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "contact_id INTEGER, " +
                        "type VARCHAR(128), " +
                        "value VARCHAR(128), " +
                        "pref BOOL)";
    tx.executeSql(sql_numbers);

    var sql_emails   = "CREATE TABLE IF NOT EXISTS emails (" +
                       "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                       "contact_id INTEGER, " +
                       "type VARCHAR(128), " +
                       "value VARCHAR(128), " +
                       "pref BOOL)";
    tx.executeSql(sql_emails);

    var sql_addresses = "CREATE TABLE IF NOT EXISTS addresses (" +
                        "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                        "contact_id INTEGER, " +
                        "type VARCHAR(128), " +
                        "formatted VARCHAR(128), " +
                        "streetAddress VARCHAR(128), " +
                        "locality VARCHAR(128), " +
                        "region VARCHAR(128), " +
                        "postalCode VARCHAR(128), " +
                        "country VARCHAR(128), " +
                        "pref BOOL)";
    tx.executeSql(sql_addresses);

    var sql_Imses   = "CREATE TABLE IF NOT EXISTS imses (" +
                       "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                       "contact_id INTEGER, " +
                       "type VARCHAR(128), " +
                       "value VARCHAR(128), " +
                       "pref BOOL)";
    tx.executeSql(sql_Imses);

    var sql_organizations   = "CREATE TABLE IF NOT EXISTS organizations (" +
                      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                      "contact_id INTEGER, " +
                      "type VARCHAR(128), " +
                      "name VARCHAR(128), " +
                      "department VARCHAR(128), " +
                      "title VARCHAR(128), " +
                      "pref BOOL)";
    tx.executeSql(sql_organizations);

    var sql_photos   = "CREATE TABLE IF NOT EXISTS photos (" +
                      "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                      "contact_id INTEGER, " +
                      "type VARCHAR(128), " +
                      "value VARCHAR(128), " +
                      "pref BOOL)";
    tx.executeSql(sql_photos);

    var sql_categories = "CREATE TABLE IF NOT EXISTS categories (" +
                       "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                       "contact_id INTEGER, " +
                       "type VARCHAR(128), " +
                       "value VARCHAR(128), " +
                       "pref BOOL)";
    tx.executeSql(sql_categories);

    var sql_urls = "CREATE TABLE IF NOT EXISTS urls (" +
                         "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                         "contact_id INTEGER, " +
                         "type VARCHAR(128), " +
                         "value VARCHAR(128), " +
                         "pref BOOL)";
    tx.executeSql(sql_urls);

    var sql_contacts = "CREATE TABLE IF NOT EXISTS contacts (" +
                       "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                       "internal_id INTEGER, " +
                       "displayName VARCHAR(128), " +
                       "nickname VARCHAR(128), " +
                       "birthday DATETIME, " +
                       "note VARCHAR(128))";
    tx.executeSql(sql_contacts);
    
    delete populate_db;
}

function sleep( mseconds ) {
    var timer = new Date();
    var time = timer.getTime();
    do {
        timer = new Date();
    } while( (timer.getTime() - time) < (mseconds) );
}