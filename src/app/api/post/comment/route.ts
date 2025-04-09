import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/prismadb";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const user = await getCurrentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.comment.create({
      data: {
        text,
        postId,
        authorId: user.id,
        replyToId,
      },
    });

    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (user.id !== post?.authorId && post) {
      await db.notification.create({
        data: {
          userId: post?.authorId,
          content: `${user.name} comment your post`,
          postId: postId,
        },
      });

      if (replyToId) {
        const reply = await db.comment.findFirst({
          where: {
            id: replyToId,
          },
          include: {
            author: true,
          },
        });

        if (reply && reply.authorId !== user.id) {
          await db.notification.create({
            data: {
              userId: reply.author.id,
              content: `${user.name} replied to your comment`,
              postId: postId,
            },
          });
        }
      }
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response("Could not create comment, please try again later", {
      status: 500,
    });
  }
}
