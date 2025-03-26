"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { PortfolioItem } from "@/types";
import EditPortfolioDialog from "@/components/EditPortfolioDialog";

interface Props {
  portfolio: PortfolioItem[];
  editMode: boolean;
  onUpdateRow: (item: PortfolioItem) => void;
  onDeleteRow: (id: string) => void;
}

export default function PortfolioTable({
  portfolio,
  editMode,
  onUpdateRow,
  onDeleteRow,
}: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="bg-green-700 text-white">Name</TableHead>
          <TableHead className="bg-green-700 text-white">Position</TableHead>
          <TableHead className="bg-green-700 text-white">Ticker</TableHead>
          <TableHead className="bg-green-700 text-white">
            Recommended By
          </TableHead>
          <TableHead className="bg-green-700 text-white">Shares</TableHead>
          <TableHead className="bg-green-700 text-white">Entry Price</TableHead>
          <TableHead className="bg-green-700 text-white">Cost Basis</TableHead>
          <TableHead className="bg-green-700 text-white">Last Price</TableHead>
          <TableHead className="bg-green-700 text-white">Change %</TableHead>
          <TableHead className="bg-green-700 text-white">% Portfolio</TableHead>
          <TableHead className="bg-green-700 text-white">Beta</TableHead>
          <TableHead className="bg-green-700 text-white">
            Market Value
          </TableHead>
          <TableHead className="bg-green-700 text-white">
            Unrealized G/L
          </TableHead>
          <TableHead className="bg-green-700 text-white">
            Unrealized G/L %
          </TableHead>
          <TableHead className="bg-green-700 text-white">Date</TableHead>
          {editMode && (
            <TableHead className="bg-green-700 text-white">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {portfolio.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.position}</TableCell>
            <TableCell>{item.ticker}</TableCell>
            <TableCell>{item.recommended_by}</TableCell>
            <TableCell>{item.shares}</TableCell>
            <TableCell>{item.entry_price}</TableCell>
            <TableCell>{(item.shares * item.entry_price).toFixed(2)}</TableCell>
            <TableCell>{item.last_price}</TableCell>

            {/* Change % */}
            <TableCell
              className={`text-center ${
                Number(item.change_percent) > 0
                  ? "bg-green-100 text-green-800"
                  : Number(item.change_percent) < 0
                  ? "bg-red-100 text-red-800"
                  : ""
              }`}
            >
              {item.change_percent}%
            </TableCell>

            <TableCell>{item.portfolio_percent}</TableCell>
            <TableCell>{item.beta}</TableCell>
            <TableCell>${item.market_value}</TableCell>

            {/* Unrealized G/L */}
            <TableCell
              className={`text-center ${
                Number(item.unrealized_gl) > 0
                  ? "bg-green-100 text-green-800"
                  : Number(item.unrealized_gl) < 0
                  ? "bg-red-100 text-red-800"
                  : ""
              }`}
            >
              {item.unrealized_gl}
            </TableCell>

            {/* Unrealized G/L % */}
            <TableCell
              className={`text-center ${
                Number(item.unrealized_gl_percent) > 0
                  ? "bg-green-100 text-green-800"
                  : Number(item.unrealized_gl_percent) < 0
                  ? "bg-red-100 text-red-800"
                  : ""
              }`}
            >
              {item.unrealized_gl_percent}%
            </TableCell>

            {/* ✅ New Date Column */}
            <TableCell>
              {item.date instanceof Date
                ? item.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Invalid date"}
            </TableCell>

            {editMode && (
              <TableCell>
                <EditPortfolioDialog
                  item={item}
                  onUpdate={onUpdateRow}
                  onDelete={onDeleteRow}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
