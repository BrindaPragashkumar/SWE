import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserShape } from '../Types';
import httpClient from '../httpClient';
import PropTypes from 'prop-types';
import '../Dark.css';
import { useNavigate, useParams } from 'react-router-dom';

const EditPropertyPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/properties/${propertyId}`);
        setProperty(response.data);
        setAddress(response.data.address);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setBedrooms(response.data.bedrooms);
        setBathrooms(response.data.bathrooms);
        setPostcode(response.data.postcode);
        setCity(response.data.city);
        setImageUrls(response.data.photos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProperty();

    (async () => {
      try {
        const resp = await httpClient.get('//localhost:5000/@me');
        setUser(resp.data);
      } catch (error) {
        console.log('Not authenticated');
      }
    })();
  }, [propertyId]);

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageUrls((prevImageUrls) => prevImageUrls.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setImages((prevImages) => [...prevImages, file]);
        setImageUrls((prevImageUrls) => [...prevImageUrls, response.data.url]);

        console.log('Uploaded image:', file, 'URL:', response.data.url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSingleDigitInput = (e, setValue) => {
    if (e.target.value.length <= 1) {
      setValue(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address || !description || !price || !bedrooms || !bathrooms || !postcode || !city || imageUrls.length === 0) {
      alert('Please fill out all fields and upload at least one photo.');
      return;
    }

    const allImageUrls = [...property.photos, ...imageUrls];

    const propertyData = {
      address,
      description,
      price,
      userId: user.id,
      photos: JSON.stringify(allImageUrls),
      bedrooms,
      bathrooms,
      postcode,
      city
    };
  
    const response = await axios.put(`http://localhost:5000/properties/${propertyId}`, propertyData);
    navigate(`/properties`);
  };

  if (!user || user.role !== 'landlord' || !property) {
    return (
      <div className='main-content'>
        <h1>You don't have access to this page.</h1>
      </div>
    );
  }

  return (
    <div className='main-content'>
      <h1>Edit Property</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label htmlFor="postcode">Post Code:</label>
          <input type="text" id="postcode" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
        </div>
        <div>
          <label htmlFor="city">City:</label>
          <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" className="property-info" min="1" />
        </div>
        <div>
          <label htmlFor="bedrooms">Bedrooms:</label>
          <input type="number" id="bedrooms" value={bedrooms} onChange={(e) => handleSingleDigitInput(e, setBedrooms)} min="1" max="9" inputMode="numeric" className="property-info" />
        </div>
        <div>
          <label htmlFor="bathrooms">Bathrooms:</label>
          <input type="number" id="bathrooms" value={bathrooms} onChange={(e) => handleSingleDigitInput(e, setBathrooms)} min="1" max="9" inputMode="numeric" className="property-info" />
        </div>
        <div>
          <label htmlFor="image">Upload Images:</label>
          <input type="file" id="image" name="image" onChange={handleImageUpload} multiple />
        </div>
        <button type="submit">Submit Property</button>
      </form>
      {imageUrls.map((url, index) => (
        <div key={index} style={{ display: 'inline-block', position: 'relative', marginRight: '10px' }}>
          <img src={url} alt={`Property Image ${index + 1}`} style={{ width: '200px', height: '200px' }} />
          <button
            type="button"
            onClick={() => handleImageRemove(index)}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: '#ff4d4d',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#cc0000'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4d4d'}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

EditPropertyPage.propTypes = {
  user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
};

export default EditPropertyPage;