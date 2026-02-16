import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Register() {
  const navigate = useNavigate();
  const Base_url = "http://192.168.29.249:4100".trim();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [iserror,setiserror]=useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    const res=await fetch(`${Base_url}/user/register`,{
      method:"POST",
      body:JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
      
    })
    const data=await res.json()
    console.log(data.error)
    if(data.error){
      setiserror(data.error)
      setFormData( {...formData, email: ''})
      setTimeout(() => {
      setiserror(false)
    }, 3000)
      return
    }
    else{

      setSubmitted(true);
  
      setTimeout(() => {setSubmitted(false)
        navigate("/")
      }
      
      , 3000);
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
                Create Account
              </h1>
              <p className="text-[#6b6b6b] text-sm leading-[1.5]">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label 
                  htmlFor="name" 
                  className="block text-[#9a9a9a] text-[13px] font-medium mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-[14px] px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-[1px] text-[#e8e8e8] text-[15px] outline-none transition-[border-color] duration-200 placeholder:text-[#4a4a4a] focus:border-[#c76b3a]"
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-[14px] px-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-[1px] text-[#e8e8e8] text-[15px] outline-none transition-[border-color] duration-200 placeholder:text-[#4a4a4a] focus:border-[#c76b3a]"
                  required
                />
              </div>
 {iserror && <span className="text-[#f6eeee] text-xs">{iserror}</span>}
              <button
                type="submit"
                className={`w-full py-[15px] px-4 border-none rounded-[1px] text-[#0a0a0a] text-[15px] font-semibold cursor-pointer transition-[background] duration-200 mt-2 ${
                  submitted 
                    ? 'bg-[#4a7c59] hover:bg-[#568a66]' 
                    : 'bg-[#c76b3a] hover:bg-[#d47742] active:bg-[#b65f33]'
                }`}
              >
                {submitted ? 'Account Created' : 'Register'}
              </button>
          
            </form>

            <div className="flex items-center my-8 gap-4">
              <div className="flex-1 h-px bg-[#1f1f1f]"></div>
              <span className="text-[#4a4a4a] text-xs">or</span>
              <div className="flex-1 h-px bg-[#1f1f1f]"></div>
            </div>

            <div className="text-center mt-6 text-[#6b6b6b] text-sm">
              Already have an account?{' '}
              <span 
                onClick={() => navigate("/Login")} 
                className="text-[#c76b3a] cursor-pointer font-medium hover:underline"
              >
                Sign in
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}