/* Index */
var divSpecificationForm = "#divSpecificationForm";
var divAddionalSpecsContent = "#divAddionalSpecsContent";
var divAddionalSpecsModalWindow = "#divAddionalSpecsModalWindow";
var lblChooseAProduct = "#lblChooseAProduct";
var lblProductType = "#lblProductType";
var spinnerSpecs = ".spinner-specs";

/* _SpecificationsForm */
var divWaveLength = "#divWaveLength";
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

/* _ModifiedStandardResults */
var divModStandardResults = "#divModStandardResults";
var btnPrevMod = "#btnPrevMod";
var btnNextMod = "#btnNextMod";

/* Validation Messages */
var missingMinMax = '- Missing Min/Max value detected';
var nonNumericEntry = '- Non-numeric Min/Max value detected.';
var greaterMinValue = '- Min value cannot be more than Max value';

var startRowMod;
var modStandardItemNumbers;
var totalRowsMod;
var lastOperatorMod;

var configValues;

var pageCount = 3;
if ($(window).width() <= 992) {
    pageCount = 1;
}

/* Index Functions */
$(document).ready(function () {
    initialPageLoad();
});

$(window).resize(function () {
    clearTimeout(window.resizedFinished);
    window.resizedFinished = setTimeout(function () {
        CheckWindowSize();

        var resultsVisible = $('.nav-tabs').is(':visible');
        if(resultsVisible)
            GetResults();

    }, 250);
});

function CheckWindowSize() {
    pageCount = ($(window).width() <= 992)? 1 : 3;
}

