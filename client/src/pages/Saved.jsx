import React from 'react';
import { Link } from 'react-router-dom';

export default function Saved() {
  return (
    <div className="h-screen w-full relative">
      <video
        src="https://videos.pexels.com/video-files/4424416/4424416-hd_1280_720_30fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center" style={{ fontFamily: 'Monaco, Times, monospace'}}>
        <h1 className="text-center text-3xl text-green-400 mb-4 pointer-events-auto"> This feature is not yet available!
        </h1>
        <Link to={'/'} className="text-green-600 hover:text-green-900 pointer-events-auto">
          Go back to homepage
        </Link>
      </div>
    </div>
  );
}