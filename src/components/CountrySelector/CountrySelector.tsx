import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './CountrySelector.css';
import { Country } from './CountrySelector.types';

// Sort the countries aphabetically
function sortCountriesAlphabetically (countries: Country[]): Country[] | void {
    if (countries.length === 0) {
        return
    }
    return countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

// Initial fetch call
async function fetchCountries (): Promise<Country[] | void> {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedData = sortCountriesAlphabetically(data);
        return sortedData;
    } catch(error) {
        console.log(error);
    }
}

// Main component
function CountrySelector () {
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [suggestedCountries, setSuggestedCountries] = useState<Country[]>([]);
    const [highlightedIndex, setHighlitedIndex] = useState<number>(-1);
    const [selectedCountry, setSelectedCountry] = useState<Country|null>(null);
    const [tempSelectedCountry, setTempSelectedCountry] = useState<Country|null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isSelectedCountryVisible, setIsSelectedCountryVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const mainContainer = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");

    const { data: countries } = useQuery({
        queryKey: ["countries"],
        queryFn: () => fetchCountries()
    });

    useEffect(() => {
        const lastSelectedCountry = localStorage.getItem("lastSelectedCountry");
        
        if (countries && countries.length > 0) {
            sortCountriesAlphabetically(countries || []);
            if (lastSelectedCountry) {
                let getCountry: any;
                getCountry = countries.filter(country => {
                    return country.cca2 === lastSelectedCountry;
                })
                // Set country from local storage
                setSelectedCountry(getCountry[0]);
                setIsSelectedCountryVisible(true);
            }
        }
        
        setFilteredCountries(countries || []);
        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        }
    }, [countries, setSelectedCountry]);

    // Close dropdown when clicked outside input or dropdown container
    function handleOutsideClick (e: any) {
        if (!mainContainer.current?.contains(e.target)) {
            setTempSelectedCountry(null);
            setQuery("");
            setIsVisible(false);
        }
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        // Reset suggested countries
        if (setSuggestedCountries.length > 0) {
            setSuggestedCountries([]);
        }

        // If input has text hide the currently selected country
        selectedCountry !== null && inputRef.current &&  inputRef.current.value.trim() !== "" ?
            setIsSelectedCountryVisible(false) : setIsSelectedCountryVisible(true)

        if (!isVisible) {
            setIsVisible(true);
        }

        // Check for cca2 matches first ex: DE
        const caa2Matches = filteredCountries.filter(coutry => {
            return coutry.cca2.toLowerCase() === e.target.value;
        })

        // Check for matching country name
        let similarMatches = filteredCountries!.filter(country =>
            country.name.common.toLowerCase().includes(e.target.value)
        ).sort((a, b) =>
            a.name.common.toLowerCase().indexOf(e.target.value) - b.name.common.toLowerCase().indexOf(e.target.value)
        );

        // Remove duplicates
        if (caa2Matches.length > 0) {
            similarMatches = similarMatches.filter(country => {
                return caa2Matches[0].name.common !== country.name.common;
            })
        }

        setQuery(e.target.value);
        setSuggestedCountries([...caa2Matches, ...similarMatches]);
        setHighlitedIndex(-1);
    }

    function handleCountryClick(selectedCountry:Country) {
        setSelectedCountry(selectedCountry);
        // Save new selected country to local storage
        localStorage.setItem("lastSelectedCountry", selectedCountry.cca2);
        // Clear values
        setQuery("");
        setIsSelectedCountryVisible(true);
        setIsVisible(false);
        setHighlitedIndex(-1);
    }

    function handleKeyDown (e: React.KeyboardEvent) {
        let targetList = suggestedCountries.length === 0 ? filteredCountries : suggestedCountries;

        if (e.key === "ArrowDown") {
            const index = Math.min(highlightedIndex + 1, targetList.length - 1)
            setHighlitedIndex(index);
            setTempSelectedCountry(targetList[index]);
            // Scroll into view if necessary
            const listItem = document.querySelector(`.countries-list li:nth-child(${index + 1})`);
            listItem?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        } else if (e.key === "ArrowUp") {
            const index = Math.max(highlightedIndex - 1, 0)
            setHighlitedIndex(index);
            setTempSelectedCountry(targetList[index]);
            // Scroll into view if necessary
            const listItem = document.querySelector(`.countries-list li:nth-child(${index + 1})`);
            listItem?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            setQuery("");
        }else if (e.key === "Enter") {
          if (highlightedIndex >= 0) {
            setTempSelectedCountry(null);
            console.log(targetList[highlightedIndex].name.common); // For debugging
            // Set a selected country from suggested countries or initial list
            setSelectedCountry(targetList[highlightedIndex]);
            // Display country name and flag over input value;
            setIsSelectedCountryVisible(true);
            setQuery("")
            inputRef.current!.value = "";
            // Clear suggested countries list
            setSuggestedCountries([]);
            setIsVisible(false);
            localStorage.setItem("lastSelectedCountry", targetList[highlightedIndex].cca2);
            // Clear highlight index
            setHighlitedIndex(-1);
          }
        }
    };
    
    function clearCountry() {
        setSelectedCountry(null);
        setQuery("");
        localStorage.removeItem("lastSelectedCountry");
    }

    return (
        <div className="country-selector" ref={mainContainer}>
            <label onClick={(e) => {e.preventDefault(); setIsVisible(!isVisible);}} htmlFor="input-query" data-testid="label">
                {tempSelectedCountry && (
                    <div className="selected-country temp-selection">
                        <div className="countr-flag">{tempSelectedCountry.flag}</div>
                        <div>{tempSelectedCountry.cca2}: {tempSelectedCountry.name.common}</div>
                    </div>
                )}
                {selectedCountry !== null && isSelectedCountryVisible && (
                    <div className="selected-country" onClick={() => inputRef.current?.focus()}>
                        <div>
                        <div className="countr-flag">{selectedCountry.flag}</div>
                        </div>
                        <div>{selectedCountry.cca2}: {selectedCountry.name.common}</div>
                        <div className="clear-country" onClick={() => clearCountry()}>Clear</div>
                    </div>
                )}
                <input
                    ref={inputRef}
                    value={query}
                    data-testid="country-input"
                    autoComplete="off"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className={"country-input"}
                    type="text"
                    id="input-query"
                    name="input-query"
                    placeholder="Country" />
            </label>    
            {isVisible && (
                <ul data-testid="country-list" className={`countries-list ${suggestedCountries.length > 0 ? 'suggested-list' : ''}`}>
                    {suggestedCountries.length > 0 && suggestedCountries.map((country, index) => (
                    <li
                        key={`suggested-${index}`}
                        onClick={() => handleCountryClick(country)}
                        className={`
                            ${highlightedIndex === index ? 'country-highlighted' : ''}
                            ${selectedCountry?.cca2 === country.cca2 ? 'currently-selected' : ''}`}>
                        {country.name.common}
                    </li>
                    ))}
                    {suggestedCountries.length === 0 && filteredCountries.map((country, index) => (
                    <li
                        key={`filtered-${index}`}
                        onClick={() => handleCountryClick(country)}
                        className={`
                            ${highlightedIndex === index ? 'country-highlighted' : ''}
                            ${selectedCountry?.cca2 === country.cca2 ? 'currently-selected' : ''}`}>
                        {country.name.common}
                    </li>
                    ))}
                </ul>
                )}
        </div>
    )
}

export default CountrySelector;