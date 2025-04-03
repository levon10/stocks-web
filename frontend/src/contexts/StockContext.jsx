import {createContext, useState, useContext, useEffect} from "react"

const StockContext = createContext()

export const useStockContext = () => useContext(StockContext)

export const StockProvider = ({children}) => {
    const [watchlist, setWatchlist] = useState([])

    useEffect(() => {
        const storedWatchlist = localStorage.getItem("watchlist")
        if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist))
    }, [])

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist))
    }, [watchlist])

    const addToWatchlist = (stock) => {
        setWatchlist(prev => [...prev, stock])
    }

    const removeFromWatchlist = (stockSymbol) => {
        setWatchlist(prev => prev.filter(stock => stock.symbol !== stockSymbol))
    }

    const isInWatchlist = (stockSymbol) => {
        return watchlist.some(stock => stock.symbol === stockSymbol)
    }

    const value = {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist
    }

    return <StockContext.Provider value={value}>
        {children}
    </StockContext.Provider>
}