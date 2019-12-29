import pymysql
import json
from app.models import User
from werkzeug.security import generate_password_hash
from app import login

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

    def createSurvey(self,survey,caseid,surveyType):
        query = 'INSERT INTO survey (name,caseid,config) VALUES (%s,%s,%s)'
        self.cursor.execute(query,('US Citizenship', caseid, surveyType))

        self.session.commit() 
        return self.cursor.lastrowid

    def updateSurvey(self,survey, surveyId):
        query = 'UPDATE survey SET config = %s WHERE id = %s' 
        self.cursor.execute(query,(survey, surveyId))
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

    def createCase(self,user,type):
        print("-----------case ID: " + str(user.id))
        query = "INSERT INTO case (type,clientid) VALUES ('" + type + "'," + str(user.id) + ")"
        print("----------query: " + query)
        self.cursor.execute(query)

        self.session.commit() 
        return self.cursor.lastrowid   

@login.user_loader
def load_user(id): 
    user = None 
    print("---------------id: " + id)
    if id != 'None':
        user = DB().getUserWithId(id)

    return user