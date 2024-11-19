import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './CountrySelector.css';


interface Country {
    name: {
        common: string
    };
    cca2: string;
    cca3: string;
}

// Sort the countries aphabetically
function sortCountriesAlphabetically (countries: Country[]): Country[] {
    return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

// Initial fetch call
async function fetchCountries (): Promise<Country[] | void> {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const sortedData = sortCountriesAlphabetically(data);
        return sortedData;
    } catch(error) {
        console.log(error);
    }
}

// Main component
function CountrySelector () {
    const [inputQuery, setInputQuery] = useState<string>('');
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [suggestedCountries, setSuggestedCountries] = useState<Country[]>([]);
    const [highlightedIndex, setHighlitedIndex] = useState<number>(-1);
    const [selectedCountry, setSelectedCountry] = useState<Country>();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: countries, isLoading } = useQuery({
        queryKey: ['countries'],
        queryFn: () => fetchCountries()
    });

    useEffect(() => {
        setFilteredCountries(countries || []);
    }, [countries])

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const searchQuery = e.target.value.toLowerCase();

        // Check for cca2 matches first ex: DE
        const caa2Matches = filteredCountries.filter(coutry => {
            return coutry.cca2.toLowerCase() === searchQuery;
        })

        let similarMatches = filteredCountries!.filter(country =>
            country.name.common.toLowerCase().includes(searchQuery)
        ).sort((a, b) =>
            a.name.common.toLowerCase().indexOf(searchQuery) - b.name.common.toLowerCase().indexOf(searchQuery)
        );

        if (caa2Matches.length > 0) {
            similarMatches = similarMatches.filter(country => {
                return caa2Matches[0].name.common !== country.name.common;
            })
        }

        setSuggestedCountries([...caa2Matches, ...similarMatches]);
    }

    function handleCountryClick(selectedIndex:number) {
        filteredCountries.filter((country, index) => {
            if (index === selectedIndex) {
                setHighlitedIndex(selectedIndex);
                setSelectedCountry(country);
                setInputQuery(country.name.common);
                setIsVisible(false);
                if (inputRef.current) {
                    inputRef.current.value = "";
                }
            }
        });
    }

    return (
        <div>
            {isVisible.toString()}
            {inputQuery.toString()}
            <label onClick={(e) => {e.preventDefault(); setIsVisible(!isVisible)}} htmlFor="input-query">
                <input
                    ref={inputRef} 
                    onChange={handleInputChange}
                    className={'country-input'}
                    type="text"
                    id="input-query"
                    name="input-query"
                    placeholder="Country" />
            </label>    
            {isVisible && (
                <ul className="countries-list">
                    {suggestedCountries.length > 0 && suggestedCountries.map((country, index) => (
                    <li
                        key={`suggested-${index}`}
                        onClick={() => handleCountryClick(index)}
                        className={highlightedIndex === index ? 'country-highlighted' : ''}
                    >
                        {country.name.common}
                        -asd-
                    </li>
                    ))}
                    {filteredCountries.map((country, index) => (
                    <li
                        key={`filtered-${index}`}
                        onClick={() => handleCountryClick(index)}
                        className={highlightedIndex === index ? 'country-highlighted' : ''}
                    >
                        {country.name.common}
                    </li>
                    ))}
                </ul>
                )}
        </div>
    )
}

export default CountrySelector;