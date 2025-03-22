import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol parameter" }, { status: 400 });
  }

  try {
    const yahooResponse = await yahooFinance.quoteSummary(symbol, { modules: ["summaryDetail"] });
    const beta = yahooResponse.summaryDetail?.beta ?? "N/A";
    
    return NextResponse.json({ beta });
  } catch (error) {
    console.error("Error fetching beta from Yahoo Finance:", error);
    return NextResponse.json({ error: "Failed to fetch beta" }, { status: 500 });
  }
}
