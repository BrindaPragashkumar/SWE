import React, { useState, useEffect } from 'react'
import { UserShape } from "../types"
import httpClient from '../httpClient'
import PropTypes from 'prop-types';
import "../dark.css"
import "./pages.css"

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

        setUser(resp.data);
      } catch (error) {
        console.log('Not authenticated');
      }
    })();
  }, []);

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
