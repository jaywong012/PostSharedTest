import { signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";


const TwitterAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleTwitterLogin = async () => {
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User signed in:", result.user);
    } catch (err) {
      setError(err.message);
      console.error("Error signing in:", err);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <img src={user.photoURL} alt={user.displayName} />
        </div>
      ) : (
        <button onClick={handleTwitterLogin}>Login with Twitter</button>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default TwitterAuth;
