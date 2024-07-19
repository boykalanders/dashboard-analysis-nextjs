import React from 'react';
import Card from './card';
import Card2 from './Card2';

const Teams = () => {
  return (
    <section className="overflow-hidden py-10 ">
      <div className="w-full h-[760px] flex-col justify-start items-center lg:items-start gap-[82px] inline-flex">
        <div className="mx-auto">
          <p className="text-center text-emerald-600 text-[15px] font-normal leading-[27px]">
            Testimonials
          </p>
          <h3 className="text-center text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[46px] font-bold leading-[55.20px]">
            What they say
          </h3>
        </div>

        <div className="grid grid-rows-1 lg:grid-flow-col gap-10 lg:gap-5 lg:my-5 lg:ms-[4rem] justify-center ">
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
        </div>

        <div className="grid grid-rows-1 lg:grid-flow-col lg:gap-5 lg:my-5 lg:ms-[-7rem] justify-center">
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
          <Card2
            name="John Doe"
            detail="Lorem ipsum is a placeholder text commonly used to Lorem ipsum
            is a placeholder text commonly used to"
            occupation="Product Designer at Rimuut"
          />
        </div>
      </div>
    </section>
  );
};

export default Teams;
