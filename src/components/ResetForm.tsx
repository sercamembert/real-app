"use client";
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PasswordRequest } from "@/lib/validators/password";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
}

const EmailForm = ({ token }: Props) => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [matchingPassword, setMatchingPassword] = useState<string>("");

  const mutation = useMutation({
    mutationFn: async ({ password, matchingPassword }: PasswordRequest) => {
      const payload: PasswordRequest = {
        password,
        matchingPassword,
        token,
      };

      const { data } = await axios.patch(
        "/api/forgot-password/reset-password",
        payload
      );
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed",
        variant: "default",
      });
      router.push("/sign-in");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 402) {
          return toast({
            title: "Passwords doesn't match",
            description: "Check passwords and try again.",
            variant: "destructive",
          });
        }
        if (err.response?.status === 403) {
          return toast({
            title: "Invalid token request",
            description:
              "Invalid token reset request. Please try resetting your password again.",
            variant: "destructive",
          });
        }

        return toast({
          title: "There was a problem",
          description: "Something went wrong, please try again later",
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="w-full flex flex-col gap-3">
      <Input
        disabled={mutation.isPending}
        onChange={(e) => setPassword(e.target.value)}
        required
        id="email"
        placeholder="Enter new password"
        className="w-[100%] rounded-[7px]"
        value={password}
        type="password"
      />
      <Input
        disabled={mutation.isPending}
        onChange={(e) => setMatchingPassword(e.target.value)}
        required
        id="email"
        placeholder="Confirm new password"
        className="w-[100%] rounded-[7px]"
        value={matchingPassword}
        type="password"
      />
      <Button
        className="w-full rounded-[7px]"
        isLoading={mutation.isPending}
        onClick={() => mutation.mutate({ password, matchingPassword, token })}
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
