import React, { useState, useEffect } from 'react'
import { UserShape } from "../Types"
import httpClient from '../httpClient'
import PropTypes from 'prop-types';
import "../Dark.css"

const LandingPage = () => {
  const [user, setUser] = useState(null);

  const logoutUser = async () => {
    await httpClient.post('//localhost:5000/logout');
    window.location.href = "/"
  }

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get('//localhost:5000/@me');
  
        const userData = {
          ...resp.data,
          numbers: resp.data.numbers ? JSON.parse(resp.data.numbers) : [],
        };
  
        setUser(userData);
        console.log('User data:', userData); // Log user data
      } catch (error) {
        console.log('Not authenticated');
      }
    })();
  }, []);
  

  const renderNumbers = () => {
    if (user && user.numbers) {
      return (
        <div>
          <h3>Numbers:</h3>
          <ul>
            {user.numbers.map((number, index) => (
              <li key={index}>{number}</li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };
  

  return (
    <div className='main-content'>
      <h1>Welcome to this React Application</h1>
      {user != null ? (
        <div>
          <h2>Logged In</h2>
          <h3>Id: {user.id}</h3>
          <h3>Email: {user.email}</h3>
          <h3>Name: {user.first_name} {user.last_name}</h3>
          <h3>Role: {user.role}</h3>
          <h3>Phone Number: {user.phone_number}</h3>
          {renderNumbers()}
          <button onClick={logoutUser}>Log Out</button>
        </div>
      ) : (<div>
        <p>You are not logged in</p>
      <div>
        <a href="/login">
          <button>Log In</button>
        </a>
        <a href="/register">
          <button>Register</button>
        </a>
      </div>
      </div>)}
    </div>
  );
};

LandingPage.propTypes = {
  user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
};

export default LandingPage;
