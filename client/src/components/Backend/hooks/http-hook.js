import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      // console.log("Working --- 1");
      setIsLoading(true);
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);
      // console.log("Working --- 2");
      try {
        // console.log("Working --- 3: " + url + " ---" + method +" --- ");
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });
        // console.log("Working --- 4");

        const responseData = await response.json();
        // console.log("Working --- 5");

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
        // console.log("Working --- 6");

        if (!response.ok) {
          // console.log("Not Working --- 7");
          throw new Error(responseData.message); 
        }
        // console.log("Working --- 7");

        setIsLoading(false);
        // console.log("WORKING -- HTTP-HOOK");
        return responseData;
      } 
      catch (err) {
        if(!err.message === 'The user aborted a request.'){
          setError(err.message)
          setIsLoading(false)
          throw err
        }
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
