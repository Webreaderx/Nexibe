import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";





export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [slide, setSlide] = useState(0);
    const navigate = useNavigate();

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [errorMsj,setErrorMsj]=useState("");
    const {loading,token,setToken}=useContext(AuthContext);

    

    const handleLogin=async (e)=>{
        e.preventDefault();
        try {
            const response= await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email,password})
            })
            const data = await response.json();
            if(!response.ok){                              
                setErrorMsj(data.message);
                throw new Error(data.message);
                
            }
            if(data.success){
                localStorage.setItem("token",data.token);
                setToken(data.token);
            }
            

                navigate("/");
            
            


            
        } catch (error) {
            
            
            setErrorMsj(error.message);
        }
    }
    


    

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
            {/* Left / top panel — illustration */}
            <div className="relative flex flex-col items-center justify-between md:justify-center bg-[#a9c1ae] md:w-1/2 px-6 py-8 md:py-12 overflow-hidden">
                <div className="hidden md:block" />

                
                <img className="w-60" src="\images\Logo tr.png" alt="" />
                <img className="w-90" src="\images\Tag tr.png" alt=""  />
                <div className="text-center max-w-xs md:max-w-sm mt-4 md:mt-8">
                    <h2 className="text-white text-lg md:text-xl font-medium mb-1 md:mb-2">
                        Where every message feels closer..
                    </h2>

                </div>


            </div>

            {/* Right / bottom panel — form */}
            <div className="flex-1 flex items-center justify-center px-6 py-10 sm:py-14 md:py-0">
                <div className="w-full max-w-sm">
                    <p className="font-serif italic text-2xl sm:text-3xl text-gray-700 mb-6 sm:mb-8 text-center md:text-left">
                        Nexibe
                    </p>

                    <h1 className="text-gray-800 text-lg sm:text-xl font-medium mb-6 sm:mb-8 text-center md:text-left">
                        Welcome to Nexibe
                    </h1>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-xs text-gray-400 mb-1"
                            >
                                User's name or Email
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={email}
                                onChange={(e)=>{
                                    setEmail(e.target.value);
                                }}

                                className="w-full border-b border-gray-300 pb-2 text-sm text-gray-800 focus:outline-none focus:border-gray-500 transition-colors bg-transparent"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label
                                    htmlFor="password"
                                    className="block text-xs text-gray-400"
                                >
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e)=>{
                                        setPassword(e.target.value)
                                    }}

                                    className="w-full border-b border-gray-300 pb-2 pr-14 text-sm text-gray-800 focus:outline-none focus:border-gray-500 transition-colors bg-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-0 top-0 text-xs text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <div className="text-right mt-2">
                                <a href="#" className="text-xs text-gray-400 hover:text-gray-600">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                        <p>{errorMsj}</p>
                        <button
                            type="submit"
                            className="w-full bg-gray-500 hover:bg-gray-600 active:bg-gray-700 transition-colors text-white text-sm font-medium py-3 rounded-full mt-2"
                        >
                            Sign in
                        </button>

                        <div className="flex items-center gap-3 py-2">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400">or</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        
                        {/* google sign in */}

                        {/* <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 48 48">
                                <path
                                    fill="#FFC107"
                                    d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                                />
                                <path
                                    fill="#FF3D00"
                                    d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.4 0-13.7 4.1-17 10.1z"
                                />
                                <path
                                    fill="#4CAF50"
                                    d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.7 35.4 27 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8l-6.7 5.2C9.2 39.6 16 44 24 44z"
                                />
                                <path
                                    fill="#1976D2"
                                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.6 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
                                />
                            </svg>
                            Sign in with Google
                        </button> */}

                        <p className="text-center text-xs text-gray-400 pt-2">
                            New Nexibe?{" "}
                            {/* <a href="#" className="text-gray-600 font-medium hover:underline">
                                Create Account
                            </a> */}
                            <button className="text-gray-600 font-medium hover:underline" onClick={()=>{
                                navigate("/register")
                            }}>Create Account</button>
                            {/* <Link className="text-gray-600 font-medium hover:underline" to="/register" >Create Account</Link> */}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}