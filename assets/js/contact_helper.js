function readContactsFromDB(id, limit) {
    var lib = new localStorageDB(DB_NAME);
    var results = null;
    if(lib.tableExists("contacts")) {
        if(id == -1) {
            results = lib.query("contacts", null, limit);
        } else {
            results = lib.query("contacts", {ID: id}, limit)
        }
        
        if(results == null || results.length <= 0) {
            console.log("The contacts, contacts, is empty");
        } else {
            console.log("The contacts, contacts, has " + results.length+ " entries");
        }
    }
    delete lib;
    return results;
}

function isContactExist(contact_internal_id) {
    var lib = new localStorageDB(DB_NAME);
    var results = null;
    var feedback = false;
    if(lib.tableExists("contacts")) {
        results = lib.query("contacts", {internal_id: contact_internal_id});
        if(results != null && results.length > 0) {
            //console.log("The table, contacts internal_id = " + contact_internal_id + ", the entry exists");
            feedback = true;
        } else {
            console.log("The table, contacts internal_id = " + contact_internal_id + ", the entry does not exist");
            feedback = false;
        }
    } else {
        console.log("The table, contacts, doesn't exist");
    }
    delete lib;
    return feedback;
}

function updateContact(contact) {
    var lib = new localStorageDB(DB_NAME);
    var results = null;
    if(lib.tableExists("contacts")) {
        results = lib.query("contacts", {internal_id: contact.id});
        if(results != null && results.length > 0) {
            //console.log("Updating contacts (ID = "+ results[0].ID +" and internal_id = " +contact.id+ ")");
            lib.update("contacts", 
                {ID: results[0].ID}, 
                function(row) {
                    row.internal_id = contact.id;
                    row.displayName = contact.displayName;
                    row.nickname = contact.nickname;
                    row.birthday = contact.birthday;
                    row.note = contact.note;
                }
            );
            lib.commit();
        } else {
            console.log("The table, contacts, the entry is not found");
        }
    } else {
        console.log("The table, contacts, doesn't exist");
    }
    delete lib;
}

function insertContact(contact) {
    var lib = new localStorageDB(DB_NAME);
    if(lib.tableExists("contacts")) {
        lib.insert("contacts", {internal_id: contact.id, displayName: contact.displayName, nickname: contact.nickname, birthday: contact.birthday, note: contact.note});
        lib.commit();
    } else {
        console.log("table contacts doesn't exist");
        return false;
    }
    delete lib;
    return true;
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
    var showInfoType = 0;
    var readFromDB = null;
    console.log("Check point 1");
    for(i = 0; i < contacts.length; i++) {
        showNameType = 0;
        showInfoType = 0;
        if(contacts[i].email != null && contacts[i].emails.length > 0) {
            showInfoType += 1;
        }
        if(contacts[i].phoneNumbers != null && contacts[i].phoneNumbers.length > 0) {
            showInfoType += 2;
        }
        if(contacts[i].displayName == null) {
            if(contacts[i].nickname == null) {
                if(contacts[i].name == null) {
                    showNameType = 0;
                } else {
                    if(contacts[i].name.formatted != null) {
                        showNameType = 3; //name
                    } else if(contacts[i].name.givenName != null && contacts[i].name.familyName != null) {
                        showNameType = 4; //name
                    }
                }
            } else {
                showNameType = 2;
            }
        } else {
            showNameType = 1;
        }

        if(showNameType == 1 && showInfoType > 0) {
            if(isContactExist(contacts[i].id)){
                updateContact(contacts[i]);
            } else {
                if(insertContact(contacts[i])) {
                    console.log("insert contact success, id = " + contacts[i].id);
                } else {
                    console.log("insert contact fail, id = " + contacts[i].id);
                }
            }            
        }
    }
    console.log("Check point 2");

    $("#show_contact").html("<ul data-role=\"listview\" id=\"contact_list\"></ul>");
    readFromDB = readContactsFromDB(-1, 10);
    for(i = 0; i < readFromDB.length; i++) {
        contact_list = "";
        contact_list += "<li><a href=\"#page-detail\" onclick=\"insert_local_data('contact_id', '" + readFromDB[i].ID + "');\">" + readFromDB[i].displayName;
        contact_list += "<span class=\"ui-li-count\">";
        if(readFromDB[i].phoneNumbers != null) {
            if(readFromDB[i].phoneNumbers.length > 1) {
                contact_list += readFromDB[i].phoneNumbers.length + " numbers";
            } else {
                contact_list += "1 number";
            }
            if(readFromDB[i].emails != null) {
                contact_list += "/";
            }
        }
        if(readFromDB[i].emails != null) {
            if(readFromDB[i].emails.length > 1) {
                contact_list += readFromDB[i].emails.length + " emails";                        
            } else {
                contact_list += "1 email";
            }
            if(readFromDB[i].birthday != null) {
                contact_list += "/"
            }
        }
        if(readFromDB[i].birthday != null) {
            contact_list += "birthday";
        }
        contact_list += "</span>";
        contact_list += "</a></li>";
        $("#contact_list").append(contact_list);
    }

    $("#contact_list").listview();
    $('body').removeClass('ui-loading');
}

function readContactDetail(contact_pattern) {
    var content = "";
    var i = 0;
    var readFromDB = null;
    readFromDB = readContactsFromDB(contact_pattern, 1);
    $("#contact_detail").html(content);
    if(readFromDB.length != 0) {
        content += "<div data-role=\"collapsible\" data-collapsed=\"false\" data-theme=\"b\" data-content-theme=\"c\" id=\"contacts_detail_data\">";
        if(readFromDB[0].displayName != null) {
            content += "    <h3>" + readFromDB[0].displayName + "</h3>";
        } else {
            content += "    <h3>" + readFromDB[0].id + "</h3>";
        }

        if(readFromDB[0].phoneNumbers != null) {
            content += sort_phone_fields(readFromDB[0].phoneNumbers, "Other phone numbers");
        }

        if(readFromDB[0].emails != null) {
            content += sort_phone_fields(readFromDB[0].emails, "Other email address");
        }

        if(readFromDB[0].birthday != null) {
            content += "<p><b>Birthday</b> " + readFromDB[0].birthday +"</p>";
        }

        if(readFromDB[0].note != null) {
            content += "<p><b>Note</b> " + readFromDB[0].note +"</p>";
        }

        content += "</div>";
        $("#contact_detail").append(content);
    }
    $("#contacts_detail_data").collapsible({refresh:true});
    $("#contacts_detail_data div[data-role=collapsible]").collapsible({refresh:true});
    $('body').removeClass('ui-loading');

    return false;
}