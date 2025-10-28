import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    axiosInstance.get(url).then(res => {
      if (!mounted) return;
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      if (!mounted) return;
      setError(err);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
