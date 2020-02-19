var surveys;
var selectedCaseItemName;
var selectedCaseItemId = -1;
var rowToDelete;

function downloadSurvey(surveyId)
{
	surveyName = "";
	surveyData = {};
	console.log("surveysResponse.length: " + surveysResponse.length)
	for(surveyIndex = 0; surveyIndex < surveysResponse.length; ++surveyIndex){
		survey = surveysResponse[surveyIndex];
		if(survey['id'] == surveyId){
			surveyName = survey['name'];
			surveyData = JSON.parse(survey['config']);
			console.log("----------Name---------");
			console.log(surveyName);
			console.log("----------Config-------");
			console.log(JSON.parse(survey['config']));
			console.log("-----------------------")
		}
	}

	var surveyModel = null;
	params = {}
	if(surveyName == "citizenship"){
		params['app'] = 'ctz'
	}
	else if(surveyName == "marriagegreencard"){
		params['app'] = 'mgc';
	}

	var options = {
	    fontSize: 14,
	    margins: {
	        left: 10,
	        right: 10,	
	        top: 18,	
	        bot: 10
	    }
	};

    $.ajax({
        type: 'GET',
        url: '/getSurveyModel',
        data: params,
        success:function(data) {
        	surveyModel = JSON.parse(data);
			var surveyPDF = new SurveyPDF.SurveyPDF(surveyModel, options);
			console.log("+++++++++++++++++++++")
			console.log(surveyData);
			console.log("+++++++++++++++++++++")
			surveyPDF.data = surveyData;
			surveyPDF.save();
        },
        error: function(data) {
        	console.log(data);
        },
        contentType: 'application/json;charset=UTF-8'
    })

	//json is same as for SurveyJS Library


	//uncomment next code to add html and markdown text support
	/*var converter = new showdown.Converter();
	surveyPDF.onTextMarkdown.add(function(survey, options) {
	    var str = converter.makeHtml(options.text);
	    str = str.substring(3);
	    str = str.substring(0, str.length - 4);
	    options.html = str;
	});*/

	
}

$('#insertGreenCardFilesButton').on('click',function()
{
	maxFileCount = 2;
	extraData = {'fileCaseId' : filecaseInfo['id'], 'type':'green_card_item'};
	allowedFileExtensions = ['jpg', 'png', 'pdf'];
	tableId = 'GreenCardFilesTable';
	setFileUploader(maxFileCount,extraData,allowedFileExtensions,tableId),
	$("#insertFilesModal").modal("show");

})

$('#insertVisaPagesFilesButton').on('click',function()
{
	maxFileCount = 5;
	extraData = {'fileCaseId' : filecaseInfo['id'], 'type':'visa_page_item'};
	allowedFileExtensions = ['jpg', 'png', 'pdf'];
	tableId = 'VisaPagesFilesTable'
	setFileUploader(maxFileCount,extraData,allowedFileExtensions,tableId),
	$("#insertFilesModal").modal("show");

})

$('#insertDetainedDocumentsFilesButton').on('click',function()
{
	maxFileCount = 5;
	extraData = {'fileCaseId' : filecaseInfo['id'], 'type':'detained_doc_item'};
	allowedFileExtensions = ['jpg', 'png', 'pdf'];
	tableId = 'DetainedDocumentsFilesTable'
	setFileUploader(maxFileCount,extraData,allowedFileExtensions,tableId),
	$("#insertFilesModal").modal("show");

})

$('#insertArrestRecordFilesButton').on('click',function()
{
	maxFileCount = 5;
	extraData = {'fileCaseId' : filecaseInfo['id'], 'type':'arrest_record_item'};
	allowedFileExtensions = ['jpg', 'png', 'pdf'];
	tableId = 'ArrestRecordFilesTable'
	setFileUploader(maxFileCount,extraData,allowedFileExtensions,tableId),
	$("#insertFilesModal").modal("show");
})



$('#insertBirthPassportNatFilesButton').on('click',function()
{
	maxFileCount = 5;
	extraData = {'fileCaseId' : filecaseInfo['id'], 'type':'married_certificate_item'};
	allowedFileExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
	tableId = 'BirthPassportNatFileTable'
	setFileUploader(maxFileCount,extraData,allowedFileExtensions,tableId),
	$("#insertFilesModal").modal("show");
})

