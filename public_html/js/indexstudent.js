var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var studentDBName = 'School-DB';
var studentRelationName = 'Student_Table';
var connToken = '90932176|-31949215765002474|90963961';

$(document).ready(function() {
    $('#rollno').focus();

    // Attach event handlers
    $('#save').click(saveData);
    $('#change').click(changeData);
    $('#reset').click(resetForm);
    $('#rollno').change(getEmp);
});

function saveRecN02LS(jsonObj) {
    console.log("Saving record number to localStorage:", jsonObj); // Log jsonObj
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getRollNoAsJsonDbObj() {
    var rollno = $('#rollno').val();
    console.log("Roll No JSON:", JSON.stringify({ rollno: rollno })); // Debugging line
    var jsonStr = { rollno: rollno };
    return JSON.stringify(jsonStr);
}


function fillData(jsonObj) {
    saveRecN02LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#fullname').val(record.name);
    $('#class').val(record.cls);
    $('#birth-date').val(record.birth);
    $('#address').val(record.address);
    $('#edate').val(record.edate);
    
    // Enable buttons after filling data
    $('#save').prop('disabled', true);
    $('#change').prop('disabled', false);
    $('#reset').prop('disabled', false);
}

function resetForm() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birth-date").val("");
    $("#address").val("");
    $("#edate").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === '') return;
    var putRequest = createPUTRequest(connToken, jsonStrObj, studentDBName, studentRelationName);
    console.log("PUT Request:", putRequest); // Log the request
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    console.log("Response from saveData:", resJsonObj); // Log the response
    jQuery.ajaxSetup({ async: true });
    alert("Your data has been successfully submitted!");
    resetForm();
    $("#rollno").focus();
}

function validateData() {
    var rollno, fullname, sclass, birthdate, address, edate;
    var rollno = $("#rollno").val();
    var fullname = $("#fullname").val();
    var sclass = $("#class").val();
    var birthdate = $("#birth-date").val();
    var address = $("#address").val();
    var edate = $("#edate").val();

    if (rollno ==='') {
        alert("Roll No. missing");
        $("#rollno").focus();
        return "";
    }
    if (fullname === '') {
        alert("Full Name missing");
        $("#fullname").focus();
        return "";
    }
    if (sclass === '') {
        alert("Class missing");
        $("#class").focus();
        return "";
    }
    if (birthdate === '') {
        alert("Birth Date missing");
        $("#birth-date").focus();
        return "";
    }
    if (address === '') {
        alert("Address missing");
        $("#address").focus();
        return "";
    }
    if (edate === '') {
        alert("Enrollment Date missing");
        $("#edate").focus();
        return "";
    }

    var jsonStrObj = {
        rollno: rollno,
        name: fullname,
        cls: sclass,
        birth: birthdate,
        address: address,
        edate: edate
    };
    return JSON.stringify(jsonStrObj);
}

function changeData() {
    $("#change").prop("disabled", true);
    var jsonChg = validateData();
    if (jsonChg === '') return; // Ensure valid data before proceeding
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, studentDBName, studentRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({ async: true });
    console.log("Response from changeData:", resJsonObj); // Log the response
    resetForm();
    $("#rollno").focus();
}

function getEmp() {
    var rollnoJsonObj = getRollNoAsJsonDbObj();
    var getRequest = createGET_BY_KEYRequest(connToken, studentDBName, studentRelationName, rollnoJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        $("#save").prop('disabled', false);
        $("#reset").prop('disabled', false);
        $('#fullname').focus();
    } else if (resJsonObj.status === 200) {
        $('#rollno').prop('disabled', true);
        fillData(resJsonObj);
    }
}
