import Axios from "axios";
import Joi from "joi";
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Register() {
    let navigate = useNavigate();

    const [errorList, setErrorList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState({
        first_name:'',
        last_name:'',
        age:0,
        email:'',
        password:''
    });

    function getUserData(e)
    {
        let myUser = {...user};
        myUser[e.target.name] = e.target.value;
        setUser(myUser);
    }

    async function submitRegisterForm(e)
    {
        e.preventDefault();
        setIsLoading(true);
        let validationResult = validateRegisterForm();

        if (validationResult.error)
        {
            setErrorList(validationResult.error.details)
            setIsLoading(false);
        } else {
            let userData = {...user, age: Number(user.age)}
            try {
                let response = await Axios.post(`http://localhost:8888/api/react/v1/users/signup`, userData)
                console.log(response.status)
                if (response.data.message === 'success') {
                    setIsLoading(false);
                    // programattic routing
                    navigate('/login')
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                setError(error.toString())
            }
        }
    }

    function validateRegisterForm()
    {
        let schema = Joi.object({
            first_name:Joi.string().alphanum().min(3).max(10).required(),
            last_name:Joi.string().alphanum().min(3).max(10).required(),
            age:Joi.number().min(16).max(80).required(),
            email:Joi.string().email({minDomainSegments: 2, tlds: { allow: ['com', 'net']}}).required(),
            password:Joi.string().pattern(new RegExp('^[A-Z][a-z]{3,8}$')).required(),
        });

        return schema.validate(user, {abortEarly:false});
    }

    return (
        <>
        <div className="w-75 mx-auto">
            <h2>Register Now</h2>
            {errorList.map((error, i)=> <div key={i} className="alert alert-danger">{error.message}</div>)}
            {error.length > 0 ? <div className="alert alert-danger">{error}</div> : ''}
            <form onSubmit={submitRegisterForm}>
                <label htmlFor="first_name">first_name :</label>
                <input onChange={getUserData} className="form-control mb-2" id="first_name" name="first_name"></input>

                <label htmlFor="last_name">last_name :</label>
                <input onChange={getUserData} className="form-control mb-2" id="last_name" name="last_name"></input>

                <label htmlFor="age">age :</label>
                <input onChange={getUserData} type="number" className="form-control mb-2" id="age" name="age"></input>

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