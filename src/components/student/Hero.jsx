import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from './SearchBar';

const Hero = () => {
    return (
        <div className='flex flex-col item-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7
        text-center bg-gradient-to-b from-cyan-100/70'>
            <h1 className='md:text-home-heading-large 
            text-home-heading-small relative
            font-bold text-gray-800 max-w-3xl mx-auto'>
                Hero. 
                <span className='text-blue-600'>
                    <img src={assets.sketch} alt="sketch" 
                    className='md:block hidden absolute -bottom-7 right-0'/>
                </span>
            </h1>

            <p className='text-gray-500 max-w-lg mx-auto'>dao manh tung</p>
            <p className='text-gray-500 max-w-lg mx-auto'>cntt2-k63</p>
            <SearchBar />
        </div>
    );
}

export default Hero;
