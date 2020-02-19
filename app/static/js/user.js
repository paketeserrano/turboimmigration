
$(document).ready(function() {

    // Understand this function - it came with the user template page I copied from    
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.avatar').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
    

    $(".file-upload").on('change', function(){
        readURL(this);
    });

    userCases = JSON.parse(userCasesResponse);
    caseHtml = "";
    for(i = 0; i < userCases.length; ++i){
        userCase = userCases[i];
        caseHtml += '<div class="card border-primary mb-3" >';
        caseHtml += '<div class="card-header"><a href="/getFileCase/' + userCase['id'] + '" >Citizenship</a></div>';
        caseHtml += '<div class="card-body text-primary">';
        caseHtml += '<h5 class="card-title">You have updates in your case</h5>';
        caseHtml += '<p class="card-text">Quick sample text to create the card title and make up the body of the card content.</p>';
        caseHtml += '</div>';
        caseHtml += '</div>';
    }

    $('#casesTab').html(caseHtml);


});