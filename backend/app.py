from flask import Flask, redirect, request
from flask_restful import Resource, Api
from flask_login import login_required, current_user
import csv
from models import db, User, Categories, Activities, Entries
from auth import auth, login_manager

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
db.init_app(app)

login_manager.init_app(app)
login_manager.login_view = 'login'

app.register_blueprint(auth)

with app.app_context():
    db.create_all()


@app.route('/test', methods=['GET', 'POST'])
def test():
    return {"message": "success"}, 200


class UserData(Resource):
    @login_required
    def get(self, username):
        user_data = Categories.query.filter_by(user_id=current_user.id).all()
        name = [user.name for user in user_data]
        target = [user.targetPercentage for user in user_data]
        value = [user.actualPercentage for user in user_data]
        data = [{"name": n, "target": t, "value": v} for n, t, v in zip(name, target, value)]
        return {"data": data}, 200

    @login_required
    def post(self, username):
        if request.get_json():
            user_data = Categories(current_user, request.get_json()['name'], request.get_json()['target'],
                                   request.get_json()['value'])
            db.session.add(user_data)
            db.session.commit()
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400

    @login_required
    def delete(self, username):
        if request.get_json():
            user_data = Categories.query.filter_by(id=request.get_json()['id']).first()
            db.session.delete(user_data)
            db.session.commit()
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400

    @login_required
    def patch(self, username):
        if request.get_json():
            user_data = Categories.query.filter_by(id=request.get_json()['id']).first()
            user_data.name = request.get_json()['name']
            user_data.targetPercentage = request.get_json()['target']
            user_data.actualPercentage = request.get_json()['value']
            db.session.commit()
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400


api.add_resource(UserData, '/data/<string:username>')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)
