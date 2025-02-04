import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const TwitterCallback = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");
    const storedState = sessionStorage.getItem("state");
    const codeVerifier = sessionStorage.getItem("codeVerifier");

    if (!code || !returnedState) {
      setError("No code or state returned in the query params.");
      return;
    }
    if (returnedState !== storedState) {
      setError("State does not match. Possible CSRF attack.");
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        // Twitter's OAuth 2.0 token endpoint
        const url = "https://api.twitter.com/2/oauth2/token";

        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: "YOUR_TWITTER_CLIENT_ID", // same as used in your login step
          redirect_uri: "https://post-shared-test.vercel.app/auth/callback",
          code_verifier: codeVerifier,
        });

        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        if (!res.ok) {
          throw new Error(`Token request failed: ${res.statusText}`);
        }

        const data = await res.json();
        setTokenData(data);

        // Optionally, store the tokens in localStorage or a global state
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

  if (!tokenData) {
    return <p>Exchanging code for token...</p>;
  }

  return (
    <div>
      <h2>Callback Response</h2>
      <pre>{JSON.stringify(tokenData, null, 2)}</pre>
      <p>Access token: {tokenData.access_token}</p>
    </div>
  );
};

export default TwitterCallback;
