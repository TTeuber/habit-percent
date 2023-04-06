from flask import Flask
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
api = Api(app)


class Test(Resource):
    def get(self):
        return {'hello': 'world', 'goodbye': 'person'}


api.add_resource(Test, '/')


if __name__ == '__main__':
    app.run()
