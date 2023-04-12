import React, { useState } from 'react'
import PropTypes from 'prop-types'
import httpClient from '../httpClient'
import '../Dark.css'

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const [role, setRole] = useState("")
    const [phone_number, setPhone_number] = useState("")
    const [error, setError] = useState("")

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const validatePhoneNumber = (phone_number) => {
        const re = /^0\d{10}$/;
        return re.test(String(phone_number));
    }

    const validateName = (name) => {
        const re = /^[A-Za-z]+$/;
        return re.test(String(name));
    }

    const registerUser = async () => {

        if (!validateName(first_name) || !validateName(last_name)) {
            setError("First Name and Last Name should contain only letters")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        if (!validatePhoneNumber(phone_number)) {
            setError("Invalid phone number")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (role === "" || role === "Select role") {
            setError("Please select a role")
            return
        }

        try {
            await httpClient.post("http://localhost:5000/register", {
                email, password, first_name, last_name, role, phone_number
            })
            window.location.href = "/"
        } catch (error) {
            if (error.response.status === 401) {
                alert("Invalid credentials")
            }
            if (error.response.status === 409) {
                if (error.response.data.error === "email") {
                    setError("An account already exists with that email")
                } else if (error.response.data.error === "phone_number") {
                    setError("An account already exists with that phone number")
                }
            }
        }
    }

    return (
        <div className='main-content'>
            <h1>Create New Account</h1>
            <form>
            <div style={{display: 'flex', justifyContent: 'center'}}> 
                    <div>
                        <input
                            type="text"
                            value={first_name}
                            onChange={(e) => setFirst_name(e.target.value)}
                            id=""
                            placeholder="First Name"/>
                    </div>
                    <div>
                        <input
                            type="text"
                            value={last_name}
                            onChange={(e) => setLast_name(e.target.value)}
                            id=""
                            placeholder="Last Name"/>
                    </div>
                </div>
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        id=""
                        placeholder="Email"/>
                </div>
                <div>
                    <input
                        type="text"
                        value={phone_number}
                        onChange={(e) => setPhone_number(e.target.value)}
                        id=""
                        placeholder="Phone Number"/>
                </div>
                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id=""
                        placeholder="Password"/>
                </div>
                <div>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password"/>
                </div>
                <div>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="" disabled>Select role</option>
                        <option value="landlord">Landlord</option>
                        <option value="consultant">Consultant</option>
                    </select>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button className='button' type="button" onClick={() => registerUser()}>Register</button>
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
    role: PropTypes.string,
    phone_number: PropTypes.string
}

export default RegisterPage