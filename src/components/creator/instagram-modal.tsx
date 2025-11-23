"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

type InstagramModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handle: string;
  redirectUrl: string;
};

export function InstagramModal({
  isOpen,
  onClose,
  handle,
  redirectUrl,
}: InstagramModalProps) {

  const handleRedirect = () => {
    window.open(redirectUrl, '_blank');
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <Instagram />
            Follow on Instagram
          </DialogTitle>
          <DialogDescription>
            Click the button below to visit the creator's Instagram profile and stay updated.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
            <p className="text-lg font-semibold">@{handle}</p>
        </div>
        <DialogFooter>
          <Button onClick={handleRedirect} className="w-full gap-2" size="lg">
            <Instagram />
            Open Instagram
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
