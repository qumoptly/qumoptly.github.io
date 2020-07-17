//////////////////////////////////////////////////////////////////////
//   VARIABLE DECLARATIONS
//////////////////////////////////////////////////////////////////////

/* Index */
var divAddionalSpecsContent = "#divAddionalSpecsContent";
var divAddionalSpecsModalWindow = "#divAddionalSpecsModalWindow";
var spinnerSpecs = ".spinner-specs";
var divSearchResults = "#divSearchResults";
var divSearchResultsSpinner = "#divSearchResultsSpinner";
var btnSearch = "#btnSearch";
var spinnerSearch = ".spinner-search";

/* Custom Quote Form */
var divEmailConfirmation = "#divEmailConfirmation";
var formCustomQuote = "#formCustomQuote";
var btnSubmitQuoteEmail = "#btnSubmitQuoteEmail";
var spinnerEmail = "#spinner-email";

/* _SearchResults */
var divCustomQuoteForm = "#divCustomQuoteForm";
var quoteProperties = [];
var specFormSessionID;
var productSearchID;

/* _StandardResults */
var btnPrevStandard = "#btnPrevStandard";
var btnNextStandard = "#btnNextStandard";

var startRowStandard;
var standardPartNumbers;
var totalRowsStandard;
var lastOperatorStandard;

/* _AlternateResults */
var btnPrevAlternate = "#btnPrevAlternate";
var btnNextAlternate = "#btnNextAlternate";

var startRowAlternate;
var alternatePartNumbers;
var totalRowsAlternate;
var lastOperatorAlternate;

var cameraSelected;
var cameraMountValue;

/* _PartNumbers */
var divPartNumberResults = "#divPartNumberResults";
var divPartNumberResultsAlt = "#divPartNumberResultsAlt";

//////////////////////////////////////////////////////////////////////
//   FUNCTIONS
//////////////////////////////////////////////////////////////////////
var pageCount = 3;
if ($(window).width() <= 992) {
    pageCount = 1;
}

/* Index Functions */
$(document).ready(function () {
    InitialPageLoad();

    //add focus in/out calls to entry boxes:
    $("#txtHorizontalPixels").focusin(function () {
        SwitchImageFocus(1);
    });
    $("#txtHorizontalPixels").focusout(function () {
        SwitchImageFocus(0);
    });

    $("#txtVerticalPixels").focusin(function () {
        SwitchImageFocus(2);
    });
    $("#txtVerticalPixels").focusout(function () {
        SwitchImageFocus(0);
    });

    $("#txtPixelSize").focusin(function () {
        SwitchImageFocus(3);
    });
    $("#txtPixelSize").focusout(function () {
        SwitchImageFocus(0);
    });

    $("#txtWorkingDistance").focusin(function () {
        SwitchImageFocus(4);
    });
    $("#txtWorkingDistance").focusout(function () {
        SwitchImageFocus(0);
    });

    $("#txtHorizontalFieldOfView").focusin(function () {
        SwitchImageFocus(5);
    });
    $("#txtHorizontalFieldOfView").focusout(function () {
        SwitchImageFocus(0);
    });

    $("#ddlCameraMounts").focusin(function () {
        SwitchImageFocus(6);
    });
    $("#ddlCameraMounts").focusout(function () {
        SwitchImageFocus(0);
    });

    $("#ddlCameras").focusin(function () {
        SwitchImageFocus(0);
    });
    $("#ddlCameras").focusout(function () {
        SwitchImageFocus(0);
    });
});

$(window).resize(function () {
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function () {
        CheckWindowSize();
        ValidateSubmit(false);
    }, 250);
});

function DisplayCover() {
    $.ajax({
        url: '/tools/imaginglenswizard/_cover'
    }).done(function (data) {
        $("#divModalCoverContent").html(data);
    });

    $("#divModalCover").show();
}

function CheckWindowSize() {
    pageCount = ($(window).width() <= 992) ? 1 : 3    
}

function InitialPageLoad() {
    $(spinnerSpecs).hide();
    $(spinnerSearch).hide();

    $("#rdoSearchTypeCustom").prop("checked", true);
    $("#rdoSearchTypeCamera").prop("checked", false);

    InitializeSpecs();
    InitializeCameraDropdown();

    SetImagingLensSpecificationsForm();

    //check if coming from camera page:
    var cameraID = GetCameraID();
    if (!isEmpty(cameraID) && !isNaN(cameraID))
        SetCameraValues(cameraID);

    $('.eo-modal-content .close').click(function () {
        $('.eo-modal-window').hide();
    })

    $('.eo-modal-footer .btn').click(function () {
        $('.eo-modal-window').hide();
    })
}

