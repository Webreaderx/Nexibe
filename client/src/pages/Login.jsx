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
            <div className="relative hidden  md:flex flex-col  items-center justify-between md:justify-center bg-[#a9c1ae] md:w-1/2 px-6 py-8 md:py-12 overflow-hidden">
                <div className="hidden md:block" />

                
                <img className="w-60" src="\images\Logo tr.png" alt="" />
                <img className="w-90" src="\images\Tag tr.png" alt=""  />
                <div className="text-center max-w-xs md:max-w-sm mt-4 md:mt-8">
                    <h2 className="text-white text-lg md:text-xl font-medium mb-1 md:mb-2">
                        Where every message feels closer..
                    </h2>

                </div>


            </div>

            <div className=" flex md:hidden items-center justify-center w-full">
              <img className="h-50" src="\images\Logo_tag tr.png" alt="" />
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