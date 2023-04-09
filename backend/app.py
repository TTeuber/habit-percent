from flask import Flask, redirect, request
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
import csv

app = Flask(__name__)
api = Api(app)

credentials = csv.DictReader(open('credentials.csv', 'r'))
credentials = next(credentials)
username = credentials['username']
password = credentials['password']
host = credentials['host']
port = credentials['port']
database = credentials['database']

app.config[
    'SQLALCHEMY_DATABASE_URI'] = 'postgresql://' + username + ':' + password + '@' + host + ':' + port + '/' + database
app.config['SECRET_KEY'] = 'secret'
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True)
    password = db.Column(db.String(80))
    user = db.relationship('UserData', backref=db.backref('user', lazy=True))

    def __init__(self, _username, _password):
        self.username = _username
        self.password = _password


class UserData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    text = db.Column(db.String(100))

    def __init__(self, user, _text):
        self.user_id = user.id
        self.text = _text


with app.app_context():
    db.create_all()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@login_manager.request_loader
def load_user_from_request(user_id):
    return User.query.get(int(user_id))


class Test(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(90), nullable=False)


class TestAPI(Resource):
    def get(self):
        return {"hello": Test.query.first().name}


class Data(Resource):
    def get(self, username):
        return "please work"


api.add_resource(Data, '/data/<username>')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.form.get("username") and request.form.get("password"):
        user = User.query.filter_by(username=request.form.get("username")).first()
        if user:
            if check_password_hash(user.password, request.form.get("password")):
                login_user(user)
                return redirect(f"http://localhost:3000/user/{user.username}")
            else:
                return "Incorrect password", 401
        else:
            return "User does not exist", 404
    return redirect('http://localhost:3000/user/fail')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.form.get("username") and request.form.get("password"):
        if not User.query.filter_by(username=request.form.get("username")).first():
            user = User(request.form.get("username"),
                        generate_password_hash(request.form.get("password"), method='sha256'))
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(f"http://localhost:3000/user/{user.username}")
        else:
            return "Username already taken", 409

    return redirect("http://localhost:3000/user/fail")


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect('http://localhost:3000/user/login')


api.add_resource(TestAPI, '/')

if __name__ == '__main__':
    app.run(debug=True)
