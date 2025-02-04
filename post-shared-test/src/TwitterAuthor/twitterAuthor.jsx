import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  generateRandomString,
  generateCodeChallenge,
} from "../../utils/pkce";

const CLIENT_ID = "VE9JY0x1eTh2Vlpxc1ZUeFVyanQ6MTpjaQ";
const CLIENT_SECRET = "RntqmR8C_yFvYPnGN5PI108hsm6Lz2_K6fsfccETzbU4kV8C_P";
const REDIRECT_URI = "https://post-shared-test.vercel.app";

const TwitterAuth = () => {
  const handleLogin = async () => {
    // 1. Generate the code verifier and state
    const codeVerifier = generateRandomString(50);
    const state = generateRandomString(12);

    // 2. Generate the code challenge
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // 3. Store verifier + state so we can use them later
    sessionStorage.setItem("codeVerifier", codeVerifier);
    sessionStorage.setItem("state", state);

    // 4. Build the authorization URL
    const clientId = import.meta.env.VITE_TWITTER_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_TWITTER_REDIRECT_URI;
    const scope = "tweet.read users.read offline.access"; // customize scopes

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

    // 5. Redirect user to Twitter login
    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Twitter OAuth 2.0 PKCE Example</h1>
      <button onClick={handleLogin}>Login with Twitter</button>
    </div>
  );
};

export default TwitterAuth;
