import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signinstart, signinsuccess, signinfailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinstart());
      const res = await fetch('/server/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signinfailure(data.message));
        return;
      }
      dispatch(signinsuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signinfailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7' style={{ fontFamily: 'Monaco, Times, monospace'}}>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          style={{ fontFamily: 'Monaco, Times, monospace'}}
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg' 
          style={{ fontFamily: 'Monaco, Times, monospace'}}
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:bg-slate-400 hover:text-black disabled:opacity-80' style={{ fontFamily: 'Monaco, Times, monospace'}}>
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p style={{ fontFamily: 'Monaco, Times, monospace'}}>Dont have an account?</p>
        <Link to={'/signup'}>
          <span className='text-blue-700' style={{ fontFamily: 'Monaco, Times, monospace'}}>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5' style={{ fontFamily: 'Monaco, Times, monospace'}}>{error}</p>}
    </div>
  )
  };
