import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Dark.css'
import PropTypes from 'prop-types';
import { UserShape } from "../Types";
import httpClient from '../httpClient';
import { useNavigate } from 'react-router-dom';

const AllPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  const navigateToEditProperty = (propertyId) => {
    navigate(`/edit-property/${propertyId}`);
  };

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
      setProperties(response.data);
    };
    fetchProperties();
  }, []);

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
    const confirmation = window.confirm("Are you sure you want to remove ALL of your properties?");
    if (!confirmation) {
      return;
    }
    if (user) {
      const userProperties = properties.filter(property => property.userId === user.id);
      for (const property of userProperties) {
        try {
          const response = await axios.delete(`http://localhost:5000/properties/${property.id}`);
          console.log(response.data.message);
        } catch (error) {
          console.error(error);
        }
      }
      setProperties(properties.filter(property => property.userId !== user.id));
    }
  };

  return (
    <div className='main-content'>
      <h1>All Properties</h1>
      {user && <button onClick={removeAllProperties}>Remove All</button>}
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>ID</th>
            <th>Address</th>
            <th>Description</th>
            <th>Price</th>
            <th>Bedrooms</th>
            <th>Bathrooms</th>
            <th>Photos</th>
          </tr>
        </thead>
        <tbody>
          {user && properties.filter(property => property.userId === user.id).map((property) => (
            <tr key={property.id}>
              <td>
                <button onClick={() => removeProperty(property.id)}>Remove</button>
                <button onClick={() => navigateToEditProperty(property.id)}>Edit</button>
              </td>
              <td>{property.id}</td>
              <td>{property.address}</td>
              <td>{property.description}</td>
              <td>{property.price}</td>
              <td>{property.bedrooms}</td>
              <td>{property.bathrooms}</td>
              <td>
                <div className="photos-container">
                  {property.photos.map((photo, index) => (
                    <img src={photo} alt={`Property ${property.id} photo ${index + 1}`} key={index} className="property-photo" />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AllPropertiesPage.propTypes = {
  user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
};

export default AllPropertiesPage;