$('#insertMarriedCertificateFilesButton').on('click',function()
{
	maxFileCount = 5;
	extraData = {'fileCaseId' : filecaseInfo['id'], 'type':'birth_passport_naturalization_item'};
	allowedFileExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
	tableId = 'MarriedCertificateFileTable'
	setFileUploader(maxFileCount,extraData,allowedFileExtensions,tableId),
	$("#insertFilesModal").modal("show");
})

function setFileUploader(maxFileCount,extraData,allowedFileExtensions,tableId){
	$('#input-id').fileinput('clearFileStack')
	$('#input-id').fileinput('clear');
	$('#input-id').fileinput('destroy');
	$('#input-id').unbind();

    $("#input-id").fileinput('refresh',{
        dropZoneEnabled: false,
        maxFileCount: maxFileCount,
        mainClass: "input-group-lg",
        hideThumbnailContent: true,
        allowedFileExtensions: allowedFileExtensions,
        uploadUrl: '/uploadCaseFileItem',
        uploadExtraData: extraData
    }).on('fileuploaded', function(event, data, previewId, index) {
	    console.log(data);
	    newFile = data.response;
    	newRowHtml = ''
    	newRowHtml += '<tr>'
    	newRowHtml += '<td style="display:none">' + newFile.id + '</td>';
    	newRowHtml += '<td scope="row">' + newFile.name + '</td>';
    	newRowHtml += '<td><button type="button" class="btndeleteCaseItem btn-xs" data-toggle="modal" data-target="#modaldeletecaseitem">Delete</button><a href="/getCaseItem/' + newFile.id + '" target="blank"><button class="btn btn-default">View</button></a></td>';
    	newRowHtml += '</tr>';
	    $('#' + tableId + ' > tbody:last-child').append(newRowHtml);
	    $('#' + tableId).show();

	    /* This event triggers for each file selected. The data.files contains all the files uploaded
	    // That's why we just have to do the following only once
	    console.log("files.length: " + files.length);
	    console.log("Index: " + index);
	    if(index == 0){
		    newRowHtml = ''
		    for(fileIndex = 0; fileIndex < files.length; ++fileIndex){
		    	file = files[fileIndex];
		    	newRowHtml += '<tr>'
		    	newRowHtml += '<td style="display:none">-1</td>';
		    	newRowHtml += '<td scope="row">' + file.name + '</td>';
		    	newRowHtml += '<td><button type="button" class="btndeleteCaseItem btn-xs" data-toggle="modal" data-target="#modaldeletecaseitem">Delete</button> </td>';
		    	newRowHtml += '</tr>';
		    }

		    var rowCount = $('#' + tableId + ' tr').length;
		    console.log("Number of rows: " + rowCount);
		    console.log("tableId: " + tableId);
		    console.log("newRowHtml: " + newRowHtml);
		    $('#' + tableId + ' > tbody:last-child').append(newRowHtml);
		    $('#' + tableId).show();
		}
		*/
	    
	}).on('fileuploaderror', function(event, data, msg) {
        console.log('File Upload Error', 'ID: ' + data.fileId + ', Thumb ID: ' + data.previewId);
    }).on('filebatchuploadcomplete', function(event, files, extra) {
    	console.log('File batch upload complete');
		console.log("----------")
		console.log("files: ",files);
		console.log("----------")
	});
}

function createItemsTable(tableId,tableParentId,caseItemType){
    html = '<table class="table table-striped" id="' + tableId +'">';
    html += '<thead>';
    html += '<tr>';
    html += '<th scope="col" style="display:none">ID</th>';
    html += '<th scope="col">Docs</th>';
    html += '<th scope="col">Actions</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    numCaseItems = 0
	for(caseItemIndex = 0;caseItemIndex < caseitemsInfo.length; ++caseItemIndex){
		caseItem = caseitemsInfo[caseItemIndex];
		if(caseItem['type'] == caseItemType){
			numCaseItems = numCaseItems + 1;
	    	html += '<tr>'
	    	html += '<td style="display:none">' + caseItem['id'] + '</td>'
	    	html += '<td scope="row">' + caseItem['name'] + '</td>';
	    	html += '<td><button type="button" class="btndeleteCaseItem btn-xs" data-toggle="modal" data-target="#modaldeletecaseitem">Delete</button><a href="/getCaseItem/' + caseItem['id'] + '" target="blank"><button class="btn btn-default">View</button></a></td>';
	    	html += '</tr>';			
		}
	}

	html += '</tbody>';
	html += '</table>';

	$('#' + tableParentId).html(html);

	if(numCaseItems == 0){
		$('#' + tableId).hide();
	}
}

