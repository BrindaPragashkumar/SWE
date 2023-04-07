import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

const PropertyDetailsPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const response = await axios.get(`http://localhost:5000/properties/${propertyId}`);
      setProperty(response.data);
    };
    fetchProperty();
  }, [propertyId]);

  if (!property) {
    return <div>Loading...</div>;
  }

  return (
    <div className='main-content'>
      <h1>{property.address}</h1>
      <p>{property.description}</p>
      <p>Price: ${property.price}</p>
      <p>Bedrooms: {property.bedrooms}</p>
      <p>Bathrooms: {property.bathrooms}</p>
      {property.photos.map((url, index) => (
        <img key={index} src={url} alt="Property" style={{ width: '200px', height: '200px' }} />
      ))}
    </div>
  );
};

export default PropertyDetailsPage;
