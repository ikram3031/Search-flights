# Flight Search System

## Tech Stack

- Next js
- Typesript
- Tailwind css
- Shad cn

## Frontend Handling

- Search form collects:
  - Origin
  - Destination
  - Departure date
  - Return date (if round trip)
- Request is sent to `/api/search`
- Loading state is managed using React state
- Results are displayed with infinite scroll (10 at a time)

## System Flow

The search application follows this required flow:

```
Generate Token
→ Fetch App Data
→ Extract Flight API IDs
→ Select Two
→ Execute Parallel Search
→ Merge Results
→ Simplify Data
→ Return Results
```

## 1️⃣ Token Handling

Token generation is implemented as a reusable utility function.

### How It Works

When `getToken()` is called:

- If a valid token already exists in memory → return it
- If not → call auth API → store token in memory → return it

## 2️⃣ getAppData Handling

Similar to token logic, `getAppData()` is implemented as a utility function.

### How It Works

- If `flightApis` already exist in memory → return from memory
- Otherwise:
  - Call `getAppData` API
  - Extract `flightApis`
  - Store in memory
  - Return data

## 3️⃣ Next.js API Route

```
app/api/search/route.ts
```

### Responsibilities

- Receive search request from frontend
- Get token (from memory or API)
- Get flight API IDs (from memory or API)
- Select any two APIs
- Execute parallel search
- Merge results
- Simplify result structure
- Return clean response

## 4️⃣ Parallel Flight Search (Multi-Supplier)

From the available `flightApis`, two APIs are selected.

These two APIs are called asynchronously.

### Implementation Strategy

`Promise.allSettled()` is used instead of `Promise.all()`.

## Assumptions & Simplifications

- Passenger selection is currently hardcoded to:
  - 1 Adult (ADT)
- Cabin class is fixed to Economy
- Two API IDs are selected from available flight APIs

These simplifications were made to focus on:

- Backend integration
- Multi-supplier orchestration
- Secure API handling
- Result merging logic