$('#deleteCaseItemButton').on('click', function() {

	if(selectedCaseItemId == -1){
		console.log("It's a new case item");
		rowToDelete.remove();
		selectedCaseItemName = null;
		selectedCaseItemId = -1;
	}
	else{
		console.log("It's NOT a new case item");
	    $.ajax({
	        type: 'POST',
	        url: '/deleteCaseItem',
	        contentType: 'application/json;charset=UTF-8',
	        data: JSON.stringify({
	            'caseItemId': selectedCaseItemId
	        }),
	        success:function(res){
	            var data=JSON.parse(res);
	            $("#modaldeletecaseitem").modal("hide");
	            rowToDelete.remove();
	            selectedCaseItemName = null;
	            selectedCaseItemId = -1;
	        },
	        error: function(returned_value){
	            console.log("Unexpected error archiving plan. Please check server logs")
	            planToArchive = -1;
	            $("#modalarchiveplan").modal("hide");
	            selectedCaseItemName = null;
	            selectedCaseItemId = -1;
	        }
	    })	
	}

}) 

function prepareDeleteCaseItem(domElement){
	console.log("-----------prepareDeleteCaseItem")
    rowToDelete = domElement.closest("tr"); 
    selectedCaseItemName = rowToDelete.find("td:eq(1)").text();
    selectedCaseItemId = rowToDelete.find("td:eq(0)").text();
    var myhtml ='';
    myhtml += '<h2><center>Are you sure you want to delete ' + selectedCaseItemName + ' ?</center></h2>';
   $('#deleteCaseItemText').html(myhtml); 
}

$(document).ready(function() {

	//// Citizenship Docs////

	//Set up the green card items table
	tableId = "GreenCardFilesTable";
	caseItemType = 'green_card_item';
	tableParentId = 'greencardFilesPlaceholder';
	createItemsTable(tableId,tableParentId,caseItemType);

	//Set up the visa pages items table
	tableId = "VisaPagesFilesTable";
	caseItemType = 'visa_page_item';
	tableParentId = 'visaPagesFilesPlaceholder';
	createItemsTable(tableId,tableParentId,caseItemType);

	//Set up the detained docs items table
	tableId = "DetainedDocumentsFilesTable";
	caseItemType = 'detained_doc_item';
	tableParentId = 'arrestRecordFilesPlaceholder';
	createItemsTable(tableId,tableParentId,caseItemType); 

	//Set up the arrest records items table
	tableId = "ArrestRecordFilesTable";
	caseItemType = 'arrest_record_item';
	tableParentId = 'detainedDocumentsFilesPlaceholder';
	createItemsTable(tableId,tableParentId,caseItemType); 

	// Events for delete case item
	$("#GreenCardFilesTable").on('click','.btndeleteCaseItem',function(){ 
		console.log("Inside GreenCardFilesTable");
		domElement = $(this);
		prepareDeleteCaseItem(domElement);      
	});

	$("#VisaPagesFilesTable").on('click','.btndeleteCaseItem',function(){ 
		domElement = $(this);
		prepareDeleteCaseItem(domElement);      
	});

	$("#DetainedDocumentsFilesTable").on('click','.btndeleteCaseItem',function(){ 
		domElement = $(this);
		prepareDeleteCaseItem(domElement);      
	});

	$("#ArrestRecordFilesTable").on('click','.btndeleteCaseItem',function(){ 
		domElement = $(this);
		prepareDeleteCaseItem(domElement);      
	});

	//// Marriage Green Card Docs ////
	//Set up the Copy of U.S. birth certificate/U.S. passport bio page/naturalization certificate from U.S. Citizen Petitioner
	tableId = "BirthPassportNatFileTable";
	caseItemType = 'birth_passport_naturalization_item';
	tableParentId = 'birthPassportNatFilePlaceholder';
	createItemsTable(tableId,tableParentId,caseItemType);

	// Married certificate
	tableId = "MarriedCertificateFileTable";
	caseItemType = 'married_certificate_item';
	tableParentId = 'marriedCertificateFilePlaceholder';
	createItemsTable(tableId,tableParentId,caseItemType);

	$("#BirthPassportNatFileTable").on('click','.btndeleteCaseItem',function(){ 
		domElement = $(this);
		prepareDeleteCaseItem(domElement);      
	}); 	

	$("#MarriedCertificateFileTable").on('click','.btndeleteCaseItem',function(){ 
		domElement = $(this);
		prepareDeleteCaseItem(domElement);      
	}); 
})
