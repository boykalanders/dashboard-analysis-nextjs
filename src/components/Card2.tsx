import Image from 'next/legacy/image';
import React from 'react';

const Card2 = ({ name, detail, occupation }: any) => {
  return (
    <div className="w-[100%] pl-8 lg:pl-0 flex flex-col lg:flex-row justify-center lg:justify-start">
      <div className="w-[100%] h-auto lg:w-[423px] lg:h-[230px] m-auto lg:ml-[100px] lg:mr-[22px] flex">
        <div className="w-[100%] h-auto lg:w-[392px] lg:h-48 flex-col justify-center lg:justify-start items-start gap-[30px] inline-flex relative">
          <div className="absolute top-0 left-[-22px] lg:left-[-24px]">
            <svg
              width="82"
              height="78"
              viewBox="0 0 82 78"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="&#226;&#128;&#156;"
                opacity="0.24"
                d="M82 0.772277L80.109 15.0165C75.4102 14.6733 71.8574 15.5886 69.4507 17.7624C67.044 19.9362 65.4969 22.9109 64.8092 26.6865C64.1216 30.462 63.9497 34.6381 64.2935 39.2145H82V78H48.3061V34.066C48.3061 22.0528 51.2285 13.0143 57.0734 6.9505C63.0328 0.772278 71.3417 -1.28713 82 0.772277ZM33.6939 0.772277L31.8029 15.0165C27.1041 14.6733 23.5514 15.5886 21.1447 17.7624C18.7379 19.9362 17.1908 22.9109 16.5031 26.6865C15.8155 30.462 15.6436 34.6381 15.9874 39.2145H33.6939V78H0V34.066C0 22.0528 2.92243 13.0143 8.76729 6.9505C14.7268 0.772278 23.0356 -1.28713 33.6939 0.772277Z"
                fill="#45516C"
              />
            </svg>
          </div>
          <div className="flex">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '7px' }}
            >
              <g id="Iconly/Sharp/Bold/Star 12">
                <path
                  id="Fill 268"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1664 6.83479L8.99968 0.982544L6.83368 6.83479L0.982178 9.00004L6.83368 11.1653L8.99968 17.0175L11.1664 11.1653L17.0179 9.00004L11.1664 6.83479Z"
                  fill="#C2CDE7"
                />
              </g>
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '7px' }}
            >
              <g id="Iconly/Sharp/Bold/Star 12">
                <path
                  id="Fill 268"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1664 6.83479L8.99968 0.982544L6.83368 6.83479L0.982178 9.00004L6.83368 11.1653L8.99968 17.0175L11.1664 11.1653L17.0179 9.00004L11.1664 6.83479Z"
                  fill="#C2CDE7"
                />
              </g>
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '7px' }}
            >
              <g id="Iconly/Sharp/Bold/Star 12">
                <path
                  id="Fill 268"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1664 6.83479L8.99968 0.982544L6.83368 6.83479L0.982178 9.00004L6.83368 11.1653L8.99968 17.0175L11.1664 11.1653L17.0179 9.00004L11.1664 6.83479Z"
                  fill="#C2CDE7"
                />
              </g>
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: '7px' }}
            >
              <g id="Iconly/Sharp/Bold/Star 12">
                <path
                  id="Fill 268"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1664 6.83479L8.99968 0.982544L6.83368 6.83479L0.982178 9.00004L6.83368 11.1653L8.99968 17.0175L11.1664 11.1653L17.0179 9.00004L11.1664 6.83479Z"
                  fill="#C2CDE7"
                />
              </g>
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="Iconly/Sharp/Bold/Star 12">
                <path
                  id="Fill 268"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.1664 6.83479L8.99968 0.982544L6.83368 6.83479L0.982178 9.00004L6.83368 11.1653L8.99968 17.0175L11.1664 11.1653L17.0179 9.00004L11.1664 6.83479Z"
                  fill="#C2CDE7"
                />
              </g>
            </svg>
          </div>
          <div className="w-[100%] lg:w-[345px] text-slate-200 text-base leading-7 tracking-tight">
            {detail}
          </div>
          <div className="flex justify-evenly items-center">
            <div className="w-auto h-auto lg:w-[54px] lg:h-[54px] bg-red-400 rounded-[300px] flex-col justify-start items-start inline-flex">
              <img
                className="w-full h-full rounded-[300px] object-cover"
                src="/img/cardImg2.png"
              />
            </div>
            <div className="w-[100%] lg:w-[165px] h-auto lg:h-[50px] ml-5">
              <div className="text-slate-300 text-base font-semibold leading-7">
                {name}
              </div>
              <div className="text-slate-400 text-[13px] font-normal leading-normal">
                {occupation}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-px h-[156px] opacity-70 border border-gray-800 hidden lg:block" />
    </div>
  );
};

export default Card2;
