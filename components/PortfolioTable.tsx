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
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Recommended By</TableHead>
          <TableHead>Shares</TableHead>
          <TableHead>Cost Basis</TableHead>
          <TableHead>Last Price</TableHead>
          <TableHead>Change %</TableHead>
          <TableHead>% Portfolio</TableHead>
          <TableHead>Beta</TableHead>
          <TableHead>Market Value</TableHead>
          <TableHead>Unrealized G/L</TableHead>
          <TableHead>Unrealized G/L %</TableHead>
          {editMode && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {portfolio.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.position}</TableCell>
            <TableCell>{item.symbol}</TableCell>
            <TableCell>{item.recommended_by}</TableCell>
            <TableCell>{item.shares}</TableCell>
            <TableCell>{item.cost_basis}</TableCell>
            <TableCell>{item.last_price}</TableCell>
            <TableCell>{item.change_percent}%</TableCell>
            <TableCell>{item.portfolio_percent}</TableCell>
            <TableCell>{item.beta}</TableCell>
            <TableCell>${item.market_value}</TableCell>
            <TableCell>{item.unrealized_gl}</TableCell>
            <TableCell>{item.unrealized_gl_percent}%</TableCell>
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
