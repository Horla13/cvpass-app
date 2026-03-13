"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { AppHeader } from "@/components/AppHeader";

function TrackCheckout() {
  const posthog = usePostHog();
  const searchParams = useSearchParams();

  useEffect(() => {
    const plan = searchParams.get("plan");
    posthog?.capture("stripe_checkout_completed", { plan: plan ?? "unknown" });
  }, [posthog, searchParams]);

  return null;
}

export default function PricingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <Suspense fallback={null}>
        <TrackCheckout />
      </Suspense>
      <main className="max-w-lg mx-auto px-6 py-24 text-center">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-brand-black mb-4">
          Paiement confirmé !
        </h1>
        <p className="text-brand-gray mb-8 leading-relaxed">
          Votre plan est maintenant actif. Vous pouvez dès maintenant analyser
          votre CV sans limite.
        </p>
        <Link
          href="/analyze"
          className="inline-block bg-brand-green text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Analyser mon CV →
        </Link>
      </main>
    </div>
  );
}
