import getCurrentUser from "@/actions/getCurrentUser";
import SettingsForm from "@/components/SettingsForm";
import React from "react";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full md:w-[400px] lg:w-[500px]">
      <SettingsForm currentUser={currentUser} />
    </div>
  );
};

export default page;
