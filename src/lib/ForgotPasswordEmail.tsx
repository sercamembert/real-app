import React from "react";
import { Html } from "@react-email/html";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";
import { Link } from "@react-email/link";
export default function ForgotPasswordEmail({
  params,
}: {
  params: { name: string | null; url: string };
}) {
  return (
    <Html>
      <Heading as="h2"> Hello {params.name} </Heading>
      <Text>
        We received the reset password request for your Real account. Click link
        bellow
      </Text>
      <Link href={params.url}>Click Here</Link>
      <Text>
        Didn’t request this change? You can ignore this email and get back to
        scrolling.
      </Text>
      <Hr />
      <Text>The Real Team</Text>
    </Html>
  );
}
