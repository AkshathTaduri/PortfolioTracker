"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PortfolioItem } from "@/types";
import { useState } from "react";
import axios from "axios";

export default function EditPortfolioDialog({
  item,
  onUpdate,
  onDelete,
}: {
  item: PortfolioItem;
  onUpdate: (updated: PortfolioItem) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem>(item);

  const handleUpdate = async () => {
    try {
      await axios.patch("/api/updatePortfolioEntry", editItem);
      onUpdate(editItem);
      setOpen(false);
    } catch {
      alert("Failed to update item");
    }
  };

  const handleDelete = async () => {
    if (!item.id) return;
    try {
      await axios.delete(`/api/deletePortfolioEntry?id=${item.id}`);
      onDelete(item.id);
      setOpen(false);
    } catch {
      alert("Failed to delete item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Portfolio Item</DialogTitle>

        <Input
          placeholder="Name"
          value={editItem.name}
          onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
        />
        <select
          className="w-full rounded-md border px-3 py-2 text-sm mt-2"
          value={editItem.position}
          onChange={(e) =>
            setEditItem({ ...editItem, position: e.target.value })
          }
        >
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </select>
        <Input
          placeholder="Symbol"
          value={editItem.symbol}
          onChange={(e) => setEditItem({ ...editItem, symbol: e.target.value })}
        />
        <Input
          placeholder="Recommended By"
          value={editItem.recommended_by}
          onChange={(e) =>
            setEditItem({ ...editItem, recommended_by: e.target.value })
          }
        />
        <Input
          placeholder="Shares"
          type="number"
          value={editItem.shares}
          onChange={(e) =>
            setEditItem({ ...editItem, shares: Number(e.target.value) })
          }
        />
        <Input
          placeholder="Cost Basis"
          type="number"
          step="0.01"
          value={editItem.cost_basis}
          onChange={(e) =>
            setEditItem({ ...editItem, cost_basis: Number(e.target.value) })
          }
        />

        <div className="flex justify-between mt-4">
          <Button className="bg-blue-600 text-white" onClick={handleUpdate}>
            Save Changes
          </Button>
          <Button className="bg-red-600 text-white" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
