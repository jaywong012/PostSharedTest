import React, { useEffect, useState } from "react";
import axios from "axios";

const CLIENT_ID = "VE9JY0x1eTh2Vlpxc1ZUeFVyanQ6MTpjaQ";
const CLIENT_SECRET = "RntqmR8C_yFvYPnGN5PI108hsm6Lz2_K6fsfccETzbU4kV8C_P";
const REDIRECT_URI = "https://post-shared-test.vercel.app";

const TwitterAuth = () => {
  const [user, setUser] = useState(null);
  // Save the personalization id (if returned)
  const [personalizationId, setPersonalizationId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code) => {
    try {
      const tokenResponse = await axios.post(
        "https://api.twitter.com/2/oauth2/token",
        new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
          code_verifier: "challenge", // Make sure this matches the one used in the authorize URL
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      // Assuming Twitter now returns a personalization_id in the token response,
      // extract it (if not, you may need to fetch it via another endpoint)
      const { access_token, personalization_id } = tokenResponse.data;

      // Save the personalization id for later use.
      setPersonalizationId(personalization_id);

      fetchUserProfile(access_token, personalization_id);
    } catch (error) {
      console.error("Error exchanging code for token:", error.response?.data || error);
    }
  };

  const fetchUserProfile = async (token, personalizationId) => {
    try {
      // Some endpoints (or future calls like posting a tweet) require that you include
      // a personalization id. In this GET call, we add it to the headers.
      const userResponse = await axios.get("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Twitter-Personalization-Id": personalizationId,
        },
      });
      setUser(userResponse.data);
    } catch (error) {
      console.error("Error fetching user profile:", error.response?.data || error);
    }
  };

  // Example function to post a tweet that requires personalization_id
  const postTweet = async (token, personalizationId, tweetText) => {
    try {
      const tweetResponse = await axios.post(
        "https://api.twitter.com/2/tweets",
        { text: tweetText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Twitter-Personalization-Id": personalizationId,
          },
        }
      );
      console.log("Tweet posted:", tweetResponse.data);
    } catch (error) {
      console.error("Error posting tweet:", error.response?.data || error);
    }
  };

  return (
    <div>
      {!user ? (
        <button
          onClick={() =>
            (window.location.href =
              "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=VE9JY0x1eTh2Vlpxc1ZUeFVyanQ6MTpjaQ&redirect_uri=https://post-shared-test.vercel.app&scope=tweet.read%20users.read%20offline.access&state=randomstring&code_challenge=challenge&code_challenge_method=plain")
          }
        >
          Login with Twitter
        </button>
      ) : (
        <div>
          <h3>Welcome, {user.data.name}</h3>
          <p>Twitter ID: {user.data.id}</p>
        </div>
      )}
    </div>
  );
};

export default TwitterAuth;
