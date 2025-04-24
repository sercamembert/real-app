import getCurrentUser from "@/actions/getCurrentUser";
import SearchPostFeed from "@/components/SearchPostFeed";
import SearchProfileFeed from "@/components/SearchProfileFeed";
import SearchType from "@/components/SearchType";
import { db } from "@/lib/prismadb";
import React from "react";

interface Props {
  params: {
    input: string;
    sort: string;
    type: string;
  };
}

const page = async ({ params }: Props) => {
  let profiles;
  let posts;
  if (params.type === "profile") {
    profiles = await db.user.findMany({
      where: {
        name: {
          contains: params.input,
        },
      },
    });
  }
  return (
    <div className="w-[90%] md:w-[500px] px-1 lg:w-[600px] 2xl:w-[700px] flex flex-col items-center justify-center ">
      <SearchType params={params} />
      {params.type === "profile" && <SearchProfileFeed profiles={profiles} />}
      {params.type === "post" && <SearchPostFeed params={params} />}
    </div>
  );
};

export default page;
