import React, { useState } from 'react'
import PropTypes from 'prop-types'
import httpClient from '../httpClient'
import '../Dark.css'

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const logInUser = async () => {
        console.log(email, password)

        try{
            await httpClient.post("http://localhost:5000/login", {
                email, password
            })   
            window.location.href = "/"
        }
        catch (error){
            if(error.response.status === 401){
                setErrorMessage(error.response.data.error);
            }
        }
    }

    return (
        <div className='main-content'>
            <h1>Log Into Your Account</h1>
            <form>
                <div>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id=""
                        placeholder="Email"/>
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id=""
                        placeholder="Password"/>
                </div>
                {errorMessage && <div className="error-message" style={{color: 'red'}}>{errorMessage}</div>}
                <button className='button' type="button" onClick={() => logInUser()}>Log In</button>
            </form>
            <div>
                <p>Dont have an account? <a href="/register">Sign up</a></p>
            </div>
        </div>
    )
}

LoginPage.propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
}

export default LoginPage