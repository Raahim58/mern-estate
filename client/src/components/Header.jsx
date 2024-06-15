import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaList, FaHeart } from 'react-icons/fa';
import { deleteUserFailure, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleToggle = () => {
      setIsOpen(!isOpen);
  };

  const handleSignOut = async() => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/server/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
    navigate('/signin');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleSelect = (value) => {
    if (value === "/profile") {
      navigate("/profile");
    } else if (value === "/mylistings") {
      navigate("/mylistings");
    } else if (value === "/savedlistings") {
      navigate("/savedlistings");
    } else if (value === "/signout") {
      handleSignOut();
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-section')) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className='bg-slate-400 shadow-lg'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-200' style={{ fontFamily: 'Monaco, Times, monospace'}}>Poonawala</span>
            <span className='text-slate-700' style={{ fontFamily: 'Monaco, Times, monospace'}}>Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center border border-gray-600'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            style={{ fontFamily: 'Monaco, Times, monospace'}}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
          <li className='text-s hidden sm:inline text-slate-700 hover:text-white' style={{ fontFamily: 'Monaco, Times, monospace', fontSize: '17px' }}>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:text-white' style={{ fontFamily: 'Monaco, Times, monospace', fontSize: '17px' }}>
              About
            </li>
          </Link>
          <div className="profile-section">
            <div className="profile-icon cursor:pointer" onClick={handleToggle}>
              {currentUser? (
                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
              ) : (
                <Link to="/signin">
                <li className='text-slate-700 hover:text-white' style={{ fontFamily: 'Monaco, Times, monospace', fontSize: '17px' }}>
                  <i className="fas fa-user"/> Signin
                </li>
                </Link>
              )}
            </div>
            {currentUser && isOpen && (
              <div className="profile-dropdown" 
              style={{
                position: 'absolute',
                top: '60px',
                right: '0px',
                zIndex: 1000,
                transform: 'translateX(-100%)',
                padding: '10px',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                fontFamily: 'Monaco, Times, monospace',
                cursor: 'pointer',
                background: 'white',
              }}>
                <ul>
                  <li className='text-slate-700 hover:text-black ' onClick={() => handleSelect("/profile")}>
                    <i className="fas fa-user" onClick={() => handleSelect("/profile")}/> Profile
                  </li>
                  <li className='text-slate-700 hover:text-black mt-1' onClick={() => handleSelect("/mylistings")}>
                    <i className="fas fa-list" onClick={() => handleSelect("/profile")}/> My Listings
                  </li>
                  <li className='text-slate-700 hover:text-black mt-1' onClick={() => handleSelect("/savedlistings")}>
                    <i className="fas fa-heart" onClick={() => handleSelect("/profile")}/> Saved Listings
                  </li>
                  <li className='text-slate-700 hover:text-black mt-1' onClick={handleSignOut}>
                    <span><i className="fas fa-sign-out-alt" /> Sign Out</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
}

