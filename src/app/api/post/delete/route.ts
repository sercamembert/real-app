import { db } from "@/lib/prismadb";
import { DeleteValidator } from "@/lib/validators/delete";
import getCurrentUser from "@/actions/getCurrentUser";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    let { postId, userId } = DeleteValidator.parse(body);

    const user = await getCurrentUser();

    if (user?.id !== userId) {
      return new Response("Can`t delete this post, please try again later.", {
        status: 402,
      });
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not like", { status: 500 });
  }
}
