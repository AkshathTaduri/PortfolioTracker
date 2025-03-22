export interface PortfolioItem {
    id?: string;
    user_id?: string;
    name: string;
    position: string;
    symbol: string;
    recommended_by: string;
    shares: number;
    entry_price: number;
    cost_basis?: number;
    last_price?: number | string;
    change_percent?: number | string;
    portfolio_percent?: number | string;
    beta?: number | string;
    market_value?: number | string;
    unrealized_gl?: number | string;
    unrealized_gl_percent?: number | string;
  }
  