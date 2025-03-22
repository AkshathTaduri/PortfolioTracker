"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function AddPortfolioItem() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    symbol: "",
    recommended_by: "",
    shares: "",
    cost_basis: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");

    // Get the authenticated user's ID
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in to add portfolio items.");
      return;
    }

    // Insert the new portfolio item
    const { error } = await supabase.from("portfolio").insert({
      user_id: user.id,
      ...form,
      shares: parseInt(form.shares, 10),
      cost_basis: parseFloat(form.cost_basis),
    });

    if (error) {
      setError(error.message);
    } else {
      alert("Portfolio item added successfully!");
      setForm({
        name: "",
        position: "",
        symbol: "",
        recommended_by: "",
        shares: "",
        cost_basis: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 mt-4">
      {error && <p className="text-red-500">{error}</p>}
      <input name="name" placeholder="Name" onChange={handleChange} required />
      <input
        name="position"
        placeholder="Position"
        onChange={handleChange}
        required
      />
      <input
        name="symbol"
        placeholder="Symbol"
        onChange={handleChange}
        required
      />
      <input
        name="recommended_by"
        placeholder="Recommended By"
        onChange={handleChange}
      />
      <input
        name="shares"
        placeholder="Shares"
        type="number"
        onChange={handleChange}
        required
      />
      <input
        name="cost_basis"
        placeholder="Cost Basis"
        type="number"
        step="0.01"
        onChange={handleChange}
        required
      />
      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Add Portfolio Item
      </button>
    </form>
  );
}
