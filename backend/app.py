from flask import Flask
import csv
import os
from models import db
from auth import auth, login_manager
from api import api

app = Flask(__name__)
api.init_app(app)

username = "postgres"
password = os.environ.get("DB_PASSWORD")
host = os.environ.get("DB_HOST")
port = "5432"
database = "postgres"

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
