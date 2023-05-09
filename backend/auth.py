from flask import Blueprint, request, redirect, make_response, session
from flask_login import login_user, logout_user, login_required, LoginManager, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, db
from sqlalchemy.exc import OperationalError

auth = Blueprint('auth', __name__)

login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


@login_manager.request_loader
def load_user_from_request(req):
    user = request.url.split('/')[-1]
    return User.query.filter_by(username=user).first()


@login_manager.unauthorized_handler
def unauthorized():
    return "Unauthorized", 401


@auth.route('/login', methods=['GET', 'POST'])
def login():
    try:
        if request.json.get("username") and request.json.get("password"):
            if user := User.query.filter_by(username=request.json.get("username")).first():
                if check_password_hash(user.password, request.json.get("password")):
                    login_user(user)
                    return make_response("success", 200)
                else:
                    return "Incorrect password", 401
            else:
                print("login error")
                return "User does not exist", 404
        return redirect('http://localhost:3000/user/fail'), 401
    except OperationalError as e:
        return {"error": "Connection Error"}, 500
    except Exception as e:
        print(e)
        return redirect('http://localhost:3000/error'), 500


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.json.get("username") and request.json.get("password"):
        if not User.query.filter_by(username=request.json.get("username")).first():
            user = User(request.json.get("username"),
                        generate_password_hash(request.json.get("password"), method='sha256'))
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return redirect(f"http://localhost:3000/user/{user.username}")
        else:
            return "Username already taken", 409

    return redirect("http://localhost:3000/user/fail")


@auth.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    try:
        logout_user()
        response = make_response("success", 200)
        return response
    except Exception as e:
        print(e)
        return redirect('http://localhost:3000/error')
