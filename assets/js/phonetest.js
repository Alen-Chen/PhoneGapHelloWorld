// Wait for PhoneGap to load
// 
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is loaded and it is now safe to make calls PhoneGap methods
//
function onDeviceReady() {
    checkConnection();
    checkGeolocation();
    checkDevice();
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
