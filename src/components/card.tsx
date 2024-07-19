import Image from 'next/legacy/image';
import React from 'react';

const card = ({ name, detail }: any) => {
  return (
    <div className='w-[289px]  bg-white bg-opacity-5 rounded-[10px] m-3 p-5'>
      <div className='grid grid-cols-2  item-center'>
        <div>
          <img
            src='/img/cardImg1.png'
            alt='vision'
            className='h-[88px] w-[88px] rounded-full object-cover'
          />
        </div>
        <div>
          <p className='text-white text-sm font-bold'>“{detail}”</p>
          <p className='text-white text-xs mt-2'>~{name}</p>
        </div>
      </div>
    </div>
    
  );
};

export default card;
