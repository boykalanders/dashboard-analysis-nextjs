import Image from 'next/legacy/image';
import React from 'react';

const Describe = () => {
  return (
    <section className=' p-14 lg:p-24'>
      <div className='grid grid-cols-1 lg:grid-cols-2 items-center  justify-items-center'>
        <div className=''>
          <h4 className='text-white  text-[34px] lg:text-[64px] font-semibold '>
            Describe
          </h4>
          <p className='text-white text-[26px] lg:text-[32px] w-[360px] mb-10 italic'>
            Answer 3 quick questions about the dashboard You Uploaded
          </p>
        </div>
        <div>
          <img
            src='/img/2.jpeg'
            alt='vision'
            className={`h-[228px] lg:h-[355px] w-[276px]  lg:w-[580px] rounded-[50px]`}
          />
        </div>
      </div>
    </section>
  );
};

export default Describe;
