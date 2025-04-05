import React from "react";
import Logo, { LogoSmall } from "./Logo";
import Searchbar from "./Searchbar";
import Notifications from "./Notifications";
import Link from "next/link";
import More from "./More";
import getCurrentUser from "@/actions/getCurrentUser";

interface Props {}

const NavMobile = async () => {
  const currentUser = await getCurrentUser();
  return (
    <div className="flex md:hidden py-3 pr-[25px] items-center justify-between fixed top-0 z-10 w-full bg-background dark:bg-black">
      <Link href="/">
        <LogoSmall />
      </Link>
      <Searchbar />

      <More currentUser={currentUser} />
    </div>
  );
};

export default NavMobile;
