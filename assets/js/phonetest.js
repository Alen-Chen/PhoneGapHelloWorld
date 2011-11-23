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

function onReadContactSuccess(contacts) {
    var i = 0;
    var j = 0;
    var contact_list = "";
    for(i = 0; i < contacts.length; i++) {
        contact_list = "";
        if(contacts[i].displayName == null) {
            continue;
        } else {
            console.log("id = " + contacts[i].id + ", Display name is = " + contacts[i].displayName);
            console.log("nickname = " + contacts[i].nickname + ", note is = " + contacts[i].note);
            if(contacts[i].phoneNumbers == null) {
                continue;
            } else {
                contact_list += "<li data-theme=\"c\" class=\"ui-btn ui-btn-up-c ui-btn-icon-right ui-li-has-arrow ui-li\">";
                contact_list += "<div class=\"ui-btn-inner ui-li\" aria-hidden=\"true\"><div class=\"ui-btn-text\">";
                contact_list += "<a href=\"#page-contact-detail\" class=\"ui-link-inherit\">" + contacts[i].displayName;
                for(j = 0; j < contacts[i].phoneNumbers.length; j++) {
                    contact_list += " " + contacts[i].phoneNumbers[j].value + " ";
                }
                contact_list += "</a></div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\"></span></div></li>";
            }
            $("#contact_list").append(contact_list);
        }
    }
    delete i;
    delete j;
    delete contact_list;
}

function onReadContactError(error) {
    $("#contact_list").text(error.code + "(", error.message, ")");
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