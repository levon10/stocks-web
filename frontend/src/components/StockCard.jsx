import "../css/StockCard.css";
import { useStockContext } from "../contexts/StockContext";
import { useState } from "react";

function StockCard({ stock }) {
    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useStockContext();
    const watching = isInWatchlist(stock.symbol);
    
    // Format market cap to be more readable
    const formatMarketCap = (marketCap) => {
        if (marketCap >= 1000000000000) {
            return `$${(marketCap / 1000000000000).toFixed(2)}T`;
        } else if (marketCap >= 1000000000) {
            return `$${(marketCap / 1000000000).toFixed(2)}B`;
        } else if (marketCap >= 1000000) {
            return `$${(marketCap / 1000000).toFixed(2)}M`;
        } else {
            return `$${marketCap.toLocaleString()}`;
        }
    };
    
    const handleWatchlistClick = (e) => {
        e.preventDefault();
        if (watching) {
            removeFromWatchlist(stock.symbol);
        } else {
            addToWatchlist(stock);
        }
    };

    return (
        <div className="stock-card">
            <div className="company-logo">
                {stock.logo ? (
                    <img src={stock.logo} alt={`${stock.name} logo`} />
                ) : (
                    <div className="logo-placeholder">{stock.symbol.charAt(0)}</div>
                )}
            </div>
            <div className="stock-overlay">
                <button 
                    className={`watchlist-btn ${watching ? "active" : ""}`} 
                    onClick={handleWatchlistClick}
                >
                    {watching ? "★" : "☆"}
                </button>
            </div>
            <div className="stock-info">
                <div className="stock-header">
                    <h3>{stock.name}</h3>
                    <p className="stock-symbol">{stock.symbol}</p>
                </div>
                <div className="stock-details">
                    <div className="price-container">
                        <p className="stock-price">${stock.price?.toFixed(2) || "N/A"}</p>
                        {stock.change !== undefined && (
                            <p className={`stock-change ${stock.change >= 0 ? "positive" : "negative"}`}>
                                {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                            </p>
                        )}
                    </div>
                </div>
                <p className="stock-market-cap">Market Cap: {formatMarketCap(stock.marketCap || 0)}</p>
            </div>
        </div>
    );
}

export default StockCard;