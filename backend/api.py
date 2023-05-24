from flask_restful import Resource, Api
from models import Categories, db, Activities, Entries
from flask_login import login_required, current_user
from flask import request, jsonify
from sqlalchemy import func

api = Api()


class CategoryData(Resource):
    @login_required
    def get(self, username):
        user_data = Categories.query.filter_by(user_id=current_user.id).all()
        name = [user.name for user in user_data]
        target = [user.targetPercentage for user in user_data]
        value = [user.actualPercentage for user in user_data]
        ids = [user.id for user in user_data]
        data = [{"name": n, "target": t, "value": v, "id": str(i)} for n, t, v, i in zip(name, target, value, ids)]
        return {"data": data}, 200

    @login_required
    def post(self, username):
        if request.get_json():
            user_data = Categories(current_user, request.get_json()['name'], request.get_json()['target'],
                                   request.get_json()['value'], request.get_json()['id'])
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
            for data in request.get_json()["data"]:
                user_data = Categories.query.filter_by(id=data['id']).first()
                user_data.name = data['name']
                user_data.targetPercentage = data['target']
                user_data.actualPercentage = data['value']
                user_data.id = data['id']
            db.session.commit()
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400


api.add_resource(CategoryData, '/data/<string:username>')


class ActivityData(Resource):
    @login_required
    def get(self, username, category):
        category_id = Categories.query.filter_by(user_id=current_user.id, name=category).first().id
        user_data = Activities.query.filter_by(category_id=category_id).all()
        name = [user.name for user in user_data]
        target = [user.targetPercentage for user in user_data]
        value = [user.actualPercentage for user in user_data]
        ids = [user.id for user in user_data]
        data = [{"name": n, "target": t, "value": v, "id": str(i)} for n, t, v, i in zip(name, target, value, ids)]
        return {"data": data}, 200

    @login_required
    def post(self, username, category):
        if request.get_json():
            activity_category = Categories.query.filter_by(user_id=current_user.id, name=category).first()
            user_data = Activities(current_user, activity_category, request.get_json()['name'],
                                   request.get_json()['target'],
                                   request.get_json()['value'], request.get_json()['id'])
            db.session.add(user_data)
            db.session.commit()
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400

    @login_required
    def delete(self, username, category):
        if request.get_json():
            user_data = Activities.query.filter_by(id=request.get_json()['id']).first()
            db.session.delete(user_data)
            db.session.commit()
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400

    @login_required
    def patch(self, username, category):
        if request.get_json():
            category_id = Categories.query.filter_by(user_id=current_user.id, name=category).first().id
            for data in request.get_json()["data"]:
                user_data = Activities.query.filter_by(category_id=category_id, id=data['id']).first()
                user_data.category_id = category_id
                user_data.name = data['name']
                user_data.targetPercentage = data['target']
                user_data.actualPercentage = data['value']
                user_data.id = data['id']
            db.session.commit()
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400


api.add_resource(ActivityData, '/activitydata/<string:username>/<string:category>')


def update_percentages(user_id):
    category_data = Categories.query.filter_by(user_id=user_id).all()
    activity_data = Activities.query.filter_by(user_id=user_id).all()
    entries_data = Entries.query.filter_by(user_id=user_id, completed=True).all()
    for category in category_data:
        activities = [activity for activity in activity_data if activity.category_id == category.id]
        category_entries = [entry for entry in entries_data if entry.category_id == category.id]
        for activity in activities:
            current_entries = [entry for entry in entries_data if entry.activity_id == activity.id]
            if len(current_entries) == 0:
                activity.actualPercentage = 0
            activity.actualPercentage = len(current_entries) / len(category_entries)
        if len(category_entries) == 0:
            category.actualPercentage = 0
        category.actualPercentage = len(category_entries) / len(entries_data)
    db.session.commit()


class EntryData(Resource):
    @login_required
    def get(self, username):
        entries = Entries.query.filter_by(user_id=current_user.id).all()
        data = [{"id": str(user.id), "date": str(user.date), "userId": str(user.user_id),
                 "activityId": str(user.activity_id), "categoryId": str(user.category_id), "completed": user.completed}
                for user in entries]
        return {"data": data}, 200

    @login_required
    def put(self, username):
        if request.get_json():
            for data in request.get_json()["data"]:
                if entry := Entries.query.filter_by(id=data['id']).first():
                    entry.completed = data['completed']
                else:
                    new_entry = Entries(current_user, data['activityId'], data['categoryId'], data['date'],
                                        data['completed'], data['id'])
                    db.session.add(new_entry)
            db.session.commit()
            update_percentages(current_user.id)
            return {"message": "success"}, 200
        else:
            return {"message": "fail"}, 400


api.add_resource(EntryData, '/entrydata/<string:username>')


class EntryUtility(Resource):
    @login_required
    def get(self, username):
        categories = Categories.query.filter_by(user_id=current_user.id).all()
        activities = Activities.query.filter_by(user_id=current_user.id).all()
        data = [{"category": category.name,
                 "activities": [{"name": activity.name, "id": str(activity.id), "categoryId": str(activity.category_id),
                                 "userId": str(current_user.id)} for activity in activities if
                                activity.category_id == category.id]}
                for category in categories]
        return {"data": data}, 200


api.add_resource(EntryUtility, '/entryutility/<string:username>')
