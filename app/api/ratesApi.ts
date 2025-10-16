import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FrankfurterLatest {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export const ratesApi = createApi({
  reducerPath: "ratesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.frankfurter.app/" }),
  endpoints: (builder) => ({
    getRateToUSD: builder.query<FrankfurterLatest, string>({
      query: (from) => `latest?from=${encodeURIComponent(from)}&to=USD`,
    }),
  }),
});

export const { useGetRateToUSDQuery } = ratesApi;
