'use client'
import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const page = () => {

  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if(!username || !password) return alert("Username & Password are required")
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });
      if(res.status===200) {
        alert("Login successful")
        localStorage.setItem('token', res.data.token);
        return router.replace('/');
      }
    } catch (error:any) {
      alert(error.response.data.error);
    }
  }
  
  return (
    <div className='flex justify-center items-center w-100 h-[100vh]'>
      <div className="flex-col h-fit min-w-[420px] bg-violet-50 px-20 py-10 rounded-lg shadow-lg">
        <label className='flex font-medium rounded-sm text-violet-900' htmlFor="username">Username</label>
        <input className='h-8 w-full px-1 mb-2 rounded-sm focus:outline outline-2 outline-violet-900' 
          type="text" name='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)} />
        <label className='flex font-medium rounded-sm text-violet-900' htmlFor="password">Password</label>
        <input className='h-8 w-full px-1 mb-2 rounded-sm focus:outline outline-2 outline-violet-900' 
          type="password" name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}  />
        <button
          onClick={handleLogin}
          className='flex justify-center w-full text-white 
          bg-violet-900 py-2 mt-4 rounded-sm hover:bg-gradient-to-r from-violet-900 via-violet-700 to-violet-900'>Login
        </button>
        <p className='text-sm text-center mt-2'>Don't have an account? 
          <span className='ml-2 text-violet-900'><Link href={'/registration'}>Register</Link></span>
        </p>
      </div>
    </div>
  )
}

export default page