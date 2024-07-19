import Navbar from "@/components/Navbar";
import ThankYou from "@/components/ThankYou";
import { useRouter } from "next/navigation";
import React, {useEffect} from "react";

const Index = () => {
  // const { push } = useRouter();

  // useEffect(() => {
  //   const loginCheck = localStorage.getItem('token');

  //   if (!loginCheck) {
  //     push('/login');
  //   }
  // }, []);

  return (
    <div>
      <Navbar />
      <ThankYou />
    </div>
  );
};

export default Index;
