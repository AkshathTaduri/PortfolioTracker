import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updateData } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing portfolio item ID." }, { status: 400 });
  }

  const { error } = await supabase
    .from("portfolio")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Portfolio item updated successfully." });
}
