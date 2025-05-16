"use client";
import React, { useEffect, useState } from "react";
import { useEdgeStore } from "../lib/edgestore";
import UserAvatar from "./UserAvatar";
import { User } from "@prisma/client";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { SettingsRequest } from "@/lib/validators/settings";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Props {
  currentUser: User | null;
}

const SettingsForm = ({ currentUser }: Props) => {
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const { edgestore } = useEdgeStore();
  const [username, setUsername] = useState<string>();
  const [biogram, setBiogram] = useState<string>();
  const [isDirty, setIsDirty] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const uploadFile = async () => {
      if (file) {
        const res = await edgestore.publicFiles.upload({
          file,
        });
        if (res && res.url) {
          setImageUrl(res.url);
          setIsDirty(false);
        }
      }
    };

    uploadFile();
  }, [file, edgestore.publicFiles]);

  const update = useMutation({
    mutationFn: async ({ username, biogram, avatarUrl }: SettingsRequest) => {
      const payload: SettingsRequest = {
        avatarUrl,
        biogram,
        username,
      };

      const { data } = await axios.patch(`/api/settings`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast({
          title: "There was a problem",
          description: "Something went wrong, please try again later",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      router.refresh();
      router.push(`/profile/${currentUser?.id}`);
    },
  });

  return (
    <div className="w-full sm:w-2/3 sm:m-auto md:w-full flex flex-col item-center justify-center gap-3">
      <div className=" flex flex-col gap-1 w-full items-center">
        <label
          htmlFor="upload-photo"
          className="hover:brightness-75 cursor-pointer"
        >
          <UserAvatar image={imageUrl || currentUser?.image} h={60} w={60} />
        </label>
        <input
          type="file"
          name="photo"
          id="upload-photo"
          className="opacity-0 absolute z-[-1]"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
        <label
          htmlFor="upload-photo"
          className="text-textGray hover:text-dark cursor-pointer text-sm dark:hover:text-background"
        >
          Change profile picture
        </label>
        <input
          type="file"
          name="photo"
          id="upload-photo"
          className="opacity-0 absolute z-[-1]"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
      </div>
      <div className="w-full flex flex-col gap-2">
        <p className="text-sm">Username</p>
        <Input
          className="rounded-[8px] text-gray-700"
          placeholder="Enter new username..."
          // @ts-expect-error
          defaultValue={currentUser?.name}
          onChange={(e) => {
            setUsername(e.target.value);
            setIsDirty(false);
          }}
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <p className="text-sm">Biogram</p>
        <Textarea
          className="rounded-[8px] text-gray-700 bg-inputGray border-none"
          placeholder="Enter new biogram..."
          // @ts-expect-error
          defaultValue={currentUser?.description}
          onChange={(e) => {
            setBiogram(e.target.value);
            setIsDirty(false);
          }}
        />
      </div>

      <Button
        className="w-[60px] text-sm"
        disabled={isDirty}
        onClick={() => {
          update.mutate({ avatarUrl: imageUrl, biogram, username });
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default SettingsForm;
