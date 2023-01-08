import { useState, useCallback, useRef, useEffect } from "react";

// useHttpClient handles isLoading and error state. The logic is the same for all requests so this is why we are exporting functionality into a custom hook that can be reused multiple times.
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // ref will be a piece of data that is not changed when the page re renders. Value is preserved in-between renders. Function will run again whenever the component which uses the hook re-renders. Stores data between re-render cycles.
  // initial value of activeHttpRequest.current = []
  const activeHttpRequests = useRef([]);

  // send request is configurable. Wrap in useCallback to ensure that the function never gets recreated when the component that uses the hook re renders.
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      const httpAbortCtrl = new AbortController(); // abort controller allows you to abort a wep request when desired. new AbortController() creates a new AbortController instance.
      activeHttpRequests.current.push(httpAbortCtrl);

      let responseData;
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal, // this associations the signal and controller with the fetch request and allows us to abort by calling AbortController.abort()
        });

        responseData = await response.json();

        // once the response is complete we remove the abortcontroller associated with the request from the array. from abort co
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
        throw error;
      }
      return responseData;
    },
    []
  );

  // will return this aswell so the componenets that use the hook can clear the error.
  const clearError = () => {
    setError(null);
  };

  // will only run the component mounts.
  // clean up function that is return from the useffect function will run before the next time useEffect runs again or when the compoenent that uses useEffect unmounts (in our case component that users our custom hook unmounts)
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((AbortController) =>
        AbortController.abort()
      );
    };
  }, []);

  // return the error state and isLoading state and sendRequest Function.
  return { error, isLoading, sendRequest, clearError };
};

// what if we are making a request but then switch the page. Important edge case. We will try and change the state of a componenent that is no longer on the screen (will create an error). In such case we will want to cancel the ongoing HttpRequest.

// We use logic in this file that ensures that we never continue with an HttpRequest that is on its way out if we switch away from the component that trigged the request.
