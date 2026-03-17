// backend/routes/githubOAuth.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// Login → GitHub authorization screen
router.get("/login", (req, res) => {
  const redirectUrl =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${CLIENT_ID}` +
    "&scope=repo,user:email";

  res.redirect(redirectUrl);
});

// GitHub callback → Exchange code for access token
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) throw new Error("No access token returned by GitHub");
    req.session.githubToken = accessToken;

    // Attempt to fetch the user's email list, fallback to /user if needed
    let email = null;
    try {
      const emailRes = await axios.get("https://api.github.com/user/emails", {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github+json"
        },
      });

      if (Array.isArray(emailRes.data) && emailRes.data.length > 0) {
        const primary = emailRes.data.find((e) => e.primary) || emailRes.data[0];
        email = primary?.email || null;
      }
    } catch (e) {
      // ignore and fallback to /user
      console.warn("Could not fetch /user/emails, falling back to /user:", e.message);
    }

    if (!email) {
      const userRes = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: "application/vnd.github+json"
        },
      });
      email = userRes.data?.email || null; // may be null if private
    }

    req.session.githubEmail = email || null;

    // Redirect back to frontend; use environment value if provided
    const REDIRECT = process.env.GITHUB_OAUTH_REDIRECT || "http://localhost:5173/workspace";
    res.redirect(REDIRECT);
  } catch (err) {
    console.error("GitHub OAuth Error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "GitHub OAuth Error", details: err.response?.data || err.message });
  }
});

// Check if logged in
router.get("/status", (req, res) => {
  res.json({
    connected: !!req.session.githubToken,
    email: req.session.githubEmail || null,
  });
});

module.exports = router;
