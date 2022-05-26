import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'; 
import AuthService from './auth';

const { getCurrentUser } = AuthService;

const ProtectedRoute = ({ Component}) => {

    let location = useLocation()
    return getCurrentUser() ? <Component  /> : <Navigate to="/login" state={{from: location}}/> 
    // return getCurrentUser() ? <Component  /> : <Navigate to="/login"}/>  //the state and location property helps redirect the user back to where he was trying to go as soon as he logs in
};

export default ProtectedRoute;