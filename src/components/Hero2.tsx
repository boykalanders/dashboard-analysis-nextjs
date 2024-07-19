import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import Spinner from './spinner/Spinner';
import Teams from './Teams';
import { supabase } from '@/client';
import TermsAndConditionCheck from './TermsAndConditionCheckbox';

const Hero2 = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log(acceptedFiles);

    const file = acceptedFiles[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result?.toString());
      };
      reader.readAsDataURL(file);
    } else {
      setImageSrc('');
      toast('Please upload an valid format of image', { type: 'error' });

    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [companySize, setCompanySize] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);


  const [imageSrc, setImageSrc] = useState<string | null | undefined>('');
  const [id, setId] = useState({ user: { id: '' } });
  const [createdAt, setCreatedAt] = useState('');
  const [token, setToken] = useState('');
  const [show, setShow] = useState('');


  useEffect(() => {
    const tokenData = localStorage.getItem('token');
    if (tokenData) {
      try {
        const parsedData = JSON.parse(tokenData);
        // Check if parsedData has the required structure
        if (parsedData && parsedData.user && parsedData.user.created_at) {
          setCreatedAt(parsedData.user.created_at);
          setToken(parsedData);
          setId(parsedData);
        }
      } catch (error) {
        console.error('Error parsing token data:', error);
        // Handle the error as needed (e.g., clear localStorage, redirect, etc.)
      }
    }
  }, []);

  const [userCount, setUserCount] = useState<number | null>(null);
  const [submissionCount, setSubmissionCount] = useState<number | null>(null);


  useEffect(() => {
    const fetchUserCount = async () => {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setUserCount(count);
      }

      // Fetch other table count
      const { count: resultCount, error: resultCountError } = await supabase
        .from('results')
        .select('*', { count: 'exact' });

      if (resultCountError) {
        console.error('Error fetching other table data:', resultCountError);
      } else {
        setSubmissionCount(resultCount);
      }

    };

    fetchUserCount();
  }, []);

  const displayText = () => {
    if (userCount === null || submissionCount === null) {
      return 'Loading...';
    }
    return `${userCount} Users, ${submissionCount} dashboards reviewed`;
  };

  const router = useRouter();

  const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onLastNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const onCompanySizeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompanySize(e.target.value);
  };

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // const tokenCount = () => {
  //   setCountToken(countToken + 1);
  //   console.log(countToken, 'countToken')
  // };

  const [termsChecked, setTermsChecked] = useState(false);

  const handleTermsChange = (checked: boolean | ((prevState: boolean) => boolean)) => {
    setTermsChecked(checked);
  };

  const addUserData = async (
    userName: any,
    userEmail: any,
    companySize: any,
    totalReqTokens: number,
    totalResTokens: number
  ) => {
    // check email already exists
    const { data: existingData, error: selectError } = await supabase
      .from('users')
      .select('token, total_request_tokens, total_response_tokens')
      .eq('email', email);

    if (selectError) {
      console.error('Error querying existing data:', selectError);
      return;
    }

    console.log(existingData, 'existingdata');

    let tokenCount = 1;

    if (existingData && existingData.length > 0) {
      // Email exists, retrieve current token
      const { data, error } = await supabase
        .from('users')
        .update({
          token: existingData[0].token + 1,
          total_request_tokens:
            existingData[0].total_request_tokens + totalReqTokens,
          total_response_tokens:
            existingData[0].total_response_tokens + totalResTokens,
        })
        .eq('email', email)
        .select();

      if (error) {
        console.log('cannot update data into users', error);
      }
    } else {
      const { data, error } = await supabase
        .from('users')
        .upsert([
          {
            name: userName,
            email: userEmail,
            companySize: companySize,
            token: tokenCount,
            total_request_tokens: totalReqTokens,
            total_response_tokens: totalResTokens,
          },
        ])
        .select();

      if (error) {
        console.log('cannot insert data into user_data', error);
        return;
      }
    }
  };

  function isTimeDifference12Hours(
    timeStr1: string | number | Date,
    timeStr2: string | number | Date
  ) {
    // Convert input time strings to Date objects
    const time1: any = new Date(timeStr1);
    const time2: any = new Date(timeStr2);

    // Calculate the difference in time in milliseconds
    const timeDifference = Math.abs(time1 - time2);
    console.log(timeDifference, 'timeDifference');

    // Define the threshold for 12 hours in milliseconds
    const twelveHours = 12 * 60 * 60 * 1000;
    console.log(twelveHours, 'twelveHours');

    // Check if the difference is exactly 12 hours
    const result = timeDifference > twelveHours;

    return result;
  }

  const onSubmitBtnClicked = async () => {
    if (
      name === '' ||
      lastName === '' ||
      companySize === '' ||
      !isValidEmail(email) ||
      imageSrc == null ||
      imageSrc == undefined ||
      imageSrc == ''
    ) {
      toast('Please fill up all form data', { type: 'error' });
      return;
    }
    if (!termsChecked) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setTimeout(() => {
      toast('An email will be sent in the next few minutes!', {
        type: 'success',
      });
      setIsLoading(false);
      router.push(`/thankyou?email=${email}`);
    }, 4000);

    setIsLoading(true);
    const base64String = imageSrc?.split(',')[1];

    // const userId = id.user.id;

    // const data = localStorage.getItem('token');
    // const parsedData = JSON.parse(data || '');
    // const userInfo = parsedData.user.user_metadata;

    const campaignResponse = await fetch('/api/active-campaign-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        userName: name + ' ' + lastName,
        companySize: companySize
      }),
    });


    if (!campaignResponse.ok) {
      throw new Error(`HTTP error! Status: ${campaignResponse.status}`);
    }

    const data = await campaignResponse.json();
    console.log('Success:', data);


    const processResponse = await fetch('/api/process-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64String,
        email: email,
        // userId: userId,
        userName: name + ' ' + lastName,
      }),
    });

    console.log(processResponse, 'openai-response');

    try {
      if (processResponse.ok) {
        const data = await processResponse.json();
        await addUserData(
          name + ' ' + lastName,
          email,
          companySize,
          data.data.reqTokens,
          data.data.resTokens
        );
        setIsLoading(false);
      } else {
        const errorData = await processResponse.json();
        console.log(errorData);
        toast('Error inside response of Open AI!', { type: 'error' });
        console.error('Failed to fetch API');
        setIsLoading(false); // Stop loading in case of error
      }
    } catch (error) {
      toast('Internal Server Error!', { type: 'error' });
      console.error('Error:', error);
      setIsLoading(false); // Stop loading in case of error
    }
  };

  const toggleIcons = (id: String) => {
    if (id === show) {
      return (
        <svg
          data-accordion-icon
          className="w-3 h-3 rotate-180 shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5 5 1 1 5"
          />
        </svg>
      );
    } else {
      return (
        <svg
          data-accordion-icon
          className="w-3 h-3 rotate-360 shrink-0"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5 5 1 1 5"
          />
        </svg>
      );
    }
  };

  return (
    <>
      <section className="container max-w-[90rem] mx-auto text-gray-600 body-font bg-gray-950">
        {isLoading && <Spinner />}
        <div className="w-full py-4 md:mb-20 items-center justify-center flex-col xl:flex-row flex xl:items-start xl:justify-around">
          <div className="w-[100%] xl:w-[50%] 2xl:w-auto rounded-lg overflow-hidden mb-10 lg:mb-0 lg:p-10">
            <div className="text-emerald-600 text-center xl:text-left text-[19px] sm:text-[28px] font-normal leading-loose mb-[24px]">
              Empower Your Teams & Clients.
            </div>
            <div className="w-[100%]">
              <h1 className="w-[100%] mx-auto xl:mx-0 2xl:w-[580px] text-center xl:text-left px-0 text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[25px] sm:text-[58px] 2xl:text-[63px] font-bold leading-[51.8px] sm:leading-[76.80px] mb-[26px] inline-block tracking-tight">
                Data Dashboard Feedback In Minutes
              </h1>
              <p className="w-[100%] mx-auto sm:w-[540px] 2xl:w-[632px] text-center px-0 xl:text-left text-slate-200 text-sm lg:text-lg font-normal leading-loose mb-[18px]">
                1. Upload Dashboard Screenshot
              </p>
              <p className="w-[100%] mx-auto sm:w-[540px] 2xl:w-[632px] text-center px-0 xl:text-left text-slate-200 text-sm lg:text-lg font-normal leading-loose mb-[18px]">
                2. Receive Detailed Dashboard Review
              </p>
              <p className="w-[100%] mx-auto sm:w-[540px] 2xl:w-[632px] text-center px-0 xl:text-left text-slate-200 text-sm lg:text-lg font-normal leading-loose mb-[18px]">
                3. Implement Feedback & Share
              </p>
              {/* <div className="flex flex-col items-center sm:items-start sm:flex-row justify-normal sm:justify-center xl:justify-start mb-[26px]">
                <img
                  src="/img/productTwo.png"
                  alt="product"
                  className="w-[170px] h-[73px] mr-0 sm:mr-[30px] lg:mr-[40px]"
                />
                <img
                  src="/img/productTwo.png"
                  alt="product"
                  className="w-[170px] h-[73px] mr-0 sm:mr-[30px] lg:mr-[40px]"
                />
              </div> */}
              <div className="flex flex-col sm:flex-row justify-center xl:justify-start items-center">
                {/* <div className="w-[160px] sm:w-[200px] h-14 mb-5 sm:mb-0">
                  <button className="w-[160px] sm:w-[200px] h-14 bg-emerald-600 rounded border-none flex justify-between items-center pl-8 sm:pl-16 pr-5">
                    <span className="text-center text-white text-base font-semibold leading-tight">
                      Start Free
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.0892 10.6095C13.2454 10.4533 13.3332 10.2413 13.3332 10.0204C13.3332 9.79939 13.2454 9.58746 13.0892 9.43119L8.375 4.71702C8.29813 4.63743 8.20617 4.57395 8.1045 4.53027C8.00283 4.4866 7.89348 4.46361 7.78284 4.46265C7.67219 4.46169 7.56245 4.48277 7.46004 4.52467C7.35763 4.56657 7.26458 4.62845 7.18634 4.7067C7.10809 4.78494 7.04622 4.87798 7.00432 4.9804C6.96242 5.08281 6.94133 5.19254 6.94229 5.30319C6.94325 5.41384 6.96624 5.52319 7.00992 5.62486C7.05359 5.72653 7.11708 5.81849 7.19667 5.89536L11.3217 10.0204L7.19667 14.1454C7.04487 14.3025 6.96087 14.513 6.96277 14.7315C6.96467 14.95 7.05231 15.159 7.20682 15.3135C7.36133 15.468 7.57034 15.5557 7.78883 15.5576C8.00733 15.5595 8.21783 15.4755 8.375 15.3237L13.0892 10.6095Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </div> */}
                <div className="w-[400px] h-[54px] relative ml-[40px] flex">
                  <div className="w-auto h-auto justify-start relative items-start inline-flex">
                    <div className="absolute w-12 h-12 bg-slate-400 rounded-[200px] border-2 border-zinc-950 justify-center items-center flex">
                      <img className="w-12 h-12" src="/img/12.png" />
                    </div>
                    <div className="absolute left-[35px] w-12 h-12 pr-[2.64px] pt-[3.60px] bg-red-300 rounded-[200px] border-2 border-zinc-950 justify-start items-center flex">
                      <img className="w-12 h-12" src="/img/11.png" />
                    </div>
                    <div className="absolute left-[69px] w-12 h-12 bg-orange-200 rounded-[200px] border-2 border-zinc-950 justify-center items-center flex">
                      <img className="w-12 h-12" src="/img/2.png" />
                    </div>
                  </div>
                  <div className="left-[130px] sm:left-[130px] top-[13px] absolute text-slate-300 text-base font-normal leading-7">
                    {displayText()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[100%] sm:w-[80%] lg:w-[70%] xl:w-[445px] h-[100%] flex-col justify-start items-start gap-6 inline-flex">
            <div className="w-full flex-col justify-start items-center gap-[20px] flex lg:pt-10">
              <div className="px-2.5 justify-start items-start gap-2.5 inline-flex">
                <h2 className="text-center text-white text-2xl font-bold leading-[31.20px]">
                  Get Started Now
                </h2>
              </div>
              <div className="w-full flex-col justify-start items-center gap-3 inline-flex">
                <div className="w-full justify-center items-start gap-2 inline-flex">
                  <div className="w-[50%] h-[41px] p-4 bg-neutral-900 rounded-xl border border-gray-600 justify-start items-center gap-1 flex">
                    <input
                      id="name"
                      type="name"
                      value={name}
                      onChange={onNameChanged}
                      placeholder="First Name"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 0,
                        width: '100%',
                      }}
                      className="text-gray-400 placeholder:text-gray-400 placeholder:text-base placeholder:font-medium placeholder:leading-normal placeholder:tracking-tight"
                    />
                  </div>
                  <div className="w-[50%] h-[41px] p-4 bg-neutral-900 rounded-xl border border-gray-600 justify-start items-center gap-1 flex">
                    <input
                      id="lastName"
                      type="lastName"
                      value={lastName}
                      onChange={onLastNameChanged}
                      placeholder="Last Name"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        outline: 0,
                        width: '100%',
                      }}
                      className="text-gray-400 placeholder:text-gray-400 placeholder:text-base placeholder:font-medium placeholder:leading-normal placeholder:tracking-tight"
                    />
                  </div>
                </div>
                <div className="w-[100%] h-[41px] p-4 bg-neutral-900 rounded-xl border border-gray-600 justify-start items-center gap-1 inline-flex">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={onEmailChanged}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 0,
                      width: '100%'
                    }}
                    className="text-gray-400 placeholder:text-gray-400 placeholder:text-base placeholder:font-medium placeholder:leading-normal placeholder:tracking-tight"
                    placeholder="Email"
                  />
                </div>
                <select
                  id="companySize"
                  name="companySize"
                  value={companySize}
                  onChange={onCompanySizeChanged}
                  className="w-[100%] h-[41px] pl-3 bg-neutral-900 rounded-xl border border-gray-600 justify-start items-center gap-1 inline-flex text-gray-400 text-base font-medium leading-normal tracking-tight"
                >
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value=""
                  >
                    Select Company Size
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="Just me"
                  >
                    Just me
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="2 to 5"
                  >
                    2 to 5
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="5 to 10"
                  >
                    5 to 10
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="11 to 25"
                  >
                    11 to 25
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="26 to 50"
                  >
                    26 to 50
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="51 to 200"
                  >
                    51 to 200
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="201 to 1,000"
                  >
                    201 to 1,000
                  </option>
                  <option
                    className="text-gray-400 text-base font-medium leading-normal tracking-tight"
                    value="1000+"
                  >
                    1000+
                  </option>
                </select>
                <div
                  {...getRootProps()}
                  className="w-[100%] h-[100%] p-8 bg-neutral-900 rounded-xl border border-dashed border-gray-600 flex-col justify-center items-center gap-5 inline-flex"
                >
                  <input {...getInputProps()} />
                  {imageSrc && (
                    <img
                      src={imageSrc}
                      alt="Uploaded"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  )}
                  {!imageSrc &&
                    (isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <>
                        <div className="w-[68.78px] h-[59.59px] relative">
                          <div className="w-[69px] h-[61px] left-[0.81px] top-[-0.81px] absolute">
                            <svg
                              width="69"
                              height="61"
                              viewBox="0 0 69 61"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M36.1368 14.9524L36.229 14.9799L36.233 14.9753C36.6707 15.0546 37.1049 14.7926 37.2335 14.3585C38.4051 10.4217 42.0962 7.67158 46.2086 7.67158C46.6955 7.67158 47.0903 7.2767 47.0903 6.78984C47.0903 6.30297 46.6955 5.90811 46.2086 5.90811C41.1545 5.90811 36.9073 9.27319 35.5435 13.8559C35.4044 14.3227 35.6703 14.8132 36.1368 14.9524Z"
                                fill="#018979"
                                stroke="#F9FFF9"
                                strokeWidth="0.3"
                                strokeLinecap="round"
                              />
                              <path
                                d="M56.4523 42.645H52.0619C51.6579 42.645 51.3302 42.3173 51.3302 41.9132C51.3302 41.5092 51.6579 41.1815 52.0619 41.1815H56.4523C62.5042 41.1815 67.4282 36.2574 67.4282 30.2055C67.4282 24.1536 62.5042 19.2296 56.4523 19.2296H56.3467C56.1345 19.2296 55.9327 19.1376 55.7937 18.9771C55.6547 18.8167 55.592 18.604 55.6223 18.3938C55.6876 17.9381 55.7206 17.4802 55.7206 17.0344C55.7206 11.7895 51.4529 7.52185 46.208 7.52185C44.1675 7.52185 42.2216 8.1595 40.5804 9.36632C40.2198 9.63132 39.7076 9.51372 39.499 9.11701C34.851 0.266242 22.7108 -0.922326 16.4167 6.77707C13.7653 10.0207 12.7235 14.2402 13.5583 18.3526C13.6503 18.8068 13.3027 19.2301 12.8412 19.2301H12.548C6.49612 19.2301 1.57205 24.1542 1.57205 30.2061C1.57205 36.258 6.49612 41.182 12.548 41.182H16.9383C17.3423 41.182 17.6701 41.5098 17.6701 41.9138C17.6701 42.3178 17.3424 42.6455 16.9383 42.6455H12.548C5.68902 42.6455 0.108521 37.065 0.108521 30.206C0.108521 23.5395 5.38007 18.0807 11.9736 17.7797C11.3542 13.5131 12.5386 9.20949 15.2836 5.85092C22.0223 -2.39306 34.9365 -1.46902 40.3956 7.72362C42.1372 6.63176 44.1301 6.05898 46.2078 6.05898C52.5623 6.05898 57.5977 11.4675 57.1571 17.7865C63.6899 18.1529 68.8914 23.5828 68.8914 30.2055C68.8914 37.065 63.3109 42.645 56.4519 42.645L56.4523 42.645Z"
                                fill="#018979"
                              />
                              <path
                                d="M15.9585 41.5C15.9585 51.67 24.2322 59.9435 34.402 59.9435C44.5719 59.9435 52.8455 51.6698 52.8455 41.5C52.8455 31.3301 44.5719 23.0565 34.402 23.0565C24.2321 23.0565 15.9585 31.3302 15.9585 41.5ZM17.7223 41.5C17.7223 32.3031 25.205 24.8203 34.402 24.8203C43.5989 24.8203 51.0817 32.303 51.0817 41.5C51.0817 50.6969 43.5989 58.1797 34.402 58.1797C25.2051 58.1797 17.7223 50.697 17.7223 41.5Z"
                                fill="#018979"
                                stroke="#F9FFF9"
                                strokeWidth="0.3"
                                strokeLinecap="round"
                              />
                              <path
                                d="M34.0507 48.8642C34.0507 49.2428 34.3578 49.5499 34.7364 49.5499C35.115 49.5499 35.4221 49.2433 35.4221 48.8642V34.9356C35.4221 34.557 35.115 34.2499 34.7364 34.2499C34.3578 34.2499 34.0507 34.557 34.0507 34.9356V48.8642Z"
                                fill="#018979"
                                stroke="#018979"
                                strokeWidth="0.3"
                                strokeLinecap="round"
                              />
                              <path
                                d="M34.7364 35.9067L30.9357 39.7074L34.7364 35.9067ZM34.7364 35.9067L38.5372 39.7075C38.6709 39.8412 38.8469 39.9083 39.022 39.9083L34.7364 35.9067ZM29.9658 39.7075C30.2336 39.9753 30.668 39.9754 30.9356 39.7075L39.022 39.9083C39.1969 39.9083 39.373 39.8418 39.5069 39.7074C39.7748 39.4395 39.7748 39.0055 39.5069 38.7377L35.2212 34.452C34.9534 34.1842 34.5191 34.1841 34.2515 34.452C34.2514 34.4521 34.2514 34.4521 34.2514 34.4521L29.9658 38.7377C29.6979 39.0056 29.6979 39.4396 29.9658 39.7075Z"
                                fill="#018979"
                                stroke="#018979"
                                strokeWidth="0.3"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-col justify-start items-center flex">
                          <div className="p-[5px] justify-start items-start gap-2.5 inline-flex">
                            <div className="text-center text-gray-400 text-base font-bold leading-normal">
                              Drag & drop files Here
                            </div>
                          </div>
                          <div className="p-[5px] justify-start items-start gap-2.5 inline-flex">
                            <div className="text-center text-neutral-400 text-xs font-normal leading-[18px]">
                              Supported formates: PNG (.png), JPEG (.jpeg and .jpg) or WEBP (.webp)
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
              </div>
              <TermsAndConditionCheck onCheck={handleTermsChange} />
              <button
                onClick={() => onSubmitBtnClicked()}
                className="w-[100%] h-14 bg-emerald-600 rounded border-none flex justify-center xl:justify-between gap-5 xl:gap-0 items-center px-0 xl:pl-32 xl:pr-14"
              >
                <span className="text-center text-white text-base font-semibold leading-tight">
                  Analyze My Dashboard
                </span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.0892 10.6095C13.2454 10.4533 13.3332 10.2413 13.3332 10.0204C13.3332 9.79939 13.2454 9.58746 13.0892 9.43119L8.375 4.71702C8.29813 4.63743 8.20617 4.57395 8.1045 4.53027C8.00283 4.4866 7.89348 4.46361 7.78284 4.46265C7.67219 4.46169 7.56245 4.48277 7.46004 4.52467C7.35763 4.56657 7.26458 4.62845 7.18634 4.7067C7.10809 4.78494 7.04622 4.87798 7.00432 4.9804C6.96242 5.08281 6.94133 5.19254 6.94229 5.30319C6.94325 5.41384 6.96624 5.52319 7.00992 5.62486C7.05359 5.72653 7.11708 5.81849 7.19667 5.89536L11.3217 10.0204L7.19667 14.1454C7.04487 14.3025 6.96087 14.513 6.96277 14.7315C6.96467 14.95 7.05231 15.159 7.20682 15.3135C7.36133 15.468 7.57034 15.5557 7.78883 15.5576C8.00733 15.5595 8.21783 15.4755 8.375 15.3237L13.0892 10.6095Z"
                    fill="white"
                  />
                </svg>
              </button>

              {/* <div className="mt-5">
              <label
                htmlFor="name"
                className="block mb-2 text-white text-lg font-normal"
              >
                NAME
              </label>
              <input
                id="name"
                type="name"
                value={name}
                onChange={onNameChanged}
                className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-2"
                placeholder="John doe"
              />
              <label
                htmlFor="email"
                className="block mb-2 mt-3 text-white text-lg font-normal"
              >
                EMAIL
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={onEmailChanged}
                className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-2"
                placeholder="email@hotmail.com"
              />

              <div className="mt-10 text-center">
                <div
                  {...getRootProps()}
                  className="w-auto h-[220px] bg-zinc-300 bg-opacity-0 rounded-[1px] border-2 border-white border-dashed flex   place-items-center items-center justify-center text-center text-white font-bold overflow-hidden"
                >
                  <input {...getInputProps()} />
                  {imageSrc && <img src={imageSrc} alt="Uploaded" />}
                  {!imageSrc &&
                    (isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <div className="text-[#FAC3F8] md:text-2xl text-[20px] font-medium">
                        DRAG + DROP YOUR FILE HERE
                      </div>
                    ))}
                </div>
                <div className="w-[75.06px] h-[78px] relative"></div>

                <div>
                  <button
                    // onClick={() => {
                    //   token
                    //     ? onSubmitBtnClicked()
                    //     : (router.push('/login'), toast('To Analyze, Please Login First!', { type: 'error' }));
                    // }}

                    // User can get the link without login
                    onClick={() => {
                      onSubmitBtnClicked();
                    }}
                    className="w-[210px] h-14 bg-[#C742C1] rounded-[10px] text-white text-lg font-bold "
                  >
                    ANALYZE NOW
                  </button>
                </div>
              </div>
            </div> */}
            </div>
          </div>
        </div>
        {/* supporters */}
        { /*Comment this out until we have real logos from real users.*/}
        {/* <div className="flex justify-center mb-20 md:mb-0">
          <div className="w-[40rem] md:w-[56rem] lg:w-[70rem] xl:w-[90rem] h-[50px] justify-start items-center gap-[12px] md:gap-[15px] lg:gap-[41px] xl:gap-[70px] mt-16 mb-20 flex flex-col md:flex-row md:inline-flex">
            <div className="w-px h-[50px] opacity-70 bg-gray-800" />
            <div className="w-[73.69px] h-[18px] relative">
              <svg
                width="75"
                height="18"
                viewBox="0 0 75 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="dribbble">
                  <path
                    id="Vector"
                    d="M23.0493 7.24226C23.8926 7.24226 24.5763 6.55835 24.5763 5.71483C24.5763 4.87117 23.8926 4.1874 23.0493 4.1874C22.2059 4.1874 21.5223 4.87117 21.5223 5.71483C21.5223 6.55835 22.2059 7.24226 23.0493 7.24226ZM73.4446 12.461C73.2123 12.2976 73.033 12.2706 72.8841 12.5878C70.3195 18.1425 65.9975 15.3706 66.4268 15.6146C67.3855 15.176 69.9068 13.154 69.5257 10.3619C69.2943 8.65557 67.8298 7.89869 66.2753 8.16969C63.5618 8.64276 62.5636 11.5695 63.0718 14.1607C63.1607 14.6057 63.3196 14.9727 63.4783 15.3322C60.412 17.8258 59.1942 13.1 59.0561 12.5352C59.0506 12.505 61.4237 10.527 62.0837 5.81342C62.7756 0.873337 61.1996 -0.0261681 59.5882 0.00189647C56.6061 0.0538519 55.8003 6.28433 56.8829 11.477C56.7922 11.5006 56.3702 11.7343 55.6922 11.7605C55.2043 10.2253 53.1196 8.87965 52.574 9.3982C51.2085 10.6954 52.9052 13.2314 54.099 13.4303C53.3819 17.8474 48.8969 16.7534 49.7317 11.2195C51.1923 8.50733 52.303 4.47452 52.1049 2.03996C52.0346 1.17802 51.3973 0.0231967 49.9561 0.0804772C47.1841 0.190145 46.8827 6.42235 47.2077 10.8456C47.1915 10.7367 47.0373 11.383 45.9013 11.7044C45.6326 10.2129 43.2311 8.71587 42.6658 9.43561C41.6076 10.7827 43.4415 13.1846 44.3102 13.3521C43.5931 17.7691 39.1082 16.6751 39.9431 11.1412C41.4036 8.42918 42.5143 4.39637 42.3161 1.96181C42.2458 1.09972 41.6087 -0.0550962 40.1673 0.00204039C37.3953 0.111852 37.0939 6.34405 37.4189 10.7673C37.4026 10.6566 37.2447 11.3243 36.0624 11.6403C36.0229 9.70532 33.6126 8.81805 33.0336 9.43547C32.0017 10.536 33.2699 12.7942 34.4432 13.3521C33.726 17.7691 29.2412 16.6751 30.076 11.1412C31.5366 8.42918 32.6473 4.39637 32.449 1.96181C32.3789 1.09972 31.7416 -0.0550962 30.3003 0.00204039C27.5284 0.111852 27.3053 6.65737 27.6303 11.0805C26.7172 14.9924 23.6553 19.8776 24.0531 10.0915C24.0924 9.40496 24.1353 9.14432 23.793 8.88728C23.5366 8.68752 22.9534 8.78365 22.6346 8.79157C22.2472 8.80711 22.15 9.03379 22.0644 9.37646C21.8649 10.2613 21.8291 11.1191 21.8006 12.2894C21.7819 12.8369 21.738 13.0924 21.5272 13.8389C21.3166 14.5852 20.1153 15.9495 19.4576 15.7214C18.5451 15.4076 18.8445 12.8317 19.0155 11.0619C19.1579 9.6633 18.7017 9.03523 17.5328 8.80683C16.8484 8.6642 16.4326 8.68608 15.72 8.46142C15.046 8.24899 14.8936 6.97414 13.4561 7.39899C12.6698 7.63157 13.1753 9.29745 12.9863 10.5321C12.0573 16.6057 10.1243 16.7726 9.22754 13.8222C13.2664 3.93036 10.3959 0.0306806 8.71561 0.0306806C6.96554 0.0306806 4.96504 1.23616 5.81216 8.94916C5.40025 8.82899 5.2736 8.76423 4.8227 8.76423C2.27257 8.76423 0.535156 10.8257 0.535156 13.3688C0.535156 15.9119 2.27271 17.9736 4.82284 17.9736C6.32826 17.9736 7.38521 17.2889 8.1857 16.2298C8.70799 16.9778 9.34397 17.9851 10.507 17.9398C13.9736 17.8048 14.9818 10.6938 15.1008 10.2971C15.4714 10.3543 15.822 10.4623 16.1642 10.5195C16.7344 10.6051 16.7759 10.8308 16.7629 11.4043C16.6118 16.2406 17.5043 17.934 19.5287 17.934C20.6566 17.934 21.6619 16.8258 22.3544 16.0334C22.8717 17.101 23.6959 17.9013 24.8016 17.9338C27.481 18.0005 28.5069 13.7299 28.4133 14.2919C28.3399 14.7329 29.2826 17.9098 32.041 17.9213C35.4578 17.9357 36.0929 14.1782 36.1687 13.5489C36.1782 13.4237 36.1823 13.4366 36.1687 13.5489L36.1661 13.587C37.2508 13.3852 37.8105 12.8036 37.8105 12.8036C37.8105 12.8036 38.6815 17.9798 41.9079 17.9215C45.2584 17.8607 45.8902 14.4642 45.9731 13.8019C45.984 13.6447 45.9905 13.6631 45.9731 13.8019C45.9727 13.8084 45.9722 13.8148 45.9718 13.8213C47.2603 13.3526 47.5993 12.8821 47.5993 12.8821C47.5993 12.8821 48.2915 17.9553 51.6967 17.9996C54.7311 18.0393 55.8557 14.9319 55.8623 13.6313C56.3741 13.6368 57.3208 13.3277 57.2987 13.3101C57.2987 13.3101 58.4102 17.7457 61.5141 17.9736C62.9715 18.0805 64.0647 17.1535 64.6879 16.7307C66.1524 17.9167 71.0291 19.4316 74.1085 14.2109C74.5431 13.4617 73.6086 12.5765 73.4446 12.461ZM4.69979 16.2514C3.21194 16.2514 2.25789 14.8757 2.25789 13.3923C2.25789 11.909 3.13365 10.5333 4.6215 10.5333C5.29102 10.5333 5.66349 10.607 6.18491 11.0605C6.27947 11.4331 6.54745 12.2926 6.67784 12.6829C6.85256 13.2052 7.06038 13.6498 7.26993 14.1336C6.97057 15.3747 5.98918 16.2514 4.69979 16.2514ZM8.32545 11.1041C8.26356 11.0055 8.27651 11.0661 8.20729 10.973C7.93456 10.2311 7.40896 8.57511 7.34808 6.69421C7.27928 4.56649 7.63391 2.07248 8.67935 2.07248C9.38772 2.07248 10.1406 7.12698 8.3253 11.1041H8.32545ZM29.2747 8.88713C29.1069 7.62452 29.0981 1.99577 30.4494 2.15078C31.1955 2.45301 29.9763 7.76441 29.2747 8.88713ZM39.1418 8.88713C38.974 7.62452 38.9652 1.99577 40.3164 2.15078C41.0625 2.45301 39.8434 7.76441 39.1418 8.88713ZM48.9305 8.96557C48.7626 7.70281 48.7539 2.07407 50.1051 2.22907C50.8512 2.5313 49.632 7.84284 48.9305 8.96557ZM59.7373 1.82134C60.9727 1.69325 60.9217 7.08827 58.442 10.4943C58.1222 9.2632 57.6318 2.24404 59.7373 1.8212V1.82134ZM64.9299 13.4303C64.5331 11.4259 65.5584 10.1095 66.6154 9.9651C66.9848 9.90609 67.5202 10.1454 67.627 10.5929C67.8026 11.4361 67.6015 12.6869 65.2359 14.2739C65.2394 14.2875 65.0184 13.8767 64.9301 13.4303H64.9299Z"
                    fill="#C2CDE7"
                  />
                </g>
              </svg>
            </div>
            <div className="w-px h-[50px] opacity-70 bg-gray-800" />
            <div className="w-[162.11px] h-[18px] relative">
              <svg
                width="163"
                height="18"
                viewBox="0 0 163 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="xpeng">
                  <path
                    id="Vector"
                    d="M0.427442 0.491314C0.784762 -0.223326 1.67806 -0.0446636 2.30337 0.312656C6.59121 2.09926 10.8791 4.06451 15.0776 5.94044C16.1495 6.20843 15.7029 7.54839 15.7029 8.35236C13.3803 8.35236 11.0577 8.35236 8.64581 8.35236C8.0205 8.35236 7.21652 8.44169 6.76987 7.90571C4.80461 6.11911 3.01801 4.15385 1.05275 2.27791C0.516773 1.83126 -0.108538 1.11662 0.427442 0.491314ZM28.2984 1.20596C29.281 0.759307 30.353 0.312654 31.425 0.0446637C32.1396 -0.133996 32.4076 0.580643 32.7649 1.02729C31.3356 3.17121 29.1917 4.77916 27.4944 6.65509C26.6905 7.36973 26.0652 8.44169 24.9039 8.35236C22.4026 8.35236 19.8121 8.35236 17.3108 8.35236C17.1322 7.63772 16.7748 6.38709 17.6681 5.94044C21.152 4.42183 24.7252 2.8139 28.2984 1.20596ZM49.291 1.56327C49.4696 1.11662 50.0056 1.29529 50.4523 1.20596C53.9361 1.20596 57.42 1.20596 60.9039 1.20596C63.1371 1.29529 65.0131 2.90322 65.3704 5.13647C65.7277 7.63771 63.9411 9.9603 61.4399 10.3176C61.3505 10.3176 61.2612 10.3176 61.2612 10.3176C58.3133 10.4069 55.2761 10.2283 52.3282 10.3176C51.7029 11.9256 52.4175 13.7122 51.9709 15.4094C51.2562 16.1241 50.2736 16.4814 49.291 16.66C49.291 13.8908 49.291 11.2109 49.291 8.44169C49.291 8.08437 49.3803 7.45906 49.9163 7.54839C53.4895 7.45906 57.0627 7.54839 60.7252 7.54839C61.6185 7.54839 62.5118 6.92307 62.6011 5.94044C62.6905 4.95781 62.0652 4.06452 61.0825 3.97519C60.9932 3.97519 60.9039 3.97519 60.8145 3.97519C57.0627 3.88586 53.3108 4.06452 49.559 3.88586C49.2016 3.17122 49.2016 2.36724 49.291 1.56327ZM81.3605 16.66C81.3605 11.4789 81.2711 6.3871 81.3605 1.20596C86.7203 1.20596 92.0801 1.20596 97.5292 1.20596C97.3505 2.18859 96.8146 3.17122 96.0999 3.88586C92.1694 4.06452 88.1495 3.88586 84.1297 3.97519C84.1297 5.13648 84.1297 6.3871 84.1297 7.54839C87.9709 7.54839 91.9014 7.54839 95.7426 7.54839C95.8319 8.44169 95.8319 9.42432 95.7426 10.3176C91.8121 10.3176 87.9709 10.3176 84.0404 10.3176V13.8908C87.7922 13.8908 91.5441 13.8908 95.2959 13.8908C96.7252 13.8015 96.9039 15.4988 97.6185 16.3921C97.2612 16.5707 96.8146 16.7494 96.4572 16.66C91.3654 16.66 86.2736 16.66 81.3605 16.66ZM113.43 1.29529C113.787 0.848635 114.234 1.47395 114.591 1.65261C118.79 4.86849 122.988 8.08437 127.187 11.3002C127.276 8.44169 127.097 5.58313 127.276 2.63524C127.991 1.9206 128.884 1.38461 129.867 1.02729C130.045 1.6526 130.045 2.27791 130.045 2.90322C130.045 7.36972 130.045 11.7469 130.045 16.1241C130.224 16.8387 129.331 16.5707 129.063 16.3027C124.775 12.9975 120.576 9.78163 116.288 6.47642C116.199 9.33498 116.378 12.2829 116.199 15.1414C115.485 15.9454 114.591 16.3921 113.519 16.5707C113.519 12.0149 113.519 7.36973 113.519 2.81389C113.43 2.36724 113.43 1.83127 113.43 1.29529ZM146.125 7.10174C147.018 3.61787 150.145 1.20596 153.718 1.20596C156.487 1.29529 159.256 1.11663 161.936 1.29529C161.847 2.27792 161.4 3.17122 160.686 3.88586C158.184 4.15385 155.683 3.79653 153.182 4.06452C151.038 4.33251 149.341 5.85112 148.805 7.90571C148.269 10.5856 149.966 13.1762 152.646 13.8015C152.824 13.8015 153.003 13.8908 153.182 13.8908C155.326 13.8908 157.47 13.8908 159.614 13.8908C159.614 12.7295 159.614 11.5682 159.614 10.3176C158.006 10.3176 156.398 10.3176 154.79 10.3176C154.075 10.4069 153.896 9.60297 153.539 9.15632C153.182 8.70967 152.824 8.1737 153.092 7.63772C155.683 7.45906 158.274 7.63772 160.864 7.54839C161.311 7.63772 161.936 7.36972 162.293 7.81637C162.383 10.7643 162.293 13.7122 162.293 16.5707C160.328 16.7494 158.363 16.5707 156.398 16.66C154.432 16.7494 152.199 16.928 150.323 15.9454C147.018 14.3375 145.231 10.6749 146.125 7.10174ZM6.59122 10.0496C7.1272 9.51364 7.84183 9.6923 8.55647 9.60297C10.8791 9.60297 13.291 9.60297 15.6135 9.60297C15.6135 10.3176 16.0602 11.5682 15.1669 11.9256C11.5044 13.5335 7.7525 15.2308 4.08997 16.8387C3.19667 17.2854 2.12471 17.6427 1.14208 17.9107C0.606101 17.732 0.159451 17.196 0.248781 16.66C0.606101 15.9454 1.14208 15.3201 1.76739 14.8734C3.37533 13.2655 4.98327 11.5682 6.59122 10.0496ZM17.2215 9.69231C19.7227 9.60298 22.1346 9.69231 24.6359 9.69231C25.1719 9.69231 25.7972 9.60297 26.1545 10.0496C27.9411 11.7469 29.6384 13.5335 31.425 15.2308C31.9609 15.6774 32.3183 16.2134 32.6756 16.8387C32.7649 17.464 32.3183 18 31.693 18C31.425 18 31.2463 18 31.0676 17.8213C26.6011 16.0347 22.224 13.9802 17.8468 12.0149C16.6855 11.6576 17.1322 10.4963 17.2215 9.69231Z"
                    fill="#C2CDE7"
                  />
                </g>
              </svg>
            </div>
            <div className="w-px h-[50px] opacity-70 bg-gray-800" />
            <div className="w-[153.15px] h-[18px] relative">
              <svg
                width="154"
                height="18"
                viewBox="0 0 154 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="veroxfloor" clipPath="url(#clip0_323_1594)">
                  <path
                    id="Vector"
                    d="M7.3452 17.7221L0.33313 0.277832H3.92505L9.0578 13.2916L14.2209 0.277832H17.8128L10.7653 17.7221H7.3452Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_2"
                    d="M20.9045 7.46682H31.4429C31.1195 6.25941 30.4729 5.26418 29.508 4.48618C28.543 3.70819 27.4417 3.31919 26.2091 3.31919C24.8855 3.31919 23.7488 3.70313 22.8091 4.47103C21.8695 5.23892 21.2329 6.2392 20.9096 7.47187M19.8436 15.3933C18.1108 13.6504 17.2469 11.5336 17.2469 9.04302C17.2469 6.55242 18.1007 4.42556 19.8133 2.65739C21.5209 0.889213 23.6225 0.00512695 26.108 0.00512695C28.5936 0.00512695 30.5487 0.80333 32.3168 2.39469C34.085 3.98604 35.0146 6.08764 35.1105 8.69443C35.1105 9.2754 35.0752 9.8008 35.0045 10.2656H20.9096C21.051 11.569 21.6017 12.6299 22.5666 13.4584C23.5315 14.2819 24.7137 14.6961 26.108 14.6961C27.8307 14.6961 29.2251 14.1151 30.2961 12.9532L34.378 12.9886C33.6101 14.4991 32.4936 15.7166 31.0286 16.6361C29.5635 17.5555 27.957 18.0152 26.2141 18.0152C23.7033 18.0152 21.5815 17.1412 19.8487 15.3983L19.8436 15.3933Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_3"
                    d="M37.4193 17.722V8.61848C37.4193 5.82477 38.0862 3.72822 39.4249 2.31874C40.7637 0.909249 42.5369 0.207031 44.7446 0.207031H45.0932V3.52109H44.7446C42.1378 3.52109 40.8395 5.21854 40.8395 8.61343V17.717H37.4193V17.722Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_4"
                    d="M55.323 3.31406C53.7165 3.31406 52.3828 3.85967 51.3118 4.95594C50.2408 6.04715 49.7053 7.39601 49.7053 9.00253C49.7053 10.609 50.2458 11.9276 51.3269 13.034C52.408 14.1403 53.7417 14.691 55.323 14.691C56.9042 14.691 58.2228 14.1454 59.2837 13.0491C60.3446 11.9579 60.87 10.609 60.87 9.00253C60.87 7.39601 60.3396 6.04715 59.2837 4.95594C58.2279 3.86472 56.9042 3.31406 55.323 3.31406ZM48.9222 2.63205C50.6803 0.873983 52.8021 0 55.2876 0C57.7732 0 59.9 0.879035 61.6531 2.63205C63.4111 4.39012 64.2851 6.51193 64.2851 8.99747C64.2851 11.483 63.4061 13.6099 61.6531 15.3629C59.895 17.121 57.7732 17.9949 55.2876 17.9949C52.8021 17.9949 50.6752 17.1159 48.9222 15.3629C47.1641 13.6048 46.2902 11.483 46.2902 8.99747C46.2902 6.51193 47.1692 4.38507 48.9222 2.63205Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_5"
                    d="M81.9928 17.7221H78.0877L73.5864 11.4779L69.0852 17.7221H65.1447L71.6313 8.65392L65.665 0.277832H69.5398L73.5511 5.86021L77.633 0.277832H81.5028L75.5415 8.65392L81.9928 17.7221Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_6"
                    d="M85.9582 17.6665V11.8265H82.8311V9.82592H85.9582V9.20453L86.0289 7.07767C86.2158 4.96091 86.8776 3.29883 88.0194 2.08637C89.1611 0.87896 90.6817 0.176742 92.5914 -0.00512695V2.12173C91.384 2.32886 90.3887 2.85426 89.6107 3.69288C88.8327 4.5315 88.3831 5.65808 88.2669 7.07767L88.1962 9.20453V9.82592H93.6977V11.8265H88.1962V17.6665H85.9632H85.9582Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_7"
                    d="M99.4468 0.282959H97.2139V17.7272H99.4468V0.282959Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_8"
                    d="M116.992 4.11732C115.699 2.79371 114.102 2.12686 112.193 2.12686C110.283 2.12686 108.677 2.78866 107.363 4.11732C106.05 5.44092 105.393 7.07269 105.393 9.00253C105.393 10.9324 106.055 12.5338 107.383 13.8675C108.707 15.2063 110.314 15.8731 112.198 15.8731C114.082 15.8731 115.674 15.2113 116.977 13.8827C118.28 12.5591 118.932 10.9273 118.932 8.99747C118.932 7.06764 118.285 5.44092 116.997 4.11227M105.797 2.63205C107.555 0.873983 109.677 0 112.163 0C114.648 0 116.775 0.879035 118.528 2.63205C120.286 4.39012 121.16 6.51193 121.16 8.99747C121.16 11.483 120.281 13.6099 118.528 15.3629C116.77 17.121 114.648 17.9949 112.163 17.9949C109.677 17.9949 107.55 17.1159 105.797 15.3629C104.039 13.6048 103.165 11.483 103.165 8.99747C103.165 6.51193 104.044 4.38507 105.797 2.63205Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_9"
                    d="M138.65 4.11732C137.356 2.79371 135.76 2.12686 133.85 2.12686C131.941 2.12686 130.334 2.78866 129.021 4.11732C127.707 5.44092 127.051 7.07269 127.051 9.00253C127.051 10.9324 127.712 12.5338 129.041 13.8675C130.365 15.2063 131.971 15.8731 133.855 15.8731C135.74 15.8731 137.331 15.2113 138.635 13.8827C139.938 12.5591 140.59 10.9273 140.59 8.99747C140.59 7.06764 139.943 5.44092 138.655 4.11227M127.455 2.63205C129.213 0.873983 131.335 0 133.82 0C136.306 0 138.433 0.879035 140.186 2.63205C141.944 4.39012 142.818 6.51193 142.818 8.99747C142.818 11.483 141.939 13.6099 140.186 15.3629C138.427 17.121 136.306 17.9949 133.82 17.9949C131.335 17.9949 129.208 17.1159 127.455 15.3629C125.697 13.6048 124.823 11.483 124.823 8.99747C124.823 6.51193 125.702 4.38507 127.455 2.63205Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_10"
                    d="M145.454 17.7223V8.649C145.454 5.83508 146.101 3.71832 147.389 2.29873C148.682 0.879144 150.42 0.171875 152.603 0.171875C152.835 0.171875 153.012 0.181979 153.128 0.207238V2.3341C153.012 2.30884 152.835 2.29873 152.603 2.29873C151.092 2.29873 149.895 2.83424 149.011 3.90525C148.127 4.97625 147.687 6.55751 147.687 8.649V17.7223H145.454Z"
                    fill="#C2CDE7"
                  />
                  <path
                    id="Vector_11"
                    d="M151.219 15.7822H151.598C151.78 15.7822 151.901 15.7569 151.967 15.7013C152.032 15.6458 152.068 15.575 152.068 15.4892C152.068 15.4336 152.053 15.3831 152.022 15.3376C151.992 15.2921 151.946 15.2568 151.891 15.2366C151.835 15.2163 151.729 15.2012 151.578 15.2012H151.224V15.7771L151.219 15.7822ZM150.906 16.8633V14.9385H151.568C151.795 14.9385 151.957 14.9587 152.058 14.9941C152.159 15.0294 152.239 15.09 152.3 15.181C152.361 15.2669 152.391 15.3629 152.391 15.4639C152.391 15.6053 152.34 15.7266 152.239 15.8327C152.138 15.9388 152.007 15.9943 151.84 16.0095C151.906 16.0398 151.962 16.0701 152.002 16.1105C152.078 16.1863 152.174 16.3126 152.285 16.4894L152.517 16.8683H152.138L151.967 16.5652C151.83 16.3278 151.724 16.1762 151.638 16.1156C151.583 16.0701 151.497 16.0499 151.391 16.0499H151.209V16.8683H150.896L150.906 16.8633ZM151.694 14.3828C151.441 14.3828 151.199 14.4485 150.956 14.5748C150.719 14.7011 150.532 14.888 150.395 15.1254C150.259 15.3629 150.193 15.6154 150.193 15.8731C150.193 16.1307 150.259 16.3783 150.39 16.6157C150.522 16.8532 150.709 17.035 150.946 17.1664C151.184 17.2977 151.431 17.3634 151.689 17.3634C151.946 17.3634 152.194 17.2977 152.431 17.1664C152.669 17.035 152.856 16.8481 152.982 16.6157C153.113 16.3783 153.179 16.1307 153.179 15.8731C153.179 15.6154 153.113 15.3629 152.977 15.1254C152.846 14.888 152.659 14.7011 152.416 14.5748C152.179 14.4485 151.931 14.3828 151.684 14.3828H151.694ZM151.694 14.0847C151.992 14.0847 152.29 14.1605 152.573 14.3171C152.861 14.4687 153.083 14.6909 153.24 14.9789C153.401 15.2669 153.477 15.5649 153.477 15.8781C153.477 16.1914 153.396 16.4844 153.24 16.7673C153.083 17.0502 152.861 17.2725 152.578 17.4291C152.295 17.5857 151.997 17.6665 151.689 17.6665C151.381 17.6665 151.083 17.5857 150.8 17.4291C150.517 17.2725 150.294 17.0502 150.138 16.7673C149.981 16.4844 149.9 16.1863 149.9 15.8781C149.9 15.57 149.981 15.2669 150.143 14.9789C150.305 14.6909 150.527 14.4687 150.815 14.3171C151.103 14.1605 151.396 14.0847 151.694 14.0847Z"
                    fill="#C2CDE7"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_323_1594">
                    <rect
                      width="153.149"
                      height="18"
                      fill="white"
                      transform="translate(0.33313)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="w-px h-[50px] opacity-70 bg-gray-800" />
            <div className="w-[96.98px] h-[18px] relative">
              <svg
                width="98"
                height="18"
                viewBox="0 0 98 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Behance " clipPath="url(#clip0_323_1607)">
                  <path
                    id="Vector"
                    d="M8.82869 0C9.65551 0 10.4187 0.064238 11.1184 0.254408C11.818 0.381612 12.3904 0.63602 12.8992 0.95403C13.408 1.27204 13.7896 1.71725 14.044 2.29031C14.2985 2.86209 14.4257 3.56235 14.4257 4.32557C14.4257 5.21536 14.2349 5.97922 13.7896 6.55164C13.408 7.12342 12.772 7.63224 12.0088 8.01385C13.09 8.33186 13.9168 8.90364 14.4257 9.6675C14.9345 10.4307 15.2525 11.3848 15.2525 12.466C15.2525 13.3558 15.0617 14.1196 14.7437 14.7557C14.4257 15.3917 13.9168 15.9641 13.3444 16.3457C12.772 16.728 12.0724 17.046 11.3092 17.2361C10.5459 17.4263 9.78272 17.5541 9.01949 17.5541H0.496826V0H8.82869ZM8.31987 7.12342C9.01949 7.12342 9.59191 6.93262 10.0371 6.61461C10.4823 6.2966 10.6731 5.72418 10.6731 5.02456C10.6731 4.64295 10.6095 4.26133 10.4823 4.00693C10.3551 3.75252 10.1643 3.56171 9.90992 3.37091C9.65551 3.2437 9.4011 3.1165 9.08309 3.0529C8.76508 2.98929 8.44707 2.98929 8.06546 2.98929H4.37655V7.12342H8.31987ZM8.51068 14.6285C8.89229 14.6285 9.2739 14.5649 9.59191 14.5019C9.90992 14.4377 10.2279 14.3104 10.4823 14.1196C10.7367 13.9288 10.9276 13.738 11.1184 13.42C11.2456 13.102 11.3728 12.7198 11.3728 12.2752C11.3728 11.3848 11.1184 10.7487 10.6095 10.3029C10.1007 9.92127 9.4011 9.7311 8.57428 9.7311H4.37655V14.6285H8.51068ZM20.7859 14.5649C21.2947 15.0737 22.0579 15.3281 23.0755 15.3281C23.7752 15.3281 24.4112 15.1373 24.92 14.8193C25.4288 14.437 25.7468 14.056 25.874 13.6738H28.9905C28.4817 15.2002 27.7185 16.2821 26.7008 16.9811C25.6832 17.6171 24.4748 17.9994 23.0119 17.9994C21.9943 17.9994 21.1039 17.8079 20.277 17.4899C19.4502 17.1719 18.8142 16.7273 18.2418 16.0913C17.6694 15.5189 17.2241 14.8193 16.9697 13.9918C16.6517 13.165 16.5245 12.2752 16.5245 11.2569C16.5245 10.3029 16.6517 9.41309 16.9697 8.58563C17.2878 7.75881 17.733 7.05982 18.3054 6.4238C18.8778 5.85138 19.5774 5.34257 20.3406 5.02456C21.1675 4.70655 21.9943 4.51574 23.0119 4.51574C24.0932 4.51574 25.0472 4.70655 25.874 5.15176C26.7008 5.59698 27.3369 6.10579 27.8457 6.86901C28.3545 7.56864 28.7361 8.39483 28.9905 9.28589C29.1177 10.1763 29.1813 11.0667 29.1177 12.0844H19.8954C19.8954 13.102 20.277 14.056 20.7859 14.5649ZM24.7928 7.88665C24.3476 7.44143 23.6479 7.18702 22.8211 7.18702C22.2487 7.18702 21.8035 7.31359 21.4219 7.50503C21.0403 7.69584 20.7859 7.94961 20.5315 8.20466C20.277 8.4597 20.1498 8.77707 20.0862 9.09508C20.0226 9.41309 19.959 9.66687 19.959 9.92191H25.6832C25.556 8.96788 25.238 8.33186 24.7928 7.88665ZM34.0787 0V6.61461H34.1423C34.5875 5.85138 35.1599 5.34257 35.8595 5.02456C36.5592 4.70655 37.1952 4.51574 37.8948 4.51574C38.8488 4.51574 39.612 4.64294 40.1845 4.89735C40.7569 5.15176 41.2657 5.53337 41.5837 5.97859C41.9017 6.4238 42.1561 6.99622 42.2833 7.63224C42.4105 8.26826 42.4741 8.96852 42.4741 9.79471V17.6178H38.976V10.4307C38.976 9.34949 38.7852 8.58627 38.4672 8.07745C38.1492 7.56864 37.5768 7.31423 36.75 7.31423C35.7959 7.31423 35.0963 7.63224 34.7147 8.14169C34.2695 8.71347 34.0787 9.6675 34.0787 10.9395V17.6178H30.5806V0H34.0787ZM45.0182 6.74181C45.3998 6.16939 45.845 5.78778 46.4175 5.40553C46.9899 5.08752 47.6259 4.83375 48.3255 4.70591C49.0251 4.57871 49.7241 4.51511 50.4244 4.51511C51.0604 4.51511 51.6964 4.57871 52.3967 4.64231C53.0327 4.70591 53.6687 4.89608 54.1769 5.15112C54.7493 5.4049 55.1309 5.78714 55.5132 6.23236C55.8306 6.67821 56.0214 7.31423 56.0214 8.07745V14.7557C56.0214 15.3281 56.085 15.9005 56.1486 16.41C56.2128 16.9188 56.4023 17.364 56.5938 17.6178H53.0321C52.9042 17.4905 52.8406 17.2361 52.7777 17.046C52.7141 16.8545 52.7141 16.6008 52.7141 16.41C52.1416 16.9817 51.5056 17.364 50.7424 17.6178C49.9792 17.8722 49.216 17.9358 48.4527 17.9358C47.8167 17.9358 47.3079 17.8722 46.7355 17.682C46.2267 17.5548 45.7814 17.2997 45.3362 16.9817C44.9546 16.6637 44.6366 16.2821 44.3822 15.7739C44.1914 15.2645 44.0642 14.7557 44.0642 14.056C44.0642 13.3558 44.1914 12.7198 44.4458 12.2752C44.7002 11.83 45.0182 11.4484 45.3998 11.1303C45.7814 10.8766 46.2903 10.6215 46.7991 10.4943C47.3079 10.3678 47.8167 10.2406 48.3891 10.1763L49.9156 9.98551C50.4244 9.92191 50.8696 9.85831 51.2512 9.79471C51.6328 9.6675 51.9508 9.5403 52.2052 9.34949C52.4597 9.15869 52.5233 8.90428 52.5233 8.52267C52.5233 8.14105 52.4597 7.82304 52.3324 7.63224C52.2052 7.44143 52.0144 7.25063 51.8236 7.12342C51.6322 6.99622 51.3784 6.93262 51.124 6.86965C50.8696 6.80541 50.5516 6.80541 50.2336 6.80541C49.534 6.80541 49.0251 6.93262 48.6435 7.25063C48.2619 7.56864 48.0075 8.07745 47.9439 8.71347H44.4458C44.4458 7.95025 44.7002 7.25063 45.0182 6.74181ZM51.9502 11.7028C51.76 11.7664 51.5056 11.83 51.2506 11.8936C50.9962 11.9578 50.7418 11.9578 50.4238 12.0208C50.17 12.0844 49.852 12.0844 49.5969 12.148L48.8337 12.3388C48.5793 12.4024 48.3249 12.5296 48.1977 12.6568C48.0069 12.784 47.8797 12.9748 47.7525 13.1656C47.5623 13.42 47.5623 13.6744 47.5623 13.9924C47.5623 14.3104 47.6259 14.5649 47.7531 14.7557C47.8803 14.9465 48.0075 15.1379 48.1983 15.2645C48.3891 15.3917 48.6435 15.4559 48.8979 15.5189C49.1523 15.5819 49.4061 15.5825 49.7241 15.5825C50.4244 15.5825 50.9326 15.4559 51.3142 15.2645C51.6964 15.0107 51.9502 14.7557 52.1416 14.4377C52.3324 14.1196 52.4596 13.8016 52.4596 13.4836C52.5233 13.1656 52.5233 12.9118 52.5233 12.7204V11.3848C52.3324 11.512 52.1416 11.6398 51.9502 11.7028ZM61.301 4.83375V6.61461H61.3646C61.8091 5.85138 62.3822 5.34257 63.0812 5.02456C63.7814 4.70655 64.5447 4.51574 65.2437 4.51574C66.1977 4.51574 66.9609 4.64294 67.5333 4.89735C68.1693 5.15176 68.6152 5.53337 68.9332 5.97859C69.2512 6.4238 69.505 6.99622 69.6958 7.63224C69.823 8.26826 69.8872 8.96852 69.8872 9.79471V17.6178H66.3891V10.4307C66.3891 9.34949 66.1977 8.58627 65.8797 8.07745C65.5617 7.56864 64.9892 7.25063 64.0988 7.25063C63.1448 7.25063 62.4445 7.63224 61.9999 8.20466C61.5547 8.77707 61.3639 9.7311 61.3639 11.0031V17.6814H57.8658V4.83375H61.301ZM77.709 7.12342C77.1372 7.12342 76.6914 7.25063 76.3104 7.50567C75.9288 7.75944 75.6108 8.07745 75.3564 8.5233C75.102 8.90491 74.9748 9.35013 74.8469 9.85894C74.7203 10.3684 74.7203 10.813 74.7203 11.3224C74.7203 11.767 74.784 12.2765 74.8469 12.721C74.9748 13.2305 75.1013 13.6115 75.3564 13.9931C75.6108 14.3753 75.8652 14.6933 76.2468 14.9471C76.6284 15.2015 77.073 15.3294 77.6454 15.3294C78.4729 15.3294 79.1089 15.0749 79.6171 14.6291C80.0629 14.1845 80.3809 13.5485 80.4445 12.721H83.8154C83.5617 14.4383 82.9256 15.7103 81.8431 16.6014C80.7625 17.4912 79.3633 17.937 77.6454 17.937C76.6914 17.937 75.8009 17.7462 75.0377 17.4282C74.2103 17.1102 73.5742 16.665 73.0025 16.0926C72.4307 15.5202 71.9842 14.8205 71.6662 14.0573C71.3482 13.2305 71.2216 12.403 71.2216 11.449C71.2216 10.4314 71.3482 9.54093 71.6662 8.71411C71.9842 7.88728 72.3664 7.12406 72.9382 6.48804C73.5106 5.85202 74.2103 5.40681 74.9741 5.02519C75.8003 4.70718 76.6907 4.51638 77.7084 4.51638C78.4722 4.51638 79.1718 4.64358 79.8708 4.83439C80.5698 5.02519 81.2065 5.3432 81.7153 5.72418C82.2877 6.10643 82.7329 6.61461 83.0509 7.25063C83.3689 7.82304 83.5604 8.58627 83.6234 9.41309H80.1888C80.0635 7.88665 79.2361 7.12342 77.709 7.12342ZM19.1958 1.20844H26.3192V2.92569H19.1958V1.20844ZM89.0944 14.5649C89.6039 15.0737 90.43 15.3281 91.3841 15.3281C92.0843 15.3281 92.7203 15.1373 93.2285 14.8193C93.738 14.437 94.056 14.056 94.1826 13.6738H97.2361C96.7266 15.2002 95.9641 16.2821 94.9458 16.9811C93.9275 17.6171 92.7197 17.9994 91.2569 17.9994C90.2392 17.9994 89.3488 17.8079 88.5213 17.4899C87.7385 17.198 87.0397 16.7177 86.4867 16.0913C85.9143 15.5189 85.4691 14.8193 85.2147 13.9918C84.8967 13.165 84.7695 12.2752 84.7695 11.2569C84.7695 10.3029 84.8967 9.41309 85.2147 8.58563C85.521 7.78796 85.974 7.05471 86.5503 6.4238C87.1227 5.85138 87.8224 5.34257 88.5856 5.02456C89.4124 4.70655 90.3028 4.51574 91.2569 4.51574C92.3375 4.51574 93.2915 4.70655 94.0554 5.15176C94.8815 5.59698 95.5176 6.10579 96.027 6.86901C96.5358 7.56864 96.9174 8.39483 97.1719 9.28589C97.4256 10.1757 97.4899 11.1297 97.4256 12.148H88.2033C88.2033 13.102 88.5856 14.056 89.0944 14.5649ZM93.1649 7.88665C92.7197 7.44143 92.0195 7.18702 91.1933 7.18702C90.6208 7.18702 90.175 7.31359 89.7934 7.50503C89.4118 7.69584 89.0938 7.94961 88.9036 8.20466C88.7134 8.4597 88.5213 8.77707 88.4584 9.09508C88.3954 9.41309 88.3318 9.66687 88.3318 9.92191H94.056C93.8645 8.96788 93.5465 8.33186 93.1649 7.88665Z"
                    fill="#C2CDE7"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_323_1607">
                    <rect
                      width="96.9828"
                      height="18"
                      fill="white"
                      transform="translate(0.482178)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="w-px h-[50px] opacity-70 bg-gray-800" />
            <div className="w-[123px] h-[19px] relative">
              <svg
                width="124"
                height="20"
                viewBox="0 0 124 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="surveymonkey">
                  <g id="Group 35">
                    <g id="&#60;Group&#62;">
                      <path
                        id="&#60;Compound Path&#62;"
                        d="M30.2568 14.2763L31.2357 13.1121C32.1219 13.8795 33.0058 14.3143 34.1557 14.3143C35.1607 14.3143 35.7951 13.851 35.7951 13.1501V13.1239C35.7951 12.4634 35.4245 12.107 33.7067 11.6984C31.737 11.2232 30.618 10.6411 30.618 8.93517V8.90904C30.618 7.32429 31.939 6.22662 33.778 6.22662C35 6.20211 36.1906 6.61499 37.1351 7.39082L36.2632 8.63343C35.4316 8.01331 34.6 7.68306 33.7518 7.68306C32.8015 7.68306 32.2455 8.1725 32.2455 8.78074V8.80687C32.2455 9.51965 32.6684 9.83803 34.4385 10.2609C36.3939 10.7361 37.4131 11.4489 37.4131 12.9695V12.9956C37.4131 14.7277 36.0517 15.7588 34.1082 15.7588C32.6843 15.7628 31.3105 15.234 30.2568 14.2763Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_2"
                        d="M38.4871 13.0888V8.64819H40.0861V12.6136C40.0861 13.697 40.6278 14.3195 41.5805 14.3195C42.5333 14.3195 43.1534 13.6709 43.1534 12.5851V8.64819H44.7524V15.6263H43.1534V14.9135C42.8761 15.2095 42.5367 15.4406 42.1596 15.5901C41.7826 15.7396 41.3771 15.8039 40.9723 15.7784C39.3994 15.7712 38.4871 14.7068 38.4871 13.0888Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_3"
                        d="M46.4629 8.6475H48.0619V9.81171C48.4967 8.7663 49.3045 8.46218 50.5329 8.51683V9.94238H50.4402C49.0384 9.94238 48.0643 10.8785 48.0643 12.9788V15.6256H46.4653L46.4629 8.6475Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_4"
                        d="M51.1035 8.64819H52.8213L54.6983 13.5046L56.599 8.64819H58.2764L55.4253 15.6809H53.9855L51.1035 8.64819Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_5"
                        d="M58.2783 12.1623V12.1361C58.2783 10.1404 59.7039 8.50098 61.6878 8.50098C63.9093 8.50098 65.0331 10.2449 65.0331 12.2549C65.0331 12.3999 65.0188 12.5448 65.0069 12.704H59.8773C60.0484 13.8397 60.8562 14.4764 61.8874 14.4764C62.2451 14.4794 62.5994 14.4066 62.927 14.2629C63.2546 14.1192 63.548 13.9077 63.7881 13.6425L64.7147 14.4693C64.3723 14.8921 63.9368 15.23 63.4422 15.4566C62.9476 15.6833 62.4074 15.7926 61.8636 15.7761C59.8393 15.7832 58.2783 14.3172 58.2783 12.1623ZM63.446 11.6467C63.3414 10.6156 62.7332 9.81011 61.6759 9.81011C60.697 9.81011 60.0127 10.5633 59.8654 11.6467H63.446Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_6"
                        d="M73.5078 6.37427H75.2399L78.0553 11.0929L80.8708 6.37427H82.5934V15.6261H80.9777V8.99016L78.0553 13.6969H78.0031L75.1092 9.0163V15.6261H73.5102L73.5078 6.37427Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_7"
                        d="M83.7481 12.1762V12.1501C83.7446 11.1633 84.1333 10.2155 84.8286 9.51529C85.5239 8.81507 86.4689 8.41975 87.4557 8.41628C88.4425 8.41282 89.3903 8.80149 90.0905 9.49681C90.7907 10.1921 91.186 11.1371 91.1895 12.1239V12.1501C91.1877 12.6358 91.089 13.1163 90.8992 13.5634C90.7093 14.0105 90.4321 14.4152 90.0838 14.7538C89.7355 15.0923 89.3231 15.358 88.8708 15.5351C88.4185 15.7122 87.9354 15.7972 87.4498 15.7852C86.9681 15.7976 86.4888 15.7134 86.0402 15.5376C85.5916 15.3617 85.1827 15.0979 84.8377 14.7615C84.4927 14.4251 84.2185 14.0231 84.0314 13.579C83.8442 13.135 83.7479 12.658 83.7481 12.1762ZM89.5905 12.1762V12.1501C89.5905 10.9217 88.7043 9.90242 87.4521 9.90242C86.2 9.90242 85.3494 10.9074 85.3494 12.1239V12.1501C85.3494 13.3665 86.2357 14.3977 87.4878 14.3977C88.7708 14.3977 89.5905 13.3784 89.5905 12.1762Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_8"
                        d="M100.135 5.97754H101.734V11.7392L104.628 8.65046H106.572L103.796 11.5016L106.664 15.6381H104.813L102.711 12.6254L101.732 13.6423V15.6381H100.133L100.135 5.97754Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_9"
                        d="M106.536 12.1623V12.1361C106.536 10.1404 107.962 8.50098 109.946 8.50098C112.167 8.50098 113.291 10.2449 113.291 12.2549C113.291 12.3999 113.277 12.5448 113.265 12.704H108.135C108.306 13.8397 109.114 14.4764 110.145 14.4764C110.503 14.4796 110.857 14.4069 111.185 14.2631C111.513 14.1194 111.806 13.9078 112.046 13.6425L112.973 14.4693C112.63 14.8921 112.195 15.23 111.7 15.4566C111.205 15.6833 110.665 15.7926 110.121 15.7761C108.095 15.7832 106.536 14.3172 106.536 12.1623ZM111.704 11.6467C111.599 10.6156 110.991 9.81011 109.934 9.81011C108.955 9.81011 108.271 10.5633 108.123 11.6467H111.704Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Path&#62;"
                        d="M70.6503 8.64819L68.7186 13.4072L66.8013 8.64819H65.1357L67.8847 15.4647L66.4496 19.0001H68.1151L72.3158 8.64819H70.6503Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_10"
                        d="M122.35 8.76722C122.184 8.76726 122.02 8.80979 121.875 8.89077C121.723 8.97185 121.598 9.09471 121.514 9.24478C121.433 9.39013 121.389 9.5534 121.386 9.71997C121.386 9.88657 121.429 10.0503 121.512 10.1952C121.594 10.3446 121.718 10.4674 121.868 10.5492C122.012 10.6326 122.176 10.6765 122.343 10.6765C122.51 10.6765 122.674 10.6326 122.818 10.5492C122.968 10.4671 123.09 10.3443 123.172 10.1952C123.254 10.0501 123.297 9.88647 123.297 9.71997C123.297 9.55347 123.254 9.38979 123.172 9.24478C123.09 9.09421 122.965 8.97111 122.814 8.89077C122.668 8.81027 122.505 8.76778 122.338 8.76722M122.338 8.57715C122.536 8.57851 122.73 8.63002 122.902 8.72683C123.084 8.82191 123.233 8.96915 123.332 9.14975C123.433 9.32368 123.486 9.52122 123.486 9.72234C123.486 9.92347 123.433 10.121 123.332 10.2949C123.233 10.474 123.085 10.6214 122.906 10.7202C122.732 10.8185 122.536 10.8701 122.336 10.8699C122.136 10.8691 121.939 10.8176 121.763 10.7202C121.584 10.6216 121.437 10.4741 121.338 10.2949C121.241 10.1216 121.189 9.92606 121.188 9.7271C121.188 9.52513 121.241 9.32668 121.343 9.15212C121.441 8.9723 121.59 8.82524 121.771 8.72921C121.944 8.63296 122.138 8.58151 122.336 8.57952"
                        fill="#C2CDE7"
                      />
                      <g id="&#60;Group&#62;_2">
                        <path
                          id="&#60;Compound Path&#62;_11"
                          d="M121.863 9.0899H122.436C122.572 9.08242 122.705 9.1285 122.807 9.2182C122.878 9.29304 122.916 9.39302 122.914 9.49618C122.917 9.5865 122.888 9.67503 122.832 9.74627C122.777 9.81751 122.698 9.86692 122.609 9.88583L122.956 10.361H122.688L122.372 9.91197H122.089V10.361H121.852L121.863 9.0899ZM122.419 9.71714C122.581 9.71714 122.683 9.63161 122.683 9.50331C122.683 9.3655 122.583 9.28947 122.417 9.28947H122.089V9.71714H122.419Z"
                          fill="#C2CDE7"
                        />
                      </g>
                      <path
                        id="&#60;Path&#62;_2"
                        d="M118.907 8.64819L116.975 13.4072L115.056 8.64819H113.393L116.142 15.4647L114.706 19.0001H116.372L120.573 8.64819H118.907Z"
                        fill="#C2CDE7"
                      />
                      <path
                        id="&#60;Compound Path&#62;_12"
                        d="M98.5127 11.1852V15.6259H96.9137V11.6604C96.9066 10.577 96.3743 9.95451 95.424 9.95451C94.4736 9.95451 93.8511 10.6031 93.8511 11.6866V15.6259H92.2402V8.64775H93.8392V9.36053C94.1166 9.06451 94.4559 8.83347 94.833 8.68396C95.21 8.53444 95.6155 8.47015 96.0203 8.49569C97.5932 8.50045 98.5127 9.55773 98.5127 11.1852Z"
                        fill="#C2CDE7"
                      />
                    </g>
                    <path
                      id="&#60;Compound Path&#62;_13"
                      d="M23.3644 10.8449C23.117 10.8463 22.8707 10.8787 22.6307 10.9414C22.1832 9.09629 21.2386 7.42507 19.9097 6.12713C18.5808 4.8292 16.9236 3.95936 15.1359 3.62141C14.9728 3.59109 14.8256 3.56905 14.6599 3.547C14.6862 2.60995 14.7283 1.52684 16.0458 0.551204L15.838 0C15.838 0 13.274 0.826806 12.9769 3.13359C12.848 2.50798 11.662 1.72527 11.0624 1.57644L10.7679 2.07528C11.0298 2.241 11.2532 2.46571 11.4219 2.73313C11.5907 3.00055 11.7005 3.30398 11.7435 3.62141C9.95568 3.95867 8.29817 4.82788 6.96877 6.12533C5.63938 7.42278 4.69423 9.09368 4.24612 10.9386C3.77663 10.8156 3.28606 10.8107 2.81439 10.9241C2.34272 11.0375 1.90329 11.2661 1.53191 11.5912C1.16054 11.9164 0.86773 12.3289 0.677353 12.7952C0.486976 13.2615 0.404417 13.7683 0.436406 14.2744C0.468394 14.7804 0.614024 15.2714 0.861427 15.7073C1.10883 16.1431 1.451 16.5116 1.86006 16.7826C2.26912 17.0536 2.73348 17.2194 3.21531 17.2666C3.69714 17.3138 4.18279 17.2411 4.63269 17.0543C4.89439 17.7399 5.22871 18.3925 5.62936 19L8.17759 17.2003L8.15655 17.17C7.44544 16.1199 7.04403 14.8741 7.00209 13.5872C6.92583 12.121 7.26506 10.663 8.16181 9.80592C10.0026 8.15231 12.0118 8.91021 13.2688 10.4867H13.608C14.865 8.91021 16.8715 8.16057 18.715 9.80592C19.6091 10.663 19.951 12.121 19.8747 13.5872C19.8328 14.8741 19.4313 16.1199 18.7202 17.17L18.6992 17.2003L21.2474 19C21.6481 18.3925 21.9824 17.7399 22.2441 17.0543C22.6641 17.2262 23.1151 17.299 23.565 17.2676C24.0148 17.2362 24.4526 17.1012 24.8471 16.8724C25.2416 16.6435 25.5831 16.3263 25.8474 15.9435C26.1116 15.5606 26.2921 15.1214 26.3761 14.6571C26.46 14.1928 26.4453 13.7148 26.3329 13.2572C26.2206 12.7996 26.0134 12.3735 25.7262 12.0093C25.4389 11.645 25.0785 11.3516 24.6708 11.1499C24.263 10.9482 23.8179 10.8431 23.367 10.8422L23.3644 10.8449ZM3.45193 15.012C3.2201 14.9989 3.00188 14.8932 2.84219 14.7166C2.6825 14.54 2.5935 14.3059 2.5935 14.0626C2.5935 13.8193 2.6825 13.5852 2.84219 13.4086C3.00188 13.232 3.2201 13.1262 3.45193 13.1131C3.63302 13.1143 3.8097 13.1718 3.95947 13.2785C3.9673 13.7769 3.99978 14.2746 4.05677 14.7695C3.89049 14.9256 3.67515 15.0119 3.45193 15.012ZM23.4249 15.012C23.2016 15.0119 22.9863 14.9256 22.82 14.7695C22.877 14.2746 22.9095 13.7769 22.9173 13.2785C23.0536 13.1817 23.2124 13.1257 23.3768 13.1166C23.5412 13.1074 23.7048 13.1454 23.8501 13.2265C23.9954 13.3076 24.1168 13.4287 24.2013 13.5768C24.2857 13.7248 24.3301 13.8942 24.3295 14.0667C24.3291 14.1912 24.3054 14.3144 24.2596 14.4293C24.2138 14.5442 24.1469 14.6485 24.0627 14.7363C23.9784 14.8241 23.8785 14.8936 23.7686 14.9409C23.6587 14.9882 23.541 15.0124 23.4222 15.012H23.4249Z"
                      fill="#C2CDE7"
                    />
                  </g>
                </g>
              </svg>
            </div>
            <div className="w-px h-[50px] opacity-50 bg-slate-800 bg-opacity-0" />
          </div>
        </div> */}
      </section>
      {/* <Teams /> */}
      <section className="container max-w-[90rem] mx-auto text-gray-600 body-font bg-gray-950 mt-20">
        <div className="w-[100%] mx-auto pb-16">
          <p className="text-center text-emerald-600 text-[15px] font-normal leading-[27px] mb-3">
            How it works
          </p>
          <h3 className="w-[100%] mb-5 mx-0 sm:mx-auto text-center text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[30px] sm:text-[46px] font-bold leading-[40.20px] sm:leading-[55.20px]">
            The Best UX/UI principals in dashboard design have been applied to our AI model.

          </h3>
          <p className="w-[100%] mx-auto text-center text-slate-400 text-base font-normal leading-7">
            You receive a write up of your report based on 6 core functions.
          </p>
        </div>
        <div className="relative" style={{ paddingTop: '56.25%' }}>
          <iframe
            src="https://player.vimeo.com/video/903867286?h=95e9d0cb44&badge=0&autopause=0&player_id=0&app_id=58479"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute top-0 left-0 w-full h-full"
            title="Review My Dashboard - Overview-4k"
          >
          </iframe>
        </div>
      </section>
      <section className="container max-w-[90rem] mx-auto text-gray-600 body-font bg-gray-950 pt-20 sm:pt-[248px]">
        <div className="w-full h-auto flex flex-col items-center lg:flex-row justify-center lg:justify-around mb-20 sm:mb-40 lg:mb-60">
          <div className="mb-5 lg:mb-0">
            <p className="text-emerald-600 text-center sm:text-left text-[15px] font-normal leading-[27px] mb-2">
              Screenshots of your dashboards
            </p>
            <h3 className="w-[100%] sm:w-[522px] mb-5 text-center sm:text-left text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[46px] font-bold leading-[55.20px]">
              Feedback on Readability
            </h3>
            <p className="w-[100%] sm:w-[522px] text-slate-200 text-center sm:text-left text-base font-thin leading-7">
              Does your dashboard make sense from a 3rd party perspective? We hope to find out.
            </p>
            <div className="flex items-center mt-8 mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Read text & charts
              </p>
            </div>
            <div className="flex items-center mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Understand visual hierarchy
              </p>
            </div>
            <div className="flex items-center mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Build relations
              </p>
            </div>
          </div>
          <div className="w-[100%] sm:w-[553px] lg:w-[30%] h-[100%] sm:h-[440px] lg:h-[90%]">
            <img
              src="/img/Screenshot_4.png"
              alt="screenshot1"
              className="w-full h-full object-fit"
            />
          </div>
        </div>
        <div className="w-full h-auto flex flex-col items-center lg:flex-row justify-center lg:justify-around mb-20 sm:mb-40 lg:mb-60">
          <div className="w-[100%] sm:w-[553px] lg:w-[30%] h-[100%] sm:h-[440px] lg:h-[90%]">
            <img
              src="/img/Screenshot_4.png"
              alt="screenshot1"
              className="w-full h-full object-fit"
            />
          </div>
          <div className="mt-5 lg:mt-0">
            <p className="text-emerald-600 text-center sm:text-left text-[15px] font-normal leading-[27px] mb-2">
              Visual Improvemet
            </p>
            <h3 className="w-[100%] sm:w-[522px] mb-5 text-center sm:text-left text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[46px] font-bold leading-[55.20px]">
              Contrast, text size & readability
            </h3>
            <p className="w-[100%] sm:w-[522px] text-center sm:text-left text-slate-200 text-base font-thin leading-7">
              We take into account the wholistic dashboard to make sure it visually make sense to read through.
            </p>
            <div className="flex items-center mt-8 mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Standard distances & colors
              </p>
            </div>
            <div className="flex items-center mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Standard font sizes
              </p>
            </div>
            <div className="flex items-center mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Groupings & color usage
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-auto flex flex-col items-center lg:flex-row justify-center lg:justify-around">
          <div className="mb-5 lg:mb-0">
            <p className="text-emerald-600 text-center sm:text-left text-[15px] font-normal leading-[27px] mb-2">
              Take Action Fast
            </p>
            <h3 className="w-[100%] sm:w-[522px] mb-5 text-center sm:text-left text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[46px] font-bold leading-[55.20px]">
              Improve your reports with actionable suggestions!
            </h3>
            <p className="w-[100%] sm:w-[522px] text-center sm:text-left text-slate-200 text-base font-thin leading-7">
              We give you 3 areas you are doing well on & 7 areas to improve.
            </p>
            <div className="flex items-center mt-8 mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Every critique comes with a suggestion
              </p>
            </div>
            <div className="flex items-center mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                Every suggestion has improvements
              </p>
            </div>
            <div className="flex items-center mb-[18px]">
              <div className="w-[34px] h-[34px] bg-neutral-800 rounded-full">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Check">
                    <circle
                      id="Ellipse"
                      cx="17"
                      cy="17"
                      r="17"
                      fill="#242826"
                    />
                    <path
                      id="Vector 3"
                      d="M12 16.9444L15.3333 20.5L22 12.5"
                      stroke="#018979"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
              <p className="text-slate-200 text-[15px] font-thin leading-[27px] ml-3.5">
                You can implement then get more feedback
              </p>
            </div>
          </div>
          <div className="w-[100%] sm:w-[553px] lg:w-[30%] h-[100%] sm:h-[440px] lg:h-[90%]">
            <img
              src="/img/Screenshot_4.png"
              alt="screenshot1"
              className="w-full h-full object-fit"
            />
          </div>
        </div>
      </section>
      <section className="container max-w-[90rem] mx-auto text-gray-600 body-font bg-gray-950 pt-20 sm:pt-[248px] pb-[248px]">
        <div className="w-full flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-around h-auto">
          <div className="w-[100%] lg:w-[35%] xl:w-[40%] mb-7 lg:mb-0 text-center lg:text-left">
            <p className="text-emerald-600 text-[15px] font-normal leading-[27px] mb-2">
              Frequently Asked Questions
            </p>
            <h3 className="w-full mb-5 text-transparent bg-gradient-to-r from-[#EBF1FF] to-[#B3C0DE] bg-clip-text text-[46px] font-bold leading-[55.20px]">
              Answer to your most pressing questions!             </h3>
            {/* <p className="w-full text-slate-200 text-base font-thin leading-7">
              Lorem ipsum is a placeholder text commonly used to demonstrate the
              visual form of a document or a typeface without
            </p> */}
          </div>
          <div
            id="accordion-collapse"
            data-accordion="collapse"
            className="w-[100%] lg:w-[60%]"
          >
            <h2 id="accordion-collapse-heading-1">
              <button
                type="button"
                onClick={() => setShow('accordion-collapse-body-1')}
                className="flex items-center justify-between w-full px-5 p-10 font-medium rtl:text-right text-gray-500 border-b border-gray-700 hover:bg-gray-800 gap-3"
                data-accordion-target="#accordion-collapse-body-1"
                aria-expanded="true"
                aria-controls="accordion-collapse-body-1"
              >
                <span>What does this cost? </span>
                {toggleIcons('accordion-collapse-body-1')}
              </button>
            </h2>
            <div
              id="accordion-collapse-body-1"
              className={`${show === 'accordion-collapse-body-1' ? '' : 'hidden'
                }`}
              aria-labelledby="accordion-collapse-heading-1"
            >
              <div className="p-5">
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Currently it’s 100% free. We might implement a usage limit if people abuse it,
                  but currently its intended to be useful to have practitioners, managers, founders, & directors get feedback fast!
                </p>
                {/* <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual form
                </p> */}
              </div>
            </div>
            <h2 id="accordion-collapse-heading-2">
              <button
                type="button"
                onClick={() => setShow('accordion-collapse-body-2')}
                className="flex items-center justify-between w-full px-5 py-10 font-medium rtl:text-right text-gray-500 border-b border-gray-700 hover:bg-gray-800 gap-3"
                data-accordion-target="#accordion-collapse-body-2"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-2"
              >
                <span>Can I talk to a person? </span>
                {toggleIcons('accordion-collapse-body-2')}
              </button>
            </h2>
            <div
              id="accordion-collapse-body-2"
              className={`${show === 'accordion-collapse-body-2' ? '' : 'hidden'
                }`}
              aria-labelledby="accordion-collapse-heading-2"
            >
              <div className="p-5">
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  If you would like to have a real person review or build you a better dashboard,
                  please visit VisionLabs.com & we will be happy to help get you moving to a better & more actionable future!
                </p>
                {/* <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual form
                </p> */}
              </div>
            </div>
            <h2 id="accordion-collapse-heading-3">
              <button
                type="button"
                onClick={() => setShow('accordion-collapse-body-3')}
                className="flex items-center justify-between w-full px-5 py-10 font-medium rtl:text-right text-gray-500 border-b border-gray-700 hover:bg-gray-800 gap-3"
                data-accordion-target="#accordion-collapse-body-3"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-3"
              >
                <span>Who can see my dashboard?</span>
                {toggleIcons('accordion-collapse-body-3')}
              </button>
            </h2>
            <div
              id="accordion-collapse-body-3"
              className={`${show === 'accordion-collapse-body-3' ? '' : 'hidden'
                }`}
              aria-labelledby="accordion-collapse-heading-3"
            >
              <div className="p-5">
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  We utilize OpenAI API & Anthropic API. Both platforms will receive the image & abide by their terms of service & operating.
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Open AI &nbsp;
                  <a href="https://openai.com/policies/terms-of-use" className="text-blue-500 hover:underline">Terms of Use</a>
                  , &nbsp;
                  <a href="https://openai.com/policies/usage-policies" className="text-blue-500 hover:underline">Policies</a>
                  ,
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Anthropic &nbsp;
                  <a href="https://console.anthropic.com/legal/terms" className="text-blue-500 hover:underline">Terms of Use</a>
                  ,
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  If you would like an enterprise instance, please &nbsp;
                  <a href="https://visionlabs.com/contact/" className="text-blue-500 hover:underline">Contact Us</a>
                </p>
              </div>
            </div>
            {/* <h2 id="accordion-collapse-heading-4">
              <button
                type="button"
                onClick={() => setShow('accordion-collapse-body-4')}
                className="flex items-center justify-between w-full px-5 py-10 font-medium rtl:text-right text-gray-500 border-b border-gray-700 hover:bg-gray-800 gap-3"
                data-accordion-target="#accordion-collapse-body-4"
                aria-expanded="false"
                aria-controls="accordion-collapse-body-4"
              >
                <span>Lorem ipsum is a placeholder text commonly used to</span>
                {toggleIcons('accordion-collapse-body-4')}
              </button>
            </h2>
            <div
              id="accordion-collapse-body-4"
              className={`${show === 'accordion-collapse-body-4' ? '' : 'hidden'
                }`}
              aria-labelledby="accordion-collapse-heading-4"
            >
              <div className="p-5">
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual form of a document or a typeface without
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual form
                </p>
              </div>
            </div> */}
          </div>
          {/* <div>
            <div className="grid grid-cols-3 items-start gap-40 h-[74px]">
              <div className="text-slate-200 text-lg font-normal leading-7 tracking-tight grid col-span-2">
                Lorem ipsum is a placeholder text commonly used to
              </div>
              <div>
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Icon / Plus">
                    <path
                      id="Vector 1"
                      d="M12 5.1626V19.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      id="Vector 2"
                      d="M19 12.1626L5 12.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="w-[85%] h-px opacity-70 bg-gray-800" />
            <div className="grid grid-cols-3 items-center gap-40 h-[95px]">
              <div className="text-slate-200 text-lg font-normal tracking-tight leading-7 grid col-span-2">
                Lorem ipsum is a placeholder text commonly used to
              </div>
              <div>
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Icon / Plus">
                    <path
                      id="Vector 1"
                      d="M12 5.1626V19.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      id="Vector 2"
                      d="M19 12.1626L5 12.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="w-[85%] h-px opacity-70 bg-gray-800" />
            <div className="grid grid-cols-3 items-center gap-40 h-[95px]">
              <div className="text-slate-200 text-lg font-normal tracking-tight leading-7 grid col-span-2">
                Lorem ipsum is a placeholder text commonly used to
              </div>
              <div>
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Icon / Plus">
                    <path
                      id="Vector 1"
                      d="M12 5.1626V19.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      id="Vector 2"
                      d="M19 12.1626L5 12.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="w-[85%] h-px opacity-70 bg-gray-800" />
            <div className="grid grid-cols-3 items-center gap-40 h-[95px]">
              <div className="text-slate-200 text-lg font-normal tracking-tight leading-7 grid col-span-2">
                Lorem ipsum is a placeholder text commonly used to
              </div>
              <div>
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="Icon / Plus">
                    <path
                      id="Vector 1"
                      d="M12 5.1626V19.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      id="Vector 2"
                      d="M19 12.1626L5 12.1626"
                      stroke="#E7EAF3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="w-[85%] h-px opacity-70 bg-gray-800" />
          </div> */}
        </div>
      </section>
    </>
  );
};

export default Hero2;
