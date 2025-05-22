"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const BackButton = () => {
  return (
    <div className="mb-6 w-fit cursor-pointer">
      <Link href="/tools">
        <Button variant="ghost" className="flex items-center gap-1 text-muted-foreground hover:text-white cursor-pointer">
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Button>
      </Link>
    </div>
  );
}

export default BackButton;