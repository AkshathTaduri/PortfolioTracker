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
import axios from "axios";
import { PortfolioItem } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { AxiosError } from "axios";

export default function AddPortfolioDialog() {
  const [newItem, setNewItem] = useState<PortfolioItem>({
    name: "",
    position: "Long",
    symbol: "",
    recommended_by: "",
    shares: 0,
    cost_basis: 0,
  });

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleAddRow = async () => {
    if (newItem.shares === 0 || newItem.cost_basis === 0) {
      alert("Shares and Cost Basis must be non-zero.");
      return;
    }

    // Get authenticated user from Supabase
    const { data } = await supabase.auth.getUser();

    // Optional: Wait a bit in case Supabase is still loading
    await sleep(300); // ← tweak this if needed

    const userId = data?.user?.id;

    if (!userId) {
      alert("User not authenticated.");
      return;
    }

    try {
      const response = await axios.post<{ message: string }>(
        "/api/addPortfolioEntry",
        {
          ...newItem,
          user_id: userId, // sending user ID from client
        }
      );

      alert(response.data.message);

      // Reset form
      setNewItem({
        name: "",
        position: "Long",
        symbol: "",
        recommended_by: "",
        shares: 0,
        cost_basis: 0,
      });

      location.reload(); // or router.refresh() if you're in App Router
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      alert(err.response?.data?.error || "Error adding entry");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white">Add Row</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add Portfolio Item</DialogTitle>
        <p className="text-sm mt-2">Name:</p>
        <Input
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />

        {/* Dropdown for Position */}
        <p className="text-sm">Position:</p>
        <select
          className="w-full rounded-md border px-3 py-2 text-sm mt-2"
          value={newItem.position}
          onChange={(e) => setNewItem({ ...newItem, position: e.target.value })}
        >
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </select>

        <p className="text-sm">Symbol:</p>
        <Input
          value={newItem.symbol}
          onChange={(e) => setNewItem({ ...newItem, symbol: e.target.value })}
        />

        <p className="text-sm">Recommended By:</p>
        <Input
          value={newItem.recommended_by}
          onChange={(e) =>
            setNewItem({ ...newItem, recommended_by: e.target.value })
          }
        />

        <p className="text-sm">Shares:</p>
        <Input
          placeholder="Shares"
          type="number"
          value={newItem.shares}
          onChange={(e) =>
            setNewItem({ ...newItem, shares: Number(e.target.value) })
          }
        />

        <p className="text-sm">Cost Basis:</p>
        <Input
          placeholder="Cost Basis"
          type="number"
          step="0.01"
          value={newItem.cost_basis}
          onChange={(e) =>
            setNewItem({ ...newItem, cost_basis: Number(e.target.value) })
          }
        />

        <Button className="bg-green-500 text-white mt-4" onClick={handleAddRow}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
