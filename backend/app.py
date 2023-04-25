from flask import Flask
import csv
from models import db
from auth import auth, login_manager
from api import api

app = Flask(__name__)
api.init_app(app)

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
db.init_app(app)

login_manager.init_app(app)
login_manager.login_view = 'login'

app.register_blueprint(auth)

with app.app_context():
    db.create_all()


@app.route('/test', methods=['GET', 'POST'])
def test():
    return {"message": "success"}, 200


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
