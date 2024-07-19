import React from 'react';

const Faqs = () => {
  return (
    <section>
      <div className='flex justify-center  mt-48 mb-48'>
        <button
          type='button'
          className='text-center text-white text-2xl font-bold px-10 py-3 bg-[#018879] rounded-[10px]'
        >
          Try It Today!
        </button>
      </div>
      <div className='mb-24'>
        <div className='flex justify-center'>
          <p className=' text-white  text-[64px] italic '>FAQs</p>
        </div>
        <div className='flex justify-center mt-6'>
          <input
            type='email'
            className='bg-[#FFFFFF26] text-[white]  placeholder-white text-2xl rounded-lg  block h-[90px] w-[360px] lg:h-[90px] lg:w-[700px] pl-4  mb-5 italic '
            placeholder='Where Does Myy Data Go? '
          />
        </div>
      </div>
    </section>
  );
};

export default Faqs;
