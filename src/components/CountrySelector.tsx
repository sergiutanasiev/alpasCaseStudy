import React from 'react';
import { useQuery } from '@tanstack/react-query';


interface Country {
    name: {};
    cca2: string;
    cca3: string;
}

async function fetchCountries () {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error) {
        console.log(error);
    }
}

function CountrySelector () {

    const { data, isLoading } = useQuery({
        queryKey: ['countries'],
        queryFn: () => fetchCountries()
    });

    React.useEffect(() => {

    }, [])


    return (
        <div></div>
    )
}

export default CountrySelector;