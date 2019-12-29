var surveyId = -1;
var formName = "US_citizenship"
var survey = {}

function sendDataToServer(survey) {
  var resultAsString = JSON.stringify(survey.data);
  alert(resultAsString); //send Ajax request to your web server.
}

var surveyJSON = {  
    "triggers": [
        {
            "type": "complete",
            "name": "exit1",
            "operator": "equal",
            "value": "Yes"
        }
    ],
   "pages":[  
      {  
         "name":"Age",
         "elements":[  
            {  
               "type":"radiogroup",
               "name":"GreenCardHolder",
               "title":"Are you a Green Card holder?",
               "choices":[  
                  "Yes",
                  "No"
               ]
            },
          {
              "name": "GreenCardIssueDate",
              "type": "datepicker",
              "inputType": "date",
              "title": "When did you become a U.S. green card holder (permanent resident)?",
              "dateFormat": "mm/dd/yy",
              "visibleIf":"{GreenCardHolder} = 'Yes'",
              "isRequired": true            
          }
         ],
         "title":"Tell us about you..."
      },
      {
       "name": "age2",
       "elements": [
        {
         "type": "radiogroup",
         "name": "age_question",
         "title": "Are you 18 or older?",
         "defaultValue": "Yes",
         "choices": [
          "Yes",
          "No"
         ]
        }
       ],
       "title": "Tell us about you..."
      },
      {
       "name": "page1",
       "elements": [
        {
         "type": "html",
         "name": "question6",
         "html": "You are too young. \n\nCall you mom and come back again"
        },
        {
         "type": "radiogroup",
         "visible": false,
         "name": "exit1",
         "title": "Finish the survey?",
         "defaultValue": "Yes",
         "choices": [
          "Yes",
          "No"
         ]
        }
       ],
       "visible": false,
       "visibleIf": "{age_question} = \"No\""
      },
      {
       "name": "you_are_elegible",
       "elements": [
        {
         "type": "html",
         "name": "you_are_elegible_message",
         "html": "Congratulations, you are elegible!. \n\nPlease keep filling the questions, you are clicks again to finish your application"
        }
       ]
      },
      {  
         "name":"TimeInUS",
         "elements":[  
            {  
               "type":"checkbox",
               "name":"question3",
               "title":"In the last 5 years, have you been in the United States for at least half the time (30 months)?",
               "choices":[  
                  {  
                     "value":"item1",
                     "text":"Yes"
                  },
                  {  
                     "value":"item2",
                     "text":"No"
                  }
               ]
            }
         ],
         "description":"The government requires all applicants to be physically present in the U.S. for at least 30 months over the past 5 years before applying for naturalization. If you’re not sure, put down “Yes” here and we’ll help you calculate the exact number later in the application."
      }
   ],
   "storeOthersAsComment":false
}


$('#saveProrgressButton').click(function(){
    username = $('#userName').text();
    console.log('--------------username: ' + username);
    if (username == 'Log In'){
      window.location.href = "/login?next=survey";    
    }
    else{
      saveSurvey(survey);
    }

});

function saveSurvey(survey){
  console.log("------------------- Sending the survey to the server");
   var data = survey.data;
   data.pageNo = survey.currentPageNo;

    $.ajax({
        type: 'POST',
        url: '/saveSurvey',
        data: JSON.stringify({
            'survey': JSON.stringify(data),
            'surveyId': surveyId,
            'caseType': 'US_citizenship',
            'surveyType': 'US_citizenship'
       }),
        success:function(res)
        {
            console.log("Survey has been saved!");
            var response = JSON.parse(res);
            surveyId = response['surveyId'];
        },
        error: function(returned_value)
        {
            console.log("Problem saving the survey")
        },
        contentType: 'application/json;charset=UTF-8'

        }) 
}

function doOnCurrentPageChanged(survey) {
  console.log("---------->survey.currentPageNo: " + survey.currentPageNo )
  currentPage = survey.currentPage
  console.log("-----------: survey.data: " + JSON.stringify(survey.data));
  console.log("-----------: page data: " + JSON.stringify(survey.currentPage.getValue()))
  console.log("-----------: currentPage: " + currentPage)

  if(survey.data.age_question == "No"){
    console.log("I should finish the survey");
    //survey.doComplete();
  }
}

$(document).ready(function(){
  console.log("Hellooooo")
  console.log("======================== survey: " + $('#surveyData').text())
  surveyDataStr = $('#surveyData').text();  

  // Survey object setup
  Survey.StylesManager.applyTheme("bootstrap");
  survey = new Survey.Model(surveyJSON);
  surveyData = JSON.parse(surveyDataStr);

  // Restore survey state
  if (surveyData['surveyId'] != null){
    console.log("--------Restoring survey")        
    surveyId = surveyData['surveyId'];
    var surveyState = JSON.parse(surveyData['survey']);
    survey.data = surveyState;
    if (surveyState.pageNo) {
      survey.currentPageNo = surveyState.pageNo;
    }
  }
  // Restore temporary survey if it exists in the session browser storage
  // This happens when the user is completing the survey when no logged in
  else{
    var prevData = window.sessionStorage.getItem(formName) || null;
    if (prevData) {
      var data = JSON.parse(prevData);
      survey.data = data;
      if (data.pageNo) {
      survey.currentPageNo = data.pageNo;
      }
    }
  }
  
  survey.sendResultOnPageNext = true;
  $('#surveyContainer').Survey({
    model:survey
  });

  survey.onPartialSend.add(function (survey) {
    var data = survey.data;
    data.pageNo = survey.currentPageNo;
    window.sessionStorage.setItem(formName, JSON.stringify(data));
    currentPageValues = survey.currentPage.getValue();
    if (currentPageValues['exit1'] == 'Yes'){
      console.log("Finishing the survey if click next");
      survey.doComplete();
    }
  });

  survey.onComplete.add(function (survey, options) {
     saveSurvey(survey);
  });



});