function GetCameraID() {
    var cameraID = getUrlParameter('id');

    if (isEmpty(cameraID))
        cameraID = getUrlValue();

    return cameraID;
}

function SetCameraValues(cameraID) {
    $("#rdoSearchTypeCustom").prop("checked", false);
    $("#rdoSearchTypeCamera").prop("checked", true);

    SetImagingLensSpecificationsForm();
    
    $(".chzn-select").val(cameraID).trigger("chosen:updated");
    GetCameraSpecs(cameraID);
}

function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function getUrlValue() {
    var url = window.location.pathname;
    var id = url.substring(url.lastIndexOf('/') + 1);
    return id;
}

function SetCustomSensorDisplay(isLocked)
{
    $("#txtHorizontalPixels").prop('disabled', isLocked);
    $("#txtVerticalPixels").prop('disabled', isLocked);
    $("#txtPixelSize").prop('disabled', isLocked);
}

function InitializeSpecs() {
    $("#hdnCameraID").val(0);
    $("#hdnCameraMount").val('');

    $("#txtHorizontalPixels").val('');
    $("#txtVerticalPixels").val('');
    $("#txtPixelSize").val('');
    $("#txtWorkingDistance").val('');
    $("#txtHorizontalFieldOfView").val('');

    SetCustomSensorDisplay(false);

    $("#ddlCameras").find('option:eq(0)').prop('selected', true);
    $("#ddlCameraMounts").find('option:eq(0)').prop('selected', true);
}

function InitializeCameraDropdown() {
    $(".chzn-select").chosen({
        no_results_text: "No matches found",
        allow_single_deselect: true,
        search_contains: true
    });
}

function InitializeIndexPage() {
    //initialize the display page:
    $("#dvImageHelperView").removeClass("nodisplay");
    $("#dvResultsView").addClass("nodisplay");
    $("#lnkResultsView").addClass("disabled");
}

function SwitchView(lnk) {
    var id = lnk.id;

    var dvImage = $("#dvImageHelperView"), dvResults = $("#dvResultsView");
    var lnkImage = $("#lnkImageHelperView"), lnkResults = $("#lnkResultsView");

    dvImage.removeAttr('style');
    dvResults.removeAttr('style');

    if (id == "lnkImageHelperView") {
        dvImage.removeClass("nodisplay");
        lnkImage.removeClass("btn-default").removeClass("btn-gray");
        lnkImage.addClass("btn-primary").addClass("btn-blue");

        dvResults.addClass("nodisplay");
        lnkResults.removeClass("btn-primary").removeClass("btn-blue");
        lnkResults.addClass("btn-default").addClass("btn-gray");
    }
    else {
        dvImage.addClass("nodisplay");
        lnkImage.removeClass("btn-primary").removeClass("btn-blue");
        lnkImage.addClass("btn-default").addClass("btn-gray");

        dvResults.removeClass("nodisplay");
        lnkResults.removeClass("btn-default").removeClass("btn-gray");
        lnkResults.addClass("btn-primary").addClass("btn-blue");
    }

    ScrollView();
}

function SwitchModule(tab, isInitial) {
    var id = $(tab).data("tab");
    var categoryID = $(tab).data("val");
    var module = $(tab).data("module");

    GetCameraMounts(module);

    $(".nodisplay").hide();

    //set active module tab:
    $("#resourcesTab").children("div").children("a").removeClass("active");
    $(tab).addClass("active");

    //set active module triangle:
    $(".tab-btn-triangle").removeClass("active");
    $('div[data-tab="' + id + '"]').addClass("active");
   
    $("#hdnCategoryID").val(categoryID);

    SwichImage(id);
    $("#txtHorizontalPixels").focus();

    if (!isInitial)
        ScrollView();

    return false;
}

function ShowSelector(btn) {
    var id = $(btn).data("tab");

    var dataTab = $('a[data-tab="' + id + '"]');
    if (dataTab != null && dataTab != undefined) {
        SwitchModule(dataTab, true);
        $("#divModalCover").hide();
        $("#txtHorizontalPixels").focus();
    }
}

