import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

/**
 * Lovebirds — Register Page
 * Responsive React + Tailwind recreation matching the Lovebirds login design.
 *
 * - Desktop/tablet: two-column split (illustration panel + form panel)
 * - Mobile: illustration panel collapses to a compact top banner, form stacks below
 * - Register button is disabled (faded) until password === confirmPassword
 *   and both fields are non-empty.
 * - The bird illustration is a self-contained inline SVG (BirdIllustration)
 *   below — swap it for an <img src="..." /> or a different SVG anytime.
 */

function BirdIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Illustration of a bird surrounded by flowers"
    >
      <path
        d="M180 380 C 170 300, 190 260, 170 200 C 155 155, 175 120, 165 80"
        stroke="#6b7f5e"
        strokeWidth="4"
        fill="none"
      />
      <ellipse cx="150" cy="220" rx="26" ry="12" fill="#7c9268" transform="rotate(-30 150 220)" />
      <ellipse cx="190" cy="180" rx="26" ry="12" fill="#8ba377" transform="rotate(25 190 180)" />
      <ellipse cx="150" cy="140" rx="22" ry="10" fill="#7c9268" transform="rotate(-20 150 140)" />
      <ellipse cx="185" cy="100" rx="22" ry="10" fill="#8ba377" transform="rotate(20 185 100)" />

      <g fill="#e8c15a">
        <circle cx="110" cy="120" r="6" />
        <circle cx="122" cy="112" r="6" />
        <circle cx="134" cy="120" r="6" />
        <circle cx="122" cy="128" r="6" />
        <circle cx="122" cy="120" r="5" fill="#c9a13d" />
      </g>
      <g fill="#f1f1e8">
        <circle cx="105" cy="330" r="5" />
        <circle cx="115" cy="323" r="5" />
        <circle cx="125" cy="330" r="5" />
        <circle cx="115" cy="337" r="5" />
      </g>

      <g transform="translate(210,90)">
        <ellipse rx="20" ry="30" fill="#d9435e" transform="rotate(0)" />
        <ellipse rx="20" ry="30" fill="#e0596e" transform="rotate(72)" />
        <ellipse rx="20" ry="30" fill="#d9435e" transform="rotate(144)" />
        <ellipse rx="20" ry="30" fill="#e0596e" transform="rotate(216)" />
        <ellipse rx="20" ry="30" fill="#d9435e" transform="rotate(288)" />
        <circle r="12" fill="#c9a13d" />
      </g>
      <g transform="translate(150,150)">
        <ellipse rx="16" ry="24" fill="#eda15b" transform="rotate(0)" />
        <ellipse rx="16" ry="24" fill="#f0b174" transform="rotate(72)" />
        <ellipse rx="16" ry="24" fill="#eda15b" transform="rotate(144)" />
        <ellipse rx="16" ry="24" fill="#f0b174" transform="rotate(216)" />
        <ellipse rx="16" ry="24" fill="#eda15b" transform="rotate(288)" />
        <circle r="9" fill="#c9a13d" />
      </g>

      <g transform="translate(230,240)">
        <path d="M0 0 C 60 -50, 110 -20, 130 30 C 90 20, 70 10, 0 0 Z" fill="#c8493f" />
        <path d="M0 0 C 55 -20, 100 10, 110 60 C 75 40, 55 25, 0 0 Z" fill="#e0693f" />
        <path d="M0 0 C 45 5, 80 40, 75 85 C 50 60, 35 40, 0 0 Z" fill="#eda15b" />
        <path d="M0 0 C 30 20, 45 55, 30 90 C 15 65, 5 40, 0 0 Z" fill="#d9435e" />
      </g>

      <ellipse cx="210" cy="255" rx="65" ry="55" fill="#c8493f" />
      <ellipse cx="195" cy="270" rx="45" ry="35" fill="#eda15b" />

      <circle cx="160" cy="220" r="38" fill="#c8493f" />
      <path d="M126 222 L100 228 L126 236 Z" fill="#e8c15a" />
      <circle cx="150" cy="212" r="12" fill="#fdf6e3" />
      <circle cx="148" cy="212" r="6" fill="#3a2c1a" />
      <circle cx="150" cy="210" r="2" fill="#fff" />

      <path d="M195 305 L190 320 M195 305 L200 320 M195 305 L195 322" stroke="#c9a13d" strokeWidth="3" fill="none" />
      <path d="M225 305 L220 320 M225 305 L230 320 M225 305 L225 322" stroke="#c9a13d" strokeWidth="3" fill="none" />
    </svg>
  );
}

