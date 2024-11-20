import React from 'react';
import './App.css';
import CountrySelector from './components/CountrySelector/CountrySelector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <CountrySelector></CountrySelector>
      </QueryClientProvider>
    </div>
  );
}

export default App;
