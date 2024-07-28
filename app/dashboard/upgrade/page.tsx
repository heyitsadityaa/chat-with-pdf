"use client";
import { createCheckoutSession } from "@/action/createCheckoutSession";
import { createStripePortal } from "@/action/createStripePortal";
import { Button } from "@/components/ui/button";
import useSubscriptions from "@/hooks/useSubscriptions";
import getStripe from "@/lib/stripe-js";
import { useUser } from "@clerk/nextjs";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

export type UserDetails = {
  email: string;
  name: string;
};

function PricingPage() {
  const { user } = useUser();
  const router = useRouter();
  const { hasActiveMembership, loading } = useSubscriptions();
  const [isPending, startTransition] = useTransition();

  console.log(hasActiveMembership);

  const handleUpgrade = () => {
    if (!user) return;

    const userDetails: UserDetails = {
      email: user.primaryEmailAddress?.toString()!,
      name: user.fullName!,
    };

    startTransition(async () => {
      // Load Stripe
      const stripe = await getStripe();

      if (hasActiveMembership) {
        // create stripe portal...
        const stripePortalUrl = await createStripePortal();
        return router.push(stripePortalUrl);
      }

      const sessionId = await createCheckoutSession(userDetails);

      await stripe?.redirectToCheckout({
        sessionId,
      });
    });
  };

  return (
    <div>
      <div className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <h2 className=" text-base font-semibold leading-7 text-sky-500">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            SuperCharge your Document Companion
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-2xl px-10 text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan thats packed with the best features for
          interacting with your PDFs, enhancing productivity, and streamlining
          your workflow
        </p>

        <div className="max-w-md mx-auto mt-10 grid-cols-1 grid md:grid-cols-2 md:max-w-2xl gap-8 lg:max-w-4xl">
          <div className="ring-1 ring-gray-200 p-8 h-fit pb-12 rounded-3xl">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">
              Starter Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Explore Core Features at No Cost
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                Free
              </span>
            </p>

            <ul
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              role="list"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Up to 3 messages per Document
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Try out the AI Chat Functionality
              </li>
            </ul>
          </div>
          <div className="ring-2 ring-sky-500 rounded-3xl p-8">
            <h3 className="text-lg font-semibold leading-8 text-sky-500">
              Pro Plan
            </h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Maximize Productivity with PRO Features
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">
                $5.99
              </span>
              <span className="text-sm font-semibold leading-6 text-gray-600">
                {" "}
                / month
              </span>
            </p>
            <Button
              className="bg-sky-500 w-full text-white shadow-sm hover:bg-sky-400 mt-6 block rounded-md px-3 py-2 to-current text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              disabled={loading || isPending}
              onClick={handleUpgrade}
            >
              {isPending || loading
                ? "Loading..."
                : hasActiveMembership
                ? "Manage Plan"
                : "Upgrade to Pro"}
            </Button>
            <ul
              className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              role="list"
            >
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Store upto 20 Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Ability to Delete Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Up to 100 messages per Documents
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Full Power AI Chat Functionality with Memory Recall{" "}
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                Advanced analytics{" "}
              </li>
              <li className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-sky-500" />
                24-hour support response time{" "}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
