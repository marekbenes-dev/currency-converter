import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface FrankfurterLatest {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

type FrankfurterCurrencies = Record<string, string>;

export const ratesApi = createApi({
  reducerPath: "ratesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.frankfurter.app/" }),
  endpoints: (builder) => ({
    getRateToUSD: builder.query<FrankfurterLatest, string>({
      query: (from) => `latest?from=${encodeURIComponent(from)}&to=USD`,
    }),
    getCurrencies: builder.query<FrankfurterCurrencies, void>({
      query: () => "currencies",
    }),
  }),
});

export const { useGetRateToUSDQuery, useGetCurrenciesQuery } = ratesApi;
