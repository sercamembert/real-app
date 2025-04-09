import { db } from "@/lib/prismadb";
import { LikeValidator } from "@/lib/validators/like";
import getCurrentUser from "@/actions/getCurrentUser";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    let { isLiked, postId } = LikeValidator.parse(body);

    const user = await getCurrentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (isLiked) {
      await db?.like.deleteMany({
        where: {
          postId,
          userId: user.id,
        },
      });
      isLiked = false;
    } else {
      await db?.like.create({
        data: {
          userId: user.id,
          postId,
        },
      });
      isLiked = true;

      const post = await db.post.findFirst({
        where: {
          id: postId,
        },
      });

      const isNotification = await db.notification.findFirst({
        where: {
          content: `${user.name} like your post`,
          userId: post?.authorId,
          postId,
        },
      });

      if (post && post.authorId !== user.id && !isNotification) {
        await db.notification.create({
          data: {
            postId,
            userId: post.authorId,
            content: `${user.name} liked your post`,
          },
        });
      }
    }

    return new Response(JSON.stringify({ isLiked }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not like", { status: 500 });
  }
}
