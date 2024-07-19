import Link from 'next/link';
import React from 'react';

const TermsAndCondition = () => {
    return (
        <>
            <section className="max-w-[690px] text-gray-300 mx-auto container">
                <div className="container mx-auto p-4">
                    <h1 className="text-[70px] font-[700] text-center mb-4">Terms & Conditions</h1>

                    <p className="mb-2 text-[34px] font-[700]" ><strong>Last updated: December, 19, 2023</strong></p>

                    <section className="mb-4">
                        <p className="mb-2 ">These terms and conditions (&quot;Terms&quot;) govern your access to and use of Mediauthentic&apos;s AI Dashboard
                            Feedback Software (the &quot;Service&quot;) provided by Mediauthentic (&quot;we&quot; or &quot;us&quot;).
                            By accessing or using the Service, you agree to be bound by these Terms.
                            If you do not agree to these Terms, you may not access or use the Service.</p>
                    </section>

                    <section className="mb-4">
                        <h2 className="text-[24px] font-[700] mb-2">Use Terms for Mediauthentic&apos;s AI Dashboard Feedback Software</h2>
                        <p className="mb-2">Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable
                            license to use the Service for your internal business purposes during the term of these Terms.</p>
                        <p className="mb-2">You may not use the Service in any way that could damage, disable, overburden, or impair
                            the Service or interfere with any other party&apos;s use and enjoyment of the Service. You may not attempt to gain
                            unauthorized access to the Service, other accounts, computer systems, or networks connected to the Service.
                        </p>
                        <p className="mb-2">You are solely responsible for all data, information, and content uploaded, stored, or processed
                            using the Service (&quot;User Data&quot;). You represent and warrant that you have the necessary rights to upload, store, and
                            process User Data using the Service and that your use of the Service complies with all applicable laws and regulations.
                        </p>
                    </section>

                    <section className="mb-4">
                        <h2 className="text-[24px] font-[700] mb-2">User Data</h2>
                        <p className="mb-2">We will maintain certain data that you transmit to the Service for the purpose of managing
                            the performance of the Service, as well as data relating to your use of the Service.
                            You are solely responsible for all User Data that you transmit or that relates to any activity you have undertaken
                            using the Service. You agree that we shall have no liability to you for any loss or corruption of any such User Data,
                            and you hereby waive any right of action against us arising from any such loss or corruption of such User Data.
                        </p>
                    </section>

                    <section className="mb-4">
                        <h2 className="text-[24px] font-[700] mb-2">Disclaimer of Warranties</h2>
                        <p className="mb-2">The Service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind,
                            whether express or implied.
                        </p>
                        <p className="mb-2">We do not warrant that the Service will be uninterrupted or error-free, or that the
                            Service will meet your requirements or expectations.
                        </p>
                        <p className="mb-2">We expressly disclaim any and all warranties of merchantability, fitness for a particular purpose,
                            non-infringement, and any warranties arising out of the course of dealing or usage of trade.
                        </p>
                    </section>

                    <section className="mb-4">
                        <h2 className="text-[24px] font-[700] mb-2">Termination</h2>
                        <p className="mb-2">Either party may terminate these Terms upon written notice to the other party if the other
                            party breaches any material term of these Terms and fails to cure such breach within thirty (30) days
                            of receiving written notice of the breach.
                        </p>
                        <p className="mb-2">Upon termination of these Terms, you must immediately cease all use of the Service and destroy
                            all copies of the Service in your possession.
                        </p>
                    </section>

                    <section className="mb-4">
                        <h2 className="text-[24px] font-[700] mb-2">Confidentiality</h2>
                        <p className="mb-2">&quot;Confidential Information&quot; means any information disclosed by either party to the other party
                            that is marked as confidential or should reasonably be considered confidential given the nature of the information
                            and the circumstances of its disclosure.
                        </p>
                        <p className="mb-2">The recipient of Confidential Information will maintain the confidentiality of the Confidential
                            Information and will not disclose it to any third party, except as necessary to provide the Service or as required
                            by law.
                        </p>
                    </section>
                    <section className="mb-4">
                        <h2 className="text-[24px] font-[700] mb-2">Contact Us</h2>
                        <p className="mb-2">In order to receive further information regarding use of the Service, please contact us at:
                        </p>
                        <Link href="mailto:hello@visionlabs.com" className="text-blue-600 hover:text-blue-800">hello@visionlabs.com</Link>
                    </section>
                </div>

            </section>
        </>
    );
};

export default TermsAndCondition;
