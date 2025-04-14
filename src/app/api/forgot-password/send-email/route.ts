import getCurrentUser from "@/actions/getCurrentUser";
import { db } from "@/lib/prismadb";
import { EmailValidator } from "@/lib/validators/email";
import { randomUUID } from "crypto";
import { render } from "@react-email/render";
import cryptoRandomString from "crypto-random-string";
import { z } from "zod";
import ForgotPasswordEmail from "@/lib/ForgotPasswordEmail";
import Env from "@/lib/env";
import { sendEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = EmailValidator.parse(body);
    const currentUser = await getCurrentUser();

    const user = await db?.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new Response("Invalid email adress.", { status: 402 });
    }

    const randomStr = cryptoRandomString({
      length: 64,
      type: "alphanumeric",
    });

    const token = await db?.passwordResetToken.create({
      data: {
        userId: user.id,
        token: randomStr,
      },
    });

    const url = `https://real-gules.vercel.app/password-reset/${token?.token}}`;
    const html = render(
      ForgotPasswordEmail({
        params: {
          name: user.name,
          url: url,
        },
      })
    );
    await sendEmail(email, "Reset Password", html);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response("Could not send email, please try again later.", {
      status: 500,
    });
  }
}
