import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Dark.css';
import { UserShape } from '../Types';
import httpClient from '../httpClient';
import { useNavigate } from 'react-router-dom';
import { FaBed, FaBath, FaHeart, FaPhone } from 'react-icons/fa';

const ViewingListPage = () => {
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

  const filteredProperties = properties.filter((property) => property.user_ids_list.includes(user?.id));

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

  const handleCheckboxChange = async (propertyId, isChecked) => {
    if (user) {
      const property = properties.find((p) => p.id === propertyId);
      const currentUserIds = property.user_ids_list || [];
      const updatedUserIds = isChecked
        ? [...currentUserIds, user.id]
        : currentUserIds.filter((id) => id !== user.id);

      try {
        const response = await httpClient.post('//localhost:5000/update-property-users', {
          propertyId,
          userIds: updatedUserIds,
        });

        setProperties(
          properties.map((p) =>
            p.id === propertyId ? { ...p, user_ids_list: updatedUserIds } : p
          )
        );
        console.log(
          `User ID ${user.id} added to property ID ${propertyId}'s user list:`,
          updatedUserIds
        );
      } catch (error) {
        console.error('Failed to update property user list', error);
      }
    }
  };

  const isPropertyChecked = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    return property && property.user_ids_list && property.user_ids_list.includes(user.id);
  };

  const getUserPhoneNumber = (propertyId) => {
    const property = properties.find((p) => p.id === propertyId);
    const propertyUser = property && user && property.userId === user.id ? user : null;

    if (propertyUser) {
      console.log(`Phone number for user ID ${propertyUser.id}: ${propertyUser.phone_number}`);
      return propertyUser.phone_number;
    } else {
      return '';
    }
  };

  const navigateToProperty = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleHeartClick = (event, propertyId) => {
    handleCheckboxChange(propertyId, !isPropertyChecked(propertyId));
  };

  const handleCheckboxClick = (event, propertyId) => {
    event.stopPropagation();
    handleCheckboxChange(propertyId, !isPropertyChecked(propertyId));
  };


  return (
    <div className='main-content'>
      <h1>All Properties</h1>
      <div className="property-cards">
      {user && properties
  .filter(property => property.user_ids_list.includes(user.id))
  .map((property) => (
            <div className="property-card">
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
              <div className="property-info" >
                <div className="property-price">£{property.price}</div>
                <div className="save-container">
                  <input
                    type="checkbox"
                    id={`heart-checkbox-${property.id}`}
                    className="heart-checkbox"
                    onClick={(event) => handleCheckboxClick(event, property.id)}
                    checked={isPropertyChecked(property.id)}
                  />
                  <label
                    htmlFor={`heart-checkbox-${property.id}`}
                    className="heart-icon"
                    onClick={(event) => handleHeartClick(event, property.id)}
                  >
                    <FaHeart />
                  </label>
                  <span>Save</span>
                </div>
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
                <div className="property-contact">
                  <FaPhone />
                  <span>{getUserPhoneNumber(property.id)}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

ViewingListPage.propTypes = {
  user: UserShape,
};

export default ViewingListPage;
