import { createContext, useEffect, useState } from "react";
import { createSocket } from "../socket";

export const AuthContext = createContext();



export const AuthProvider =({children})=>{

    const [user,setUser]=useState("");
    const [token,setToken]=useState("");
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState("");
    

    const getCurrentUser=async()=>{
        const token1 =localStorage.getItem("token");
        setToken(token1);
        
        if(!token1){
            setLoading(false);
            return;
        } 

        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token1}`
                }
            })
            const data = await response.json();
            if(!response.ok){
                localStorage.removeItem("token");
                setToken("");
                setUser(null);
                throw new error(data.message)
            }
            // console.log(data);
            // console.log(data.user);
            
            
            setUser(data.user);
            setLoading(false);
            
            
        } catch (error) {
            console.log(error);
            
        }finally{
            setLoading(false);
        }
    }

   useEffect(()=>{
    getCurrentUser();

   },[token])

   useEffect(()=>{
    if (!user?._id) {
        return;
    }
    const token1 = localStorage.getItem("token");
    if(!token1){
        return;
    }

    const newSocket = createSocket(token1);
    setSocket(newSocket);
    
     return () => {
        newSocket.disconnect();
    };
   },[user?._id]);



    return <AuthContext.Provider  value={{loading,user,token,setToken,setUser,getCurrentUser,socket,setUser}}>
        {children}
    </AuthContext.Provider>
}

