import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/prismadb";
import { PostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content } = PostValidator.parse(body);

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const createdPost = await db?.post.create({
      data: {
        title,
        content,
        authorId: currentUser.id,
      },
    });

    return new Response(JSON.stringify({ id: createdPost?.id }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not publish post, please try again later.", {
      status: 500,
    });
  }
}
