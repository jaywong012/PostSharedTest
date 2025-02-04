import React from "react";
import {
  generateRandomString,
  generateCodeChallenge,
} from "../../utils/pkce";

// Replace with your actual Client ID (not the base64-encoded "client_id:secret" version).
// Typically something like: "Tk12RU9Xc2Q1M1lEexampleL53Q6MTpjaQ"
const CLIENT_ID = "YOUR_TWITTER_CLIENT_ID"; 

// This should match exactly what you put in Twitter's "Callback URLs" list.
const REDIRECT_URI = "https://post-shared-test.vercel.app/auth/callback";

const TwitterAuth = () => {
  const handleLogin = async () => {
    // 1. Generate the code verifier and state
    const codeVerifier = generateRandomString(50);
    const state = generateRandomString(12);

    // 2. Generate the code challenge
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // 3. Store verifier + state so we can use them later (in your Callback page)
    sessionStorage.setItem("codeVerifier", codeVerifier);
    sessionStorage.setItem("state", state);

    // 4. Build the authorization URL
    const scope = "tweet.read users.read offline.access"; // customize scopes as needed

    const params = new URLSearchParams({
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope,
      state,
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
