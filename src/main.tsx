
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import App from './App.tsx';
import './index.css';

// Create a client with more lenient settings for development
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // More frequent refreshes in development
      retry: 1,
      refetchOnWindowFocus: false // Disable refetch on focus for easier development
    },
  },
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" attribute="class">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
