import EmailForm from "@/components/EmailForm";
import React from "react";

interface Props {}

const page = () => {
  return (
    <div className="w-full flex justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-[80px]">
      <div className="flex flex-col gap-3 w-[280px] md:w-[320px] xl:w-[380px]">
        <div>
          <p className="text-xl font-semibold">Reset password</p>
          <p className="text-sm mt-1">
            Enter your email adress to get instructions for resetting your
            password.
          </p>
        </div>
        <EmailForm />
      </div>
    </div>
  );
};

export default page;
