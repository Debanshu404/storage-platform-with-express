import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const Base_url = "http://192.168.29.249:4100".trim();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [iserror, setiserror] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    const res = await fetch(`${Base_url}/user/login`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
      credentials:"include"
    });
    
const data = await res.json();
   console.log(data)
   
   if (data.error) {
      console.log(data.error);
      setiserror(data.error);
      setFormData({ ...formData, password: '' });
      setTimeout(() => {
        setiserror(false);
      }, 3000);
      return;
    } else {
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        // Navigate to dashboard or home page after successful login
        navigate("/");
      }, 2000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&family=Work+Sans:wght@400;500;600&display=swap');
        
        body {
          font-family: 'Work Sans', sans-serif;
        }
        
        .font-crimson {
          font-family: 'Crimson Text', serif;
        }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-5">
        <div className="w-full max-w-[440px]">
          <div className="bg-[#141414] rounded-sm p-12 border border-[#1f1f1f] md:p-10 sm:p-7">
            
            <div className="mb-10">
              <div className="w-10 h-[3px] bg-[#c76b3a] mb-6"></div>
              <h1 className="font-crimson text-[28px] font-semibold text-[#e8e8e8] mb-2 -tracking-[0.5px] md:text-2xl">
                Welcome Back
              </h1>
              <p className="text-[#6b6b6b] text-sm leading-[1.5]">
                Sign in to continue to your account
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label 
                  htmlFor="email" 
                  className="block text-[#9a9a9a] text-[13px] font-medium mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-[14px] px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-[1px] text-[#e8e8e8] text-[15px] outline-none transition-[border-color] duration-200 placeholder:text-[#4a4a4a] focus:border-[#c76b3a]"
                  required
                />
              </div>

              <div className="mb-6">
                <label 
                  htmlFor="password" 
                  className="block text-[#9a9a9a] text-[13px] font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-[14px] px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-[1px] text-[#e8e8e8] text-[15px] outline-none transition-[border-color] duration-200 placeholder:text-[#4a4a4a] focus:border-[#c76b3a]"
                  required
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-[1px] cursor-pointer accent-[#c76b3a]"
                  />
                  <span className="ml-2 text-[#6b6b6b] text-[13px]">Remember me</span>
                </label>
                <a href="#" className="text-[#c76b3a] text-[13px] no-underline hover:underline">
                  Forgot password?
                </a>
              </div>

              {iserror && <span className="text-[#f6eeee] text-xs block mb-4">{iserror}</span>}
              
              <button
                type="submit"
                className={`w-full py-[15px] px-4 border-none rounded-[1px] text-[#0a0a0a] text-[15px] font-semibold cursor-pointer transition-[background] duration-200 ${
                  submitted 
                    ? 'bg-[#4a7c59] hover:bg-[#568a66]' 
                    : 'bg-[#c76b3a] hover:bg-[#d47742] active:bg-[#b65f33]'
                }`}
              >
                {submitted ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center my-8 gap-4">
              <div className="flex-1 h-px bg-[#1f1f1f]"></div>
              <span className="text-[#4a4a4a] text-xs">or</span>
              <div className="flex-1 h-px bg-[#1f1f1f]"></div>
            </div>

            <div className="text-center mt-6 text-[#6b6b6b] text-sm">
              Don't have an account?{' '}
              <span 
                onClick={() => navigate("/register")} 
                className="text-[#c76b3a] cursor-pointer font-medium hover:underline"
              >
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}