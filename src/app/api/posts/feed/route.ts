import getCurrentUser from "@/actions/getCurrentUser";
import { ExtendedPost } from "@/components/Feed";
import { db } from "@/lib/prismadb";
import { z } from "zod";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const user = await getCurrentUser();

  try {
    const { limit, page } = z
      .object({
        limit: z.string(),
        page: z.string(),
      })
      .parse({
        limit: url.searchParams.get("limit"),
        page: url.searchParams.get("page"),
      });

    let allPosts: ExtendedPost[];

    if (!user) {
      allPosts = await db.post.findMany({
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        include: {
          author: true,
          comments: true,
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      const follows = await db.follows.findMany({
        where: {
          followerId: user?.id,
        },
      });

      const followedUserIds = follows.map((follow) => follow.followingId);

      const followedUserPosts = await db.post.findMany({
        where: {
          authorId: {
            in: followedUserIds,
          },
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
      });

      const excludedUserIds = [...followedUserIds, user?.id];

      const remainingUserPosts = await db.post.findMany({
        where: {
          authorId: {
            notIn: excludedUserIds as string[],
          },
        },
        include: {
          author: true,
          comments: true,
          likes: true,
        },
        take: parseInt(limit),
        skip: (parseInt(page) - 1) * parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
      });

      allPosts = [...followedUserPosts, ...remainingUserPosts];
    }
    return new Response(JSON.stringify(allPosts));
  } catch (error) {
    return new Response("Could not fetch posts", { status: 500 });
  }
}
