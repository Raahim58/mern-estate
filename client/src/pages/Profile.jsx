import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart, updateUserFailure, updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({}); // empty object
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // to show upload %
        setFilePerc(Math.round(progress)); // to round it off
      },
      (error) => {
        setFileUploadError(true); // to see error 
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL }) // get previous date for updating
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    } 
  }
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
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
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/server/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
    } catch(error) {
      setShowListingError(true);
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

      setUserListings((prev) => prev.filter((listing) => listing.id !== listingId));
    } catch(error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7' style={{ fontFamily: 'Monaco, Times, monospace'}}>That's you!</h1>
      <form onSubmit={handleSubmit}className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        {currentUser.avatar && formData.avatar !== "https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg=" && (
          <button
            onClick={() => {
              setFormData({ ...formData, avatar: "https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg=" });
              setFilePerc(0); // reset filePerc to 0
            }}
            className='text-red-700 text-sm self-center'
            style={{ fontFamily: 'Monaco, Times, monospace'}}
          >
            Delete Picture
          </button>
        )}
        {formData.avatar && (
          <p className='text-sm self-center' style={{ fontFamily: 'Monaco, Times, monospace'}}>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error Image upload (should be an image of less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700'>
                {`Uploading ${filePerc}%`}
              </span>
            ) : filePerc === 100 && !fileUploadError ? (
              formData.avatar === "https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg=" ? (
                <span className='text-slate-700'>Default avatar selected</span>
              ) : (
                <span className='text-green-700'>Image successfully uploaded!</span>
              )
            ) : formData.avatar === "https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg=" ? (
              <span className='text-slate-700'>Default avatar selected</span>
            ) : (
              <span className='text-green-700'>Image successfully deleted!</span>
            )}
          </p>
        )}
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          style={{ fontFamily: 'Monaco, Times, monospace'}}
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          defaultValue={currentUser.email}
          style={{ fontFamily: 'Monaco, Times, monospace'}}
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          style={{ fontFamily: 'Monaco, Times, monospace'}}
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button disabled={loading} 
        className='bg-slate-600 text-white rounded-lg p-3 uppercase hover:bg-slate-400 hover:text-black disabled:opacity-80' style={{ fontFamily: 'Monaco, Times, monospace'}}>
          {loading ? 'Loading...': 'Update'}
        </button>
        <Link className='bg-blue-900 text-white p-3 rounded-lg uppercase text-center hover:bg-blue-400 hover:text-black' style={{ fontFamily: 'Monaco, Times, monospace'}} to={"/create-listing"}>Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-blue-700 cursor-pointer hover:text-red-700 hover:scale-105' style={{ fontFamily: 'Monaco, Times, monospace'}}>Delete account</span>
        <span onClick={handleSignOut} className='text-blue-700 cursor-pointer hover:text-red-700 hover:scale-105' style={{ fontFamily: 'Monaco, Times, monospace'}}>Sign out</span>
      </div>
      <Link to = {`/mylistings`}>
      <button onClick={handleShowListings} 
      className='text-blue-700 w-full hover:text-green-700 hover:scale-105' style={{ fontFamily: 'Monaco, Times, monospace'}}>Show Listings</button>
      </Link>
      {error ? (
        <p className='text-red-700 mt-5' style={{ fontFamily: 'Monaco, Times, monospace'}}>
          {'Credentials already in use'}
        </p>
      ) : (
        updateSuccess? (
          <p className='text-green-700 mt-5' style={{ fontFamily: 'Monaco, Times, monospace'}}>
            User is updated successfully!
          </p>
        ) : null
      )}
    </div>
  );
}