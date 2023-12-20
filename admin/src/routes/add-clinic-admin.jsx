import React, {useState} from 'react'
import Breadcrumbs from '../components/Breadcrumbs'
import Header from '../components/Header'
import {useNavigate, Link} from 'react-router-dom'
import {QRCodeSVG} from 'qrcode.react';
import { Base64 } from 'js-base64';
import axios from 'axios'
import validator from 'validator';


const AddClinicAdmin = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Error handler states
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    // Clinic admin credentials previewer variables
    const [showPreviewer, setShowPreviewer] = useState(false)


    const admin = () => {
        navigate('/admin')
    }

    const handleRegisterClinicAdmin = async () => {

        if(validator.isEmpty(username)){
            setSuccess(false)
            setSuccessMessage('')
            setError(true)
            setErrorMessage('Please input a username/email')
            return
        }

        if(validator.isEmpty(password)){
            setSuccess(false)
            setSuccessMessage('')
            setError(true)
            setErrorMessage('Please input password')
            return
        }
        if(validator.isEmpty(confirmPassword)){
            setSuccess(false)
            setSuccessMessage('')
            setError(true)
            setErrorMessage('Please re-type password ')
            return
        }

        if(password.length <= 7){
            setSuccess(false)
            setSuccessMessage('')
            setError(true)
            setErrorMessage('Password should contain more than 8 characters')
            return
        }

        if(password !== confirmPassword){
            setSuccess(false)
            setSuccessMessage('')
            setError(true)
            setErrorMessage('Confirmed password did not match')
            return
        }

        const token = localStorage.getItem('token');

        var data = {
                username: username,
                email: username,
                password: password
		}
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		  }
		
        setSuccess(false)
        setError(false)
        setIsLoading(true)

        await axios.post('https://univtraze.herokuapp.com/api/clinic/createClinicAdmin', data, {
			  headers: headers
			})
			.then((response) => {

				if(response.data.success === 0){
                    setIsLoading(false)
                    setSuccess(false)
                    setSuccessMessage('')
                    setError(true)
                    setErrorMessage(response.data.message)
                    return
				}
				
                setIsLoading(false)
                setSuccess(true)
                setSuccessMessage('Clinic admin added successfuly')
                setError(false)
                setErrorMessage('')
                return
			})

			.catch((error) => {
                setIsLoading(false)
				setSuccess(false)
                setSuccessMessage('')
                setError(true)
                setErrorMessage(error)
                return
			})
    }

  return (
    <>
        <Header/>
        <div className="container">
            <Breadcrumbs  event={admin} identifier='Dashboard / ' current='Add Clinic Admin'/>
            <div className="add-room">
                <div className="add-room__form">
                    <h3 className="add-room__title">
                        Add clinic admin
                    </h3>
                    <div className="add-room__input-container">
                        <p className="add-room__label">Username/Email</p>
                        <input type="text" className="add-room__input" placeholder='Email/Username' onChange={e => {setUsername(e.target.value)}}/>
                    </div>
                    <div className="add-room__input-container">
                        <p className="add-room__label">Password</p>
                        <input type="password" className="add-room__input" placeholder='Password' onChange={e => {setPassword(e.target.value)}}/>
                    </div>
                    <div className="add-room__input-container">
                        <p className="add-room__label">Confirm Password</p>
                        <input type="password" className="add-room__input" placeholder='Confirm password' onChange={e => {setConfirmPassword(e.target.value)}} />
                    </div>'
                    {
                        error?
                        <p style={{color: 'red'}}>{errorMessage}</p>
                        :
                        null
                    }

                    {
                        success?
                        <p style={{color: '#28cd41'}}>{successMessage}</p>
                        :
                        null
                    }  

                    {
                        isLoading?
                        <p style={{color: '#28cd41'}}>Please wait...</p>
                        :
                        null
                    }   

                    <button className="btn-primary" onClick={() => {handleRegisterClinicAdmin()}}>Register Clinic Admin</button>
                    
                </div>
                <div className="add-room__qr-container">
                    {
                        success?
                        <>
                        <img src={require("../assets/verified_icon.gif")} width="200"/>
                        <p>Clinic admin created successfully</p>
                        <p style={{fontWeight: 'bold', fontSize: '1.5rem'}}>{username}</p>
                    
                        <button className="btn-primary" style={{width: '50%'}}> <a href='http://clinic.univtraze.net' target="_blank" rel="noopener noreferrer">Visit clinic</a></button>
                        </>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default AddClinicAdmin