function Field({ id, label, type = "text", value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] text-gray-400 mb-0.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full border-b pb-1.5 text-sm text-gray-800 focus:outline-none transition-colors bg-transparent ${
          error ? "border-red-300 focus:border-red-400" : "border-gray-300 focus:border-gray-500"
        }`}
      />
      {error && <p className="text-[10px] text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [slide, setSlide] = useState(0);
  const [errorMsj,setErrorMsj]=useState("");
  
  const {setToken,setUser}=useContext(AuthContext);


  const navigate = useNavigate();

  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const confirmError =
    confirmPassword.length > 0 && confirmPassword !== password
      ? "Passwords don't match"
      : "";

const handleSubmit=async (e)=>{
    e.preventDefault();
    setErrorMsj("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({name,username,email,password})
      })

      const data = await response.json();
      if(!response.ok){
        throw new Error(data.message);
      }
      if(data.success){
        setToken('')
        setUser(null);
        localStorage.removeItem("token");
        navigate("/");
      }
      
    } catch (error) {
      setErrorMsj(error.message);
    }
  }
  return (
    <div className="min-h-screen md:h-screen w-full flex flex-col md:flex-row bg-white md:overflow-hidden">
      {/* Left / top panel — illustration */}
      <div className="relative flex flex-col items-center justify-between md:justify-center bg-[#a9c1ae] md:w-1/2 px-6 py-8 md:py-12 overflow-hidden">
                <div className="hidden md:block" />

                
                <img className="w-60" src="\images\Logo tr.png" alt="" />
                <img className="w-90" src="\images\Tag tr.png" alt="" srcset="" />
                <div className="text-center max-w-xs md:max-w-sm mt-4 md:mt-8">
                    <h2 className="text-white text-lg md:text-xl font-medium mb-1 md:mb-2">
                        Where every message feels closer..
                    </h2>

                </div>


            </div>

      {/* Right / bottom panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 md:py-4 md:overflow-y-auto">
        <div className="w-full max-w-sm">
          <p className="font-serif italic text-xl sm:text-2xl text-gray-700 mb-3 md:mb-4 text-center md:text-left">
            Nexibe
          </p>

          <h1 className="text-gray-800 text-base sm:text-lg font-medium mb-4 md:mb-5 text-center md:text-left">
            Create your account
          </h1>

          <form
            className="space-y-3"
            onSubmit={handleSubmit}
          >
            <Field id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Field
              id="username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Field
              id="confirmPassword"
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmError}
            />
  <p>{errorMsj}</p>
            <button
              type="submit"
              disabled={!passwordsMatch}
              className={`w-full text-white text-sm font-medium py-2.5 rounded-full mt-1 transition-colors ${
                passwordsMatch
                  ? "bg-gray-500 hover:bg-gray-600 active:bg-gray-700 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Register
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
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
              Sign up with Google
            </button> */}

            <p className="text-center text-xs text-gray-400 pt-1">
              Already have an account?{" "}
              {/* <a href="#" className="text-gray-600 font-medium hover:underline">
                Sign in
              </a> */}

              <button className="text-gray-600 font-medium hover:underline" onClick={()=>{
                                navigate(-1)
                            }}>Sign in</button>
              {/* <Link className="text-gray-600 font-medium hover:underline" to="/login">Sign in</Link> */}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}