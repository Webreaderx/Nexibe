import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoutes = ({children}) => {

    const {loading,user}=useContext(AuthContext);

    if(loading){
        return <h1>Loading...</h1>
    }
    if(!user){
        return <Navigate to={"/login"} replace/>;

    }
    return children
  
}

export default ProtectedRoutes
