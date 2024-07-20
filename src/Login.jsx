import Axios from "axios";
import Joi from "joi";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Login(props) {
    let navigate = useNavigate();

    const [errorList, setErrorList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        email:'',
        password:''
    });

    function getUserData(e)
    {
        let myUser = {...user};
        myUser[e.target.name] = e.target.value;
        setUser(myUser);
    }

    async function submitLoginForm(e)
    {
        e.preventDefault();
        setIsLoading(true);
        let validationResult = validateLoginForm();

        if (validationResult.error)
        {
            setErrorList(validationResult.error.details)
            setIsLoading(false);
        } else {
            try {
                let response = await Axios.post(`http://localhost:8888/api/react/v1/users/signin`, user)
                console.log(response)
                if (response.data.message === 'success') {
                    setIsLoading(false);
                    localStorage.setItem('userToken', response.data.token)
                    localStorage.setItem('userData', JSON.stringify(response.data.user))

                    props.saveUserData();
                    // programattic routing
                    navigate('/home')
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                setError(error.toString())
            }
        }
    }

    function validateLoginForm()
    {
        let schema = Joi.object({
            email:Joi.string().email({minDomainSegments: 2, tlds: { allow: ['com', 'net']}}).required(),
            password:Joi.string().pattern(new RegExp('^[A-Z][a-z]{3,8}$')).required(),
        });

        return schema.validate(user, {abortEarly:false});
    }

    return (
        <>
        <div className="w-75 mx-auto">
            <h2>Login Now</h2>
            {errorList.map((error, i)=> <div key={i} className="alert alert-danger">{error.message}</div>)}
            {error.length > 0 ? <div className="alert alert-danger">{error}</div> : ''}
            <form onSubmit={submitLoginForm}>

                <label htmlFor="first_name">email :</label>
                <input onChange={getUserData} type="email" className="form-control mb-2" id="email" name="email"></input>

                <label htmlFor="first_name">password :</label>
                <input onChange={getUserData} type="password" className="form-control mb-2" id="password" name="password"></input>

                <button type="submit" className="btn btn-outline-info">{isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Rigester'}</button>

            </form>
        </div>
        </>
    )
}