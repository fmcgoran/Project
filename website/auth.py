
from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash 
from . import db 
from flask_login import login_user, login_required, logout_user, current_user, UserMixin

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST']) 
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first() 
        if user:
            if check_password_hash(user.password, password):
                flash('Logged in successfully!', category='success')
                login_user(user, remember=True) 
                if user.type == 'walker':
                    flash('DOGWALKER')
                    return redirect(url_for('views.home')) # is signed up as dog walker
                    
                else:
                    flash('DOGOWNER')
                    return redirect(url_for('views.dohome')) # is signed up as dog owner
                
            else:
                flash('Incorrect password, try again.', category='error')
        else:
            flash('Email does not exist.', category='error') 

    return render_template("login.html", user=current_user) 

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))
 
@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        type = request.form.get('type')
        email = request.form.get('email')
        firstName = request.form.get('firstName')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        

        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email already exists.', category='error')
        elif len(email) < 4:  #validation for form
            flash('Invalid email address.', category='error')
        elif len(firstName) < 2:
            flash('First name must have more than one character.', category='error')
        elif password1 != password2:
            flash('Passwords do not match.', category='error')
        elif len(password1) < 7:
            flash('Password must be at least 7 characters.', category='error')
        else:
            #Add user to database
            new_user = User(type=type, email=email, firstName=firstName, password=generate_password_hash(password1, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True) 
            flash('Account created!', category='success')
            if new_user.type == 'walker':
                    flash('DOGWALKER')
                    return redirect(url_for('views.home')) # is signed up as dog walker
                    
            else:
                    flash('DOGOWNER')
                    return redirect(url_for('views.dohome')) # is signed up as dog owner
                

           
    return render_template("signup.html", user=current_user)      