function SwichImage(tab) {
    var img = $('#imgHelperView');
    
    if (img != null && img != undefined)
    {
        var baseURL = '/areas/tools/assets/img/';

        var src = '';

        switch (tab) {
            case 'factoryAutoTab':
                src = 'fa-qu1.jpg';
                break;
            case 'telecentricTab':
                src = 'tele-ques1.jpg';
                break;
            case 'm12Tab':
                src = 'm12-ques1.jpg';
                break;
            default:
                src = 'image-helper.png';
                break;
        }

        img.attr('src', baseURL + src);
    }
}

function SwitchImageFocus(picID) {
    var tab = $(".tab-btn.active").data("tab");
    var img = $('#imgHelperView');
    var src = '';

    var baseURL = '/areas/tools/assets/img/';

    switch (tab) {
        case 'factoryAutoTab':
            src = 'fa-qu' + picID + '.jpg';
            break;
        case 'telecentricTab':
            src = 'tele-ques' + picID + '.jpg';
            break;
        case 'm12Tab':
            src = 'm12-ques' + picID + '.jpg';
            break;
        default:
            src = 'image-helper.png';
            break;
    }

    img.attr('src', baseURL + src);
}

function ShowInfoTooltip(btn, action) {
    var module = $(btn).data("module");

    var tooltip = (module == 'M12') ?
        $("#info-m12") :
        ((module == 'Telecentric') ? $("#info-telecentric") : $("#info-factoryAuto"));

    if (tooltip != null && tooltip != undefined)
        tooltip.css("visibility", ((action == 'show') ? "visible" : "hidden"));
} 

function SetImagingLensSpecificationsForm() {
    var isCustomSearch = IsCustomSearchSelected();

    InitializeSpecs();

    if (isCustomSearch) {
        $(".chzn-select").prop('disabled', true).trigger('chosen:updated');
        $("#ddlCameraMounts").find('option:eq(0)').prop('selected', true);

        $("#dvCameras").hide();
        $("#dvMounts").show();

        $("#txtHorizontalPixels").focus();
    }
    else {
        $("#ddlCameras").find('option:eq(0)').prop('selected', true);
        $(".chzn-select").prop('disabled', false).trigger('chosen:updated');
        $('.chzn-select').trigger('chosen:activate');

        $("#dvCameras").show();
        $("#dvMounts").hide();

        $("#ddlCameras").next().find('a.chosen-single').focus();
        //$('.chzn-select').trigger('chosen:activate');
        //$("#ddlCameras_chosen:nth-child(2)").focus();
        //$(".chosen-container:first-child").focus();
    }
}

function CameraChange(e) {
    var camera = $(e).find('option:selected');

    if (camera !== null && camera !== undefined) {
        var cameraID = camera.val();

        if (isEmpty(cameraID) || isNaN(cameraID))
            InitializeSpecs();
        else
            GetCameraSpecs(cameraID);
    }
}

function CameraChanged(cameraID) {
    if (isEmpty(cameraID) || isNaN(cameraID))
        InitializeSpecs();
    else
        GetCameraSpecs(cameraID);
}

function GetCameraSpecs(cameraID) {
    if (!isEmpty(cameraID) && !isNaN(cameraID)) {
        var postUrl = '/tools/imaginglenswizard/GetCameraSpecs';

        var pixelsHorizontal = 0;
        var pixelsVertical = 0;
        var pixelSize = 0;
        var cameraMount = '';
        var cameraStockNumber = '';

        $.ajax({
            url: postUrl,
            type: 'POST',
            data: { cameraID: cameraID },
            dataType: "json",
            success: function (data) {
                var json = $.parseJSON(JSON.stringify(data.Message));
                var obj = $.parseJSON(json);

                pixelSize = obj.pixelSize;
                pixelsHorizontal = obj.pixelsHorizontal;
                pixelsVertical = obj.pixelsVertical;
                cameraMount = obj.cameraMount;
                cameraStockNumber = obj.cameraStockNumber;

                $("#txtHorizontalPixels").val(pixelsHorizontal);
                $("#txtVerticalPixels").val(pixelsVertical);
                $("#txtPixelSize").val(pixelSize);
                $("#txtWorkingDistance").val();
                $("#txtHorizontalFieldOfView").val();

                $("#hdnCameraID").val(cameraID);
                $("#hdnCameraMount").val(cameraMount);
                $("#hdnCameraStockNumber").val(cameraStockNumber);

                SetCustomSensorDisplay(true);

                $("#txtWorkingDistance").focus();
            }
        });
    }
}

