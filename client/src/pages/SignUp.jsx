import { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Initialize error state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null); // Reset error state

      const res = await fetch('http://localhost:3000/client/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.text(); // Or res.json() if your server returns JSON errors
        console.error('Error:', errorData);
        // alert(`Error: ${res.status} ${res.statusText}`);
        setLoading(false);
        setError(errorData); // Set the error state
        return;
      }

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message); // Set the error state
        return;
      }

      console.log(data);
      setLoading(false);
      setError(null);
      navigate('/signin');
    } catch (error) {
      setLoading(false);
      setError(error.message); // Set the error state
      console.error('Fetch error:', error);
      alert('An error occurred while signing up. Please try again later.');
    }
  };

  console.log(formData);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type="text"
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          value={formData.username || ''}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          value={formData.email || ''}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          value={formData.password || ''}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
      </form>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/signin"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
