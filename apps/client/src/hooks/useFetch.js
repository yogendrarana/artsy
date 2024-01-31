import api from '../api/api';
import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const { data, status } = await api.get(url);

                if (status !== 200) {
                    throw new Error("An error occurred while fetching data.");
                }

                if (isMounted) {
                    setData(data);
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error.message);
                    setIsLoading(false);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [url]);

    return { data, error, isLoading };
};

export default useFetch;