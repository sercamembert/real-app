"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ExtendedUser } from "./UserProfile";
import useCustomToast from "@/hooks/use-custom-toast";
import { useMutation } from "@tanstack/react-query";
import { FollowRequest } from "@/lib/validators/follow";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { Follows } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  user: ExtendedUser;
  currentUserId: string | undefined;
  follows: Follows[] | undefined;
}

const UserFollow = ({ user, currentUserId, follows }: Props) => {
  const router = useRouter();
  const { loginToast } = useCustomToast();
  const [isRequesting, setIsRequesting] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    follows?.some((follow) => follow.followerId === currentUserId)
  );

  const mutation = useMutation({
    mutationFn: async ({ isFollowed, userId }: FollowRequest) => {
      const payload: FollowRequest = { isFollowed, userId };
      const { data } = await axios.patch("/api/user/follow", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Your follow was not registered please try again.",
        variant: "destructive",
      });
    },
    onMutate: () => {
      setIsRequesting(true);
    },
    onSettled: () => {
      setIsRequesting(false);
    },
    onSuccess: (data: any) => {
      setIsFollowed(data.isFollowed);
      router.refresh();
    },
  });

  return (
    <Button
      className="rounded-[7px] text-[12px] h-[22px] px-4"
      size={"xs"}
      isLoading={mutation.isPending}
      onClick={() =>
        !isRequesting && mutation.mutate({ isFollowed, userId: user.id })
      }
    >
      {isFollowed ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default UserFollow;
