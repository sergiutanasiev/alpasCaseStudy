import React from 'react';
import './App.css';
import CountrySelector from './components/CountrySelector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <div>
        <CountrySelector></CountrySelector>
      </div>
    </div>
    </QueryClientProvider>
  );
}

export default App;
