from flask import Flask, request, jsonify, session, request, url_for
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from config import ApplicationConfig
from models import db, User, Property
import uuid
import os
import json

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ApplicationConfig.ALLOWED_EXTENSIONS

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, origins="*", supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()

    if user is not None:
        return jsonify({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "phone_number": user.phone_number,
        })
    else:
        return jsonify({"error": "User not found"}), 404


@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    role = request.json["role"]
    phone_number = request.json["phone_number"]

    existing_email = User.query.filter_by(email=email).first()
    existing_phone_number = User.query.filter_by(phone_number=phone_number).first()

    if existing_email:
        return jsonify({"error": "email"}), 409

    if existing_phone_number:
        return jsonify({"error": "phone_number"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, first_name=first_name, last_name=last_name, role=role, phone_number=phone_number)
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "first_name": new_user.first_name,
        "last_name": new_user.last_name,
        "role": new_user.role,
        "phone_number": new_user.phone_number
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "No account with this email exists"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect Password"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })


@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

@app.route("/update-property-users", methods=["POST"])
def update_property_users():
    property_id = request.json.get("propertyId")
    user_ids = request.json.get("userIds", [])

    property = Property.query.filter_by(id=property_id).first()
    if property is None:
        return jsonify({"error": "Property not found"}),

    property.user_ids_list = user_ids
    db.session.commit()

    return jsonify({"message": "Property user list updated successfully"})

@app.route('/properties/<property_id>', methods=['PUT'])
def update_property(property_id):
    property = Property.query.filter_by(id=property_id).first()
    if property is None:
        return jsonify({"error": "Property not found"}), 404

    property_data = request.json

    property.address = property_data.get('address', property.address)
    property.description = property_data.get('description', property.description)
    property.price = property_data.get('price', property.price)
    property.photos = property_data.get('photos', property.photos)
    property.bedrooms = property_data.get('bedrooms', property.bedrooms)
    property.bathrooms = property_data.get('bathrooms', property.bathrooms)
    property.postcode = property_data.get('postcode', property.postcode)
    property.city = property_data.get('city', property.city)

    db.session.commit()

    return jsonify({"message": "Property updated successfully"})

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return 'No image provided', 400

    image = request.files['image']
    if image.filename == '':
        return 'No image provided', 400

    if not allowed_file(image.filename):
        return 'Invalid file type', 400

    filename = secure_filename(image.filename)
    image_extension = filename.rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{image_extension}"
    image.save(os.path.join(ApplicationConfig.UPLOAD_FOLDER, unique_filename))

    image_url = url_for('static', filename=f'uploads/{unique_filename}', _external=True)
    return {'url': image_url}, 200

@app.route('/properties/<property_id>', methods=['GET'])
def get_property(property_id):
    property = Property.query.filter_by(id=property_id).first()
    if property is None:
        return jsonify({"error": "Property not found"}), 404

    property_data = {
        'id': property.id,
        'address': property.address,
        'description': property.description,
        'price': property.price,
        'userId': property.userId,
        'photos': json.loads(property.photos),
        'bedrooms': property.bedrooms,
        'bathrooms': property.bathrooms,
        'postcode': property.postcode,
        'city': property.city,
        'user_ids': property.user_ids_list
    }
    return jsonify(property_data)

@app.route('/properties/<property_id>', methods=['DELETE'])
def delete_property(property_id):
    property = Property.query.filter_by(id=property_id).first()
    if property is None:
        return jsonify({"error": "Property not found"}), 404
    db.session.delete(property)
    db.session.commit()
    return jsonify({"message": "Property deleted successfully"})

@app.route('/properties', methods=['GET', 'POST'])
def handle_properties():
    if request.method == 'GET':
        address = request.args.get('address')
        if address:
            property = Property.query.filter_by(address=address).first()
            if property:
                return jsonify({'id': property.id})
            else:
                return jsonify([])
        else:
            properties = Property.query.all()
            return jsonify([{
                'id': p.id,
                'address': p.address,
                'description': p.description,
                'price': p.price,
                'userId': p.userId,
                'photos': json.loads(p.photos),
                'bedrooms': p.bedrooms,
                'bathrooms': p.bathrooms,
                'postcode': p.postcode,
                'city': p.city,
                'user_ids_list': p.user_ids_list
            } for p in properties])
    elif request.method == 'POST':
        address = request.json["address"]
        description = request.json["description"]
        price = request.json["price"]
        userId = request.json["userId"]
        photos = request.json["photos"]
        bedrooms = request.json["bedrooms"]
        bathrooms = request.json["bathrooms"]
        postcode = request.json["postcode"]
        city = request.json["city"]

        new_property = Property(address=address, description=description, price=price, userId=userId, photos=photos, bedrooms=bedrooms, bathrooms=bathrooms, postcode=postcode, city=city)
        db.session.add(new_property)
        db.session.commit()

        return jsonify({"id": new_property.id, "message": "Property added successfully"})

if __name__ == "__main__":
    app.run(debug=True)