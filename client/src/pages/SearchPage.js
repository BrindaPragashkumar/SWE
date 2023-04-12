import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Dark.css';
import AllPropertiesPage from './AllPropertiesPage';
import { FaSearch } from 'react-icons/fa';

const SearchPage = () => {
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        minBedrooms: '',
        maxBedrooms: '',
        minBathrooms: '',
        maxBathrooms: '',
    });

    useEffect(() => {
        const fetchProperties = async () => {
            const response = await axios.get('http://localhost:5000/properties');
            const updatedProperties = response.data.map((property) => ({
                ...property,
                activePhotoIndex: 0,
            }));
            setProperties(updatedProperties);
        };
        fetchProperties();
    }, []);

    const handleSearch = () => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const searchResults = properties.filter((property) =>
            property.city.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredProperties(searchResults);
    };

    const handleFilter = () => {
        const {
            minPrice,
            maxPrice,
            minBedrooms,
            maxBedrooms,
            minBathrooms,
            maxBathrooms,
        } = filters;

        const filteredResults = properties.filter((property) => {
            const priceInRange =
                (!minPrice || property.price >= parseFloat(minPrice)) &&
                (!maxPrice || property.price <= parseFloat(maxPrice));
            const bedroomsInRange =
                (!minBedrooms || property.bedrooms >= parseInt(minBedrooms)) &&
                (!maxBedrooms || property.bedrooms <= parseInt(maxBedrooms));
            const bathroomsInRange =
                (!minBathrooms || property.bathrooms >= parseInt(minBathrooms)) &&
                (!maxBathrooms || property.bathrooms <= parseInt(maxBathrooms));

            return (
                property.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
                priceInRange &&
                bedroomsInRange &&
                bathroomsInRange
            );
        });

        setFilteredProperties(filteredResults);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'searchTerm') {
            setSearchTerm(value);
        } else {
            setFilters({ ...filters, [name]: value });
        }
    };

    const createOptionElement = (label) => (
        <option key={label} value={label}>
            {label}
        </option>
    );

    const bedroomOptions = Array.from({ length: 9 }, (_, i) => i + 1).map(createOptionElement);
    const bathroomOptions = Array.from({ length: 9 }, (_, i) => i + 1).map(createOptionElement);

    return (
        <div className="main-content">
            <h1>Search Page</h1>
            <input
                type="text"
                placeholder="Search for city"
                name="searchTerm"
                onChange={handleInputChange}
                value={searchTerm}
            />

            <div className="filters">
                <input
                    type="number"
                    placeholder="Min Price"
                    name="minPrice"
                    onChange={handleInputChange}
                    value={filters.minPrice}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    name="maxPrice"
                    onChange={handleInputChange}
                    value={filters.maxPrice}
                />
                <select name="minBedrooms" onChange={handleInputChange}>
                    <option value="">Min Bedrooms</option>
                    {bedroomOptions}
                </select>
                <select name="maxBedrooms" onChange={handleInputChange}>
                    <option value="">Max Bedrooms</option>
                    {bedroomOptions}
                </select>
                <select name="minBathrooms" onChange={handleInputChange}>
                    <option value="">Min Bathrooms</option>
                    {bathroomOptions}
                </select>
                <select name="maxBathrooms" onChange={handleInputChange}>
                    <option value="">Max Bathrooms</option>
                    {bathroomOptions}
                </select>
                <button onClick={handleFilter}>Confirm Filters</button>
            </div>
            {filteredProperties.length > 0 ? (
                <AllPropertiesPage properties={filteredProperties} />
            ) : (
                <p>No properties listed in this city.</p>
            )}
        </div>
    );
};

export default SearchPage;