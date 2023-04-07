import React, { useState } from 'react'
import PropTypes from 'prop-types'
import httpClient from '../httpClient'
import "./Pages.css"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

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
                alert("Invalid credentials")
            }
        }
    }

    return (
        <div className='main-content'>
            <h1>Log into your Account</h1>
            <form>
                <div>
                    <label>Email: </label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id=""/>
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id=""/>
                </div>
                <button type="button" onClick={() => logInUser()}>Log In</button>
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