from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
import random

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

def get_random_6_digit_number():
    number = random.randint(100000, 999999)
    
    while Property.query.filter_by(id=number).first() is not None:
        number = random.randint(100000, 999999)
    
    return number

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    first_name = db.Column(db.String(32), nullable=False)
    last_name = db.Column(db.String(32), nullable=False)
    role = db.Column(db.String(32), nullable=False)
    properties = db.relationship('Property', backref='user', lazy=True)

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True, default=get_random_6_digit_number)
    address = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    userId = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    photos = db.Column(db.Text)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
