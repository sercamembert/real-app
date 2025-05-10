import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import defaultImg from "@/images/profile.png";
interface Props {
  image: string | null | undefined;
  w: number;
  h: number;
}

const UserAvatar = ({ image, w, h }: Props) => {
  return (
    <Image
      src={image ?? defaultImg}
      alt="profile picture"
      width={w}
      height={h}
      className="rounded-[50%] aspect-square"
    />
  );
};

export default UserAvatar;
