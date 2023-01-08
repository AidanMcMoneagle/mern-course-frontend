import { useState, useCallback, useEffect } from "react";

let logoutTimer;

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  // login with uid, token, expiration date.
  // create an expiration date. If no expiration date is passed in then we know user has just logged in.
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    // created a Date Object with current date in milliseconds from 1970 plus 1 hour.
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
    setUserId(null);
  }, []);

  // we check if token data in localstorage. if there is token Data and the expiration date (Milliseconds) is greater than the current time in milliseconds then we log in, using the userId, token and expiration date of the token.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login, logout]);

  // settimeout runs after tokenExpirationDate. Should re run whenever the token changes i.e. user is logged in.
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { userId, login, logout, token };
};

export default useAuth;
