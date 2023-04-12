import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Dark.css'
import PropTypes from 'prop-types';
import { UserShape } from '../Types';
import httpClient from '../httpClient';

const ViewingListPage = () => {
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);

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

  const filteredProperties = properties.filter((property) =>
    property.user_ids_list.includes(user?.id)
  );

  return (
    <div className='main-content'>
      <h1>Viewing List</h1>
      <table>
        <thead>
          <tr>
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
          {user &&
            filteredProperties.map((property) => (
              <tr key={property.id}>
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

ViewingListPage.propTypes = {
  user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
};

export default ViewingListPage;
