type MemoryStore = {
  token: string | null;
  tokenExpiry: number | null;
  apiIds: number[] | null;
};

export const appMemory: MemoryStore = {
  token: null,
  tokenExpiry: null,
  apiIds: null,
};
