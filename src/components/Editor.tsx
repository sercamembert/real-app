"use client";

import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { uploadFiles } from "@/lib/uploadthing";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import "@/styles/editor.css";
import useCustomToast from "@/hooks/use-custom-toast";
import { Button } from "./ui/button";

type FormData = z.infer<typeof PostValidator>;

export const Editor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      content: null,
    },
  });
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const pathname = usePathname();
  const { loginToast } = useCustomToast();

  const mutation = useMutation({
    mutationFn: async ({ title, content }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content };
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onSuccess: (data) => {
      router.push(`/post/${data.id}`);
      return toast({
        description: "Your post has been published.",
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }

        return toast({
          title: "Something went wrong.",
          description: "Your post was not published. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles({
                    endpoint: "imageUploader",
                    files: [file],
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value;
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
    };

    mutation.mutate(payload);
  }

  if (!isMounted) {
    return null;
  }

  const { ref: titleRef, ...rest } = register("title");

  return (
    <div>
      <div className="w-full xl:w-[700px] 2xl:w-[800px] p-4 bg-zinc-50 rounded-lg border border-zinc-200 dark:bg-dark">
        <form
          id="post-form"
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose prose-stone dark:prose-invert w-full">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e);
                // @ts-ignore
                _titleRef.current = e;
              }}
              {...rest}
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />
            <div
              id="editor"
              className="min-h-[500px] w-full text-dark dark:text-background"
            />
            <p className="text-sm text-gray-500">
              Use{" "}
              <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                Tab
              </kbd>{" "}
              to open the command menu.
            </p>
          </div>
        </form>
      </div>
      <div className="w-full flex justify-end mt-2">
        <Button
          type="submit"
          className="w-full"
          form="post-form"
          isLoading={mutation.isPending}
        >
          Post
        </Button>
      </div>
    </div>
  );
};
