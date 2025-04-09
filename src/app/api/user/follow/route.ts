import { db } from "@/lib/prismadb";
import { FollowValidator } from "@/lib/validators/follow";
import getCurrentUser from "@/actions/getCurrentUser";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    let { isFollowed, userId } = FollowValidator.parse(body);

    const user = await getCurrentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (isFollowed) {
      await db?.follows.deleteMany({
        where: {
          followingId: userId,
          followerId: user.id,
        },
      });
      isFollowed = false;
    } else {
      await db?.follows.create({
        data: {
          followingId: userId,
          followerId: user.id,
        },
      });
      isFollowed = true;

      const notification = await db.notification.findFirst({
        where: {
          userId,
          content: `${user.name} has followed you`,
        },
      });

      if (!notification) {
        await db.notification.create({
          data: {
            userId,
            content: `${user.name} has followed you`,
          },
        });
      }
    }

    return new Response(JSON.stringify({ isFollowed }), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not follow", { status: 500 });
  }
}
