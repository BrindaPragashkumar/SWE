import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Dark.css'
import PropTypes from 'prop-types';
import { UserShape } from "../Types";
import httpClient from '../httpClient';
import { useNavigate } from 'react-router-dom';
import { FaBed, FaBath, FaTrash, FaEdit } from 'react-icons/fa';

const PersonalPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
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

    const fetchProperties = async () => {
      const response = await axios.get('http://localhost:5000/properties');
      const updatedProperties = response.data.map((property) => ({ ...property, activePhotoIndex: 0 }));
      setProperties(updatedProperties);
    };
    fetchProperties();
  }, []);

  const changePhoto = (propertyId, direction) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) => {
        if (property.id === propertyId) {
          const activeIndex = property.activePhotoIndex || 0;
          const newIndex = (activeIndex + direction + property.photos.length) % property.photos.length;
          return { ...property, activePhotoIndex: newIndex };
        }
        return property;
      })
    );
  };

  const removeProperty = async (propertyId) => {
    const confirmation = window.confirm("Are you sure you want to remove this property?");
    if (!confirmation) {
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:5000/properties/${propertyId}`);
      console.log(response.data.message);
      setProperties(properties.filter(property => property.id !== propertyId));
    } catch (error) {
      console.error(error);
    }
  };

  const removeAllProperties = async () => {
    const confirmation = window.confirm("Are you sure you want to remove all properties?");
    if (!confirmation) {
      return;
    }
    try {
      const userProperties = properties.filter(property => property.userId === user.id);
      for (const property of userProperties) {
        await axios.delete(`http://localhost:5000/properties/${property.id}`);
      }
      setProperties(properties.filter(property => property.userId !== user.id));
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const navigateToEditProperty = (propertyId) => {
    console.log(propertyId)
    navigate(`/edit-property/${propertyId}`);
  };

  return (
    <div className='main-content'>
      <h1>Your Properties</h1>
      <button className="remove-button-1" onClick={removeAllProperties}>
        <FaTrash />
        <span>Remove All Properties</span>
      </button>
      <div className="property-cards">
        {user && properties.filter(property => property.userId === user.id).map((property) => (
          <div className="property-card" key={property.id}>
            <div className="property-photo-container" key={property.id} onClick={() => navigateToProperty(property.id)}>
              {property.photos.map((photo, index) => (
                <img
                  src={photo}
                  alt={`Property ${property.id} photo ${index + 1}`}
                  key={index}
                  className={`property-photo ${property.activePhotoIndex === index ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="property-info">
              <div className="property-price">£{property.price}</div>
              <div className="property-details">
                <div className="property-detail">
                  <FaBed />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="property-detail">
                  <FaBath />
                  <span>{property.bathrooms}</span>
                </div>
              </div>
              <div className="property-address">
                <h4 className="property-address-2">{property.address}</h4>
                <h5 className="property-address-2">{property.city}, {property.postcode}</h5>
              </div>
              <div className="property-description">{property.description}</div>
              <div className="property-actions">
                <button className="edit-button" onClick={() => navigateToEditProperty(property.id)}>
                  <FaEdit />
                  <span>Edit Property</span>
                </button>
                <button className="remove-button" onClick={() => removeProperty(property.id)}>
                  <FaTrash />
                  <span>Remove Property</span>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PersonalPropertiesPage.propTypes = {
  user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
};

export default PersonalPropertiesPage;