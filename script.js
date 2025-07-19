const clientId = "42537"; // your Client ID
const clientSecret = "NzdXWHPlZZX3rBQ2kLfwBfgUxVximh4lXKahheoP"; // insert your secret here
const userId = "37813409"; // your osu! user ID

async function getAccessToken() {
  const res = await fetch("https://osu.ppy.sh/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
      scope: "public",
    }),
  });

  const data = await res.json();
  return data.access_token;
}

async function getUserData(token) {
  const res = await fetch(`https://osu.ppy.sh/api/v2/users/${userId}/osu`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}

async function updateStats() {
  try {
    const token = await getAccessToken();
    const user = await getUserData(token);

    document.querySelector("#username").textContent = user.username;
    document.querySelector(".profile-pic").src = user.avatar_url;
    document.querySelector("#profile-link").href = `https://osu.ppy.sh/users/${userId}`;
    document.querySelector("#rank").textContent = `#${user.statistics.global_rank}`;
    document.querySelector("#pp").textContent = `${user.statistics.pp.toFixed(0)}pp`;
    document.querySelector("#accuracy").textContent = `${user.statistics.hit_accuracy.toFixed(2)}%`;
    document.querySelector("#plays").textContent = user.statistics.play_count;
  } catch (err) {
    console.error("Error fetching osu! data:", err);
    document.querySelector(".stats").textContent = "❌ Failed to load osu! stats.";
  }
}

updateStats();