function GetCameraMounts(moduleName) {
    var postUrl = '/tools/imaginglenswizard/GetCameraMounts';

    $.ajax({
        url: postUrl,
        type: 'POST',
        data: { moduleName: moduleName },
        dataType: "json",
        success: function (data) {
            var json = $.parseJSON(JSON.stringify(data.Message));
            var obj = $.parseJSON(json);

            var mountValues = obj.mounts.split('|');
           
            var ddlCameraMounts = $('#ddlCameraMounts');
            ddlCameraMounts.html(' ');
            ddlCameraMounts.append($("<option></option>").attr("value", '').text(''));
            $.each(mountValues, function (index, value) {
                ddlCameraMounts.append($("<option></option>").attr("value", value).text(value));
            });
        }
    })
        .fail(function () {
            alert("There was an error loading the camera mounts");
        });
}

function ValidateSubmit(showErrors) {
    var errMessage = '';

    $("[class*=' calc-entry']").each(function (index, item) {
        var entryValue = $("#" + this.id).val();
        var dataLabel = $("#" + this.id).attr("data-label");

        if (entryValue === "")
            errMessage += "- Missing entry for: " + dataLabel + ". \n";
        else {
            if (!$.isNumeric(entryValue))
                errMessage += "- Non-numeric entry for: " + dataLabel + ". \n";
        }
    });

    errMessage = ValidateCameraMountSelection(errMessage);

    if (errMessage !== '') {
        if (showErrors)
            alert("Please correct the following before submitting:\n" + errMessage);

        return false;
    }
    else {
        trackEvent('Imaging Lens Wizard', 'Search', 'Submit');
        GetSearchResults();
    }
}

function ValidateCameraMountSelection(msg) {
    var postUrl = '/tools/imaginglenswizard/validatedropdownselections/")';
    var errMessage = msg;

    var selectedMount = $("#ddlCameraMounts").val();

    if (selectedMount !== '' && selectedMount !== undefined && selectedMount !== null) {
        var validationMessage = '';

        $.ajax({
            url: postUrl,
            method: "POST",
            data: { mount: selectedMount },
            async: false
        })
            .done(function (jsonResult) {
                validationMessage = jsonResult;
            })
            .fail(function () {
                validationMessage = 'Validation failed';
            });

        //eval:
        if (validationMessage !== "valid")
            errMessage += validationMessage;
    }

    return errMessage;
}

function GetSearchResults() {
    var resultsURL = '/tools/imaginglenswizard/_searchresults';

    var iconSubmit = $("#submit-btn-chk");
    iconSubmit.removeClass("fa-check");  
    iconSubmit.addClass("fa-spinner").addClass("fa-spin");    


    $(btnSearch).prop('disabled', true);
    $(spinnerSearch).show();

    var lnk = $("#lnkResultsView");
    SwitchView(lnk);

    //set hidden camera mount value:
    var selectedMount = $("#ddlCameraMounts").val();
    $("#hdnMount").val(selectedMount);

    var cameraID = $("#hdnCameraID").val();
    if(cameraID > 0)
        SetCustomSensorDisplay(false);

    $.ajax({
        url: resultsURL,
        cache: false,
        type: "POST",
        dataType: "html",
        data: $('#formSpecifications').serialize(),
        success: function (html) {
            $(divSearchResults).html(html);
            $(divSearchResults).attr("tabindex", -1).focus();
            $("#clearFocus").attr("tabindex", -1).focus();

            $(lnk).removeClass("disabled");
        }
    })
        .done(function () {
            $(btnSearch).prop('disabled', false);
            $(spinnerSearch).hide();

            if(cameraID > 0)
                SetCustomSensorDisplay(true);

            iconSubmit.removeClass("fa-spinner").removeClass("fa-spin"); 
            iconSubmit.addClass("fa-check");
        });
}

