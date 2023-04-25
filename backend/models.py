from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password = db.Column(db.String(128))

    categories = db.relationship('Categories', backref='user', lazy='dynamic')
    activities = db.relationship('Activities', backref='user', lazy='dynamic')

    def __init__(self, _username, _password):
        self.username = _username
        self.password = _password


class Categories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    targetPercentage = db.Column(db.Float)
    actualPercentage = db.Column(db.Float)

    activities = db.relationship('Activities', backref='categories', lazy='dynamic')

    def __init__(self, _user, _name, _target, _actual=0):
        self.user_id = _user.id
        self.name = _name
        self.targetPercentage = _target
        self.actualPercentage = _actual


class Activities(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    targetPercentage = db.Column(db.Float)
    actualPercentage = db.Column(db.Float)

    entries = db.relationship('Entries', backref='activities', lazy='dynamic')


class Entries(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date = db.Column(db.Date)
    completed = db.Column(db.Boolean)
