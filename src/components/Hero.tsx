import Image from 'next/legacy/image';
import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const Hero = () => {
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
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [firstAnswer, setFirstAnswer] = useState('');
  const [secondAnswerOptions, setSecondAnswerOptions] = useState<string[]>([]);
  const [thirdAnswerOptions, setThirdAnswerOptions] = useState<string[]>([]);

  const [imageSrc, setImageSrc] = useState<string | null | undefined>('');

  useEffect(() => { }, [thirdAnswerOptions]);

  const router = useRouter();

  const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const onSubmitBtnClicked = async () => {

    if (!isValidEmail(email)) {
      toast('Input the correct email address!', { type: 'error' });
      return;
    }
    if (imageSrc == null || imageSrc == undefined || imageSrc == '') {
      toast('Please upload any image!', { type: 'error' });
      return;
    }
    setIsLoading(true)
    const base64String = imageSrc?.split(',')[1];

    const response = await fetch('/api/process-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64String, email: email }),
    });
    try {
      if (response.ok) {
        const data = await response.json();
        setFirstAnswer(data.data.firstAnswer);

        console.log(data.data.firstAnswer);

        setSecondAnswerOptions(data.data.secondAnswer.slice(1).split('*'));
        setThirdAnswerOptions(data.data.thirdAnswer.slice(1).split('*'));
        console.log(data);
        toast('An email will be sent in the next few minutes!', { type: 'success' });
        setIsLoading(false);
      } else {
        toast('Internal Server Error!', { type: 'error' });
        console.error('Failed to fetch API');
        setIsLoading(false); // Stop loading in case of error
      }
    } catch (error) {
      toast('Internal Server Error!', { type: 'error' });
      console.error('Error:', error);
      setIsLoading(false); // Stop loading in case of error
    }
  };

  return (
    <section className='text-gray-600 body-font   '>
      <div className='container px-5 py-4  mx-auto  grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3  gap-14 content-center'>
        <div className=' md:ml-auto  md:py-2 mt-0 lg:mt-20 md:mt-[100px]  flex items-center justify-center'>
          <img
            src='/img/phone.png'
            alt='phone'
            className='w-[177px] h-[365px] lg:w-[339px] lg:h-[734px]  border-solid border-8 border-[#000] ring-inset shadow '
          />
        </div>
        <div className='text-[#FFF]  rounded-lg overflow-hidden sm:mr-10 lg:p-10 flex items-end justify-start  col-span-0 lg:col-span-2'>
          <div className=''>
            <div className='flex'>
              <img
                src='/img/productOne.png'
                alt='phone'
                className=' w-[140px] h-[73px] md:w-[170px] md:h-[73px] '
              />

              <img
                src='/img/productOne.png'
                alt='phone'
                className=' w-[140px] h-[73px] md:w-[170px] md:h-[73px] '
              />
            </div>
            <h1 className='text-white text-lg hero-title lg:w-2/3 md:w-1'>
              Instant Dashboard Feedback
            </h1>
            <p className='hero-subtitle py-4'>
              Another Pair of Eyes In Minutes
            </p>

            <div className='bg-[#FFF] text-[#000] w-[auto]  rounded-[20px] grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 lg:p-8 relative'>
              {isLoading && (
                <div className='absolute top-0 left-0 right-0 bottom-0 align-middle justify-items-center flex'>
                  <Spinner />
                </div>
              )}
              <div>
                <h2 className='text-black text-2xl font-bold '>
                  Upload Dashboards
                </h2>
                <p className='  text-black  text-md py-2 mb-3'>
                  Have Reporting Feedback & Improvements
                </p>
                <div
                  {...getRootProps()}
                  className='w-auto h-[284px] bg-zinc-300 bg-opacity-0 rounded-[20px] border-2 border-emerald-600 border-dashed flex   place-items-center items-center justify-center text-center text-emerald-600 font-bold overflow-hidden'
                >
                  <input {...getInputProps()} />
                  {imageSrc && <img src={imageSrc} alt='Uploaded' />}
                  {!imageSrc && (isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <div className=''>
                      Drop Dashboard Screenshot Here <br />
                      <span className='text-lg'>- OR -</span>
                      <br />
                      <span>Browse Photos</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor='countries'
                  className='block mb-2 text-sm font-bold text-black dark:text-white'
                >
                  Who is the audience?
                </label>
                {/* <select
                  id='countries'
                  className='bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-2'
                >
                  {secondAnswerOptions.map((answer, index) => (
                    <option key={`secondAnswer-${index}`} value={index}>
                      {answer}
                    </option>
                  ))}
                </select> */}


                {thirdAnswerOptions.length > 0 ? (
                  <select
                    id="countries"
                    className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg block p-2.5 mb-2 focus:outline-none focus:ring-0 focus:border-gray-500"
                  >
                    {thirdAnswerOptions.map((answer, index) => (
                      <option key={`thirdAnswer-${index}`} value={index}>
                        {answer}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg block p-2.5 mb-2"
                  >
                    The analyzed results will appear.
                  </div>
                )}


                <label
                  htmlFor='countries'
                  className='block mb-2 text-sm font-bold text-black dark:text-white'
                >
                  What are you trying to convey?
                </label>
                <textarea
                  id='countries'
                  className='bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-2'
                  placeholder='The analyzed results will appear.'
                  value={firstAnswer}
                  readOnly
                ></textarea>
                <label
                  htmlFor='countries'
                  className='block mb-2 text-sm font-bold text-black dark:text-white'
                >
                  Type of Data
                </label>


                {/* <select
                  id='countries'
                  className='bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-2'
                >
                  {thirdAnswerOptions.map((answer, index) => (
                    <option key={`thirdAnswer-${index}`} value={index}>
                      {answer}
                    </option>
                  ))}
                </select> */}


                {secondAnswerOptions.length > 0 ? (
                  <select
                    id="countries"
                    className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg block p-2.5 mb-2 focus:outline-none focus:ring-0 focus:border-gray-500"
                  >
                    {secondAnswerOptions.map((answer, index) => (
                      <option key={`secondAnswer-${index}`} value={index}>
                        {answer}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div
                    className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg block p-2.5 mb-2"
                  >
                    The analyzed results will appear.
                  </div>
                )}


                <label
                  htmlFor='countries'
                  className='block mb-2 text-sm font-bold text-black dark:text-white'
                >
                  Your Email
                </label>
                <input
                  id='countries'
                  type='email'
                  className='bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-2'
                  placeholder='email@hotmail.com'
                  onChange={onEmailChanged}
                />

                <button
                  className='w-[190px] h-10 bg-emerald-600 rounded-[10px] text-white text-lg font-bold '
                  onClick={onSubmitBtnClicked}
                >
                  Analyze Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
