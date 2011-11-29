function checkDevice() {
    $("#device_name").text(device.name);
    $("#device_phonegap_version").text(device.phonegap);
    $("#device_platform").text(device.platform);
    $("#device_uuid").text(device.uuid);
    $("#device_version").text(device.version);
    delete checkDevice;
}