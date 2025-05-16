"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { EmailRequest } from "@/lib/validators/email";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
interface Props {}

const EmailForm = () => {
  const [email, setEmail] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async ({ email }: EmailRequest) => {
      const payload: EmailRequest = {
        email,
      };

      const { data } = await axios.post(
        "/api/forgot-password/send-email",
        payload
      );
    },
    onSuccess: () => {
      setEmail("");
      toast({
        title: "Success",
        description: "Check your email.",
        variant: "default",
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 402) {
          return toast({
            title: "Invalid email adress",
            description: "Please check email adress and try again.",
            variant: "destructive",
          });
        }

        return toast({
          title: "There was a problem",
          description: "Something went wrong, please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="w-full flex flex-col gap-3">
      <Input
        disabled={mutation.isPending}
        onChange={(e) => setEmail(e.target.value)}
        required
        id="email"
        placeholder="Enter your email adress"
        className="w-[100%] rounded-[7px]"
        value={email}
      />
      <Button
        className="w-full rounded-[7px]"
        isLoading={mutation.isPending}
        onClick={() => mutation.mutate({ email })}
      >
        Reset password
      </Button>
      <Link
        href="/sign-in"
        className="text-textGray text-xs hover:text-dark dark:hover:text-background cursor-pointer items-center flex"
      >
        <ChevronLeft width={13} height={13} /> Return to Sign In
      </Link>
    </div>
  );
};

export default EmailForm;
