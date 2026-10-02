import React from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import { Route, Routes } from 'react-router-dom'
import Chat from './pages/Chat'
import ProtectedRoutes from './components/ProtectedRoutes'

const App = () => {
  return (
    <div>
      <Routes>
        <Route
           path='/login'
           element={<Login/>}
        />
        <Route
           path='/register'
           element={<Register/>}
        />
        
        <Route
           path='/'
           element={
           <ProtectedRoutes>
           <Chat/>
           </ProtectedRoutes>
          }
        />
        


      </Routes>


      {/* <Login/> */}
      {/* <Register/> */}
      
      
    </div>
  )
}

export default App
