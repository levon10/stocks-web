import './css/App.css'
import StockCard from './components/StockCard'
import Watchlist from './pages/Watchlist';
import Home from './pages/Home';
import {Routes, Route} from "react-router-dom"
import { StockProvider } from './contexts/StockContext';
import NavBar from './components/NavBar';

function App() {
  return (
    <StockProvider>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/watchlist" element={<Watchlist />}/>
        </Routes>
      </main>
    </StockProvider>
  );
}

export default App