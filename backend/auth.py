from flask import Blueprint, request, redirect
from flask_login import login_user, logout_user, login_required, LoginManager
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, db

auth = Blueprint('auth', __name__)

login_manager = LoginManager()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@login_manager.request_loader
def load_user_from_request(req):
    user = request.url.split("/")[-1]
    return User.query.filter_by(username=user).first()


@login_manager.unauthorized_handler
def unauthorized():
    return "Unauthorized", 401


@auth.route('/login', methods=['GET', 'POST'])
def login():
    print("request")
    if request.form.get("username") and request.form.get("password"):
        user = User.query.filter_by(username=request.form.get("username")).first()
        if user:
            if check_password_hash(user.password, request.form.get("password")):
                print("Log in")
                login_user(user)
                return redirect(f"http://localhost:3000/user/{user.username}")
            else:
                return "Incorrect password", 401
        else:
            return "User does not exist", 404
    print("Fail")
    return redirect('http://localhost:3000/user/fail')


@auth.route('/signup', methods=['GET', 'POST'])
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


@auth.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    try:
        logout_user()
        return redirect('http://localhost:3000/')
    except Exception as e:
        print(e)
        return redirect('http://localhost:3000/error')
