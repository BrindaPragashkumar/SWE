import React from 'react';
import PropTypes from 'prop-types';
import { UserShape } from '../Types';
import httpClient from '../httpClient'
import './Sidebar.css';
import icon from './DefaultIcon.jpg'

const Sidebar = ({ user }) => {

  const logoutUser = async () => {
    await httpClient.post('//localhost:5000/logout');
    window.location.href = "/"
  }  

  return (
    <div className="sidebar-container">
      <div className="profile-container">
        <div className="profile-picture" style={{ backgroundImage: `url(${icon})` }}></div>
        <div className="user-details">
          <p>{user.first_name} {user.last_name}</p>
          <p>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        </div>
      </div>
      <div className="sidebar-options">
      <a href="/">Home</a>
        <a href="/search">Search</a>
        <a href="/properties">Your Properties</a>
        <a href="/all-properties">All Properties</a>
        <a href="/add-property">Add Property</a>
        <a href="/viewing-list">Viewing List</a>
        <a href="/chat">Chat</a>
        <a href="/calendar">Calendar</a>
        <a href="/faq">FAQ Page</a>
      </div>
      <div className="logout-container">
        <a onClick={logoutUser}>Log Out</a>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  user: UserShape.isRequired
};

export default Sidebar;
