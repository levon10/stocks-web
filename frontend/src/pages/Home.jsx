import StockCard from "../components/StockCard";
import { useState, useEffect } from "react";
import { searchStocks, getTopStocks, getStockDetails } from "../services/api";
import "../css/Home.css"

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [stocks, setStocks] = useState([]);
    const [stockDetails, setStockDetails] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTopStocks = async () => {
            try {
                setLoading(true);
                const topStocks = await getTopStocks();
                setStocks(topStocks);
                
                // Get details for each stock
                const detailsMap = {};
                for (const stock of topStocks.slice(0, 25)) { // Limit API calls
                    try {
                        const details = await getStockDetails(stock.symbol);
                        detailsMap[stock.symbol] = details;
                    } catch (err) {
                        console.error(`Failed to load details for ${stock.symbol}:`, err);
                    }
                }
                setStockDetails(detailsMap);
            } catch (err) {
                console.error(err);
                setError("Failed to load stocks...");
            } finally {
                setLoading(false);
            }
        };

        loadTopStocks();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        if (loading) return;

        setLoading(true);
        try {
            const searchResults = await searchStocks(searchQuery);
            setStocks(searchResults);
            
            // Get details for search results
            const detailsMap = {};
            for (const stock of searchResults.slice(0, 25)) { // Limit API calls
                try {
                    const details = await getStockDetails(stock.symbol);
                    detailsMap[stock.symbol] = details;
                } catch (err) {
                    console.error(`Failed to load details for ${stock.symbol}:`, err);
                }
            }
            setStockDetails(detailsMap);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to search stocks...");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" 
                placeholder="Search for stocks by symbol or name..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}
            
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="stocks-grid">
                {stocks.map((stock) => {
                    const details = stockDetails[stock.symbol];
                    if (!details) return null;
                    return (
                        <StockCard 
                            stock={details} 
                            key={stock.symbol} 
                        />
                    );
                })}
              </div>
            )}
        </div>
    );
}

export default Home;