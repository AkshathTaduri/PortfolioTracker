"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EditCashDialogProps {
  currentCash: number;
  onSave: (newCash: number) => void;
}

export default function EditCashDialog({
  currentCash,
  onSave,
}: EditCashDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputCash, setInputCash] = useState<number>(currentCash);

  const handleSave = () => {
    if (isNaN(inputCash)) {
      alert("Please enter a valid number.");
      return;
    }
    onSave(inputCash);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-xs text-blue-600 p-0 h-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Cash Balance</DialogTitle>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">Enter new cash amount:</p>
          <Input
            type="number"
            step="0.01"
            value={inputCash}
            onChange={(e) => setInputCash(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 text-white" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
