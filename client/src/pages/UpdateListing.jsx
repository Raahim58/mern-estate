import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        title: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListing  = async () => {
            const listingId = params.listingId;
            const res = await fetch(`/server/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        }
        fetchListing();
    }, []);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length +formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
            for (let i=0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({
                    ...formData, 
                    imageUrls: formData.imageUrls.concat(urls)
                });
                setImageUploadError(false);
                setUploading(false);
            }).catch((err) => {
                setImageUploadError('Image upload failed! (2mb max per image)');
                setUploading(false);
            });
        } else if (files.length == 0 ) {
            setImageUploadError('No files uploaded!');
            setUploading(false);
        } else {
            setImageUploadError('You can only upload a total of 6 images per listing!');
            setUploading(false);
        }
    };

    const storeImage = async(file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress  = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            )
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id,
            });
        } else if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        } else if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) 
                return setError('You must upload atleast one image');
            if(+formData.regularPrice < +formData.discountPrice) 
                return setError('Discounted price should be lower than Regular price');
            setLoading(true);
            setError(false);
            const res = await fetch(`/server/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl text-gray-700 font-semibold text-center my-7' style={{ fontFamily: 'Monaco, Times, monospace'}}>Update your Listing!</h1>
            <form onSubmit = {handleSubmit} className='sm:flex-row gap-4'>
                <div className='flex flex-col flex-1 gap-4'>
                    <input 
                        type="text" 
                        placeholder='title..' 
                        className='border border-black p-3 rounded-lg' 
                        id='name' 
                        maxLength='62' 
                        minLength='10' 
                        required
                        onChange={handleChange}
                        rows = "10"
                        value = {formData.name} 
                        style={{ fontFamily: 'Monaco, Times, monospace'}}
                    />
                    <textarea 
                        type="text" 
                        placeholder='tell your listing story..' 
                        className='border border-black p-3 rounded-lg' 
                        id='description' 
                        required 
                        onChange={handleChange}
                        rows = "10"
                        value = {formData.description}
                        style={{ fontFamily: 'Monaco, Times, monospace'}}
                    />
                    <input 
                        type="text" 
                        placeholder='address..' 
                        className='border border-black p-3 rounded-lg' 
                        id='address' 
                        required
                        onChange={handleChange}
                        value = {formData.address}
                        style={{ fontFamily: 'Monaco, Times, monospace'}}
                    />
                    <div className='flex gap-6 flex-wrap mx-auto'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale'className='w-5 border border-black'
                            onChange = {handleChange} checked = {formData.type === "sale"}/>
                            <span style={{ fontFamily: 'Monaco, Times, monospace'}}>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent'className='w-5 border border-black'
                            onChange = {handleChange} checked = {formData.type === "rent"}/>
                            <span style={{ fontFamily: 'Monaco, Times, monospace'}}>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking'className='w-5 border border-black'
                            onChange = {handleChange} checked = {formData.parking}/>
                            <span style={{ fontFamily: 'Monaco, Times, monospace'}}>Parking spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished'className='w-5 border border-black'
                            onChange = {handleChange} checked = {formData.furnished}/>
                            <span style={{ fontFamily: 'Monaco, Times, monospace'}}>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer'className='w-5 border border-black'
                            onChange = {handleChange} checked = {formData.offer}/>
                            <span style={{ fontFamily: 'Monaco, Times, monospace'}}>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6 mx-auto'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border border-gray-600 rounded-lg' 
                            onChange = {handleChange} value = {formData.bedrooms}/>
                            <p style={{ fontFamily: 'Monaco, Times, monospace'}}>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathrooms' min='1' max='10' required className='p-3 border border-gray-600 rounded-lg'
                            onChange = {handleChange} value = {formData.bathrooms} />
                            <p style={{ fontFamily: 'Monaco, Times, monospace'}}>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='50' max='1000000' required className='p-3 border border-gray-600 rounded-lg'
                            onChange = {handleChange} value = {formData.regularPrice} />
                            <div className='flex flex-col items-center'>
                                <p style={{ fontFamily: 'Monaco, Times, monospace'}}>Regular Price</p>
                                {formData.type === 'rent' && (<span className='text-xs' style={{ fontFamily: 'Monaco, Times, monospace'}}>($ / month)</span>)}
                            </div>
                        </div>
                        {formData.offer && (
                        <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='0' max='10000000' required className='p-3 border border-gray-600 rounded-lg'
                            onChange = {handleChange} value = {formData.discountPrice} />
                            <div className='flex flex-col items-center'>
                                <p style={{ fontFamily: 'Monaco, Times, monospace'}}>Discounted Price</p>
                                {formData.type === 'rent' && (<span className='text-xs' style={{ fontFamily: 'Monaco, Times, monospace'}}>($ / month)</span>)}
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4 my-6'>
                        <p className='font-semibold' style={{ fontFamily: 'Monaco, Times, monospace'}}>Images:
                        <span className='font-normal text-gray-700 ml-2' 
                        style={{ fontFamily: 'Monaco, Times, monospace'}}>
                            The first image will be the cover (max 6)</span></p>
                    <div className='flex gap-4'>
                        <input onChange={(e)=>setFiles(e.target.files)} 
                        className='p-3 border border-gray-500 rounded w-full' type="file" id='images' accept='image/*' multiple 
                        style={{ fontFamily: 'Monaco, Times, monospace'}} />
                        <button 
                        type='button'
                        disabled={uploading} 
                        onClick={handleImageSubmit} 
                        className='p-3 text-slate-600 border border-slate-700 rounded uppercase hover:shadow-lg hover:text-slate-700 disabled:opacity-80' 
                        style={{ fontFamily: 'Monaco, Times, monospace'}}>
                            {uploading ? 'Uploading...' : 'Upload'} </button>
                    </div>
                    <p className="text-red-700" style={{ fontFamily: 'Monaco, Times, monospace'}}>{imageUploadError && imageUploadError}</p>
                    {
                        formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                            <div key={url} className="flex justify-between p-3 border border-black items-center">
                                <img src = {url} alt = "listing image" className="w-20 h-20 object-contain rounded-lg" />
                                <button type='button' onClick={() => handleRemoveImage(index)} className="p-3 text-red-500 rounded-lg uppercase hover:text-red-700" style={{ fontFamily: 'Monaco, Times, monospace' }}>Delete</button>
                            </div>
                        ))
                    }
                    <button disabled={loading || uploading} className='p-3 bg-green-600 text-white rounded-lg uppercase hover:bg-green-400 hover:text-black disabled:opacity-80 my-4' 
                    style={{ fontFamily: 'Monaco, Times, monospace'}}>{loading ? 'Updating...' : 'Update Listing'} </button>
                    {error && <p className="text-red-700 text-md" style={{ fontFamily: 'Monaco, Times, monospace' }}>{error}</p>}
                </div>
            </form>
        </main>
    )
};