function ShowAdditionalSpecs(partNumberID, stockNumber) {
    $.ajax({
        url: '/catalog/partnumber/_GridDetails/?partNumberID=' + partNumberID + '&showHeading=true'
    }).done(function (data) {
        $(divAddionalSpecsContent).html(data);
        LoadDownloadAllButton(partNumberID);
    });

    $(divAddionalSpecsModalWindow).show();
}

function LoadDownloadAllButton(partNumberID) {
    $.getJSON("/catalog/partnumber/getPartNumberByStockNumber/?partNumberID=" + partNumberID, function (data) {
        if (data.Result === true) {
            $("#documentDownloads_" + data.Data.PartNumber.MaterialNumber).append('<a id="downloadAllBtn_' + data.Data.PartNumber.MaterialNumber + '" style="vertical-align: middle !important; cursor: pointer !important; display: inline-block !important; height: 27px; padding-top: 8px; padding-left: 5px;" onclick="downloadAll(\'' + data.Data.PartNumber.MaterialNumber + '\');" download></a>');
            $("#downloadAllBtn_" + data.Data.PartNumber.MaterialNumber).text($("#downloadAllText_" + data.Data.PartNumber.MaterialNumber).val());
        }
    });
}

function downloadAll(stockNumber) {
    trackEvent('Document Download', 'Download All', stockNumber);
    window.open('@Url.Action("DownloadAll", "PartNumber")?stockNum=' + stockNumber, '_blank');
}

function SetPopover(action) {
    if (action === 'show') {
        var popoverVisible = $('.popover-content').is(':visible');
        if (!popoverVisible)
            $("[data-toggle=popover]").popover(action);
    }
    else
        $("[data-toggle=popover]").popover(action);
}

/* _SearchResults Functions */
function SearchResultsInit(sessionID, searchID) {
    specFormSessionID = sessionID;
    productSearchID = searchID;
}

/* _StandardResults Functions */
function StandardLensResultsInit(resultsCount, partNumbers, totalRows, sessionID, isCameraSelected, cameraMount, partLabel, partsLabel, foundLabel) {
    standardPartNumbers = partNumbers;
    totalRowsStandard = totalRows;
    specFormSessionID = sessionID;
    startRowStandard = 0;
    cameraSelected = isCameraSelected;
    cameraMountValue = cameraMount;

    if (resultsCount > 0) {
        CheckWindowSize();
        GoToNextPageStandard("+");
        DisableButton(btnPrevStandard);
    }
    else {
        ShowNoSearchResults(divPartNumberResults);
        DisableButton(btnPrevStandard);
        DisableButton(btnNextStandard);
    }

    SetRecordCountLabel(totalRows, partLabel, partsLabel, foundLabel);
}

function GoToNextPageStandard(operator) {
    startRowStandard = ValidateStartRow(startRowStandard, operator, lastOperatorStandard);

    var startNumber = startRowStandard;
    var endRow = startRowStandard + pageCount;
    var partsArray = standardPartNumbers.slice(startRowStandard, endRow);

    GetLensPartNumberResults(divPartNumberResults, partsArray, cameraSelected, cameraMountValue);

    startRowStandard = GetNextStartRow(startRowStandard, operator);
    lastOperatorStandard = operator;

    SetupPagingButtons(startRowStandard, btnPrevStandard, btnNextStandard, totalRowsStandard);
}

/* _AlternateResults Functions */
function AlternateLensResultsInit(resultsCount, partNumbers, totalRows, sessionID, isCameraSelected, cameraMount, partLabel, partsLabel, foundLabel) {
    alternatePartNumbers = partNumbers;
    totalRowsAlternate = totalRows;
    specFormSessionID = sessionID;
    startRowAlternate = 0;
    cameraSelected = isCameraSelected;
    cameraMountValue = cameraMount;

    if (resultsCount > 0) {
        CheckWindowSize();
        GoToNextPageAlternate("+");
        DisableButton(btnPrevAlternate);
    }
    else {
        ShowNoSearchResults(divPartNumberResultsAlt);
        DisableButton(btnPrevAlternate);
        DisableButton(btnNextAlternate);
    }

    //SetRecordCountLabel(totalRows, partLabel, partsLabel, foundLabel);
}

