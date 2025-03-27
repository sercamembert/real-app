import React from "react";
import ResetForm from "@/components/ResetForm";

const page = ({ params }: { params: { token: string } }) => {
  const decodedToken = params.token.replace(/%7D/g, "");
  return (
    <div className="w-full flex justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-[80px]">
      <div className="flex flex-col gap-3 w-[280px] md:w-[320px] xl:w-[380px]">
        <p className="text-xl font-semibold">Reset password</p>
        <ResetForm token={decodedToken} />
      </div>
    </div>
  );
};

export default page;
