import React from "react";
import NavBar from "./Navbar";

function Landing(props) {
  return (
    <div>
      <NavBar />
      <div className='pt-32'>
        <div className='flex container mx-auto px-1 flex-col mt-7 items-center'>
          <h1 className='text-center text-5xl md:text-7xl font-bold primaryTextColor tracking-wide sm:leading-[4rem]'>
            A Platform for Women Creators to Raise Funds and Build their Ideas
          </h1>
          <p className=' text-center mt-4 text-lg text-gray-800 sm:mt-10 sm:text-2xl primaryTextColor'>
            Pitch ideas, raise funds and bring your creative ideas to life by
            building in public.
          </p>

          <button className='text-lg primaryColor text-white mt-16 px-16 py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 duration-100 hover:primaryHover'>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
