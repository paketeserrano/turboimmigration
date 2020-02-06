var surveys;

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

$(document).ready(function() {
	//surveys = JSON.parse(surveysResponse);
	console.log("Helloooo")
})
