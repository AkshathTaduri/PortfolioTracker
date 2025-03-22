"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/utils/supabase/client";
import axios from "axios";
import LogoutButton from "@/components/LogoutButton";
import AddPortfolioDialog from "@/components/AddPortfolioDialog";
import PortfolioTable from "@/components/PortfolioTable";
import { PortfolioItem } from "@/types";
import { Button } from "@/components/ui/button";

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE_URL = process.env.NEXT_PUBLIC_FINNHUB_BASE_URL;

export default function PortfolioPage() {
  const { user } = useUser();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    investedValue: "0.00",
    netExposure: "0.00",
    estimatedAUM: "0.00",
  });

  const [editMode] = useState(true); // Set to `true` for now; you can toggle this via UI later

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching portfolio:", error);
      } else {
        setPortfolio(data);
      }
      setLoading(false);
    };

    if (user) fetchPortfolio();
  }, [user, router]);

  useEffect(() => {
    const enrichPortfolio = async () => {
      let totalInvestedValue = 0;
      let longValue = 0;
      let shortValue = 0;

      const enrichedPortfolio = await Promise.all(
        portfolio.map(async (item) => {
          const stockData = await fetchStockData(item.symbol);
          const lastPrice = Number(stockData.last_price);
          const shares = Number(item.shares);
          const costBasis = Number(item.cost_basis);
          const position = item.position?.toLowerCase();

          const marketValue = lastPrice * shares;
          const unrealizedGL = marketValue - costBasis;
          const unrealizedGLPercent =
            costBasis !== 0
              ? ((unrealizedGL / costBasis) * (shares < 0 ? -1 : 1)).toFixed(2)
              : "N/A";

          totalInvestedValue += costBasis;

          if (position === "long") {
            longValue += marketValue;
          } else if (position === "short") {
            shortValue += Math.abs(marketValue);
          }

          return {
            ...item,
            ...stockData,
            market_value: marketValue,
            unrealized_gl: unrealizedGL.toFixed(2),
            unrealized_gl_percent: unrealizedGLPercent,
          };
        })
      );

      const estimatedAUM = longValue + shortValue;
      const netExposure =
        estimatedAUM !== 0
          ? (((longValue - shortValue) / estimatedAUM) * 100).toFixed(2)
          : "N/A";

      const finalPortfolio = enrichedPortfolio.map((item) => ({
        ...item,
        market_value: item.market_value?.toFixed(2),
        portfolio_percent:
          estimatedAUM !== 0
            ? (
                (Math.abs(Number(item.market_value)) / estimatedAUM) *
                100
              ).toFixed(2)
            : "N/A",
      }));

      setPortfolio(finalPortfolio);
      setSummary({
        investedValue: totalInvestedValue.toFixed(2),
        netExposure,
        estimatedAUM: estimatedAUM.toFixed(2),
      });
    };

    if (portfolio.length > 0) {
      enrichPortfolio();
      const interval = setInterval(enrichPortfolio, 20000);
      return () => clearInterval(interval);
    }
  }, [portfolio.length]);

  const fetchStockData = async (symbol: string) => {
    try {
      const finnhubResponse = await axios.get<{
        c: number;
        pc: number;
        d: number;
      }>(`${FINNHUB_BASE_URL}?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const betaResponse = await axios.get(`/api/fetchBeta?symbol=${symbol}`);
      const beta = (betaResponse.data as { beta: any }).beta;

      return {
        last_price: finnhubResponse.data.c,
        change_percent: finnhubResponse.data.pc
          ? ((finnhubResponse.data.d / finnhubResponse.data.pc) * 100).toFixed(
              2
            )
          : "N/A",
        portfolio_percent: "N/A",
        beta,
      };
    } catch (error) {
      console.error("Error fetching stock data:", error);
      return {
        last_price: "N/A",
        change_percent: "N/A",
        portfolio_percent: "N/A",
        beta: "N/A",
      };
    }
  };

  const onUpdateRow = async (updatedItem: PortfolioItem) => {
    const originalItem = portfolio.find((item) => item.id === updatedItem.id);
    if (!originalItem) return;

    // Check if there are actual changes
    const isChanged = Object.keys(updatedItem).some((key) => {
      return (
        updatedItem[key as keyof PortfolioItem] !==
        originalItem[key as keyof PortfolioItem]
      );
    });

    if (!isChanged) return; // No update needed

    try {
      const response = await fetch("/api/updatePortfolioEntry", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update:", errorData.error);
        return;
      }

      router.refresh(); // Refresh page only if update was successful
    } catch (err) {
      console.error("Error updating row:", err);
    }
  };

  const onDeleteRow = async (id: string) => {
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) {
      console.error("Error deleting row:", error);
      return;
    }
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
    router.refresh(); // Refresh the page after a delete
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Portfolio Tracker</h1>
        <LogoutButton />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button className="bg-blue-600 text-white">Refresh</Button>
        <AddPortfolioDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border">
          <h2 className="text-sm text-gray-500">Invested Value</h2>
          <p className="text-lg font-semibold">${summary.investedValue}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <h2 className="text-sm text-gray-500">Net Exposure</h2>
          <p className="text-lg font-semibold">{summary.netExposure}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border">
          <h2 className="text-sm text-gray-500">Estimated AUM</h2>
          <p className="text-lg font-semibold">${summary.estimatedAUM}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <PortfolioTable
            portfolio={portfolio}
            editMode={editMode}
            onUpdateRow={onUpdateRow}
            onDeleteRow={onDeleteRow}
          />
        </div>
      )}
    </div>
  );
}
