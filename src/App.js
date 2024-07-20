import React, { useEffect } from 'react';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import { useState } from 'react';
import './App.css';

import Navbar from './Navbar';
import Home from './Home';
import Notfound from './Notfound';
import Register from './Register';
import Login from './Login';
import People from './People';
import Tv from './Tv';
import Movies from './Movies';
import Footer from './Footer';

function App() {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState('');

  let navigate = useNavigate();

  function saveUserData()
  {
    // let encodedToken = localStorage.getItem('userToken')
    // let decodedToken = jwDecode('encodedToken')
    // setUserData(decodedToken)
    let myUser = localStorage.getItem('userData');
    let token = localStorage.getItem('userToken');
    setUserData(myUser);
    setUserToken(token);
  }
  console.log(userToken, userData)

  function logOut()
  {
    setUserData(null);
    localStorage.clear();
    navigate('/login')
  }

  // component didMount
  useEffect(() => {
    if (localStorage.getItem('userToken')) {
      saveUserData();
    }
  }, [])

  function ProtectedRoute(props)
  {
    if(localStorage.getItem('userToken') === null)
      {
        return <Navigate to='/login'/>
      } else 
      {
        return props.children;
      }
  }
  return (
    <>
      <Navbar logOut={logOut} token={userToken} userData={userData}/>
      <div className='container-fluid'>
        <Routes>
          <Route path='' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path='home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
          <Route path='movies' element={<ProtectedRoute><Movies/></ProtectedRoute>}/>
          <Route path='tv' element={<ProtectedRoute><Tv/></ProtectedRoute>}/>
          <Route path='people' element={<ProtectedRoute><People/></ProtectedRoute>}/>
          <Route path='login' element={<Login saveUserData={saveUserData}/>}/>
          <Route path='register' element={<Register/>}/>
          <Route path='*' element={<ProtectedRoute><Notfound/></ProtectedRoute>}/>
        </Routes>
      </div>  
      <Footer/>
    </>
  );
}

export default App;
