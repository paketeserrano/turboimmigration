import os

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'erin!baha!maha!paco@2016'