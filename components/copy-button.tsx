"use client";
import { Copy } from "lucide-react";
import { PropsWithChildren, useState } from "react";
import { Button } from "./ui/button";

export const CopyButton = ({
  text,
  children,
}: PropsWithChildren<{ text: string }>) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="ghost"
      className="w-full justify-between"
      aria-controls="collapsible-content"
    >
      <span>{copied ? "Copied!" : children}</span>
      <Copy className="mr-2 h-4 w-4" />
    </Button>
  );
};
