import React from 'react';

export default function About() {
  return (
    <div className="h-screen w-full relative">
      <video
        src="https://videos.pexels.com/video-files/7578541/7578541-hd_1280_720_30fps.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-start text-left p-20" style={{ fontFamily: 'Monaco, Times, monospace' }}>
        <h1 className="text-3xl font-bold mb-4 text-black">About Poonawala Estate</h1>
        <p className="mb-4 font-semibold text-white">
          Poonawala Estate is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
        </p>
        <p className="mb-4 font-semibold text-white">
          Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
        </ p>
        <p className="mb-4 font-semibold text-white">
          Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.
        </p>
      </div>
    </div>
  );
}