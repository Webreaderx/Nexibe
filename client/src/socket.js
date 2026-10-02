import {io} from "socket.io-client";



export const createSocket=(token)=>{
    const socket =io(`${import.meta.env.VITE_API_URL}`,{
        auth:{token}
    })
    return socket;
} 