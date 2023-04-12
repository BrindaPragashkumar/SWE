import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../Dark.css';
import '../PropertyDetailsPage.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PropertyDetailsPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

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

  const changePhoto = (direction) => {
    setActivePhotoIndex((prevIndex) => (prevIndex + direction + property.photos.length) % property.photos.length);
  };

  return (
    <div className='main-content'>
      <div className="property-details-container">
        <div className="property-details-left">
          <h1 className="property-details-title">{property.address}</h1>
          <div className="photos-container">
            <button className="arrow-btn" onClick={() => changePhoto(-1)}>
              <FaChevronLeft />
            </button>
            {property.photos.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Property ${propertyId} photo ${index + 1}`}
                className={`property-photo ${activePhotoIndex === index ? 'active' : ''}`}
              />
            ))}
            <button className="arrow-btn" onClick={() => changePhoto(1)}>
              <FaChevronRight />
            </button>
          </div>
          <p>Price: ${property.price}</p>
        </div>
        <div className="property-details-right">
          <h3>{property.postcode}</h3>
          <h3>{property.city}</h3>
          <p>{property.description}</p>
          <p>Bedrooms: {property.bedrooms}</p>
          <p>Bathrooms: {property.bathrooms}</p>
        </div>
      </div>
    </div>
  )
}
export default PropertyDetailsPage;
