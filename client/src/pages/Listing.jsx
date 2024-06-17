import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import { Link, useNavigate } from 'react-router-dom';

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const params = useParams();
    const [userListings, setUserListings] = useState([]);
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/server/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    useEffect(() => {
        const initializeCarousel = () => {
            let currentIndex = 0;
            const items = document.querySelectorAll("[data-carousel-item]");
            const indicators = document.querySelectorAll("[data-carousel-slide-to]");
            const prevButton = document.querySelector("[data-carousel-prev]");
            const nextButton = document.querySelector("[data-carousel-next]");

            const updateCarousel = () => {
                items.forEach((item, index) => {
                    item.classList.toggle("hidden", index !== currentIndex);
                });
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle("active", index === currentIndex);
                });
            };

            prevButton.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + items.length) % items.length;
                updateCarousel();
            });

            nextButton.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            });

            indicators.forEach((indicator, index) => {
                indicator.addEventListener("click", () => {
                    currentIndex = index;
                    updateCarousel();
                });
            });

            // Add automatic slideshow
            setInterval(() => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            }, 5000); // Change the interval time as needed

            updateCarousel();
        };

        if (listing && listing.imageUrls) {
            initializeCarousel();
        }
    }, [listing]);

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
            navigate('/mylistings');
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleSaveForLater = async (listingId) => {
        try {
          const response = await fetch('/server/savedlistings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ listingId, userId: currentUser._id }),
          });
          if (response.ok) {
            setIsSaved(true);
          } else {
            console.error('Failed to save listing');
          }
        } catch (error) {
          console.error('Error saving listing', error);
        }
    };

    return (
        <>
            <style>
                {`
                .carousel-image {
                    width: 100%;
                    height: 100%;
                    object-position: relative;
                    object-fit: contain; /* Ensures the image covers the container */
                    transition: transform 0.5s ease-in-out;
                }
                .carousel-indicator {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.5s ease-in-out;
                    background-color: white; /* Default color */
                }
                .carousel-indicator.active {
                    background-color: black; /* Active color */
                }          
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
                [data-carousel-item] {
                    transform: translateX(0); /* Initial transform */
                }
                [data-carousel-item].hidden {
                    transform: translateX(-100%); /* Hidden transform */
                }
                .textarea-output {
                    white-space: pre-wrap;
                }
                `}
            </style>
            <main>
                {loading ? (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                ) : error ? (
                    <p className="text-center my-7 text-2xl" style={{ fontFamily: 'Monaco, Times, monospace' }}>
                        Error loading listing.
                    </p>
                ) : (
                    listing && (
                        <div>
                            <div id="default-carousel" className="relative w-full" data-carousel="slide">
                                <div className="relative h-56 overflow-hidden rounded-none md:h-[700px]">
                                    {listing.imageUrls.map((url, index) => (
                                        <div key={index} className={`absolute block w-full transition-transform duration-3000 ease-in-out ${index === 0 ? '' : 'hidden'}`} data-carousel-item>
                                            <img
                                                src={url}
                                                className="carousel-image"
                                                alt={`Slide ${index + 1}`}
                                                style={{ cursor: 'pointer'}}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
                                    {listing.imageUrls.map((url, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`carousel-indicator ${index === 0 ? 'active' : ''}`}
                                            aria-current={index === 0 ? "true" : "false"}
                                            aria-label={`Slide ${index + 1}`}
                                            data-carousel-slide-to={index}
                                        ></button>
                                    ))}
                                </div>
                                <button type="button" className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-4 group-focus:ring-black">
                                        <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                                        </svg>
                                        <span className="sr-only">Previous</span>
                                    </span>
                                </button>
                                <button type="button" className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/30 group-hover:bg-black/50 group-focus:ring-4 group-focus:ring-black">
                                        <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                        <span className="sr-only">Next</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    )
                )}
                <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <FaShare
                        className='text-slate-500'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }}
                    />
                </div>
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                        Link copied!
                    </p>
                )}
                {listing && (
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4' style={{ fontFamily: 'Monaco, Times, monospace' }}>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ${' '}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-2 gap-2 text-slate-600 text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <p className='text-left text-slate-600 text-sm'>
                                Last updated: {new Date(listing.updatedAt).toLocaleDateString('en-US')}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-blue-900 w-full max-w-[200px] text-white text-center p-1 rounded-md hover:bg-blue-400 hover:text-black'>
                                {listing.type === 'rent' ? 'for rent' : 'for sale'}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md hover:bg-green-500 hover:text-black'>
                                    ${+listing.regularPrice - +listing.discountPrice} discount
                                </p>
                            )}  
                        </div>
                        <div className='textarea-output'>
                            <p className='text-brown-700'>
                                <span className='font-bold text-red-900'>Description - </span>
                                {listing.description}
                            </p>
                        </div>
                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <>
                            <button
                                onClick={() => handleSaveForLater(listing._id)}
                                className={`font-semibold rounded-lg p-3 mt-6 uppercase ${isSaved ? 'bg-green-900' : 'bg-blue-900'} text-white hover:bg-blue-400 hover:text-black`}
                            >
                                {isSaved ? 'Saved' : 'Save for Later (coming soon)'}
                            </button>
                            <button
                                onClick={() => setContact(true)}
                                className='font-semibold bg-slate-600 text-white rounded-lg hover:bg-slate-400 hover:text-black p-3 mt-1 uppercase'
                            >
                                Contact landlord
                            </button>
                            </>
                        )}
                        {contact && <Contact listing={listing} />}
                        {currentUser && listing.userRef === currentUser._id && (
                            <div className='mx-auto flex flex-row gap-2'>
                                <button onClick={() => handleListingDelete(listing._id)} className='p-3 bg-red-600 text-white uppercase font-extrabold hover:bg-red-500 hover:text-black rounded-lg' style={{ fontFamily: 'Monaco, Times, monospace' }}>Delete</button>
                                <Link to={`/update-listing/${listing._id}`}>
                                    <button className='bg-green-600 p-4 rounded-lg text-white uppercase font-extrabold hover:text-black hover:bg-green-400' style={{ fontFamily: 'Monaco, Times, monospace' }}>Edit</button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}