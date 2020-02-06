var surveyId = -1;
var survey = {};
var surveyType = null;

var surveyQuestions = {}
/*
{
 "pages": [
  {
   "name": "Initial",
   "elements": [
    {
     "type": "html",
     "name": "DE_explanation",
     "html": "<p>Next you will answer a few simple question to determine if you are elegible</p>"
    }
   ],
   "title": "Determine Elegibility"
  },
  {
   "name": "Age",
   "elements": [
    {
     "type": "radiogroup",
     "name": "GreenCardHolder",
     "title": "Are you a Green Card holder?",
     "choices": [
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
   "title": "Tell us about you..."
  },
  {
   "name": "age2",
   "elements": [
    {
     "type": "radiogroup",
     "name": "age_question",
     "title": "Are you 18 or older?",
     "choices": [
      "Yes",
      "No"
     ]
    }
   ],
   "title": "Tell us about you..."
  },
    {
   "name": "page4",
   "elements": [
    {
     "type": "radiogroup",
     "name": "halfTimeInUS",
     "title": "In the last 5 years, have you been in the United States for at least half the time (30 months)? ",
     "choices": [
      {
       "value": "item1",
       "text": "Yes"
      },
      {
       "value": "item2",
       "text": "No"
      }
     ]
    }
   ]
  },
  {
   "name": "outside_us",
   "elements": [
    {
     "type": "radiogroup",
     "name": "outside_us_question",
     "title": "Have you ever been outside of the U.S. for more than one year since becoming a green card holder?",
     "choices": [
      {
       "value": "Yes",
       "text": "Yes"
      },
      {
       "value": "No",
       "text": "No"
      }
     ]
    }
   ],
   "title": "Elegibility"
  },
  {
   "name": "page3",
   "elements": [
    {
        "name": "WhenDidYouReturnToUS",
        "type": "datepicker",
        "inputType": "date",
        "title": "For your most recent trip abroad lasting one year or longer, when did you return to the U.S.?",
        "dateFormat": "mm/dd/yy",
        "isRequired": true            
    }
   ],
   "visibleIf": "{outside_us_question} = 'Yes'"
  },
  {
   "name": "page2",
   "elements": [
    {
     "type": "radiogroup",
     "name": "QualifyForFinancialHelp",
     "title": "The government may reduce or waive its fees for applicants with low income or financial hardship . Would you qualify for this program? If you do, we will ask for details later to help you get the benefit you deserve. ",
     "choices": [
      {
       "value": "Yes",
       "text": "I might qualify"
      },
      {
       "value": "No",
       "text": "I would not qualify"
      }
     ]
    }
   ]
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
     "name": "exit1",
     "visible": false,
     "title": "Finish the survey?",
     "defaultValue": "Yes",
     "choices": [
      "Yes",
      "No"
     ]
    }
   ],
   "visible": false,
   "visibleIf": "{age_question} = \"No\" or returnedLessThanFiveYearsAgo({WhenDidYouReturnToUS}) or {halfTimeInUS} = \"No\" ",
   "navigationButtonsVisibility": "hide"
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
   "name": "page5",
   "elements": [
    {
     "type": "panel",
     "name": "FullNamePanel",
     "elements": [
      {
       "type": "text",
       "name": "FirstName",
       "title": "First Name"
      },
      {
       "type": "text",
       "name": "MiddleName",
       "title": "Middle Name"
      },
      {
       "type": "text",
       "name": "LastName",
       "title": "Last Name"
      }
     ],
     "title": "Please enter your full name below"
    }
   ]
  }
 ],
 "triggers": [
  {
   "type": "complete",
   "value": "Yes",
   "name": "exit1"
  }
 ],
"showProgressBar": "top",
"storeOthersAsComment": false
}

*/

// This function needs to calculate better the 5 years difference
function returnedLessThanFiveYearsAgo(arrivalDateStr){
  console.log("-------------------- arrivalDate: " + arrivalDateStr);
  now = new Date(Date.now());
  arrivalDate = new Date(arrivalDateStr);    
  yearsDiff =  now.getFullYear() - arrivalDate.getFullYear();
  console.log("Num years: " + yearsDiff);
  console.log("Return: " + yearsDiff < 5)
  return yearsDiff < 5;
}

