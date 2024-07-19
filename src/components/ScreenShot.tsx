import Image from 'next/legacy/image';
import React from 'react';

const ScreenShot = ({ title, img, desc }: any) => {
  return (
    <section className='bg-gray-700 p-14 lg:p-24 '>
      <div className='grid grid-cols-1 lg:grid-cols-2 items-center  justify-items-center'>
        <div>
          <img
            src={`/img/${img}`}
            alt='vision'
            className={`h-[228px] lg:h-[355px] w-[276px] lg:w-[580px] rounded-[50px] object-cover`}
          />
        </div>
        <div className='mt-10 lg:mt-0'>
          <h4 className='text-white text-[34px] lg:text-[64px] font-semibold  '>
            {title}
          </h4>
          <p className='text-white text-[26px] lg:text-[32px] w-[360px]  lg:w-[483px] italic'>
            {desc}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScreenShot;
