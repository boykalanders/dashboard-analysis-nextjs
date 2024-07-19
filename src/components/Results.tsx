import React, { useEffect, useState } from 'react';
import { supabase } from '@/client';
import { useRouter } from 'next/router';
import Spinner from './spinner/Spinner';

const Results = () => {
  const router = useRouter();
  const [data, setData] = useState<any>([{}]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (token: any) => {
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from('results')
          .select()
          .eq('token', token);

        if (error) {
          throw error;
        }
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    const token = router.query.token;

    if (token) {
      fetchData(token);
    }
  }, [router.query.token]);

  console.log(data, 'data')

  console.log("Improvements")
  console.log(data[0]?.improvements);

  const improve = JSON.parse(data[0]?.improvements || '[]');

  const positives = JSON.parse(data[0]?.positives || '[]');

  // const parsedPositivesData = JSON.parse(parsedPositives || '[]');

  const rating = JSON.parse(data[0]?.rating || '[]');

  const dashboard = JSON.parse(data[0]?.dashboard || '[]')

  const data2 = rating.map((item: { Score: any }) => item.Score);

  console.log("Rating", rating);
  console.log("Original Score", data2);
  console.log("Good Feedback", positives);

  const numericData = data2.map(Number);

  // Calculate the average
  const sum = numericData.reduce((acc: any, value: any) => acc + value, 0);
  const average = sum / numericData.length;

  // Map the average to a scale out of 10
  const averageOutOf10 = (average / 10) * 10;

  return (
    <section className="container max-w-[82rem] mx-auto text-gray-600 body-font bg-gray-950">
      {isLoading && <Spinner />}

      <div className="w-[90%] md:w-[60%] lg:w-[50%] h-auto mx-auto p-2 bg-rose-600 bg-opacity-10 rounded-lg border border-rose-600 my-7">
        <p className="text-center text-white text-base font-normal leading-tight">
        Looking for even more actionable reporting?&nbsp;-&nbsp;
          <a href="https://visionlabs.com/contact/?utm_source=reviewmydashboard&utm_medium=email&utm_campaign=reviewmydashboard&utm_content=delivery-email"
              className="text-blue-500 hover:underline">Contact Vision Labs</a>
        </p>
      </div>
      <h1 className="w-[100%] text-center mx-auto text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[50px] sm:text-[58px] lg:text-[60px] font-bold leading-[76.80px]">
        {dashboard && dashboard.length > 0 ? dashboard : 'Name Dashboard'}
      </h1>
      {/* image section */}
      <div className="w-[80%] h-full mx-auto rounded-lg mt-16 mb-16">
        <img
          src={
            data[0]?.image
              ? `data:image;base64,${data[0]?.image}`
              : '/img/background.jpg'
          }
          alt="photo"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      {/* <h3 className="h-15 text-white text-[32px] font-extrabold my-5">
              Overall Score:{' '}
              <span className="text-lime-400 text-[34px]">
                {Math.round(averageOutOf10) || 0}/10
              </span>
            </h3>
            <div className="w-full bg-[rgba(161,253,89,0.259)] rounded-full h-3.5 dark:bg-gray-700">
              <div
                className="bg-[#A1FC58] h-3.5 rounded-full"
                style={{ width: Math.round(averageOutOf10) * 10 + '%' }}
              ></div>
            </div> */}
      {/* <h3 className="h-15 text-white text-[32px] font-extrabold my-5">
              Areas for Improvement:
            </h3>

            <div className="text-stone-50 text-lg font-medium flex flex-wrap w-full">
              {parsedData.map((item: any) => (
                <span
                  key={item.title}
                  className="bg-red-400 rounded-[10px] p-1 px-2 mr-3 mb-5"
                >
                  {item.title}
                </span>
              ))}
            </div> */}

      {/* Rating breakdown */}
      <div>
        <h3 className="w-[100%] text-center sm:text-left sm:w[50%] xl:w-[30%] text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[32px] font-extrabold mb-8">
          Rating Breakdown
        </h3>
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {rating.map((item: any, i: any) => (
            <>
              {/* {i === 0 && (
                <li
                  key={i}
                  className="col-span-1 p-4 bg-neutral-900 rounded-2xl border border-gray-900 justify-start items-center gap-4 inline-flex"
                >
                  <div className="p-2 bg-white bg-opacity-10 rounded-xl justify-start items-start gap-2 flex">
                    <div className="w-10 h-10 justify-center items-center flex">
                      <div className="w-10 h-10 relative">
                        <svg
                          width="40"
                          height="41"
                          viewBox="0 0 40 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <g id="vuesax/bold/status-up">
                            <g id="status-up">
                              <path
                                id="Vector"
                                d="M26.9835 3.83325H13.0168C6.95016 3.83325 3.3335 7.44992 3.3335 13.5166V27.4666C3.3335 33.5499 6.95016 37.1666 13.0168 37.1666H26.9668C33.0335 37.1666 36.6502 33.5499 36.6502 27.4833V13.5166C36.6668 7.44992 33.0502 3.83325 26.9835 3.83325ZM12.7168 30.7499C12.7168 31.4333 12.1502 31.9999 11.4668 31.9999C10.7835 31.9999 10.2168 31.4333 10.2168 30.7499V27.2999C10.2168 26.6166 10.7835 26.0499 11.4668 26.0499C12.1502 26.0499 12.7168 26.6166 12.7168 27.2999V30.7499ZM21.2502 30.7499C21.2502 31.4333 20.6835 31.9999 20.0002 31.9999C19.3168 31.9999 18.7502 31.4333 18.7502 30.7499V23.8333C18.7502 23.1499 19.3168 22.5833 20.0002 22.5833C20.6835 22.5833 21.2502 23.1499 21.2502 23.8333V30.7499ZM29.7835 30.7499C29.7835 31.4333 29.2168 31.9999 28.5335 31.9999C27.8502 31.9999 27.2835 31.4333 27.2835 30.7499V20.3833C27.2835 19.6999 27.8502 19.1333 28.5335 19.1333C29.2168 19.1333 29.7835 19.6999 29.7835 20.3833V30.7499ZM29.7835 15.1166C29.7835 15.7999 29.2168 16.3666 28.5335 16.3666C27.8502 16.3666 27.2835 15.7999 27.2835 15.1166V13.4999C23.0335 17.8666 17.7168 20.9499 11.7668 22.4333C11.6668 22.4666 11.5668 22.4666 11.4668 22.4666C10.9002 22.4666 10.4002 22.0833 10.2502 21.5166C10.0835 20.8499 10.4835 20.1666 11.1668 19.9999C16.7835 18.5999 21.7835 15.6499 25.7502 11.4833H23.6668C22.9835 11.4833 22.4168 10.9166 22.4168 10.2333C22.4168 9.54992 22.9835 8.98325 23.6668 8.98325H28.5502C28.6168 8.98325 28.6668 9.01659 28.7335 9.01659C28.8168 9.03325 28.9002 9.03325 28.9835 9.06659C29.0668 9.09992 29.1335 9.14992 29.2168 9.19992C29.2668 9.23325 29.3168 9.24992 29.3668 9.28325C29.3835 9.29992 29.3835 9.31659 29.4002 9.31659C29.4668 9.38325 29.5168 9.44992 29.5668 9.51659C29.6168 9.58325 29.6668 9.63325 29.6835 9.69992C29.7168 9.76659 29.7168 9.83325 29.7335 9.91659C29.7502 9.99992 29.7835 10.0833 29.7835 10.1833C29.7835 10.1999 29.8002 10.2166 29.8002 10.2333V15.1166H29.7835Z"
                                fill="#018979"
                              />
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
                    <div className="self-stretch justify-between items-center inline-block lg:inline-flex">
                      <div className="grow shrink basis-0 text-white text-base font-medium">
                        Overall Score
                      </div>
                      <div className="rounded justify-start items-center gap-2 flex">
                        <div className="w-[142px] h-3 relative">
                          <div className="w-[142px] h-3 left-0 top-0 absolute bg-gray-800 rounded" />
                          <div
                            className="h-3 left-0 top-0 absolute bg-emerald-600 rounded"
                            style={{
                              width: Math.round(averageOutOf10) * 10 + '%',
                            }}
                          />
                        </div>
                        <div className="text-white text-base font-medium">
                          {Math.round(averageOutOf10) || 0}/10
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch text-slate-200 text-base font-normal leading-7">
                      The dashboard contains a lot of information, which is
                      generally organized, but some text is small and may be
                      difficult to read, especially in dense tables.
                    </div>
                  </div>
                </li>
              )} */}
              <li
                key={i}
                className="col-span-1 p-4 bg-neutral-900 rounded-2xl border border-gray-900 justify-start items-center gap-4 inline-flex"
              >
                <div className="p-2 bg-white bg-opacity-10 rounded-xl justify-start items-start gap-2 flex">
                  <div className="w-10 h-10 justify-center items-center flex">
                    <div className="w-10 h-10 relative">
                      {i === 0 ? (
                        <svg
                          width="40"
                          height="41"
                          viewBox="0 0 40 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="vuesax/bold/book-square">
                            <g id="book-square">
                              <path
                                id="Vector"
                                d="M26.9835 3.83325H13.0168C6.95016 3.83325 3.3335 7.44992 3.3335 13.5166V27.4666C3.3335 33.5499 6.95016 37.1666 13.0168 37.1666H26.9668C33.0335 37.1666 36.6502 33.5499 36.6502 27.4833V13.5166C36.6668 7.44992 33.0502 3.83325 26.9835 3.83325ZM19.1668 29.2499C19.1668 29.8499 18.5668 30.2499 18.0168 30.0166C16.0002 29.1499 13.3668 28.3499 11.5335 28.1166L11.2168 28.0833C10.2002 27.9499 9.36683 26.9999 9.36683 25.9666V13.1333C9.36683 11.8499 10.4002 10.8999 11.6668 10.9999C13.7502 11.1666 16.8335 12.1666 18.7668 13.2666C19.0335 13.4166 19.1668 13.6999 19.1668 13.9833V29.2499ZM30.6335 25.9499C30.6335 26.9833 29.8002 27.9333 28.7835 28.0666L28.4335 28.0999C26.6168 28.3499 24.0002 29.1333 21.9835 29.9833C21.4335 30.2166 20.8335 29.8166 20.8335 29.2166V13.9666C20.8335 13.6666 20.9835 13.3833 21.2502 13.2333C23.1835 12.1499 26.2002 11.1833 28.2502 10.9999H28.3168C29.6002 10.9999 30.6335 12.0333 30.6335 13.3166V25.9499Z"
                                fill="url(#paint0_linear_95_203)"
                              />
                            </g>
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_95_203"
                              x1="23.9107"
                              y1="-4.99189"
                              x2="-9.41832"
                              y2="20.4839"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#A330FF" stopOpacity="0.7" />
                              <stop offset="0.393247" stopColor="#BC3DCB" />
                              <stop offset="1" stopColor="#E3507A" />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : i === 1 ? (
                        <svg
                          width="40"
                          height="41"
                          viewBox="0 0 40 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="vuesax/bold/colors-square">
                            <g id="colors-square">
                              <path
                                id="Vector"
                                d="M26.9835 3.83337H13.0168C6.95016 3.83337 3.3335 7.45004 3.3335 13.5167V27.4667C3.3335 33.55 6.95016 37.1667 13.0168 37.1667H26.9668C33.0335 37.1667 36.6502 33.55 36.6502 27.4834V13.5167C36.6668 7.45004 33.0502 3.83337 26.9835 3.83337ZM20.0002 10.5C23.3168 10.5 26.0002 13.1834 26.0002 16.5C26.0002 17.2834 25.8502 18.0334 25.5835 18.7167C24.9002 20.45 23.4168 21.8 21.5835 22.3C21.0835 22.4334 20.5502 22.5167 20.0002 22.5167C19.4502 22.5167 18.9168 22.45 18.4168 22.3C16.5835 21.8 15.1002 20.4667 14.4168 18.7167C14.1502 18.0334 14.0002 17.2834 14.0002 16.5C14.0002 13.1834 16.6835 10.5 20.0002 10.5ZM16.0002 30.5C12.6835 30.5 10.0002 27.8167 10.0002 24.5C10.0002 22.474 11.0151 20.6812 12.5474 19.5944C12.7958 19.4182 13.1332 19.5377 13.2674 19.8111C14.2099 21.7311 15.9519 23.1661 18.0168 23.7167C18.6502 23.9 19.3002 23.9834 20.0002 23.9834C20.482 23.9834 20.9389 23.9419 21.3827 23.8591C21.6779 23.804 21.9775 23.9952 21.9945 24.295C21.9981 24.3583 22.0002 24.4214 22.0002 24.4834C22.0002 26.25 21.2335 27.85 20.0002 28.95C18.9335 29.9167 17.5335 30.5 16.0002 30.5ZM24.0002 30.5C23.2595 30.5 22.5377 30.3677 21.8776 30.1171C21.5597 29.9965 21.5014 29.5902 21.7225 29.332C22.8615 28.0017 23.5002 26.2834 23.5002 24.5C23.5002 24.1667 23.4668 23.8167 23.4168 23.5C23.387 23.3113 23.4831 23.1261 23.6499 23.0329C24.9685 22.2969 26.053 21.1851 26.7186 19.8143C26.8519 19.5397 27.1896 19.4179 27.4393 19.5935C28.9847 20.6803 30.0002 22.4735 30.0002 24.5C30.0002 27.8167 27.3168 30.5 24.0002 30.5Z"
                                fill="url(#paint0_linear_95_71)"
                              />
                            </g>
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_95_71"
                              x1="11.6627"
                              y1="37.1667"
                              x2="44.986"
                              y2="20.5133"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#FFDB30" stopOpacity="0.82" />
                              <stop offset="0.393247" stopColor="#E27034" />
                              <stop
                                offset="1"
                                stopColor="#3EDEF6"
                                stopOpacity="0.73"
                              />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : i === 2 ? (
                        <svg
                          width="40"
                          height="41"
                          viewBox="0 0 40 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="vuesax/bold/health">
                            <g id="health">
                              <path
                                id="Vector"
                                d="M36.6668 13.5167V21.3334H29.8668C29.6668 21.3167 29.2335 21.0667 29.1335 20.8834L27.4002 17.6C26.7168 16.3 25.5335 15.5667 24.2668 15.6334C23.0002 15.7 21.9168 16.55 21.3668 17.9334L19.0668 23.7L18.7335 22.8334C17.9168 20.7167 15.5835 19.1167 13.2835 19.1167L3.3335 19.1667V13.5167C3.3335 7.45004 6.95016 3.83337 13.0168 3.83337H26.9835C33.0502 3.83337 36.6668 7.45004 36.6668 13.5167Z"
                                fill="url(#paint0_linear_95_29)"
                              />
                              <path
                                id="Vector_2"
                                d="M36.6668 27.4834V23.8334H29.8668C28.7502 23.8334 27.4335 23.0334 26.9168 22.05L25.1835 18.7667C24.7168 17.8834 24.0502 17.9334 23.6835 18.85L19.8502 28.5334C19.4335 29.6167 18.7335 29.6167 18.3002 28.5334L16.4002 23.7334C15.9502 22.5667 14.5502 21.6167 13.3002 21.6167L3.3335 21.6667V27.4834C3.3335 33.45 6.8335 37.05 12.7168 37.15C12.9002 37.1667 13.1002 37.1667 13.2835 37.1667H26.6168C26.8668 37.1667 27.1168 37.1667 27.3502 37.15C33.2002 37.0167 36.6668 33.4334 36.6668 27.4834Z"
                                fill="url(#paint1_linear_95_29)"
                              />
                              <path
                                id="Vector_3"
                                d="M3.3332 21.6666V27.1833C3.29987 26.65 3.2832 26.0833 3.2832 25.5V21.6666H3.3332Z"
                                fill="url(#paint2_linear_95_29)"
                              />
                            </g>
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_95_29"
                              x1="20.0002"
                              y1="3.83337"
                              x2="20.0002"
                              y2="23.7"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#ABEC79" />
                              <stop offset="1" stopColor="#17638E" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_95_29"
                              x1="20.0002"
                              y1="18.1324"
                              x2="20.0002"
                              y2="37.1667"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#ABEC79" />
                              <stop offset="1" stopColor="#17638E" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_95_29"
                              x1="3.3082"
                              y1="21.6666"
                              x2="3.3082"
                              y2="27.1833"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#ABEC79" />
                              <stop offset="1" stopColor="#17638E" />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : i === 3 ? (
                        <svg
                          width="40"
                          height="41"
                          viewBox="0 0 40 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="vuesax/bold/3dcube">
                            <g id="3dcube">
                              <path
                                id="Vector"
                                d="M32.2165 9.96663L21.7665 4.3333C20.6665 3.7333 19.3331 3.7333 18.2331 4.3333L7.78314 9.96663C7.01647 10.3833 6.5498 11.1833 6.5498 12.1C6.5498 13 7.01647 13.8166 7.78314 14.2333L18.2331 19.8666C18.7831 20.1666 19.3998 20.3166 19.9998 20.3166C20.5998 20.3166 21.2165 20.1666 21.7665 19.8666L32.2165 14.2333C32.9831 13.8166 33.4498 13.0166 33.4498 12.1C33.4498 11.1833 32.9831 10.3833 32.2165 9.96663Z"
                                fill="url(#paint0_linear_95_282)"
                              />
                              <path
                                id="Vector_2"
                                d="M16.5168 21.8166L6.7835 16.95C6.0335 16.5833 5.16683 16.6166 4.46683 17.05C3.75016 17.5 3.3335 18.25 3.3335 19.0833V28.2666C3.3335 29.85 4.21683 31.2833 5.6335 32L15.3502 36.8666C15.6835 37.0333 16.0502 37.1166 16.4168 37.1166C16.8502 37.1166 17.2835 37 17.6668 36.7666C18.3835 36.3333 18.8002 35.5666 18.8002 34.7333V25.55C18.8168 23.95 17.9335 22.5166 16.5168 21.8166Z"
                                fill="url(#paint1_linear_95_282)"
                              />
                              <path
                                id="Vector_3"
                                d="M35.5335 17.05C34.8169 16.6167 33.9502 16.5667 33.2169 16.95L23.5002 21.8167C22.0835 22.5333 21.2002 23.95 21.2002 25.55V34.7333C21.2002 35.5667 21.6169 36.3333 22.3335 36.7667C22.7169 37 23.1502 37.1167 23.5835 37.1167C23.9502 37.1167 24.3169 37.0333 24.6502 36.8667L34.3669 32C35.7835 31.2833 36.6669 29.8667 36.6669 28.2667V19.0833C36.6669 18.25 36.2502 17.5 35.5335 17.05Z"
                                fill="url(#paint2_linear_95_282)"
                              />
                            </g>
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_95_282"
                              x1="18.2513"
                              y1="1.97586"
                              x2="31.5255"
                              y2="12.974"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#CB6699" />
                              <stop offset="1" stopColor="#CD8067" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_95_282"
                              x1="10.0616"
                              y1="14.3278"
                              x2="21.2837"
                              y2="18.6304"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#CB6699" />
                              <stop offset="1" stopColor="#CD8067" />
                            </linearGradient>
                            <linearGradient
                              id="paint2_linear_95_282"
                              x1="27.9282"
                              y1="14.3203"
                              x2="39.1511"
                              y2="18.6218"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#CB6699" />
                              <stop offset="1" stopColor="#CD8067" />
                            </linearGradient>
                          </defs>
                        </svg>
                      ) : (
                        <svg
                          width="40"
                          height="41"
                          viewBox="0 0 40 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="vuesax/bold/emoji-normal">
                            <g id="emoji-normal">
                              <path
                                id="Vector"
                                d="M26.9835 3.83337H13.0168C6.95016 3.83337 3.3335 7.45004 3.3335 13.5167V27.4667C3.3335 33.55 6.95016 37.1667 13.0168 37.1667H26.9668C33.0335 37.1667 36.6502 33.55 36.6502 27.4834V13.5167C36.6668 7.45004 33.0502 3.83337 26.9835 3.83337ZM10.7835 13.3667C11.2668 12.8834 12.0668 12.8834 12.5502 13.3667C13.7335 14.55 15.6668 14.55 16.8502 13.3667C17.3335 12.8834 18.1335 12.8834 18.6168 13.3667C19.1002 13.85 19.1002 14.65 18.6168 15.1334C17.5335 16.2167 16.1168 16.75 14.7002 16.75C13.2835 16.75 11.8668 16.2167 10.7835 15.1334C10.3002 14.6334 10.3002 13.85 10.7835 13.3667ZM20.0002 31.8C15.5168 31.8 11.8668 28.15 11.8668 23.6667C11.8668 22.5 12.8168 21.5334 13.9835 21.5334H25.9835C27.1502 21.5334 28.1002 22.4834 28.1002 23.6667C28.1335 28.15 24.4835 31.8 20.0002 31.8ZM29.2168 15.1334C28.1335 16.2167 26.7168 16.75 25.3002 16.75C23.8835 16.75 22.4668 16.2167 21.3835 15.1334C20.9002 14.65 20.9002 13.85 21.3835 13.3667C21.8668 12.8834 22.6668 12.8834 23.1502 13.3667C24.3335 14.55 26.2668 14.55 27.4502 13.3667C27.9335 12.8834 28.7335 12.8834 29.2168 13.3667C29.7002 13.85 29.7002 14.6334 29.2168 15.1334Z"
                                fill="url(#paint0_linear_95_239)"
                              />
                            </g>
                          </g>
                          <defs>
                            <linearGradient
                              id="paint0_linear_95_239"
                              x1="3.42208"
                              y1="50.9581"
                              x2="36.6502"
                              y2="50.9581"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#7B61FF" />
                              <stop offset="1" stopColor="#CD8067" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
                  <div className="self-stretch justify-between items-center inline-block lg:inline-flex">
                    <div className="grow shrink basis-0 text-white text-base font-medium">
                      {item.Title}
                    </div>
                    <div className="rounded justify-start items-center gap-2 flex">
                      <div className="w-[142px] h-3 relative">
                        <div className="w-[142px] h-3 left-0 top-0 absolute bg-gray-800 rounded" />
                        <div
                          className="h-3 left-0 top-0 absolute bg-emerald-600 rounded"
                          style={{ width: Math.round(item.Score) * 10 + '%' }}
                        />
                      </div>
                      <div className="text-white text-base font-medium">
                        {item.Score}/10
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch text-slate-200 text-base font-normal leading-7">
                    {item.Description}
                  </div>
                </div>
              </li>
            </>
          ))}
        </ul>
      </div>

      {/* Good Feedback */}
      <div className="w-full px-4 py-6 bg-white bg-opacity-5 rounded-2xl flex-col justify-start items-start gap-8 inline-flex mt-16">
        <h3 className="w-[100%] text-center sm:text-left sm:w[50%] xl:w-[30%] text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[32px] font-extrabold">
          Good Feedback
        </h3>

        {positives.map((item: any, index: any) => (
          <div
            key={item.uniqueIdentifier || index} // Replace 'item.uniqueIdentifier' with a unique identifier from your item if available
            className="w-full h-auto p-4 rounded-2xl border border-gray-900 justify-start items-center gap-4 inline-flex"
          >
            <div className="w-[52px] h-[52px] p-2 bg-white bg-opacity-10 rounded-xl justify-center items-center gap-2 flex">
              <div className="text-slate-300 text-xl font-normal leading-9">
                {index + 1}
              </div>
            </div>
            <div className="grow shrink basis-0 flex-col justify-start items-start gap-4 inline-flex">
              <div className="self-stretch justify-between items-center inline-flex">
                <div className="grow shrink basis-0 text-white text-lg font-bold">
                  {item.Title}
                </div>
              </div>
              <div className="self-stretch text-slate-300 text-base font-normal leading-7">
                {item.Description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Areas for improvement */}
      <div className="mt-16 pb-16">
        <h3 className="w-[100%] text-center sm:text-left sm:w[50%] xl:w-[30%] text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[32px] font-extrabold mb-8">
          Areas for Improvement
        </h3>
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {improve.map((item: any, index: any) => (
            <li
              key={item.id || index}
              className={`col-span-1 p-4 bg-neutral-900 rounded-2xl border border-gray-900 justify-start items-center gap-4 inline-flex ${index === improve.length - 1 ? 'w-[204%]' : ''
                }`}
            >
              <div className="w-[52px] h-[52px] p-2 bg-white bg-opacity-10 rounded-xl justify-center items-center gap-2 flex">
                <div className="text-slate-300 text-xl font-normal leading-9">
                  {index + 1}
                </div>
              </div>
              <div className="grow shrink basis-0 flex-col justify-start items-start gap-2 inline-flex">
                <div className="self-stretch h-auto flex-col justify-start items-start flex">
                  <div className="self-stretch justify-between items-center inline-flex">
                    <div className="grow shrink basis-0 text-white text-lg font-bold">
                      {item.Title}
                    </div>
                  </div>
                  <div className="self-stretch text-slate-300 text-base font-normal leading-7">
                    {item.Description}
                  </div>
                </div>
                <div className="self-stretch justify-between items-start inline-flex">
                  <div className="grow shrink basis-0">
                    <span className="text-emerald-600 text-base font-normal leading-7">
                      Possible Solution:{' '}
                    </span>
                    <span className="text-slate-300 text-base font-normal leading-7">
                      {item.PossibleSolution}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Results;
