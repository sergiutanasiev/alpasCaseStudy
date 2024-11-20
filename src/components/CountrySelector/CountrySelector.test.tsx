import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import CountrySelector from './CountrySelector';
import { Country } from './CountrySelector.types';


const mockCountries: Country[] = [
  { name: { common: 'Germany' }, cca2: 'DE', cca3: 'DEU', flag: '' },
  { name: { common: 'France' }, cca2: 'FR', cca3: 'FRA', flag: '' },
  { name: { common: 'Spain' }, cca2: 'ES', cca3: 'ESP', flag: '' },
];

jest.mock('react-query', () => ({
  useQuery: jest.fn().mockReturnValue(({ data: {...mockCountries} }))
}));

const queryClient = new QueryClient();

const renderWithQueryClient = (component: React.ReactNode) =>
  render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);

describe('CountrySelector Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('renders the input field', () => {
    renderWithQueryClient(<CountrySelector />);
    expect(screen.getByTestId('country-input')).toBeInTheDocument();
  });

  it('input has correct value', async () => {
    renderWithQueryClient(<CountrySelector />);
    const input = screen.getByTestId('country-input');

    await act(async () => {
      fireEvent.click(input);
      fireEvent.change(input, { target: { value: 'Germany' } });
    });
    expect(input).toHaveValue('Germany');
  });
});
