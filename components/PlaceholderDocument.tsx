"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { FrownIcon, PlusCircleIcon } from "lucide-react";
import useSubscriptions from "@/hooks/useSubscriptions";

const PlaceholderDocument = () => {
  const { isOverFileLimit } = useSubscriptions();
  const router = useRouter();
  const handleClick = () => {
    // Check if the user is FREE tier and if theyre over the file.
    if (isOverFileLimit) {
      router.push("/dashboard/upgrade");
    } else {
      router.push("/dashboard/upload");
    }
  };
  return (
    <Button
      onClick={handleClick}
      className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-gray-200 drop-shadow-md text-gray-400"
    >
      {isOverFileLimit ? (
        <FrownIcon className="h-16 w-16" />
      ) : (
        <PlusCircleIcon className="h-16 w-16" />
      )}
      <p className="font-semibold">
        {isOverFileLimit ? "Upgrade to add more documents" : "Add a document"}
      </p>
    </Button>
  );
};

export default PlaceholderDocument;
