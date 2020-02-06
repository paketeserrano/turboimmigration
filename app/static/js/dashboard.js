var staffUsers = []
var selectedRow;

$("#searchButton").on('click', function(){
    console.log("Helloooo");
    fileCaseType = $("#selectType").val();
    fileCaseStatus = $("#selectStatus").val();
    clientFirstName = $("#clientFirstName").val();
    clientLastName = $("#clientLastName").val();
    ownerFirstName = $("#ownerFirstName").val();
    ownerLastName = $("#ownerLastName").val();
    console.log("Type: " + fileCaseType);
    console.log("fileCaseStatus: " + fileCaseStatus);
    console.log("clientFirstName: " + clientFirstName);
    console.log("clientLastName: " + clientLastName);
    console.log("ownerFirstName: " + ownerFirstName);
    console.log("ownerLastName: " + ownerLastName);

    searchParams = {};
    if(fileCaseType != ""){
    	searchParams['type'] = fileCaseType;
    }

    if(fileCaseStatus != ""){
    	searchParams['status'] = fileCaseStatus;
    }

    if(clientFirstName != ""){
    	searchParams['clientfirst'] = clientFirstName;
    }

    if(clientLastName != ""){
    	searchParams['clientlast'] = clientLastName;
    }

    if(ownerFirstName != ""){
    	searchParams['ownerfirst'] = ownerFirstName;
    }

    if(ownerLastName != ""){
    	searchParams['ownerlast'] = ownerLastName;
    }

    $.ajax({
        type: 'GET',
        url: '/getFileCases',
        data: searchParams,
        success:function(data) {
        	fileCases =JSON.parse(data)
        	searchResultsHtml = ""
        	for(caseIndex = 0;caseIndex < fileCases.length; ++caseIndex){
        		fileCase = fileCases[caseIndex];
        		searchResultsHtml += '<tr>'
        		searchResultsHtml += '<td scope="row">' + fileCase['id'] + '</td>';
        		searchResultsHtml += '<td>' + fileCase['type'] + '</td>';
        		searchResultsHtml += '<td>' + fileCase['clientname'] + '</td>';
        		searchResultsHtml += '<td>' + fileCase['status'] + '</td>';
        		searchResultsHtml += '<td>' + fileCase['ownername'] + '</td>';
        		searchResultsHtml += '<td><button type="button" class="assignFileCaseButton btnSelect btn-xs btn-warning fa fa-edit ">ASSIGN</button></td>'
        		searchResultsHtml += '</tr>';
			}
			$('#searchResults').html(searchResultsHtml);
        },
        error: function(data) {
        	console.log(data);
        },
        contentType: 'application/json;charset=UTF-8'
    })    


});

$("#searchResults").on('click','.assignFileCaseButton',function(){ 
  	selectedRow = $(this).closest("tr");    	

    $.ajax({
        type: 'GET',
        url: '/getStaffUsers',
        success:function(data) {
        	staffUsers =JSON.parse(data)
        	console.log("-------- Users: " + data)
        	assignFileCaseDropdownHtml = '<label for="assignFileCaseToStaffSelect">Select Staff Member</label>'
        	assignFileCaseDropdownHtml += '<select class="form-control" id="assignFileCaseToStaffSelect">'
        	for( staffIndex = 0; staffIndex < staffUsers.length;++staffIndex){
        		staffUser = staffUsers[staffIndex];
        		console.log(staffUser);
        		assignFileCaseDropdownHtml += '<option value="' + staffUser['id'] + '">' + staffUser['firstname'] + ' ' + staffUser['lastname'] + '</option>'
        	}
			
			assignFileCaseDropdownHtml += '</select>'
		    $('#assignFileCaseToStaffContent').html(assignFileCaseDropdownHtml); 
		    $('#assignFileCaseToStaff').modal('toggle');			
        },
        error: function(data) {
        	console.log(data);
        },
        contentType: 'application/json;charset=UTF-8'
    })


});

$("#assignFileCaseToStaffButton").on('click', function(){
	fileCaseId = selectedRow.find("td:eq(0)").text();
	fileCaseOwner = selectedRow.find("td:eq(4)").text();
	newfileCaseOwnerId = $('#assignFileCaseToStaffSelect').val();
	newfileCaseOwnerName = $('#assignFileCaseToStaffSelect option:selected').text();
	fileCaseToOwner = {};
	fileCaseToOwner['filecaseid'] = fileCaseId;
	fileCaseToOwner['ownerid'] = newfileCaseOwnerId;

    $.ajax({
        type: 'POST',
        url: '/assignFileCaseToOwner',
        data: JSON.stringify(fileCaseToOwner),
        success:function(data) {        	 
		    $('#assignFileCaseToStaff').modal('toggle');
		    selectedRow.find("td:eq(4)").text(newfileCaseOwnerName);
        },
        error: function(data) {
        	console.log(data);
        },
        contentType: 'application/json;charset=UTF-8'
    })	
});
