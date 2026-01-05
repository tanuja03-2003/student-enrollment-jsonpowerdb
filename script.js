

var token = "764066773|7385821546626861834|764067058";
var dbName = "SCHOOL-DB";
var relName = "STUDENT-TABLE";

function initForm() {
    resetForm();
    $("#rollNo").focus();
}

function disableAllExceptRoll() {
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", true);
    $("#saveBtn, #updateBtn").prop("disabled", true);
}

function enableFields() {
    $("#fullName, #studentClass, #birthDate, #address, #enrollDate").prop("disabled", false);
}

function resetForm() {
    $("#studentForm")[0].reset();
    $("#rollNo").prop("disabled", false);
    disableAllExceptRoll();
    $("#rollNo").focus();
}

function checkRollNo() {
    var roll = $("#rollNo").val();
    if (roll === "") return;

    var getReq = createGET_BY_KEYRequest(
        token,
        dbName,
        relName,
        JSON.stringify({ "Roll-No": roll })
    );

    jQuery.ajaxSetup({ async: false });
    var res = executeCommandAtGivenBaseUrl(
        getReq,
        "https://api.jsonpowerdb.com:5567",
        "/api/irl"
    );
    jQuery.ajaxSetup({ async: true });

    if (res.status === 400) {
        // New record
        enableFields();
        $("#saveBtn").prop("disabled", false);
        $("#updateBtn").prop("disabled", true);
        $("#fullName").focus();
    } else if (res.status === 200) {
        // Existing record
        var data = JSON.parse(res.data).record;

        $("#fullName").val(data["Full-Name"]);
        $("#studentClass").val(data["Class"]);
        $("#birthDate").val(data["Birth-Date"]);
        $("#address").val(data["Address"]);
        $("#enrollDate").val(data["Enrollment-Date"]);

        $("#rollNo").prop("disabled", true);
        enableFields();
        $("#updateBtn").prop("disabled", false);
        $("#saveBtn").prop("disabled", true);
    }
}

function validateForm() {
    if (
        $("#rollNo").val() === "" ||
        $("#fullName").val() === "" ||
        $("#studentClass").val() === "" ||
        $("#birthDate").val() === "" ||
        $("#address").val() === "" ||
        $("#enrollDate").val() === ""
    ) {
        alert("All fields are required");
        return false;
    }
    return true;
}


function saveStudent() {
    if (!validateForm()) return;

    var jsonStr = {
        "Roll-No": $("#rollNo").val(),
        "Full-Name": $("#fullName").val(),
        "Class": $("#studentClass").val(),
        "Birth-Date": $("#birthDate").val(),
        "Address": $("#address").val(),
        "Enrollment-Date": $("#enrollDate").val()
    };

    var putReq = createPUTRequest(
        token,
        JSON.stringify(jsonStr),
        dbName,
        relName
    );

    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(
        putReq,
        "https://api.jsonpowerdb.com:5567",
        "/api/iml"
    );
    jQuery.ajaxSetup({ async: true });

    alert("Record saved successfully");
    resetForm();
}

function updateStudent() {
    if (!validateForm()) return;

    var jsonStr = {
        "Roll-No": $("#rollNo").val(),
        "Full-Name": $("#fullName").val(),
        "Class": $("#studentClass").val(),
        "Birth-Date": $("#birthDate").val(),
        "Address": $("#address").val(),
        "Enrollment-Date": $("#enrollDate").val()
    };

    var updateReq = createUPDATERecordRequest(
        token,
        JSON.stringify(jsonStr),
        dbName,
        relName,
        $("#rollNo").val()
    );

    jQuery.ajaxSetup({ async: false });
    executeCommandAtGivenBaseUrl(
        updateReq,
        "https://api.jsonpowerdb.com:5567",
        "/api/iml"
    );
    jQuery.ajaxSetup({ async: true });

    alert("Record updated successfully");
    resetForm();
}
