import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import TermsAndCondition from '@/components/TermsAndCondition';

const Index = () => {

  return (
    <div>
      <Navbar />
      <TermsAndCondition />
    </div>
  );
};

export default Index;
