"use client";
import useSubscriptions from "@/hooks/useSubscriptions";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2Icon, StarIcon } from "lucide-react";
import { createStripePortal } from "@/action/createStripePortal";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

function UpgradeButton() {
  const { hasActiveMembership, loading } = useSubscriptions();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAccount = () => {
    startTransition(async () => {
      const stripePortalUrl = await createStripePortal();
      router.push(stripePortalUrl);
    });
  };

  if (!hasActiveMembership && !loading)
    return (
      <Button asChild variant="default" className="border-sky-600">
        <Link href="/dashboard/upgrade">
          Upgrade <StarIcon className="ml-3 fill-sky-500 text-white" />
        </Link>
      </Button>
    );

  if (loading)
    return (
      <Button variant="default" className="border-sky-500">
        <Loader2Icon className="animate-spin" />
      </Button>
    );

  return (
    <Button
      onClick={handleAccount}
      disabled={isPending}
      variant="default"
      className="border-sky-500 bg-sky-500"
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <p className="">
          <span className="font-bold">PRO</span> Account
        </p>
      )}
    </Button>
  );
}

export default UpgradeButton;
