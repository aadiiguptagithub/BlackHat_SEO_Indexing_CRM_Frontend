import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

export function DeleteMediaDialog({ isOpen, onClose, onConfirm, mediaName }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Media Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {mediaName}? This action cannot be
            undone.
            {/* Optional warning about usage in orders */}
            <p className="mt-2 text-yellow-600">
              Warning: If this media type is used in any orders, those
              references will remain unchanged.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
