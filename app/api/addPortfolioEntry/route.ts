import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    const { user_id, symbol, name, position, recommended_by, shares, entry_price } = await req.json();

    console.log(user_id);
    console.log(symbol);
    console.log(name);
    console.log(position);
    console.log(recommended_by);
    console.log(shares);
    console.log(entry_price);

    if (!user_id || !symbol || !name || !position || !shares || !entry_price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 🔹 Get the authenticated user


    // if (!user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // 🔹 Check if the user already has this symbol
    const { data: existingEntry } = await supabase
      .from("portfolio")
      .select("id")
      .eq("user_id", user_id)
      .eq("symbol", symbol)
      .single();

    if (existingEntry) {
      return NextResponse.json({ error: "Symbol already exists in portfolio" }, { status: 409 });
    }

    // 🔹 Insert new portfolio entry
    const { error: insertError } = await supabase.from("portfolio").insert({
      user_id: user_id, // Ensure the user_id is set correctly
      symbol,
      name,
      position,
      recommended_by,
      shares,
      entry_price,
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({ message: "Portfolio entry added successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error adding portfolio entry:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
