// src/Callback.jsx

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Callback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [tokenResponse, setTokenResponse] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const storedState = sessionStorage.getItem("state");
    const codeVerifier = sessionStorage.getItem("codeVerifier");

    // Basic validation
    if (!code || !returnedState) {
      setError("No code or state returned in the query params.");
      return;
    }
    if (returnedState !== storedState) {
      setError("State does not match. Possible CSRF attack.");
      return;
    }

    // Exchange code for tokens
    const exchangeCodeForToken = async () => {
      try {
        const clientId = import.meta.env.VITE_TWITTER_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_TWITTER_REDIRECT_URI;

        const bodyParams = new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: clientId,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        });

        // Twitter token endpoint
        const response = await fetch("https://api.twitter.com/2/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams,
        });

        if (!response.ok) {
          throw new Error(`Token request failed: ${response.statusText}`);
        }

        const data = await response.json();
        setTokenResponse(data);

        // (Optionally) Store tokens in localStorage or cookie
        // localStorage.setItem("twitter_access_token", data.access_token);

      } catch (err) {
        setError(err.message);
      }
    };

    exchangeCodeForToken();
  }, [searchParams]);

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }

  if (!tokenResponse) {
    return <p>Exchanging code for token...</p>;
  }

  return (
    <div>
      <h2>Callback</h2>
      <pre>{JSON.stringify(tokenResponse, null, 2)}</pre>
      <p>Access token: {tokenResponse.access_token}</p>
      <p>Refresh token (if granted): {tokenResponse.refresh_token}</p>

      {/* Now you can use the access token to call Twitter APIs */}
    </div>
  );
}

export default Callback;
