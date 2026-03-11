"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

function PostHogIdentifier() {
  const { user, isLoaded } = useUser();
  const ph = usePostHog();

  useEffect(() => {
    if (!isLoaded || !ph) return;
    if (user) {
      ph.identify(user.id, {
        email: user.emailAddresses[0]?.emailAddress,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
      });
    } else {
      ph.reset();
    }
  }, [user, isLoaded, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
      persistence: "localStorage",
    });
  }, []);

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return <>{children}</>;

  return (
    <PHProvider client={posthog}>
      <PostHogIdentifier />
      {children}
    </PHProvider>
  );
}