$('#saveProrgressButton').click(function(){
    username = $('#userName').text();
    console.log('--------------username: ' + username);
    if (username == 'Log In'){
      window.location.href = "/login?next=survey";    
    }
    else{
      saveSurvey(survey, "IN PROGRESS");
    }

});

function saveSurvey(survey, status){
  console.log("------------------- Sending the survey to the server");
   var data = survey.data;
   data.pageNo = survey.currentPageNo;

    $.ajax({
        type: 'POST',
        url: '/saveSurvey',
        data: JSON.stringify({
            'survey': JSON.stringify(data),
            'surveyId': surveyId,
            'caseType': surveyType,
            'surveyType': surveyType,
            'status' : status
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
  surveyQuestionsJson = JSON.parse(surveyQuestions); 
  surveyType = surveyQuestionsJson["surveyType"]  

  surveyDataStr = $('#surveyData').text(); 

  // Survey object setup
  Survey.StylesManager.applyTheme("bootstrap");
  survey = new Survey.Model(surveyQuestions);
  surveyData = JSON.parse(surveyDataStr);
  Survey
      .FunctionFactory
      .Instance
      .register("returnedLessThanFiveYearsAgo", returnedLessThanFiveYearsAgo);

  // Temporary survey if it exists in the session browser storage
  var tmpSurveyData = window.sessionStorage.getItem("surveySaved") || null;

  // Get applicationStart object if exists
  // This happens only if this application started from main page click bite
  var surveyStartDataStr = window.sessionStorage.getItem("surveyStart") || null;

  // Restore survey state
  if (surveyData['surveyId'] != null){
    console.log("--------Restoring saved survey");       
    surveyId = surveyData['surveyId'];
    var surveyState = JSON.parse(surveyData['survey']);
    survey.data = surveyState;
    if (surveyState.pageNo) {
      survey.currentPageNo = surveyState.pageNo;
    }
  }
  // Restore temporary survey if it exists in the session browser storage
  // This happens when the user is completing the survey when no logged in
  else if( tmpSurveyData){
      console.log("--------Restoring temporary saved survey");
      var dataToRestore = JSON.parse(tmpSurveyData);

      if(surveyType in dataToRestore){
        data = dataToRestore[surveyType];
        survey.data = data;
        if (data.pageNo) {
          survey.currentPageNo = data.pageNo;
        }
      }
  }
  else if(surveyStartDataStr){
      console.log("--------Loading the initial application info");
      var surveyStartData = JSON.parse(surveyStartDataStr);
      console.log("surveyStartData['married']: " + surveyStartData['married']);
      console.log("surveyStartData['sponsor']: " + surveyStartData['sponsor']);
      if(surveyStartData['name'] == 'citizenship'){
        survey.setValue("age_question",surveyStartData['age']);
        survey.setValue("GreenCardHolder",surveyStartData['gc_holder']);
      }
      else if(surveyStartData['name'] == 'marriagegreencard'){
        survey.setValue("MarriedQuestion",surveyStartData['married']);
        survey.setValue("SponsorQuestion",surveyStartData['sponsor']);        
      }
  }
  
  survey.sendResultOnPageNext = true;
    $('#surveyContainer').Survey({
      model:survey
    });

  survey.onPartialSend.add(function (survey) {
    var data = survey.data;
    data.pageNo = survey.currentPageNo;
    var tmpSurveyData = {};
    tmpSurveyData[surveyType] = data;
    window.sessionStorage.setItem("surveySaved", JSON.stringify(tmpSurveyData));
    currentPageValues = survey.currentPage.getValue();
    if (currentPageValues['exit1'] == 'Yes'){
      console.log("Finishing the survey if click next");
      survey.doComplete();
    }
  });

  survey.onComplete.add(function (survey, options) {
     saveSurvey(survey, "COMPLETED BY USER");
  });



});