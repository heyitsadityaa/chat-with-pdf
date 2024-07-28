import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import { FilePlus2 } from "lucide-react";
import { Button } from "./ui/button";
import UpgradeButton from "./UpgradeButton";

const Header = () => {
  return (
    <div className="flex justify-between bg-white shadow-sm p-5 border-b">
      <Link href="/dashboard" className="text-2xl">
        Chat with <span className="text-sky-500">PDF</span>
      </Link>

      <SignedIn>
        <div className="flex items-center space-x-2">
          <Button asChild variant="link" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">My Documents</Link>
          </Button>
          <Button asChild variant="outline" className="border-sky-500">
            <Link href="/dashboard/upload">
              <FilePlus2 className="text-sky-500" />
            </Link>
          </Button>
          <UpgradeButton />
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};

export default Header;
