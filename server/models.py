from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
import random
import json

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
    phone_number = db.Column(db.String(15), nullable=False, unique=True)

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True, default=get_random_6_digit_number)
    address = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    userId = db.Column(db.String(32), db.ForeignKey('users.id'), nullable=False)
    photos = db.Column(db.Text)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    user_ids = db.Column(db.Text, nullable=False, default="[]")
    postcode = db.Column(db.String(10), nullable=False)
    city = db.Column(db.String(255), nullable=False)
    

    @property
    def user_ids_list(self):
        return json.loads(self.user_ids or "[]")

    @user_ids_list.setter
    def user_ids_list(self, value):
        self.user_ids = json.dumps(value)