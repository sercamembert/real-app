"use client";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "./use-toast";
import Link from "next/link";

const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "default",
      action: (
        <Link
          className={buttonVariants({ variant: "default" })}
          href="/sign-in"
          onClick={() => {
            dismiss;
          }}
        >
          Login
        </Link>
      ),
    });
  };
  return {
    loginToast,
  };
};

export default useCustomToast;
