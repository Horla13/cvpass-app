"use client";

import { SignUp } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function SignUpPage() {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("signup_page_viewed");
  }, [posthog]);

  return <SignUp />;
}
