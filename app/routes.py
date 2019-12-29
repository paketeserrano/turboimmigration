from flask import render_template, flash, redirect, url_for, request, jsonify
from flask_login import current_user, login_user, login_required, logout_user
from app import app
from app.forms import LoginForm
import app.db as DBLayer
import json
from app.forms import RegistrationForm
from werkzeug.urls import url_parse

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

@app.route('/survey')
@app.route("/survey/<surveyId>",methods=['GET'])
def survey(surveyId = None):
	survey = '{}'
	if surveyId != None:
		db = DBLayer.DB()
		survey = db.getSurvey(surveyId)

	surveyData = {}
	surveyData['surveyId'] = surveyId
	surveyData['survey'] = survey

	print("--------- Survey data: " + survey)

	return render_template('survey.html', title = 'Complete Survey', surveyName = 'U.S. Citizenship', surveyData = json.dumps(surveyData))

@app.route("/saveSurvey",methods=['GET','POST'])
def saveSurvey():
	print("-------------Survey received")
	payload = request.get_json()
	surveyData = payload['survey']
	print("payload: " + json.dumps(payload))
	surveyId = payload['surveyId']
	if surveyId != -1:
		print("Updating survey " + str(id))
		surveyId = payload['surveyId']
		db = DBLayer.DB()
		db.updateSurvey(surveyData, surveyId)
	else:
		print("Saving the survey...")
		print("payload['survey']: " + surveyData)
		db = DBLayer.DB()
		caseId = db.createCase(current_user,payload['caseType'])
		surveyId = db.createSurvey(surveyData,caseId,payload['surveyType'])
		print("Survey saved")

	print("caseId; " + str(caseId))
	print("surveyId; " + str(surveyId))
	return json.dumps({'surveyId': surveyId})