function initialPageLoad() {
    $(spinnerSpecs).hide();
    $(lblProductType).hide();

    var productWizardType = wizardConfigurations.ProductWizardType,
        productType = wizardConfigurations.ProductType,
        productShape = wizardConfigurations.ProductShape;

    if (history.state != null && productWizardType.length == 0) {
        productWizardType = history.state.ProductWizardType;
        productType = history.state.ProductType;
        productShape = history.state.ProductShape;
    }

    if (productWizardType.length !== 0) {
        var optProductWizard = "#opt" + productWizardType;

        $(optProductWizard).prop("checked", true);
        GetSpecificationsForm(productType, productShape, false);
    }

    $('.radio-product-shape').click(function () {
        var productType = $('input[name=optProductWizardType]:checked').attr("data-type");
        var shape = $('input[name=optProductWizardType]:checked').attr("data-shape");

        GetSpecificationsForm(productType, shape, true);
    });

    $('.eo-modal-content .close').click(function () {
        $('.eo-modal-window').hide();
    });

    $('.eo-modal-footer .btn').click(function () {
        $('.eo-modal-window').hide();
    });
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
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

/* _SpecificationsForm Functions */
function SpecificationsFormInit(isUserAuthenticated) {
    $(spinnerSearch).hide();

    $(btnSearch).click(function () {
        var captchaMsg = '';

        if (isUserAuthenticated.toLowerCase() === 'false') {
            $("#captchaResponse").val(grecaptcha.getResponse());
            captchaMsg = ValidateCaptcha($("#captchaResponse").val());
        }

        if (captchaMsg !== '')
            alert(captchaMsg);
        else {
            var errorMessages = ValidateMinMaxEntries();

            if (errorMessages !== '')
                alert("Please correct the following before searching:\n" + errorMessages);
            else
                GetResults();
        }
    });
}

function SetConfigValues(productWizardType, productType, shape) {
    configValues = {
        ProductWizardType: productWizardType,
        ProductType: productType,
        ProductShape: shape
    };

    SetHistoryState(configValues);
}

function SetHistoryState(configValues) {
    history.replaceState(configValues, null, null);
}

function ValidateMinMaxEntries() {
    var errMessage = '';

    $("[name*='.SelectedMin']").each(function (index, item) {
        var minID = this.id;
        var maxID = this.id.replace("SelectedMin", "SelectedMax");

        var minValue = $("#" + minID).val();
        var maxValue = $("#" + maxID).val();

        if (minValue === "" && maxValue === "")
            return;
        else {
            if ((minValue !== '' && maxValue === '') || (minValue === '' && maxValue !== '')) {
                if (errMessage.search(missingMinMax) === -1)
                    errMessage += missingMinMax + "\n";
            }
            else {
                if (parseFloat(minValue) > parseFloat(maxValue)) {
                    if (errMessage.search(greaterMinValue) === -1)
                        errMessage += greaterMinValue + "\n";
                }
            }
        }
    });

    errMessage = ValidateWavelengthEntries(errMessage);
    errMessage = ValidateDropDownSelections(errMessage);

    return errMessage;
}

function ValidateWavelengthEntries(msg) {
    var errMessage = msg;

    var minValue = $("#MinWavelength").val();
    var maxValue = $("#MaxWavelength").val();

    if (minValue === "" && maxValue === "")
        return errMessage;
    else {
        if ((minValue !== '' && maxValue === '') || (minValue === '' && maxValue !== '')) {
            if (errMessage.search(missingMinMax) === -1)
                errMessage += missingMinMax + "\n";
        }
        else {
            if (parseFloat(minValue) > parseFloat(maxValue)) {
                if (errMessage.search(greaterMinValue) === -1)
                    errMessage += greaterMinValue + "\n";
            }
        }
    }

    return errMessage;
}

function ValidateDropDownSelections(msg) {
    var errMessage = msg;
    var selections = '';

    $('select.spec-cmb').each(function () {
        var specID = $("#" + this.id).attr("data-id");
        var specValue = this.value;
        
        if (specValue !== '' && specValue !== undefined && specValue !== null) {
            var currentItem = "{'SpecID':'" + specID + "', 'SpecValue':'" + specValue + "'}"; 
            selections += (((selections !== '') ? ', ' : '') + currentItem);                
        }
    });

    if (selections !== '') {
        selections = "[" + selections + "]";
        errMessage += CheckDropDownSelections(configValues.ProductWizardType, selections);
    }

    return errMessage;
}

function CheckDropDownSelections(productwizardtype, selections) {
    var postUrl = '/tools/productwizard/validatedropdownselections/")';
    var validationMessage = '';

    $.ajax({
        url: postUrl,
        method: "POST",
        data: { type: productwizardtype, json: selections },
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
        return validationMessage;

    return '';
}

function ValidateCaptcha(captchaResponse) {
    var postUrl = '/tools/productwizard/validatecaptcha/")';
    var validationMessage = '';

    $.ajax({
        url: postUrl,
        method: "POST",
        data: { captchaResponse: captchaResponse },
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
        return validationMessage;

    return '';
}

function GetSpecificationsForm(productType, shape, resetForm) {
    $(spinnerSpecs).show();
    $(lblChooseAProduct).hide();
    $(lblProductType).show();

    var url = "/Tools/ProductWizard/_SpecificationsForm/";
    $(divSpecificationForm).load(url, { "productType": productType, "shape": shape }, function () {
        if (resetForm)
            SetSpecFormDefaultValues();
        else
            ClearSpecFormValues();
    });

    $(spinnerSpecs).hide();
}

function ClearSpecFormValues() {
    var wv_min = $('input#MinWavelength').val(),
        wv_max = $('input#MaxWavelength').val();

    if (wv_min == 0 && wv_max == 0) {
        $('input#MinWavelength').val('');
        $('input#MaxWavelength').val('');
    }

    $("[name*='.SelectedMin']").each(function (index, item) {
        var minID = this.id;
        var maxID = this.id.replace("SelectedMin", "SelectedMax");

        var minValue = $("#" + minID).val();
        var maxValue = $("#" + maxID).val();

        if (minValue == 0 && maxValue == 0) {
            $("#" + minID).val('');
            $("#" + maxID).val('');
        }        
    });
}

function SetSpecFormDefaultValues() {
    $("[name*='.SelectedMin']").val('');
    $("[name*='.SelectedMax']").val('');
    $('input#MinWavelength').val('');
    $('input#MaxWavelength').val('');
    $('.spec-cmb').val('');
}

function CoatedUnCoatedClick(isCoating) {
    if (isCoating)
        $(divWaveLength).fadeIn("slow");
    else 
        $(divWaveLength).fadeOut("slow");
}

function SetPopover(action) {
    if (action == 'show') {
        var popoverVisible = $('.popover-content').is(':visible');
        if (!popoverVisible)
            $("[data-toggle=popover]").popover(action);
    }
    else
        $("[data-toggle=popover]").popover(action);
}

function GetResults() {
    var resultsURL = '/tools/productwizard/_searchresults';

    $(btnSearch).prop('disabled', true);
    $(spinnerSearch).show();

    $.ajax({
        url: resultsURL,
        type: 'POST',
        data: $('#formSpecifications').serialize(),
        success: function (html) {
            $(divSearchResults).html(html);
            $(divSearchResults).attr("tabindex", -1).focus();
            $("#clearFocus").attr("tabindex", -1).focus();            
        }
    })
    .done(function () {
        $(btnSearch).prop('disabled', false);
        $(spinnerSearch).hide();

        //reset the recaptcha
        if ($("#recaptchaRow").find("iframe").length > 0)
            grecaptcha.reset();
    });
}

/* _CustomQuoteForm Functions */
function CustomQuoteFormInit() {
    $(divEmailConfirmation).hide();
    $(spinnerEmail).hide();

    $(formCustomQuote).submit(function (e) {
        e.preventDefault();

        if (!$(this).valid())
            return false;

        SubmitCustomQuoteEmail();
    });
}

function SubmitCustomQuoteEmail() {
    $(btnSubmitQuoteEmail).prop('disabled', true);
    $(spinnerEmail).fadeIn();

    var postUrl = '/tools/productwizard/SubmitCustomQuoteEmail';
    var viewModel = $(formCustomQuote).serialize();

    $.ajax({
        url: postUrl,
        type: 'POST',
        data: viewModel,
        success: function (data) {
            DisplayEmailConfirmation(data);
        }
    })
        .fail(function () {
            alert("There was an error sending the email!");
            $(spinnerEmail).hide();
            $(btnSubmitQuoteEmail).prop('disabled', false);
        });
}

function DisplayEmailConfirmation(data) {
    $(spinnerEmail).hide();
    $(formCustomQuote).hide();

    $(divEmailConfirmation).html(data.Message);
    $(divEmailConfirmation).fadeIn();

    $(btnSubmitQuoteEmail).prop('disabled', false);
    trackEvent('Product Wizard', 'Custom Quote', 'Submit');
}

/* _SearchResults Functions */
function SearchResultsInit(sessionID, searchID) {
    specFormSessionID = sessionID;
    productSearchID = searchID;

    SetQuoteTooltip('show');
}

function GetQuote(stockNumber, modificationType, estimate, coating) {
    quoteProperties = [stockNumber, modificationType, estimate, coating];
    GetCustomQuoteForm();
    $("#navCustomQuote").trigger("click");
    trackEvent('Product Wizard', 'Modified Results- Get Quote', modificationType);
}

function GetCustomQuoteForm() {
    $.ajax({
        url: '/tools/productwizard/_CustomQuoteForm',
        type: 'Post',
        data: { sessionID: specFormSessionID, productSearchID: productSearchID, quoteProperties: quoteProperties },
        success: function (html) {
            $(divCustomQuoteForm).html(html).fadeIn();            
        }
    });
}

/* _StandardResults Functions */
function StandardResultsInit(partNumbers, totalRows, sessionID) {
    standardPartNumbers = partNumbers;
    totalRowsStandard = totalRows;
    specFormSessionID = sessionID;
    startRowStandard = 0;

    CheckWindowSize();
    GoToNextPageStandard("+");
    DisableButton(btnPrevStandard);
    trackEvent('Product Wizard', 'Standard Results Loaded', totalRows);
}

function GoToNextPageStandard(operator) {
    startRowStandard = ValidateStartRow(startRowStandard, operator, lastOperatorStandard);

    var startNumber = startRowStandard;
    var endRow = startRowStandard + pageCount;
    var partsArray = standardPartNumbers.slice(startRowStandard, endRow);

    GetPartNumberResults(partsArray);

    startRowStandard = GetNextStartRow(startRowStandard, operator);
    lastOperatorStandard = operator;

    SetupPagingButtons(startRowStandard, btnPrevStandard, btnNextStandard, totalRowsStandard);
}

function GetPartNumberResults(partsArray) {
    if (partsArray.length == 0) {
        return;
    }

    $.ajax({
        url: '/tools/productwizard/_PartNumbers',
        type: 'POST',
        data: { partNumbers: partsArray, sessionID: specFormSessionID },
        success: function (html) {
            $(divPartNumberResults).html(html).fadeIn();
        }
    });
}

/* _ModifiedStandardResults Functions */
function ModStandardResultsInit(itemNumbers, totalRows) {
    modStandardItemNumbers = itemNumbers;
    totalRowsMod = totalRows;
    startRowMod = 0;

    GoToNextPageModified("+");
    DisableButton(btnPrevMod);
    trackEvent('Product Wizard', 'Standard Results Loaded', totalRows);
}

function GoToNextPageModified(operator) {
    startRowMod = ValidateStartRow(startRowMod, operator, lastOperatorMod);

    var startNumber = startRowMod;
    var endRowMod = startRowMod + pageCount;
    var modItemsArray = modStandardItemNumbers.slice(startRowMod, endRowMod);

    GetModStandardResults(modItemsArray);

    startRowMod = GetNextStartRow(startRowMod, operator);
    lastOperatorMod = operator;

    SetupPagingButtons(startRowMod, btnPrevMod, btnNextMod, totalRowsMod);
}

function GetModStandardResults(modItemsArray) {
    if (modItemsArray.length == 0) {
        return;
    }

    $.ajax({
        url: '/tools/productwizard/_ModifiedStandardPartNumbers',
        type: 'POST',
        data: { itemNumbers: modItemsArray, sessionID: specFormSessionID },
        success: function (html) {
            $(divModStandardResults).html(html).fadeIn();
        }
    });
}

/* Shared Functions for Paging Features */
function ValidateStartRow(startRow, operator, lastOperator) {
    if (startRow < 0) {
        startRow = 0;
    }        

    if (operator == "-") {
        startRow = startRow - pageCount;

        if (lastOperator == "+") {
            startRow = startRow - pageCount;
        }
    }
    else if (lastOperator == "-") {
        startRow = startRow + pageCount;
    }
        
    return startRow;
}

function GetNextStartRow(startRow, operator) {
    if (operator == "+") {
        startRow = startRow + pageCount;
    }

    return startRow;
}

function SetupPagingButtons(startRow, btnPrev, btnNext, totalRows) {
    if (startRow <= 0) {
        DisableButton(btnPrev);
    }
    else {
        EnableButton(btnPrev);

        if (startRow >= totalRows) {
            DisableButton(btnNext);
        }
        else {
            EnableButton(btnNext);
        }
    }
}

function EnableButton(btn) {
    $(btn).prop("disabled", false);
    $(btn).removeClass("text-muted");
}

function DisableButton(btn) {
    $(btn).prop("disabled", true);
    $(btn).addClass("text-muted");
}

function ProductWizardTabs(tab) {
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

    $([document.documentElement, document.body]).animate({
        scrollTop: $("#clearFocus").offset().top
    }, 100);
}