$('#startCitizenshipButton').on('click',function(){
    age = $('#citizenbitequestion1').val();
    gc_holder = $('#citizenbitequestion2').val();
    applicationInfo = '{ "name": "citizenship", "age":"' + age + '","gc_holder":"' + gc_holder + '"}'
    appInfoJson = JSON.parse(applicationInfo)
    window.sessionStorage.setItem("surveyStart", applicationInfo);

    window.location.href = '/survey?app=ctz'
});

$('#startSpousalGreenCardButton').on('click',function(){
    married = $('#spousalGreenCard1').val();
    sponsor = $('#spousalGreenCard2').val();
    applicationInfo = '{ "name": "marriagegreencard", "married":"' + married + '","sponsor":"' + sponsor + '"}'
    appInfoJson = JSON.parse(applicationInfo)
    window.sessionStorage.setItem("surveyStart", applicationInfo);

    window.location.href = '/survey?app=mgc'
});