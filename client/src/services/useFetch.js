/* THIS IS A CUSTOM HOOK - useFetch */
import {useState, useEffect } from 'react';

const useFetch = (url) => {
    // const [data, setData ] = useState(null);
    const [data, setData ] = useState();

    useEffect(() => {
        fetch(url)
        .then((res) => res.json())
        .then((data) => setData(data));
    }, [url])

    // return [data]    Data is 
    return data;
}

export default useFetch;