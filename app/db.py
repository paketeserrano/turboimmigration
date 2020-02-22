import pymysql
import json
from app.models import User
from werkzeug.security import generate_password_hash
from app import login
from app import blog_engine

class DB:
    
    ''' Constructor and DB connexion '''
    def __init__(self):
        self.host = 'localhost'
        self.user = 'TIAdmin'
        self.passwd = 'admin'
        self.db = 'turboimmigration'
        self.session = None
        self.cursor = None
        '''
        BASE_DIR =os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.confFile = BASE_DIR+'/conf/confDB.xml'
        
        with open(self.confFile) as file:
            conf = objectify.fromstring(file.read())
            self.host = str(conf.host)
            self.user = str(conf.user)
            self.passwd = str(conf.passwd)
            self.db = str(conf.db)
        '''
        
        self.session = pymysql.connect(host=self.host, user=self.user,passwd=self.passwd,db=self.db,use_unicode=True, charset="utf8mb4")
        self.cursor = self.session.cursor()

    def createSurvey(self,survey,caseid,surveyType, surveyStatus):
        query = 'INSERT INTO survey (name,caseid,config,status) VALUES (%s,%s,%s,%s)'
        self.cursor.execute(query,(surveyType, caseid, survey,surveyStatus))

        self.session.commit() 
        return self.cursor.lastrowid

    def updateSurvey(self,survey, surveyId,surveyStatus):
        query = 'UPDATE survey SET config = %s, status = %s WHERE id = %s' 
        self.cursor.execute(query,(survey, surveyStatus, surveyId))
        self.session.commit() 


    def getSurvey(self,surveyId):
        query = 'SELECT config from survey WHERE id = ' + str(surveyId)
        self.cursor.execute(query)
        result = self.cursor.fetchone()

        if self.cursor.rowcount == 0:
            return None
        else:
            print("-----------result[0]: " + result[0])
            return result[0] 

    def getUser(self,username):
        query = 'SELECT id,username,email,firstname,lastname,password FROM user WHERE username = "' + username + '"'
        self.cursor.execute(query)
        result = self.cursor.fetchone()
        if self.cursor.rowcount == 0:
            print("No user found!!")
            return None
        else:
            id = result[0]
            username = result[1]
            email = result[2]
            firstname = result[3]
            lastname = result[4]
            hashed_password = result[5]
            user = User(id,username,email,firstname,lastname)
            user.set_hash_password(hashed_password)
            return user 

    def getUserWithId(self,id):
        query = 'SELECT id,username,email,firstname,lastname,password FROM user WHERE id = ' + str(id)
        self.cursor.execute(query)
        result = self.cursor.fetchone()
        if self.cursor.rowcount == 0:
            return None
        else:
            id = result[0]
            username = result[1]
            email = result[2]
            firstname = result[3]
            lastname = result[4]
            hashed_password = result[5]
            user = User(id,username,email,firstname,lastname)
            user.set_hash_password(hashed_password)
            return user 

    def getUserWithEmail(self,email):
        query = 'SELECT id,username,email,firstname,lastname,password FROM user WHERE email = %s'
        self.cursor.execute(query,(email))
        result = self.cursor.fetchone()
        if self.cursor.rowcount == 0:
            return None
        else:
            id = result[0]
            username = result[1]
            email = result[2]
            firstname = result[3]
            lastname = result[4]
            hashed_password = result[5]
            user = User(id,username,email,firstname,lastname)
            user.set_hash_password(hashed_password)
            return user 

    def createUser(self,form):
        query = 'INSERT INTO user (password,username,email,firstname,lastname) VALUES (%s,%s,%s,%s,%s)'
        self.cursor.execute(query,(generate_password_hash(form.password.data),form.username.data,form.email.data,form.firstname.data,form.lastname.data))  
        self.session.commit()  

    def getStaffUsers(self):
        self.cursor.execute("SELECT id,username,email,firstname,lastname,role FROM user")
        rows = self.cursor.fetchall()
        users = []
        for row in rows:
            user = {}
            user['id'] = row[0]
            user['username'] = row[1]
            user['email'] = row[2]
            user['firstname'] = row[3]
            user['lastname'] = row[4]
            user['role'] = row[5]
            users.append(user)

        return users


    def createFileCase(self,user,type,status):
        print("-----------filecase ID: " + str(user.id))
        query = "INSERT INTO filecase (type,clientid,status) VALUES ('" + type + "'," + str(user.id) + ",'" + status + "')"
        print("----------query: " + query)
        self.cursor.execute(query)

        self.session.commit() 
        return self.cursor.lastrowid   

    def getUserFileCases(self, userid):
        self.cursor.execute('SELECT id,type,clientid,status,ownerid FROM filecase WHERE clientid = ' + str(userid))
        rows = self.cursor.fetchall()
        fileCases = []
        for row in rows:
            fileCase = {}
            fileCase['id'] = row[0]
            fileCase['type'] = row[1]
            fileCases.append(fileCase)

        return fileCases

    def getStaffFileCases(self, userid):
        self.cursor.execute('SELECT id,type,clientid,status FROM filecase WHERE ownerid = ' + str(userid))
        rows = self.cursor.fetchall()
        fileCases = []
        for row in rows:
            fileCase = {}
            fileCase['id'] = row[0]
            fileCase['type'] = row[1]
            fileCase['clientname'] = row[2]
            fileCase['status'] = row[3]
            fileCases.append(fileCase)

        return fileCases

    def getFileCase(self,id):
        self.cursor.execute('SELECT id,type,clientid,status,ownerid FROM filecase WHERE id = ' + str(id))
        fileCaseResponse = self.cursor.fetchone()
        fileCase = {}
        fileCase['id'] = fileCaseResponse[0]
        fileCase['type'] = fileCaseResponse[1]
        fileCase['clientid'] = fileCaseResponse[2]
        fileCase['status'] = fileCaseResponse[3]
        fileCase['ownerid'] = fileCaseResponse[4]

        return fileCase


    def getSurveys(self,filecaseid):
        self.cursor.execute('SELECT id,name,caseid,config,status FROM survey WHERE caseid=' + str(filecaseid))
        rows = self.cursor.fetchall()
        surveys = []
        for row in rows:
            survey = {}
            survey['id'] = row[0]
            survey['name'] = row[1]
            survey['caseid'] = row[2]
            survey['config'] = row[3]
            survey['status'] = row[4]
            surveys.append(survey)

        return surveys

    def getFileCaseItems(self,filecaseid):
        self.cursor.execute('SELECT id,type,caseid,itempath,name FROM caseitem WHERE caseid=' + str(filecaseid))
        rows = self.cursor.fetchall()
        caseitems = []
        for row in rows:
            caseitem = {}
            caseitem['id'] = row[0]
            caseitem['type'] = row[1]
            caseitem['caseid'] = row[2]
            caseitem['itempath'] = row[3]
            caseitem['name'] = row[4]
            caseitems.append(caseitem)

        return caseitems

    def getItems(self,filecaseid):
        self.cursor.execute('SELECT id,name,caseid,status,type FROM caseitem WHERE caseid=' + str(filecaseid))
        rows = self.cursor.fetchall()
        caseitems = []
        for row in rows:
            caseitem = {}
            caseitem['id'] = row[0]
            caseitem['name'] = row[1]
            caseitem['caseid'] = row[2]
            caseitem['status'] = row[3]
            caseitem['type'] = row[4]
            caseitems.append(caseitem)

        return caseitems

    def getFileCaseItem(self,caseitemid):
        self.cursor.execute('SELECT id,name,caseid,status,type,itempath FROM caseitem WHERE id=' + str(caseitemid))
        row = self.cursor.fetchone()
        caseitem = {}
        caseitem['id'] = row[0]
        caseitem['name'] = row[1]
        caseitem['caseid'] = row[2]
        caseitem['status'] = row[3]
        caseitem['type'] = row[4]
        caseitem['itempath'] = row[5]

        return caseitem

    def deleteCaseItem(self,caseId):  
        self.cursor.execute('DELETE from caseitem WHERE id = ' + str(caseId) )  
        self.session.commit() 

    def getFileCases(self,clientfirst = None,clientlast = None,ownerfirst = None,ownerlast = None,fileType = None,fileStatus = None):
        whereclause = ""
        firstWhereItemAdded = False

        #Collect client ids with first and last names
        if not clientfirst is None or not clientlast is None:
            userWhereClause = ""
            if not clientfirst is None:
                userWhereClause = " WHERE firstname='" + clientfirst + "'"

            if not clientlast is None:
                if not clientfirst is None:
                    userWhereClause += " or lastname='" + clientlast + "'"
                else:
                    userWhereClause = " WHERE lastname='" + clientlast + "'"

            print("User where clause: " + userWhereClause)
            self.cursor.execute('SELECT id,firstname,lastname FROM user' + userWhereClause)
            usersInfo = self.cursor.fetchall()
            if len(usersInfo) > 0:
                firstWhereItemAdded = True
                whereclause = ' WHERE clientid IN ('
                for userInfo in usersInfo:
                    whereclause += str(userInfo[0]) + ','
                    user = {}
                    user['id'] = userInfo[0]
                    user['firstname'] = userInfo[1]
                    user['lastname'] = userInfo[2]

                whereclause = whereclause[:-1]
                whereclause += ')'

        #Collect owner ids with first and last names
        if not ownerfirst is None or not ownerlast is None:
            userWhereClause = ""
            if not ownerfirst is None:
                userWhereClause = " WHERE firstname='" + ownerfirst + "'"

            if not ownerlast is None:
                if not ownerfirst is None:
                    userWhereClause += " or lastname='" + ownerlast + "'"
                else:
                    userWhereClause = " WHERE lastname='" + ownerlast + "'"

            print("User where clause: " + userWhereClause)
            self.cursor.execute('SELECT id,firstname,lastname FROM user' + userWhereClause)
            usersInfo = self.cursor.fetchall()
            if len(usersInfo) > 0:

                if firstWhereItemAdded:
                    whereclause += ' AND ownerid IN ('
                else:
                    firstWhereItemAdded = True
                    whereclause += ' WHERE ownerid IN ('

                for userInfo in usersInfo:
                    whereclause += str(userInfo[0]) + ','
                    user = {}
                    user['id'] = userInfo[0]
                    user['firstname'] = userInfo[1]
                    user['lastname'] = userInfo[2]

                whereclause = whereclause[:-1]
                whereclause += ')'

        if not fileType is None:
            if firstWhereItemAdded:
                whereclause += ' AND type="' + str(fileType) + '"'
            else:
                firstWhereItemAdded = True
                whereclause += ' WHERE type="' + str(fileType) + '"'

        if not fileStatus is None:
            if firstWhereItemAdded:
                whereclause += ' AND status="' + str(fileStatus) + '"'
            else:
                firstWhereItemAdded = True
                whereclause += ' WHERE status="' + str(fileStatus) + '"'

        print("-----------query: SELECT id,type,clientid,status,ownerid FROM filecase" + whereclause)

        self.cursor.execute('SELECT id,type,clientid,status,ownerid FROM filecase' + whereclause)
        rows = self.cursor.fetchall()
        fileCases = []
        for row in rows:
            fileCase = {}
            fileCase['id'] = row[0]
            fileCase['type'] = row[1]
            clientid = row[2]
            self.cursor.execute('SELECT firstname,lastname FROM user WHERE id=' + str(clientid))
            firstlast = self.cursor.fetchone()
            fileCase['clientname'] = firstlast[0] + ' ' + firstlast[1]

            fileCase['status'] = row[3]
            ownerid = row[4]
            self.cursor.execute('SELECT firstname,lastname FROM user WHERE id=' + str(ownerid))
            firstlast = self.cursor.fetchone()
            fileCase['ownername'] = firstlast[0] + ' ' + firstlast[1]

            fileCases.append(fileCase)

        return fileCases    

    def assignFileCaseToOwner(self, filecaseid, ownerid):
        self.cursor.execute('UPDATE filecase SET ownerid=' + str(ownerid) + ' WHERE id=' + str(filecaseid))
        self.session.commit()   
        return {"status":"success"} 

    def createFileCaseItem(self,caseid,type,fullfilename,filename):
        query = "INSERT INTO caseitem (caseid,type,itempath,name) VALUES (" + caseid + ",'" + type + "','" + fullfilename + "','" + filename + "')"
        self.cursor.execute(query)
        self.session.commit() 
        return self.cursor.lastrowid 


@login.user_loader
@blog_engine.user_loader
def load_user(id): 
    user = None 
    print("---------------id: " + id)
    if id != 'None':
        user = DB().getUserWithId(id)

    return user