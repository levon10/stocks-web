// cvm9kchr01qnndmd1ku0cvm9kchr01qnndmd1kug
const API_KEY = "cvm9kchr01qnndmd1ku0cvm9kchr01qnndmd1kug";
const BASE_URL = "https://finnhub.io/api/v1";

export const getTopStocks = async () => {
    try {
        // First get a list of US stocks
        const response = await fetch(`${BASE_URL}/stock/symbol?exchange=US&token=${API_KEY}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
        }
        
        const allStocks = await response.json();
        
        // Filter to common stocks and get the profiles for market cap data
        const commonStocks = allStocks
            .filter(stock => stock.type === "Common Stock")
            .slice(0, 100);
        
        console.log(`Fetching company data for ${commonStocks.length} stocks...`);
        
        // Get market cap and company name data for each stock
        const stocksWithData = await Promise.all(
            commonStocks.map(async (stock) => {
                try {
                    const profileResponse = await fetch(
                        `${BASE_URL}/stock/profile2?symbol=${stock.symbol}&token=${API_KEY}`
                    );
                    
                    if (!profileResponse.ok) {
                        return { 
                            symbol: stock.symbol, 
                            name: stock.description, 
                            marketCap: 0 
                        };
                    }
                    
                    const profileData = await profileResponse.json();
                    
                    return {
                        symbol: stock.symbol,
                        name: profileData.name || stock.description,
                        marketCap: profileData.marketCapitalization || 0
                    };
                } catch (error) {
                    console.error(`Error fetching profile for ${stock.symbol}:`, error);
                    return { 
                        symbol: stock.symbol, 
                        name: stock.description, 
                        marketCap: 0 
                    };
                }
            })
        );
        
        // Sort by market cap (highest to lowest) and take top 10
        const topStocks = stocksWithData
            .sort((a, b) => b.marketCap - a.marketCap)
            .slice(0, 10);
            
        console.log("Top 10 companies by market cap:", topStocks);
        return topStocks;
    } catch (error) {
        console.error("Error fetching top stocks:", error);
        throw error;
    }
};

// Search for stocks by symbol or name
export const searchStocks = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}&token=${API_KEY}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API returned ${response.status}: ${JSON.stringify(errorData)}`);
        }
        
        const data = await response.json();
        
        if (!data.result || !Array.isArray(data.result)) {
            console.error("Unexpected API response format:", data);
            return [];
        }
        
        // Get company names for search results
        const results = data.result.slice(0, 10);
        const resultsWithNames = await Promise.all(
            results.map(async (item) => {
                try {
                    const profileResponse = await fetch(
                        `${BASE_URL}/stock/profile2?symbol=${item.symbol}&token=${API_KEY}`
                    );
                    
                    if (!profileResponse.ok) {
                        return { 
                            symbol: item.symbol, 
                            name: item.description 
                        };
                    }
                    
                    const profileData = await profileResponse.json();
                    
                    return {
                        symbol: item.symbol,
                        name: profileData.name || item.description
                    };
                } catch (error) {
                    return { 
                        symbol: item.symbol, 
                        name: item.description 
                    };
                }
            })
        );
        
        return resultsWithNames;
    } catch (error) {
        console.error("Error searching stocks:", error);
        throw error;
    }
};

// Get basic stock details
export const getStockDetails = async (symbol) => {
    try {
        // Fetch company profile data
        const profileResponse = await fetch(`${BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`);
        
        if (!profileResponse.ok) {
            const errorData = await profileResponse.json();
            throw new Error(`Profile API returned ${profileResponse.status}: ${JSON.stringify(errorData)}`);
        }
        
        const profileData = await profileResponse.json();
        
        if (Object.keys(profileData).length === 0) {
            throw new Error(`No profile data returned for ${symbol}`);
        }
        
        // Fetch current price data
        const quoteResponse = await fetch(`${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`);
        
        if (!quoteResponse.ok) {
            const errorData = await quoteResponse.json();
            throw new Error(`Quote API returned ${quoteResponse.status}: ${JSON.stringify(errorData)}`);
        }
        
        const quoteData = await quoteResponse.json();
        
        return {
            symbol,
            name: profileData.name || symbol,
            industry: profileData.finnhubIndustry || 'N/A',
            logo: profileData.logo || '',
            marketCap: (profileData.marketCapitalization || 0) * 1000000,
            country: profileData.country || 'N/A',
            exchange: profileData.exchange || 'N/A',
            price: quoteData.c || null, // Current price
            change: quoteData.dp || 0,  // Percentage change
            high: quoteData.h || null,  // High price of the day
            low: quoteData.l || null,   // Low price of the day
            open: quoteData.o || null,  // Open price of the day
            prevClose: quoteData.pc || null // Last closing price
        };
    } catch (error) {
        console.error(`Error fetching details for ${symbol}:`, error);
        throw error;
    }
};