import React, { useState } from 'react'
import PropTypes from 'prop-types'
import httpClient from '../httpClient'
import "./pages.css"

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [role, setRole] = useState("")
    const [error, setError] = useState("")

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const registerUser = async () => {
        if (role === "" || role === "Select role") {
            setError("Please select a role")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        try {
            const resp = await httpClient.post("http://localhost:5000/register", {
                email, password, first_name, last_name, role
            })   
            window.location.href = "/"
        } catch (error) {
            if (error.response.status === 401) {
                alert("Invalid credentials")
            }
        }
    }

    return (
        <div className='main-content'>
            <h1>Create New Account</h1>
            <form>
                <div style={{display: 'flex'}}>
                    <div>
                        <label>First Name: </label>
                        <input
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirst_name(e.target.value)}
                            id=""/>
                    </div>
                    <div>
                        <label>Last Name: </label>
                        <input
                            type="text"
                            value={last_name}
                            onChange={(e) => setLast_name(e.target.value)}
                            id=""/>
                    </div>
                </div>
                <div>
                <label>Email: </label>
                    <input
                        type="email"
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
                <div>
                    <label>Confirm Password: </label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div>
                    <label>Role: </label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="" disabled>Select role</option>
                        <option value="landlord">Landlord</option>
                        <option value="consultant">Consultant</option>
                    </select>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="button" onClick={() => registerUser()}>Register</button>
            </form>
            <div>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    )
}

RegisterPage.propTypes = {
    email: PropTypes.string,
    password: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    role: PropTypes.string
}

export default RegisterPage