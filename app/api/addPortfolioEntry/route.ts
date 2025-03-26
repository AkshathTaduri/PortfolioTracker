import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function POST(req: Request) {
  try {
    const {
      user_id,
      ticker,
      name,
      position,
      recommended_by,
      shares,
      entry_price,
      date,
    } = await req.json();

    console.log(user_id, ticker, name, position, recommended_by, shares, entry_price, date);

    if (
      !user_id ||
      !ticker ||
      !name ||
      !position ||
      !shares ||
      !entry_price ||
      !date
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔹 Check if the user already has this symbol
    const { data: existingEntry } = await supabase
      .from("portfolio")
      .select("id")
      .eq("user_id", user_id)
      .eq("symbol", ticker)
      .single();

    if (existingEntry) {
      return NextResponse.json(
        { error: "Symbol already exists in portfolio" },
        { status: 409 }
      );
    }

    // 🔹 Insert new portfolio entry
    const { error: insertError } = await supabase.from("portfolio").insert({
      user_id,
      ticker,
      name,
      position,
      recommended_by,
      shares,
      entry_price,
      date, // ✅ include date here
    });

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json(
      { message: "Portfolio entry added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding portfolio entry:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
