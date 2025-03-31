"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import googleImg from "@/images/google.png";
import Image from "next/image";
import { Github } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() =>
          signIn("credentials", {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast({
              title: "Invalid Credentials!",
              description: "Invalid email or password, please try again.",
              variant: "destructive",
            });
          }

          if (callback?.ok) {
            router.refresh();
            router.push("/");
          }
        })
        .catch(() =>
          toast({
            title: "Error",
            description: "Something went wrong, please try again later",
            variant: "destructive",
          })
        )
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast({
              title: "Invalid Credentials!",
              description: "Invalid email or password, please try again.",
              variant: "destructive",
            });
          }

          if (callback?.ok) {
            router.refresh();
            router.push("/");
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast({
            title: "Error",
            description: "Something went wrong, please try again later",
            variant: "destructive",
          });
        }

        if (callback?.ok) {
          router.push("/conversations");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="h-full w-full flex flex-col gap-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {variant === "REGISTER" && (
          <Input
            disabled={isLoading}
            {...register("name")}
            required
            id="name"
            placeholder="Username"
            className="w-[100%] rounded-[7px]"
          />
        )}
        <Input
          disabled={isLoading}
          {...register("email")}
          required
          id="email"
          type="email"
          placeholder="Email adress"
          className="w-[100%] rounded-[7px]"
        />
        <div>
          <Input
            disabled={isLoading}
            {...register("password")}
            required
            id="password"
            type="password"
            placeholder="Password"
            className="w-[100%] rounded-[7px]"
          />
          {variant === "LOGIN" && (
            <Link
              href="/forgot-password"
              className="text-textGray text-xs mt-1 pl-1 hover:text-dark dark:hover:text-background cursor-pointer w-[110px]"
            >
              Forgot password?
            </Link>
          )}
        </div>

        <Button
          isLoading={isLoading}
          type="submit"
          className="w-full rounded-[7px] text-lg"
        >
          {variant === "LOGIN" ? "Sign in" : "Sign Up"}
        </Button>
        <div className="flex gap-1 w-full justify-center text-sm">
          <p className="text-textGray">
            {variant === "LOGIN"
              ? "Don`t have an account? "
              : "Already have an account?"}
          </p>
          <div
            onClick={toggleVariant}
            className=" cursor-pointer hover:underline"
          >
            {variant === "LOGIN" ? "Create an account" : "Sign in"}
          </div>
        </div>

        <div className="my-1">
          <div className="relative">
            <div
              className="
                absolute 
                inset-0 
                flex 
                items-center
              "
            >
              <div className="w-full border-t border-outlineGray" />
            </div>
            <div className="relative flex justify-center text-sm ">
              <span className="px-2 text-textGray bg-background dark:bg-black">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-1">
          <Button
            className="w-1/2 flex gap-1 items-center"
            onClick={() => socialAction("google")}
            type="button"
          >
            <Image
              src={googleImg}
              width={20}
              height={20}
              alt="login with google"
            />
            <p className="text-white text-lg">Google</p>
          </Button>

          <Button
            className="w-1/2 flex items-center "
            onClick={() => socialAction("github")}
            type="button"
          >
            <Github color="white" />
            <p className="text-white text-lg">Github</p>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
