import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ThankYou = () => {
  const router = useRouter();

  const email = router.query.email;
  console.log(email);

  return (
    <>
      <section className="container max-w-[90rem] mx-auto text-gray-600 body-font bg-gray-950">
        <div className="flex justify-center mt-[27px]">
          <div className='w-full'>
            <div className='w-full'>
              <h1 className="w-full mx-auto text-center text-indigo-50 text-[54px] sm:text-[58px] md:text-[64px] font-bold leading-[76.80px]">
                Thank You!
              </h1>
              <p className="text-center mx-auto w-full sm:w-[450px] md:w-[627px] lg:w-[806px] text-slate-300 text-sm lg:text-lg font-normal leading-loose my-4">
                An email will be sent to {email} in the next few minutes with a
                link to your personalized Dashboard feedback 😎
              </p>
            </div>
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                src="https://player.vimeo.com/video/903867534?h=4b5012bfea&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                className="absolute top-0 left-0 w-full h-full"
                title="Review My Dashboard - How it works-4k"
              >
              </iframe>
            </div>
            <div className="flex justify-center gap-3 sm:gap-8 md:gap-16 pb-28">
              <div className="text-center flex flex-col items-center w-[80px] md:w-[100px] gap-4 md:gap-8">
                <div className="w-[71px] h-[67px] sm:h-[108px] sm:w-[147px]">
                  <div className="p-0 sm:p-10">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="vuesax/outline/document-upload">
                        <g id="document-upload">
                          <path
                            id="Vector"
                            d="M24 47.3332C22.9067 47.3332 22 46.4266 22 45.3332V34.1599L20.08 36.0799C19.3067 36.8532 18.0267 36.8532 17.2533 36.0799C16.48 35.3066 16.48 34.0266 17.2533 33.2532L22.5867 27.9199C23.1467 27.3599 24.0267 27.1732 24.7733 27.4932C25.52 27.7866 26 28.5332 26 29.3332V45.3332C26 46.4266 25.0933 47.3332 24 47.3332Z"
                            fill="url(#paint0_linear_75_268)"
                          />
                          <path
                            id="Vector_2"
                            d="M29.3335 36.6668C28.8268 36.6668 28.3202 36.4801 27.9202 36.0801L22.5868 30.7468C21.8135 29.9734 21.8135 28.6934 22.5868 27.9201C23.3602 27.1468 24.6402 27.1468 25.4135 27.9201L30.7468 33.2534C31.5202 34.0268 31.5202 35.3068 30.7468 36.0801C30.3468 36.4801 29.8402 36.6668 29.3335 36.6668Z"
                            fill="url(#paint1_linear_75_268)"
                          />
                          <path
                            id="Vector_3"
                            d="M40.0002 60.6666H24.0002C9.52016 60.6666 3.3335 54.4799 3.3335 39.9999V23.9999C3.3335 9.51992 9.52016 3.33325 24.0002 3.33325H37.3335C38.4268 3.33325 39.3335 4.23992 39.3335 5.33325C39.3335 6.42659 38.4268 7.33325 37.3335 7.33325H24.0002C11.7068 7.33325 7.3335 11.7066 7.3335 23.9999V39.9999C7.3335 52.2933 11.7068 56.6666 24.0002 56.6666H40.0002C52.2935 56.6666 56.6668 52.2933 56.6668 39.9999V26.6666C56.6668 25.5733 57.5735 24.6666 58.6668 24.6666C59.7602 24.6666 60.6668 25.5733 60.6668 26.6666V39.9999C60.6668 54.4799 54.4802 60.6666 40.0002 60.6666Z"
                            fill="url(#paint2_linear_75_268)"
                          />
                          <path
                            id="Vector_4"
                            d="M58.6668 28.6666H48.0002C38.8802 28.6666 35.3335 25.1199 35.3335 15.9999V5.33322C35.3335 4.53322 35.8135 3.78656 36.5602 3.49322C37.3068 3.17322 38.1602 3.35989 38.7468 3.91989L60.0802 25.2532C60.6402 25.8132 60.8268 26.6932 60.5068 27.4399C60.1868 28.1866 59.4668 28.6666 58.6668 28.6666ZM39.3335 10.1599V15.9999C39.3335 22.8799 41.1202 24.6666 48.0002 24.6666H53.8402L39.3335 10.1599Z"
                            fill="url(#paint3_linear_75_268)"
                          />
                        </g>
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_75_268"
                          x1="20.5006"
                          y1="27.3372"
                          x2="24.6948"
                          y2="27.5134"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_75_268"
                          x1="25.8313"
                          y1="27.3401"
                          x2="29.9962"
                          y2="27.715"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_75_268"
                          x1="26.8604"
                          y1="3.33326"
                          x2="52.4809"
                          y2="5.64098"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint3_linear_75_268"
                          x1="45.7275"
                          y1="3.33716"
                          x2="57.0464"
                          y2="4.3567"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="text-center text-white text-xl md:text-2xl font-bold leading-[31.20px]">
                  Upload
                </p>
                <p className="text-center text-stone-300 text-xs md:text-sm font-normal capitalize">
                  Drag & Drop
                  <br /> Dashboard
                  <br />
                  Screenshots
                </p>
              </div>
              <div className="text-center flex flex-col items-center w-[80px] md:w-[100px] gap-4 md:gap-8">
                <div className="w-[71px] h-[67px] sm:h-[108px] sm:w-[147px]">
                  <div className="p-0 sm:p-10">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="vuesax/outline/sms">
                        <g id="sms">
                          <path
                            id="Vector"
                            d="M45.3335 56.6666H18.6668C8.9335 56.6666 3.3335 51.0666 3.3335 41.3333V22.6666C3.3335 12.9333 8.9335 7.33325 18.6668 7.33325H45.3335C55.0668 7.33325 60.6668 12.9333 60.6668 22.6666V41.3333C60.6668 51.0666 55.0668 56.6666 45.3335 56.6666ZM18.6668 11.3333C11.0402 11.3333 7.3335 15.0399 7.3335 22.6666V41.3333C7.3335 48.9599 11.0402 52.6666 18.6668 52.6666H45.3335C52.9602 52.6666 56.6668 48.9599 56.6668 41.3333V22.6666C56.6668 15.0399 52.9602 11.3333 45.3335 11.3333H18.6668Z"
                            fill="url(#paint0_linear_75_44)"
                          />
                          <path
                            id="Vector_2"
                            d="M31.9992 34.3199C29.7592 34.3199 27.4926 33.6266 25.7593 32.2133L17.4126 25.5466C16.5592 24.8533 16.3993 23.5999 17.0926 22.7466C17.7859 21.8932 19.0393 21.7333 19.8926 22.4266L28.2392 29.0933C30.2659 30.7199 33.7059 30.7199 35.7326 29.0933L44.0792 22.4266C44.9326 21.7333 46.2126 21.8666 46.8792 22.7466C47.5726 23.5999 47.4393 24.8799 46.5593 25.5466L38.2126 32.2133C36.5059 33.6266 34.2392 34.3199 31.9992 34.3199Z"
                            fill="url(#paint1_linear_75_44)"
                          />
                        </g>
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_75_44"
                          x1="26.8604"
                          y1="7.33326"
                          x2="52.4088"
                          y2="10.0077"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_75_44"
                          x1="29.2413"
                          y1="21.9844"
                          x2="42.3953"
                          y2="24.9295"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="text-center text-white text-xl md:text-2xl font-bold leading-[31.20px]">
                  Email
                </p>
                <p className="text-center text-stone-300 text-xs md:text-sm font-normal capitalize">
                  Check Your
                  <br /> Email
                </p>
              </div>
              <div className="text-center flex flex-col items-center w-[80px] md:w-[100px] gap-4 md:gap-8">
                <div className="w-[71px] h-[67px] sm:h-[108px] sm:w-[147px]">
                  <div className="p-0 sm:p-10">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="vuesax/outline/link">
                        <g id="link">
                          <path
                            id="Vector"
                            d="M43.9998 48.6666H39.9731C38.8798 48.6666 37.9731 47.7599 37.9731 46.6666C37.9731 45.5733 38.8798 44.6666 39.9731 44.6666H43.9998C50.9865 44.6666 56.6665 38.9866 56.6665 31.9999C56.6665 25.0133 50.9865 19.3333 43.9998 19.3333H39.9998C38.9065 19.3333 37.9998 18.4266 37.9998 17.3333C37.9998 16.2399 38.8798 15.3333 39.9998 15.3333H43.9998C53.1998 15.3333 60.6665 22.7999 60.6665 31.9999C60.6665 41.1999 53.1998 48.6666 43.9998 48.6666Z"
                            fill="url(#paint0_linear_75_22)"
                          />
                          <path
                            id="Vector_2"
                            d="M24.0002 48.6666H20.0002C10.8002 48.6666 3.3335 41.1999 3.3335 31.9999C3.3335 22.7999 10.8002 15.3333 20.0002 15.3333H24.0002C25.0935 15.3333 26.0002 16.2399 26.0002 17.3333C26.0002 18.4266 25.0935 19.3333 24.0002 19.3333H20.0002C13.0135 19.3333 7.3335 25.0133 7.3335 31.9999C7.3335 38.9866 13.0135 44.6666 20.0002 44.6666H24.0002C25.0935 44.6666 26.0002 45.5733 26.0002 46.6666C26.0002 47.7599 25.0935 48.6666 24.0002 48.6666Z"
                            fill="url(#paint1_linear_75_22)"
                          />
                          <path
                            id="Vector_3"
                            d="M42.6668 34H21.3335C20.2402 34 19.3335 33.0933 19.3335 32C19.3335 30.9067 20.2402 30 21.3335 30H42.6668C43.7602 30 44.6668 30.9067 44.6668 32C44.6668 33.0933 43.7602 34 42.6668 34Z"
                            fill="url(#paint2_linear_75_22)"
                          />
                        </g>
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_75_22"
                          x1="47.2854"
                          y1="15.3333"
                          x2="57.4704"
                          y2="15.9578"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_75_22"
                          x1="12.6348"
                          y1="15.3333"
                          x2="22.8079"
                          y2="15.9564"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_75_22"
                          x1="29.7291"
                          y1="30"
                          x2="38.3395"
                          y2="34.9119"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="text-center text-white text-xl md:text-2xl font-bold leading-[31.20px]">
                  Link
                </p>
                <p className="text-center text-stone-300 text-xs md:text-sm font-normal capitalize">
                  Click the link In
                  <br /> your Email
                </p>
              </div>
              <div className="text-center flex flex-col items-center w-[80px] md:w-[100px] gap-4 md:gap-8">
                <div className="w-[71px] h-[67px] sm:h-[108px] sm:w-[147px]">
                  <div className="p-0 sm:p-10">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="vuesax/outline/status-up">
                        <g id="status-up">
                          <path
                            id="Vector"
                            d="M18.3467 50.3999C17.2533 50.3999 16.3467 49.4932 16.3467 48.3999V42.8799C16.3467 41.7865 17.2533 40.8799 18.3467 40.8799C19.44 40.8799 20.3467 41.7865 20.3467 42.8799V48.3999C20.3467 49.5199 19.44 50.3999 18.3467 50.3999Z"
                            fill="url(#paint0_linear_75_8)"
                          />
                          <path
                            id="Vector_2"
                            d="M32 50.3999C30.9067 50.3999 30 49.4933 30 48.3999V37.3333C30 36.2399 30.9067 35.3333 32 35.3333C33.0933 35.3333 34 36.2399 34 37.3333V48.3999C34 49.5199 33.0933 50.3999 32 50.3999Z"
                            fill="url(#paint1_linear_75_8)"
                          />
                          <path
                            id="Vector_3"
                            d="M45.6533 50.3999C44.56 50.3999 43.6533 49.4932 43.6533 48.3999V31.8132C43.6533 30.7199 44.56 29.8132 45.6533 29.8132C46.7467 29.8132 47.6533 30.7199 47.6533 31.8132V48.3999C47.6533 49.5199 46.7733 50.3999 45.6533 50.3999Z"
                            fill="url(#paint2_linear_75_8)"
                          />
                          <path
                            id="Vector_4"
                            d="M18.3469 35.1468C17.4402 35.1468 16.6402 34.5334 16.4002 33.6268C16.1335 32.5601 16.7735 31.4668 17.8669 31.2001C27.6802 28.7468 36.3202 23.3868 42.9069 15.7334L44.1335 14.2934C44.8535 13.4668 46.1069 13.3601 46.9602 14.0801C47.7869 14.8001 47.8935 16.0534 47.1735 16.9068L45.9469 18.3468C38.8269 26.6668 29.4402 32.4534 18.8269 35.0934C18.6669 35.1468 18.5069 35.1468 18.3469 35.1468Z"
                            fill="url(#paint3_linear_75_8)"
                          />
                          <path
                            id="Vector_5"
                            d="M45.6532 25.3868C44.5598 25.3868 43.6532 24.4801 43.6532 23.3868V17.6001H37.8398C36.7465 17.6001 35.8398 16.6934 35.8398 15.6001C35.8398 14.5068 36.7465 13.6001 37.8398 13.6001H45.6532C46.7465 13.6001 47.6532 14.5068 47.6532 15.6001V23.4134C47.6532 24.5068 46.7732 25.3868 45.6532 25.3868Z"
                            fill="url(#paint4_linear_75_8)"
                          />
                          <path
                            id="Vector_6"
                            d="M40.0002 60.6666H24.0002C9.52016 60.6666 3.3335 54.4799 3.3335 39.9999V23.9999C3.3335 9.51992 9.52016 3.33325 24.0002 3.33325H40.0002C54.4802 3.33325 60.6668 9.51992 60.6668 23.9999V39.9999C60.6668 54.4799 54.4802 60.6666 40.0002 60.6666ZM24.0002 7.33325C11.7068 7.33325 7.3335 11.7066 7.3335 23.9999V39.9999C7.3335 52.2933 11.7068 56.6666 24.0002 56.6666H40.0002C52.2935 56.6666 56.6668 52.2933 56.6668 39.9999V23.9999C56.6668 11.7066 52.2935 7.33325 40.0002 7.33325H24.0002Z"
                            fill="url(#paint5_linear_75_8)"
                          />
                        </g>
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_75_8"
                          x1="17.9881"
                          y1="40.8799"
                          x2="19.7875"
                          y2="40.948"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_75_8"
                          x1="31.6414"
                          y1="35.3333"
                          x2="33.4424"
                          y2="35.3763"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_75_8"
                          x1="45.2947"
                          y1="29.8132"
                          x2="47.0962"
                          y2="29.8448"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint3_linear_75_8"
                          x1="29.1893"
                          y1="13.6006"
                          x2="43.0581"
                          y2="15.4161"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint4_linear_75_8"
                          x1="40.6875"
                          y1="13.6001"
                          x2="45.9663"
                          y2="14.0767"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                        <linearGradient
                          id="paint5_linear_75_8"
                          x1="26.8604"
                          y1="3.33326"
                          x2="52.4809"
                          y2="5.64098"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#EBF1FF" />
                          <stop offset="1" stopColor="#B3C0DE" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="text-center text-white text-xl md:text-2xl font-bold leading-[31.20px]">
                  Report
                </p>
                <p className="text-center text-stone-300 text-xs md:text-sm font-normal capitalize">
                  View and
                  <br /> analyze report
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ThankYou;
