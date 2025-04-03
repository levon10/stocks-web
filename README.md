# Stock Tracker

A modern React application for tracking stock market data and maintaining a personal watchlist of your favorite stocks.

## Features

- **Real-time Stock Data**: View current prices and percentage changes for stocks
- **Market Cap Information**: See market capitalization data for companies
- **Search Functionality**: Search for stocks by company name or symbol
- **Persistent Watchlist**: Save your favorite stocks to a watchlist that persists between sessions

## Demo

https://levon10.github.io/stocks-web/

## Technology Stack

- **Frontend**: React, React Router, Context API
- **API**: Finnhub Stock API
- **Storage**: Local Storage for watchlist persistence
- **Styling**: Custom CSS

## Usage

### Home Page
The home page displays the top stocks by market capitalization. You can search for specific stocks using the search bar at the top of the page.

### Watchlist
Click the star icon on any stock card to add it to your watchlist. Visit the Watchlist page to view all your saved stocks. The watchlist is saved in your browser's local storage and will persist even if you close the browser.

### Stock Information
Each stock card displays:
- Company name and symbol
- Current stock price
- Percentage change
- Market capitalization

## API Integration

This application uses the [Finnhub Stock API](https://finnhub.io/) to fetch stock data. The integration includes:

- Getting top stocks by market cap
- Searching for stocks by name or symbol
- Fetching detailed stock information including price, change percentage, and company profiles
