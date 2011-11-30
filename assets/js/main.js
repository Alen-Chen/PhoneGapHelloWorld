// Wait for PhoneGap to load
// 
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
//
function onDeviceReady() {
    delete onDeviceReady;
}

var DB_NAME = "phonetest"

function init_db() {
    $('body').addClass('ui-loading');
    var lib = new localStorageDB(DB_NAME);
    if(lib.isNew()) {
        lib.createTable("names", ["contact_id", "formatted", "familyName", "givenName", "middleName", "honorificPrefix", "honorificSuffix"]);
        lib.createTable("numbers", ["contact_id", "type", "value", "pref"]);
        lib.createTable("emails", ["contact_id", "type", "value", "pref"]);
        lib.createTable("addresses", ["contact_id", "type", "formatted", "streetAddress", "locality", "region", "postalCode", "country", "pref"]);
        lib.createTable("imses", ["contact_id", "type", "value", "pref"]);
        lib.createTable("organizations", ["contact_id", "type", "name", "department", "title", "pref"]);
        lib.createTable("photos", ["contact_id", "type", "value", "pref"]);
        lib.createTable("categories", ["contact_id", "type", "value", "pref"]);
        lib.createTable("urls", ["contact_id", "type", "value", "pref"]);
        lib.createTable("contacts", ["internal_id", "displayName", "nickname", "birthday", "note"]);
        lib.commit();
    }
    $('body').removeClass('ui-loading');
    delete init_db;
}


function sleep( mseconds ) {
    var timer = new Date();
    var time = timer.getTime();
    do {
        timer = new Date();
    } while( (timer.getTime() - time) < (mseconds) );
}