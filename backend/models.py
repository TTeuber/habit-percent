from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from sqlalchemy.dialects.postgresql import UUID
import uuid

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(64), index=True, unique=True)
    password = db.Column(db.String(128))

    categories = db.relationship('Categories', backref='user', lazy='dynamic')
    activities = db.relationship('Activities', backref='user', lazy='dynamic')

    def __init__(self, _username, _password):
        self.id = uuid.uuid4()
        self.username = _username
        self.password = _password


class Categories(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(64), index=True)
    user_id = db.Column(UUID(), db.ForeignKey('user.id'), index=True)
    targetPercentage = db.Column(db.Float)
    actualPercentage = db.Column(db.Float)

    activities = db.relationship('Activities', backref='categories', lazy='dynamic')

    def __init__(self, _user, _name, _target, _actual=0, _id=uuid.uuid4()):
        self.id = _id
        self.user_id = _user.id
        self.name = _name
        self.targetPercentage = _target
        self.actualPercentage = _actual


class Activities(db.Model):
    id = db.Column(UUID(), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(64), index=True)
    category_id = db.Column(UUID(), db.ForeignKey('categories.id'))
    user_id = db.Column(UUID(), db.ForeignKey('user.id'))
    targetPercentage = db.Column(db.Float)
    actualPercentage = db.Column(db.Float)

    entries = db.relationship('Entries', backref='activities', lazy='dynamic')

    def __init__(self, _user, _category, _name, _target, _actual=0, _id=uuid.uuid4()):
        self.id = _id
        self.user_id = _user.id
        self.category_id = _category.id
        self.name = _name
        self.targetPercentage = _target
        self.actualPercentage = _actual


class Entries(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_id = db.Column(UUID(), db.ForeignKey('activities.id'))
    user_id = db.Column(UUID(), db.ForeignKey('user.id'))
    date = db.Column(db.Date)
    completed = db.Column(db.Boolean)

    def __init__(self, _user, _activity, _date, _completed, _id=uuid.uuid4()):
        self.id = _id
        self.user_id = _user.id
        self.activity_id = _activity.id
        self.date = _date
        self.completed = _completed
