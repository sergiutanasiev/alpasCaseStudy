import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';


interface Country {
    name: {
        common: string
    };
    cca2: string;
    cca3: string;
}

async function fetchCountries () {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
}

function CountrySelector () {
    const [inputQuery, setInputQuery] = useState<string>('');
    const [allCountries, setAllCountries] = useState<Country[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
    const [highlightedIndex, setHighlitedIndex] = useState<number>(-1);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data: countries, isLoading } = useQuery({
        queryKey: ['countries'],
        queryFn: () => fetchCountries()
    });

    useEffect(() => {
        setAllCountries(countries || []);
    })

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputQuery(e.target.value);
    }

    return (
        <div>
            <input
                value={inputQuery}
                ref={inputRef} 
                onChange={handleInputChange}
                className={'country-input'}
                type="text" />
            <div>
                {allCountries.map((el, index) => (
                    <div>{el.name.common}</div>
                ))}    
            </div>    
        </div>
    )
}

export default CountrySelector;