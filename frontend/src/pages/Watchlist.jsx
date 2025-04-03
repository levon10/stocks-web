import "../css/Watchlist.css"
import { useStockContext } from "../contexts/StockContext";
import StockCard from "../components/StockCard";
import { useEffect, useState } from "react";
import { getStockDetails } from "../services/api";

function Watchlist() {
    const { watchlist } = useStockContext();
    const [updatedStocks, setUpdatedStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const updateStockData = async () => {
            if (watchlist.length === 0) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const updatedData = [];
                
                for (const stock of watchlist) {
                    try {
                        // Get fresh stock data
                        const details = await getStockDetails(stock.symbol);
                        updatedData.push(details);
                    } catch (err) {
                        console.error(`Failed to update ${stock.symbol}:`, err);
                        // Use cached data if update fails
                        updatedData.push(stock);
                    }
                }
                
                setUpdatedStocks(updatedData);
                setError(null);
            } catch (err) {
                console.error("Error updating watchlist data:", err);
                setError("Failed to update stock data");
                // Use cached data
                setUpdatedStocks(watchlist);
            } finally {
                setLoading(false);
            }
        };
        
        updateStockData();
    }, [watchlist]);
  
    if (loading) {
        return <div className="loading">Updating stock data...</div>;
    }
    
    if (error) {
        return <div className="error-message">{error}</div>;
    }
  
    if (watchlist.length > 0) {
        return (
            <div className="watchlist">
                <h2>Your Watchlist</h2>
                <div className="stocks-grid">
                    {updatedStocks.map((stock) => (
                        <StockCard stock={stock} key={stock.symbol} />
                    ))}
                </div>
            </div>
        );
    }
  
    return (
        <div className="watchlist-empty">
            <h2>Your Watchlist is Empty</h2>
            <p>Start adding stocks to your watchlist and they will appear here!</p>
        </div>
    );
}

export default Watchlist;