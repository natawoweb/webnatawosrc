
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { LanguageProvider } from "./contexts/LanguageContext"
import App from './App'
import './index.css'

// Create a client with more lenient settings for development
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // More frequent refreshes in development
      retry: 1,
      refetchOnWindowFocus: false // Disable refetch on focus for easier development
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="class">
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
