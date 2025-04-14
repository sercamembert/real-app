import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/prismadb";
import { SettingsValidator } from "@/lib/validators/settings";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { avatarUrl, biogram, username } = SettingsValidator.parse(body);

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    await db.user.update({
      where: { id: currentUser.id },
      data: {
        name: username,
        description: biogram,
        image: avatarUrl,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not update profile.", {
      status: 500,
    });
  }
}
