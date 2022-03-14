#views.py used to store standard routes for my website e.g. homepage

from unicodedata import category
from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user, UserMixin
from .models import Note
from .models import User
from . import db
import json

views = Blueprint('views', __name__)


@views.route('/home', methods= ['GET', 'POST']) # DOG WALKERS HOME PAGE
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')

        if len(note) < 1:
            flash('Note is too short!', category='error')
        else: 
            new_note = Note(data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("home.html", user=current_user)

@views.route('/dohome', methods= ['GET', 'POST']) # DOG OWNERS HOME PAGE
@login_required
def dohome():
   users = User.query.filter_by(type='walker').all()
   return render_template("dohome.html", users=users, user=current_user)
      # users = User.query.filter_by(type='walker').all()
        #user_text = '<ul>'
        #for user in users:
        #    user_text += '<li>' + user.firstName + '</li>'
        #    user_text += '</ul>'
        #return user_text

@views.route('/')
def landingpage():
    return render_template("landingpage.html", user=current_user)

@views.route('/FAQs')
def FAQs():
    return render_template("FAQs.html", user=current_user)

@views.route('/myprofile') # Dog owners profile
def myprofile():
    return render_template("myprofile.html", user=current_user)

@views.route('/messages') # Dog owners messages
def messages():
    return render_template("messages.html", user=current_user)

@views.route('/bookings') # Dog owners bookings
def bookings():
    return render_template("bookings.html", user=current_user)

@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteId = note['noteId']
    note = Note.query.get(noteId)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()

    return jsonify({})

  