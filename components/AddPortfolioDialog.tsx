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
    ticker: "",
    recommended_by: "",
    shares: 0,
    entry_price: 0,
    date: new Date(), // default to today
  });

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleAddRow = async () => {
    if (newItem.shares === 0 || newItem.entry_price === 0) {
      alert("Shares and Entry Price must be non-zero.");
      return;
    }

    const { data } = await supabase.auth.getUser();
    await sleep(300);

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
          user_id: userId,
        }
      );

      alert(response.data.message);

      setNewItem({
        name: "",
        position: "Long",
        ticker: "",
        recommended_by: "",
        shares: 0,
        entry_price: 0,
        date: new Date(),
      });

      location.reload();
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
          value={newItem.ticker}
          onChange={(e) => setNewItem({ ...newItem, ticker: e.target.value })}
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
          type="number"
          value={newItem.shares}
          onChange={(e) =>
            setNewItem({ ...newItem, shares: Number(e.target.value) })
          }
        />

        <p className="text-sm">Entry Price:</p>
        <Input
          type="number"
          step="0.01"
          value={newItem.entry_price}
          onChange={(e) =>
            setNewItem({ ...newItem, entry_price: Number(e.target.value) })
          }
        />

        {/* ✅ Date Input */}
        <p className="text-sm">Date:</p>
        <Input
          type="date"
          value={newItem.date.toISOString().split("T")[0]} // format as yyyy-mm-dd
          onChange={(e) =>
            setNewItem({
              ...newItem,
              date: new Date(e.target.value),
            })
          }
        />

        <Button className="bg-green-700 text-white mt-4" onClick={handleAddRow}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
