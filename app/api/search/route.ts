import { NextRequest, NextResponse } from "next/server";
import { getToken } from "@/lib/token";
import { getAgentAppData } from "@/lib/getAgentAppData";
import { appMemory } from "@/lib/appMemory";

const BASE_URL = process.env.A4_BASE_URL!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // check for apiIds in memory
    if (!appMemory.apiIds || appMemory.apiIds.length === 0) {
      await getAgentAppData();
    }

    const token = await getToken();
    // console.log("apiIds", appMemory.apiIds);
    const apiIds = appMemory.apiIds?.slice(0, 2);
    // debugger;

    if (!apiIds) {
      throw new Error("API IDs not found");
    }

    const requests = apiIds.map(async (apiId: number) => {
      let reqBody = JSON.stringify({
        ...body,
        ApiId: apiId,
      });
      // debugger;
      const response = await fetch(`${BASE_URL}/api/flights/search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-api-key": `${process.env.A4_API_KEY}`,
        },
        body: reqBody,
      });

      // debugger;
      console.log(`API ${apiId} response status:`, response.status);
      const res = await response.json();
      // debugger;

      return res;
    });
    // console.log("requests", requests);

    const responses = await Promise.allSettled(requests);
    // console.log("API responses:", responses);
    debugger;
    const successfulResponses = responses
      .filter(
        (r: any) =>
          r.status === "fulfilled" && r.value && Array.isArray(r.value.results),
      )
      .map((r: any) => r.value);

    // Merge results
    const combinedResults = successfulResponses.flatMap(
      (r) => r?.results || [],
    );

    // simplify the response
    const simplifiedResults = combinedResults
      .map((r) => {
        const outbound = r.flights?.[0];
        const inbound = r.flights?.[1];

        if (!outbound?.flightSegments?.length) return null;

        const firstOutbound = outbound.flightSegments[0];
        const lastOutbound =
          outbound.flightSegments[outbound.flightSegments.length - 1];

        const simplified: any = {
          id: r.resultID,
          flightKey: r.flightKey,
          airline: r.validatingCarrier,
          airlineCode: firstOutbound.airline?.code,
          apiId: r.apiId,
          price: r.totalFare?.totalFare ?? 0,
          currency: r.totalFare?.currency ?? "",
          stops: outbound.totalStops,
          duration: outbound.totalElapsedTime,

          outbound: {
            from: firstOutbound.departure?.airport?.airportCode,
            to: lastOutbound.arrival?.airport?.airportCode,
            depTime: firstOutbound.departure?.depTime,
            arrTime: lastOutbound.arrival?.arrTime,
            date: firstOutbound.departure?.depDate,
          },
        };

        if (inbound?.flightSegments?.length) {
          const firstInbound = inbound.flightSegments[0];
          const lastInbound =
            inbound.flightSegments[inbound.flightSegments.length - 1];

          simplified.inbound = {
            from: firstInbound.departure?.airport?.airportCode,
            to: lastInbound.arrival?.airport?.airportCode,
            depTime: firstInbound.departure?.depTime,
            arrTime: lastInbound.arrival?.arrTime,
            date: firstInbound.departure?.depDate,
          };
        }

        return simplified;
      })
      .filter(Boolean); // remove nulls

    return NextResponse.json({
      results: simplifiedResults,
    });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
