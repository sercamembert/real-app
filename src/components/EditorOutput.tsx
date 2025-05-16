"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    whiteSpace: "pre-wrap",
    margin: "0px",
  },
};

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderers={renderers}
    />
  );
};

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative w-full ">
      <div className="w-full h-full flex items-center justify-center">
        <Image
          alt="image"
          className="h-full"
          src={src}
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}

function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}

export default EditorOutput;
