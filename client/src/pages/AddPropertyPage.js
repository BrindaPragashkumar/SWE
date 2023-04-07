import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserShape } from '../Types';
import httpClient from '../httpClient';
import PropTypes from 'prop-types';
import './Pages.css';
import '../Dark.css';
import { useNavigate } from 'react-router-dom';

const AddPropertyPage = () => {
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get('//localhost:5000/@me');

        setUser(resp.data);
      } catch (error) {
        console.log('Not authenticated');
      }
    })();
  }, []);

  const handleImageUpload = async (e) => {
    const files = e.target.files

    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        setImages([...images, file])
        setImageUrls([...imageUrls, response.data.url])
      } catch (error) {
        console.error('Error uploading image:', error)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address || !description || !price || !bedrooms || !bathrooms || imageUrls.length === 0) {
      alert('Please fill out all fields and upload at least one photo.');
      return;
    }

    const propertyData = {
      address,
      description,
      price,
      userId: user.id,
      photos: JSON.stringify(imageUrls),
      bedrooms,
      bathrooms,
    };
    const response = await axios.post('http://localhost:5000/properties', propertyData);
    navigate(`/property/${response.data.id}`);
  };

  return (
    <div className='main-content'>
      <h1>Add a Property</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="numeric" className="price-input" />
        </div>
        <div>
          <label htmlFor="bedrooms">Bedrooms:</label>
          <input type="number" id="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
        </div>
        <div>
          <label htmlFor="bathrooms">Bathrooms:</label>
          <input type="number" id="bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
        </div>
        <div>
          <label htmlFor="image">Upload Images:</label>
          <input type="file" id="image" name="image" onChange={handleImageUpload} multiple />
        </div>
        <button type="submit">Submit Property</button>
      </form>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt="Property" style={{ width: '200px', height: '200px' }} />
      ))}
    </div>
  )
}

AddPropertyPage.propTypes = {
    user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
  };

export default AddPropertyPage
