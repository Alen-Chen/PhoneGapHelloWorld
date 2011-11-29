var gSQL = new Array();

function executeInsert() {
    var db;
    db = window.openDatabase("phonetest", "1.0", "phonetest", 5*1024*1024);
    db.transaction(exec_db, transaction_error, exec_db_success);    
}

function insertContacts(contacts) {
    var sql_main = "";
    var sql_name = "";
    var sql_value = "";

    sql_main = "INSERT INTO contacts (";
    sql_name = "internal_id,displayName,nickname,birthday,note";
    sql_main += sql_name + ") VALUES (";

    if(contacts.id != null)             sql_value += contacts.id + ","; else sql_value += ",";
    if(contacts.displayName != null)    sql_value += "'" + contacts.displayName + "',"; else sql_value += "'',";
    if(contacts.nickname != null)       sql_value += "'" + contacts.nickname + "',"; else sql_value += "'',";
    if(contacts.birthday != null)       sql_value += "'" + contacts.birthday + "',"; else sql_value += "'',";
    if(contacts.note != null)           sql_value += "'" + contacts.note + "'"; else sql_value += "''";
    
    sql_main += sql_value + ");"
    console.log("insert sql = "+sql_main);
    gSQL.push(sql_main);
}

function exec_db(tx) {
    while(gSQL.length != 0) {
        tx.executeSql(gSQL.shift());
    }
}

function exec_db_success() {
    db = null;
}

function sort_phone_fields(data, comment) {
    var result = "";
    var preferred = 0;
    var i = 0;

    for(i = 0; i < data.length; i++) {
        if(data[i].pref == true) {
            preferred = i;
            break;
        }
    }
    result += "    <p><b>" + data[preferred].type + "</b> " + data[preferred].value + "</p>";

    if(data.length != 1) {
        result += "    <div data-role=\"collapsible\" data-theme=\"c\" data-content-theme=\"c\">";
        result += "        <h3>" + comment + "</h3><p>";
        for(i = 0; i < data.length; i++) {
            if(i != preferred) {
                result += "<b>" + data[i].type + "</b> " + data[i].value + " <br />";
            }
        }
        result += "    </p></div>";
    }
    return result;
}

function insert_local_data(key_name, key_value) {
    console.log("call insert_local_data, key_name is " + key_name +", and it's value is " + key_value);
    window.localStorage.setItem(key_name, key_value);
}

function readContact() {
    var fields = ["*"];
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    navigator.contacts.find(fields, onReadContactSuccess, onReadContactError, options);
    return false;
}

function onReadContactError(error) {
    console.log("onReadContactError: error.code = " + error.code + ", with message :" + error.message);
    $('body').removeClass('ui-loading');
}

function onReadContactSuccess(contacts) {
    var i = 0;
    var j = 0;
    var contact_list = "";
    var showName = "";
    var showNameType = 0;

    $("#show_contact").html("<ul data-role=\"listview\" id=\"contact_list\"></ul>");

    for(i = 0; i < contacts.length; i++) {        
        
        showNameType = 0;
        showName = "";
        contact_list = "";
        if(contacts[i].displayName == null) {
            if(contacts[i].nickname == null) {
                if(contacts[i].name == null) {
                    showNameType = 0;
                } else {
                    if(contacts[i].name.formatted != null) {
                        showName = contacts[i].name.formatted;
                        showNameType = 3; //name
                    } else if(contacts[i].name.givenName != null && contacts[i].name.familyName != null) {
                        showName = contacts[i].name.givenName + " " + contacts[i].name.familyName;
                        showNameType = 4; //name
                    }
                }
            } else {
                showName = contacts[i].nickname;
                showNameType = 2; //nickname
            }
        } else {
            showName = contacts[i].displayName;
            showNameType = 1; //displayName
        }

        if(showNameType == 1) {
            if(contacts[i].phoneNumbers == null && contacts[i].emails == null) {
                continue;
            } else {
                contact_list += "<li><a href=\"#page-detail\" onclick=\"insert_local_data('contact_name', '" + contacts[i].displayName + "');\">" + contacts[i].displayName;
                contact_list += "<span class=\"ui-li-count\">";
                if(contacts[i].phoneNumbers != null) {
                    if(contacts[i].phoneNumbers.length > 1) {
                        contact_list += contacts[i].phoneNumbers.length + " numbers";
                    } else {
                        contact_list += "1 number";
                    }
                    if(contacts[i].emails != null) {
                        contact_list += "/";
                    }
                }
                if(contacts[i].emails != null) {
                    if(contacts[i].emails.length > 1) {
                        contact_list += contacts[i].emails.length + " emails";                        
                    } else {
                        contact_list += "1 email";
                    }
                    if(contacts[i].birthday != null) {
                        contact_list += "/"
                    }
                }
                if(contacts[i].birthday != null) {
                    contact_list += "birthday";
                }
                contact_list += "</span>";
                contact_list += "</a></li>";
                $("#contact_list").append(contact_list);
                //insertContacts(contacts[i]);
            }
        }
    }
    //executeInsert();
    $("#contact_list").listview();
    $('body').removeClass('ui-loading');
}

function onReadContactDetailError(error) {
    console.log("onReadContactDetailError: error.code = " + error.code + ", with message :" + error.message);
    $('body').removeClass('ui-loading');
}

function readContactDetail(contact_pattern) {
    var fields = ["*"];
    var options = new ContactFindOptions();
    options.filter = contact_pattern;
    options.multiple = true;
    navigator.contacts.find(fields, onReadContactDetailSuccess, onReadContactDetailError, options);
    return false;
}

function onReadContactDetailSuccess(contacts) {
    var content = "";
    var i = 0;
    $("#contact_detail").html(content);
    if(contacts.length != 0) {
        content += "<div data-role=\"collapsible\" data-collapsed=\"false\" data-theme=\"b\" data-content-theme=\"c\" id=\"contacts_detail_data\">";
        if(contacts[0].displayName != null) {
            content += "    <h3>" + contacts[0].displayName + "</h3>";
        } else {
            content += "    <h3>" + contacts[0].id + "</h3>";
        }

        if(contacts[0].phoneNumbers != null) {
            content += sort_phone_fields(contacts[0].phoneNumbers, "Other phone numbers");
        }

        if(contacts[0].emails != null) {
            content += sort_phone_fields(contacts[0].emails, "Other email address");
        }

        if(contacts[0].birthday != null) {
            content += "<p><b>Birthday</b> " + contacts[0].birthday +"</p>";
        }

        if(contacts[0].note != null) {
            content += "<p><b>Note</b> " + contacts[0].note +"</p>";
        }

        content += "</div>";
        $("#contact_detail").append(content);
    }
    $("#contacts_detail_data").collapsible({refresh:true});
    $("#contacts_detail_data div[data-role=collapsible]").collapsible({refresh:true});
    $('body').removeClass('ui-loading');
}