function GoToNextPageAlternate(operator) {
    startRowAlternate = ValidateStartRow(startRowAlternate, operator, lastOperatorAlternate);

    var startNumber = startRowAlternate;
    var endRow = startRowAlternate + pageCount;
    var partsArray = alternatePartNumbers.slice(startRowAlternate, endRow);

    GetLensAltPartNumberResults(divPartNumberResultsAlt, partsArray, cameraSelected, cameraMountValue);

    startRowAlternate = GetNextStartRow(startRowAlternate, operator);
    lastOperatorAlternate = operator;

    SetupPagingButtons(startRowAlternate, btnPrevAlternate, btnNextAlternate, totalRowsAlternate);
}

/* Shared Functions for Paging Features */
function GetLensPartNumberResults(div, partsArray, isCameraSelected, cameraMountValue) {
    if (partsArray.length === 0) {
        return;
    }

    $.ajax({
        url: '/tools/imaginglenswizard/_PartNumbers',
        type: 'POST',
        data: { partNumbers: partsArray, sessionID: specFormSessionID, cameraSelected: isCameraSelected, cameraMount: cameraMountValue },
        success: function (html) {
            $(div).html(html).fadeIn();
        }
    });
}

function GetLensAltPartNumberResults(div, partsArray, isCameraSelected, cameraMountValue) {
    if (partsArray.length === 0) {
        return;
    }

    $.ajax({
        url: '/tools/imaginglenswizard/_AlternatePartNumbers',
        type: 'POST',
        data: { partNumbers: partsArray, sessionID: specFormSessionID, cameraSelected: isCameraSelected, cameraMount: cameraMountValue },
        success: function (html) {
            $(div).html(html).fadeIn();
        }
    });
}

function ShowNoSearchResults(div) {
    $.ajax({
        url: '/tools/imaginglenswizard/_NoSearchResults',
        type: 'POST',
        success: function (html) {
            $(div).html(html).fadeIn();
        }
    });
}

function ValidateStartRow(startRow, operator, lastOperator) {
    if (startRow < 0)
        startRow = 0;

    if (operator === "-") {
        startRow = startRow - pageCount;

        if (lastOperator === "+")
            startRow = startRow - pageCount;
    }
    else if (lastOperator === "-")
        startRow = startRow + pageCount;

    return startRow;
}

function GetNextStartRow(startRow, operator) {
    if (operator === "+")
        startRow = startRow + pageCount;

    return startRow;
}

function SetupPagingButtons(startRow, btnPrev, btnNext, totalRows) {
    EnableButton(btnPrev);
    EnableButton(btnNext);

    if (startRow <= 0)
        DisableButton(btnPrev);

    if (startRow >= totalRows)
        DisableButton(btnNext);
}

function EnableButton(btn) {
    $(btn).prop("disabled", false);
    $(btn).removeClass("text-muted");
}

function DisableButton(btn) {
    $(btn).prop("disabled", true);
    $(btn).addClass("text-muted");
}

function SetRecordCountLabel(recordCount, partLabel, partsLabel, foundLabel) {
    var lbl = (recordCount == 1) ? partLabel : partsLabel;
    lbl += " " + foundLabel;

    $("#navRecordCount").text(recordCount + " " + lbl);
}

function IsCustomSearchSelected() {
    return $("#rdoSearchTypeCustom").is(':checked');
}

function ImagingLensWizardTabs(tab) {
    var id = $(tab).data("tab");

    $(".tab-item").removeClass("active");
    $(tab).addClass("active");

    $(".nodisplay").hide();

    $(".boldResources").removeClass("boldResources")
    $(tab).children("a").addClass("boldResources")

    $(".tab-pane").hide();
    $(".tab-pane").removeClass("active");

    $("#" + id).show();
    $("#" + id).addClass("active");

    ResetSelectedModule();

    ScrollView();
}

function ScrollView() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#selector-link-fa").offset().top
    }, 800);
}

function ResetSelectedModule() {
    var tab = $(".tab-btn.active");

    var id = $(tab).data("tab");
    var categoryID = $(tab).data("val");
    var module = $(tab).data("module");

    $(".nodisplay").hide();
    $("#resourcesTab").children("div").children("a").removeClass("active")
    $(tab).addClass("active");
    //$(".tab-resources").hide();
    //$("#" + id).show();

    $("#hdnCategoryID").val(categoryID);
}

function trackSpecificationChange(specification, input){
    var value = $(input).val();
    trackEvent('Imaging Lens Wizard', specification, value);
}