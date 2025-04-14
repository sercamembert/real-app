import { db } from "@/lib/prismadb";
import { PasswordValidator } from "@/lib/validators/password";
import { hash } from "bcrypt";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { password, matchingPassword, token } = PasswordValidator.parse(body);
    if (
      !password ||
      typeof password !== "string" ||
      password !== matchingPassword
    ) {
      return new Response("Passwords doesn't match.", {
        status: 402,
      });
    }

    const passwordResetToken = await db?.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    if (!passwordResetToken) {
      return new Response(
        "Invalid token reset request. Please try resetting your password again.",
        {
          status: 403,
        }
      );
    }

    const encrypted = await hash(password, 12);

    const updateUser = await db?.user.update({
      where: { id: passwordResetToken.userId },
      data: {
        hashedPassword: encrypted,
      },
    });

    const updateToken = await db?.passwordResetToken.update({
      where: {
        id: passwordResetToken.id,
      },
      data: {
        resetAt: new Date(),
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response("Could not reset password, please try again later.", {
      status: 500,
    });
  }
}
