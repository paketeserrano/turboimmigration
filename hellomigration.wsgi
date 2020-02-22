import sys
sys.path.insert(0, '/var/www/html/hellomigration')

activate_this = '/root/hellomigration/turboimmigration/venv/bin/activate_this.py'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from turboimmigration import app as application

