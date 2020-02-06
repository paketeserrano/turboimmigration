from flask import render_template, flash, redirect, url_for, request, jsonify
from flask_login import current_user, login_user, login_required, logout_user
from app import app
from app.forms import LoginForm
import app.db as DBLayer
import json
from app.forms import RegistrationForm
from werkzeug.urls import url_parse
import os

@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html', title='Turbo Immigration')

@app.route('/login', methods=['GET', 'POST'])
def login():
	if current_user.is_authenticated:
		return redirect(url_for('index'))

	form = LoginForm()
	if form.validate_on_submit():
		user = DBLayer.DB().getUser(username=form.username.data)

		if user is None or not user.check_password(form.password.data):
			flash('Invalid username or password')
			return redirect(url_for('login'))

		print("---------------- Logging in the user")
		login_user(user, remember=form.remember_me.data)
		print("---------------- User was logged in")
		next_page = request.args.get('next')
		if not next_page or url_parse(next_page).netloc != '':
			next_page = url_for('index')
		return redirect(next_page)

	return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
	logout_user()
	return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
	if current_user.is_authenticated:
		return redirect(url_for('index'))
	form = RegistrationForm()
	if form.validate_on_submit():
		user = DBLayer.DB().createUser(form)
		flash('Congratulations, you are now a registered user!')
		return redirect(url_for('login'))
	return render_template('register.html', title='Register', form=form)

@login_required
@app.route('/user', methods=['GET'])
def user():
	db = DBLayer.DB()

	# User info
	user = db.getUser(current_user.username)
	userDict = {}
	userDict['id'] = user.id
	userDict['first'] = user.firstname
	userDict['last'] = user.lastname
	userDict['username'] = user.username
	userDict['email'] = user.email

	# Get cases info
	userFileCases = db.getUserFileCases(user.id)
	for fileCase in userFileCases:
		fileCaseSurveys = db.getSurveys(fileCase['id'])
		fileCaseItems = db.getItems(fileCase['id'])
		fileCase['surverys'] = fileCaseSurveys
		fileCase['items'] = fileCaseItems

	print("------------------------------------------")
	print(json.dumps(userFileCases))

	return render_template('user.html', title='User Area', user=userDict, filecases=json.dumps(userFileCases))

@app.route('/getSurveyModel',methods=['GET'])
def getSurveyModel(application = None):
	if application == None:
		application = request.args.get('app')
		
	surveyModel = {}
	if application == 'ctz':
		surveyName = 'U.S. Citizenship'
		surveyModelFilePath = os.path.join(app.root_path, 'static/json/citizenship.json')
		with open(surveyModelFilePath) as json_file:
		    surveyModel = json.load(json_file)
	elif application == 'mgc':
		surveyName = 'Marriage Green Card'
		surveyModelFilePath = os.path.join(app.root_path, 'static/json/marriage.json')
		with open(surveyModelFilePath) as json_file:
		    surveyModel = json.load(json_file)

	return json.dumps(surveyModel)

@app.route('/survey',methods=['GET'])
@app.route("/survey/<surveyId>",methods=['GET'])
def survey(surveyId = None):
	application = request.args.get('app')
	print("-----------------application: " + application)
	surveyName = ''
	surveyModel = getSurveyModel(application)

	survey = '{}'
	if surveyId != None:
		db = DBLayer.DB()
		survey = db.getSurvey(surveyId)

	surveyData = {}
	surveyData['surveyId'] = surveyId
	surveyData['survey'] = survey

	print("--------- Survey data: " + survey)

	return render_template('survey.html', title = 'Complete Survey', surveyName = surveyName, surveyData = json.dumps(surveyData), surveyQuestions = surveyModel)

@app.route("/saveSurvey",methods=['GET','POST'])
def saveSurvey():
	print("-------------Survey received")
	payload = request.get_json()
	surveyData = payload['survey']
	print("payload: " + json.dumps(payload))
	surveyId = payload['surveyId']
	surveyStatus = payload['status']
	if surveyId != -1:
		# Updating existing survey
		print("Updating survey " + str(id))
		surveyId = payload['surveyId']
		db = DBLayer.DB()
		db.updateSurvey(surveyData, surveyId,surveyStatus)
	else:
		#Creating new survey
		print("Saving the survey...")
		print("payload['survey']: " + surveyData)
		db = DBLayer.DB()
		caseId = db.createFileCase(current_user,payload['caseType'],"NEW")
		surveyId = db.createSurvey(surveyData,caseId,payload['surveyType'], surveyStatus)
		print("Survey saved")

	print("surveyId; " + str(surveyId))
	return json.dumps({'surveyId': surveyId})

@app.route("/dashboard",methods=['GET','POST'])
def dashboard():
	db = DBLayer.DB()
	staffId = current_user.id
	staffcases = db.getStaffFileCases(staffId)
	print("++++++++++++++")
	print(staffcases)
	print("++++++++++++++")
	return render_template('dashboard.html', title="Dashboard", staffcases=staffcases)

@app.route("/getFileCases",methods=['GET'])
def getFileCases():
	search_params = request.data 
	
	print('type: ' + str(request.args.get('type')))
	print('status: ' + str(request.args.get('status')))
	print('ownerFirstName: ' + str(request.args.get('ownerfirst')))
	print('ownerLastName: ' + str(request.args.get('ownerlast')))
	print('clientFirstName: ' + str(request.args.get('clientfirst')))
	print('clientLastName: ' + str(request.args.get('clientlast')))

	clientfirst = request.args.get('clientfirst')
	clientlast = request.args.get('clientlast')
	ownerfirst = request.args.get('ownerfirst')
	ownerlast = request.args.get('ownerlast')
	fileType = request.args.get('type')
	status = request.args.get('status')
	db = DBLayer.DB()
	filecases = db.getFileCases(clientfirst,clientlast,ownerfirst,ownerlast,fileType,status)
	return json.dumps(filecases)

@app.route("/getStaffUsers",methods=['GET'])
def getStaffUsers():
	db = DBLayer.DB()
	return json.dumps(db.getStaffUsers())

@app.route("/assignFileCaseToOwner",methods=['GET','POST'])
def assignFileCaseToOwner():
	data_received = request.get_json()
	db = DBLayer.DB()
	response = db.assignFileCaseToOwner(data_received['filecaseid'], data_received['ownerid'])
	return json.dumps(response)

@app.route("/getFileCaseForStaff/<filecaseid>",methods=['GET'])
def getFileCaseForStaff(filecaseid):
	db = DBLayer.DB()

	filecase = db.getFileCase(filecaseid)
	# Just get the username from this object. It contains the password
	client = db.getUserWithId(filecase['clientid'])
	user = db.getUser(client.username)
	userDict = {}
	userDict['id'] = user.id
	userDict['first'] = user.firstname
	userDict['last'] = user.lastname
	userDict['username'] = user.username
	userDict['email'] = user.email

	surveys = db.getSurveys(filecase['id'])

	print(surveys)

	return render_template('filecase.html', title="File Case", user=userDict, filecase=filecase, surveys=surveys)