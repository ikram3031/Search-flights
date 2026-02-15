import { appMemory } from "./appMemory";
import { getToken } from "./token";

const BASE_URL = process.env.A4_BASE_URL || "https://wl-api.fly-4u.com";

export async function getAgentAppData() {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("Unable to retrieve valid token");
    }

    const response = await fetch(`${BASE_URL}/api/auth/agent/appdata`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AppData API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const apiIds = data?.agentInfo?.flightApis;

    if (!Array.isArray(apiIds)) {
      throw new Error("flightApis not found in agentInfo");
    }

    // Save to memory
    appMemory.apiIds = apiIds;

    return data;
  } catch (error) {
    console.error("getAgentAppData error:", error);
    throw error;
  }
}
