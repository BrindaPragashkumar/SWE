import React from 'react';
import PropTypes from 'prop-types';
import { UserShape } from '../types';
import './sidebar.css';

const Sidebar = ({ user }) => {
  return (
    <div className="sidebar-container">
      <div className="profile-container">
        <div className="profile-picture">💀</div>
        <div className="user-details">
          <p>{user.first_name} {user.last_name}</p>
          <p>{user.role}</p>
        </div>
      </div>
      <div className="sidebar-options">
        <a href="/search">Search</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/properties">Properties</a>
        <a href="/viewing-list">Viewing List</a>
        <a href="/chat">Chat</a>
        <a href="/calendar">Calendar</a>
        <a href="/faq">FAQ Page</a>
      </div>
      <div className="logout-container">
        <a href="/logout">Log Out</a>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  user: UserShape.isRequired
};

export default Sidebar;
