import { appMemory } from "./appMemory";

export async function getToken() {
  // Check if token is still valid
  if (
    appMemory.token &&
    appMemory.tokenExpiry &&
    Date.now() < appMemory.tokenExpiry - 60000
  ) {
    return appMemory.token;
  }

  // token api call
  const res = await fetch(`${process.env.A4_BASE_URL}/api/auth/app/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      appSecrate: process.env.A4_APP_SECRET,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate token");
  }

  const data = await res.json();

  const token = data.token;

  if (!data.isSuccess || !data.token) {
    throw new Error("Invalid token response");
  }

  appMemory.token = token;
  appMemory.tokenExpiry = new Date(data.expire).getTime();

  return token;
}
