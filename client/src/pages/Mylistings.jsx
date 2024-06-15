import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function MyListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingError] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleShowListings = async () => {
    setLoading(true);
    try {
      setShowListingError(false);
      const res = await fetch(`/server/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
      } else {
        setUserListings(data);
      }
    } catch (error) {
      setShowListingError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/server/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing.id!== listingId));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleShowListings();
  }, []);

  return (
    <>
      <style>
          {`
          .loader-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
          .loader {
              border: 16px solid #f3f3f3;
              border-radius: 50%;
              border-top: 16px solid #3498db;
              width: 60px;
              height: 60px;
              -webkit-animation: spin 2s linear infinite;
              animation: spin 2s linear infinite;
          }
          @-webkit-keyframes spin {
              0% { -webkit-transform: rotate(0deg); }
              100% { -webkit-transform: rotate(360deg); }
          }
          @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
          }
          `}
      </style>
      <main>
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : showListingsError ? (
          <p className='text-red-700 mt-5' style={{ fontFamily: 'Monaco, Times, monospace' }}>Error showing listings</p>
        ) : (
          userListings && userListings.length > 0 ? (
            <div>
              <h1 className='text-3xl font-semibold text-center mt-10 mb-8 text-blue-900' style={{ fontFamily: 'Monaco, Times, monospace' }}>Your Listings!</h1>
              <div className='flex flex-col gap-4'>
                {userListings.map((listing) => (
                  <div key={listing._id} className='border border-gray-700 shadow-md rounded-lg p-3 flex justify-between items-center gap-4 ml-12 mr-12 hover:scale-105'>
                    <Link to={`/listing/${listing._id}`}>
                      <img src={listing.imageUrls[0]} alt="listing cover" className='h-20 w-20 object-contain rounded-lg' />
                    </Link>
                    <Link to={`/listing/${listing._id}`}>
                      <p className='text-slate-500 font-semibold flex-1 hover:text-slate-700 truncate text-xl' style={{ fontFamily: 'Monaco, Times, monospace' }}>{listing.name}</p>
                    </Link>
                    <div className='flex flex-col items-center'>
                      <button onClick={() => handleListingDelete(listing._id)} className='text-red-500 uppercase font-extrabold hover:text-red-700' style={{ fontFamily: 'Monaco, Times, monospace' }}>Delete</button>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className='text-green-500 uppercase font-extrabold hover:text-white' style={{ fontFamily: 'Monaco, Times, monospace' }}>Edit</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 mb-5 flex justify-center items-center" style={{ fontFamily: 'Monaco, Times, monospace' }}>
                <Link to="/create-listing">
                  <button className=" bg-blue-900 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg hover:text-black" style={{ fontFamily: 'Monaco, Times, monospace', marginBottom: '20px' }}>Create new listing</button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-screen flex justify-center items-center" style={{ fontFamily: 'Monaco, Times, monospace' }}>
              <div className="text-center">
                <h1 className="text-blue-700 text-4xl">No listings available.</h1>
                <p className="text-blue-500 text-3xl mt-2">Head now to create your first listing!</p>
                <Link to="/create-listing">
                  <button className="mt-5 bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Create</button>
                </Link>
              </div>
            </div>
          )
        )}
      </main>
    </>
  );
}
