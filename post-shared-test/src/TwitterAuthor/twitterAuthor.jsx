import React, { useEffect, useState } from "react";
import axios from "axios";

const CLIENT_ID = "VE9JY0x1eTh2Vlpxc1ZUeFVyanQ6MTpjaQ";
const CLIENT_SECRET = "RntqmR8C_yFvYPnGN5PI108hsm6Lz2_K6fsfccETzbU4kV8C_P";
const REDIRECT_URI = "https://post-shared-test.vercel.app";

const TwitterAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            exchangeCodeForToken(code);
        }
    }, []);

    const exchangeCodeForToken = async (code) => {
        try {
            const response = await axios.post(
                "https://api.twitter.com/2/oauth2/token",
                new URLSearchParams({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    code_verifier: "challenge",
                }).toString(),
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );

            const accessToken = response.data.access_token;
            fetchUserProfile(accessToken);
        } catch (error) {
            console.error("Error exchanging code for token:", error);
        }
    };

    const fetchUserProfile = async (token) => {
        try {
            const response = await axios.get("https://api.twitter.com/2/users/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    return (
        <div>
            {!user ? (
                <button onClick={() => window.location.href = "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=VE9JY0x1eTh2Vlpxc1ZUeFVyanQ6MTpjaQ&redirect_uri=https://post-shared-test.vercel.app&scope=tweet.read%20users.read%20offline.access&state=randomstring&code_challenge=challenge&code_challenge_method=plain"}>
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