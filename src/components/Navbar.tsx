import { Fragment, useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Pricing', href: '#', current: true },
  { name: 'Sign Up', href: '#', current: false },
];

const Navbar = () => {
  const router = useRouter();

  const [token, setToken] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const data = localStorage.getItem('token');
      const parsedData = data || '';
      setToken(parsedData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    router.push('/');
  };

  return (
    <Fragment>
      <div className="min-h-full">
        <Disclosure as="nav">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-[90rem]  px-4 py-4 lg:py-5 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row h-auto md:h-16 gap-5 md:gap-0 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        src="/img/Review My Dashboard white.png"
                        alt="VisionLabs"
                        // className="h-[75px] w-[260px] md:h-[51px] md:w-[192px] hover:cursor-pointer"
                        className="h-[70px] w-[357px] md:h-[70px] md:w-[357px] hover:cursor-pointer"

                        onClick={() => router.push('/')}
                      />
                      <button border='1px' borderColor='gray.200' marginTop='2' class="text-white" ><Link href="/signup">signup</Link></button>
                      <button border='1px' borderColor='gray.200' marginTop='2' class="text-white" ><Link href="/login">login</Link></button>
                    </div>
                  </div>
                  {/* <div className="justify-center items-center gap-[60px] inline-flex">
                    <div className="text-center text-slate-300 text-base font-medium font-['Manrope'] leading-7">
                      Home
                    </div>
                    <div className="text-center text-slate-300 text-base font-normal font-['Manrope'] leading-7">
                      Pricing
                    </div>
                  </div> */}
                  {/* <div>
                    <div className="ml-4 flex items-center md:ml-6 mt-3">
                      {token ? (
                        <button
                          onClick={() => handleLogout()}
                          className="w-[162px] h-[50px] bg-neutral-900 rounded border border-gray-800 text-center text-slate-300 text-sm font-semibold leading-[18.20px]"
                        >
                          Logout
                        </button>
                      ) : (
                        <Link
                          href="/login"
                          className="w-[162px] h-[50px] bg-neutral-900 rounded border border-gray-800 text-center text-slate-300 text-sm font-semibold leading-[18.20px]"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div> */}
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={`
                        ${
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }
                        'block rounded-md px-3 py-2 text-base font-medium'
                      `}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </Fragment>
  );
};

export default Navbar;
