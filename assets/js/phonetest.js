// Wait for PhoneGap to load
// 
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
//
function onDeviceReady() {
}

function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    $("#connection_type").text(states[networkState]);
    delete networkState;
    delete states;
}

function onGeolocationSuccess(position) {
    $("#location_lat_lng").text(position.coords.latitude + ", " + position.coords.longitude);
    $("#location_altitude").text(position.coords.altitude);
    $("#location_accuracy").text(position.coords.accuracy + " m");
    $("#location_altitude_accuracy").text(position.coords.altitudeAccuracy);
    $("#location_heading").text(position.coords.heading);
    $("#location_timestamp").text(new Date(position.timestamp));
}

function onGeolocationError(error) {
    $("#location_lat_lng").text(error.code + "(", error.message, ")");
}

function checkGeolocation() {
    navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError);
}

function checkDevice() {
    $("#device_name").text(device.name);
    $("#device_phonegap_version").text(device.phonegap);
    $("#device_platform").text(device.platform);
    $("#device_uuid").text(device.uuid);
    $("#device_version").text(device.version);
}

function sort_phone_numbers(phoneNumbers) {
    var result = "";
    var preferred = 0;
    var i = 0;

    for(i = 0; i < phoneNumbers.length; i++) {
        if(phoneNumbers[i].pref == true) {
            preferred = i;
            break;
        }
    }
    result += "    <p><b>" + phoneNumbers[preferred].type + "</b> " + phoneNumbers[preferred].value + "</p>";

    if(phoneNumbers.length != 1) {
        result += "    <div data-role=\"collapsible\" data-theme=\"c\" data-content-theme=\"c\">";
        result += "        <h3>Other phone numbers</h3><p>";
        for(i = 0; i < phoneNumbers.length; i++) {
            if(i != preferred) {
                result += "<b>" + phoneNumbers[i].type + "</b> " + phoneNumbers[i].value + " <br />";
            }
        }
        result += "    </p></div>";
    }
    
    delete i;
    delete result;
    delete preferred;
    return result;
}

function onReadContactDetailSuccess(contacts) {
    var content = "";
    var i = 0;
    $("#contact_detail").html(content);
    if(contacts.length != 0) {
        content += "<div data-role=\"collapsible\" data-collapsed=\"false\" data-theme=\"b\" data-content-theme=\"c\" id=\"contacts_detail_data\">";
        content += "    <h3>" + contacts[0].displayName + "</h3>";
        content += sort_phone_numbers(contacts[0].phoneNumbers);
        content += "</div>";
        $("#contact_detail").append(content);
    }
    $("#contacts_detail_data").collapsible({refresh:true});
    $("#contacts_detail_data div[data-role=collapsible]").collapsible({refresh:true});
    delete content;
    delete i;
}

function onReadContactSuccess(contacts) {
    var i = 0;
    var j = 0;
    var contact_list = "";

    $("#show_contact").html("<ul data-role=\"listview\" id=\"contact_list\"></ul>");
    
    for(i = 0; i < contacts.length; i++) {
        contact_list = "";
        if(contacts[i].displayName == null) {
            continue;
        } else {
            if(contacts[i].phoneNumbers == null) {
                continue;
            } else {
                contact_list += "<li><a href=\"#page-detail\" onclick=\"insert_local_data('contact_name', '" + contacts[i].displayName + "');\">" + contacts[i].displayName;
                if(contacts[i].phoneNumbers.length > 1) {
                    contact_list += "<span class=\"ui-li-count\">" + contacts[i].phoneNumbers.length + "</span>";
                }
                contact_list +=	"</a></li>";
                $("#contact_list").append(contact_list);
            }
        }
    }
    delete i;
    delete j;
    delete contact_list;
    $("#contact_list").listview();
}

function insert_local_data(key_name, key_value) {
    console.log("call insert_local_data, key_name is " + key_name +", and it's value is " + key_value);
    window.localStorage.setItem(key_name, key_value);
}

function onReadContactError(error) {
    console.log("onReadContactError: error.code = " + error.code + ", with message :" + error.message);
}

function onReadContactDetailError(error) {
    console.log("onReadContactDetailError: error.code = " + error.code + ", with message :" + error.message);
}

function readContactDetail(contact_pattern) {
    var fields = ["*"];
    var options = new ContactFindOptions();
    options.filter = contact_pattern;
    options.multiple = true;
    navigator.contacts.find(fields, onReadContactDetailSuccess, onReadContactDetailError, options);
    delete fields;
    delete options;
    return false;
}

function readContact() {
    var fields = ["*"];
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    navigator.contacts.find(fields, onReadContactSuccess, onReadContactError, options);
    delete fields;
    delete options;
    return false;
}

var db;
var dbCreated = false;

function init_db() {
    db = window.openDatabase("phonetest", "1.0", "phonetest", 5*1024*1024);
    db.transaction(populate_db, transaction_error, populate_db_success);
}

function transaction_error(tx, error) {
    console.log("Database Error: " + error);
}

function populate_db_success() {
    dbCreated = true;
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
}