import { useEffect, useMemo, useState } from "react";
import { useGetRateToUSDQuery, useGetCurrenciesQuery } from "~/api/ratesApi";
import ThemeToggle from "~/components/ThemeToggle";
import { formatCurrency, formatDateCZ } from "./format";
import { FALLBACK_CURRENCIES } from "./constants";
import type { Row } from "./types";

export function Converter() {
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("EUR");

  const {
    data: currenciesMap,
    isLoading: isCurrenciesLoading,
    isError: isCurrenciesError,
  } = useGetCurrenciesQuery();

  const currencyOptions = useMemo(() => {
    const src =
      currenciesMap && !isCurrenciesError ? currenciesMap : FALLBACK_CURRENCIES;
    return Object.entries(src)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [currenciesMap, isCurrenciesError]);

  useEffect(() => {
    const codes = new Set(currencyOptions.map((c) => c.code));
    if (!codes.has(currency) && currencyOptions.length > 0) {
      setCurrency(currencyOptions[0].code);
    }
  }, [currencyOptions, currency]);

  const { data, isFetching, isError } = useGetRateToUSDQuery(currency);
  const rateToUSD = data?.rates?.USD ?? (currency === "USD" ? 1 : undefined);

  const usdAmount = useMemo(() => {
    const n = Number(amount);
    if (!amount.trim() || Number.isNaN(n) || rateToUSD === undefined)
      return undefined;
    return n * rateToUSD;
  }, [amount, rateToUSD]);

  const [rows, setRows] = useState<Row[]>([]);
  const totalUSD = rows.reduce((sum, r) => sum + r.usdAmount, 0);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = Number(amount);
    if (!amount.trim() || Number.isNaN(n) || n < 0) return;
    if (isFetching || isError || rateToUSD === undefined) return;

    setRows((prev) => [
      ...prev,
      {
        originalAmount: n,
        originalCurrency: currency,
        usdAmount: n * rateToUSD,
        rateDateISO: data?.date ?? new Date().toISOString().slice(0, 10),
      },
    ]);
  }

  return (
    <main className="flex flex-col justify-center pt-12 md:pt-16 pb-4 container mx-auto md:p-6 p-4 mx-auto max-w-5xl">
      <header className="flex flex-col pb-8 flex-shrink-0 items-center">
        <h1 className="font-semibold text-2xl">Currency convertor</h1>
        <span className="font-medium text-lg">Zentity homework</span>
      </header>

      <div className="flex justify-center">
        <form
          onSubmit={onSubmit}
          className="flex w-full flex-col gap-4 items-start"
        >
          <div className="flex gap-4 w-full">
            <label className="block text-sm font-medium">
              Desired amount
              <input
                inputMode="decimal"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => {
                  const bad = ["e", "E", "+", "-"];
                  if (bad.includes(e.key)) e.preventDefault();
                }}
                onPaste={(e) => {
                  const text = e.clipboardData
                    .getData("text")
                    .trim()
                    .replace(",", ".");
                  if (!/^\d+(\.\d{0,2})?$/.test(text)) e.preventDefault();
                }}
                className="mt-1 w-full rounded-xl border border-foreground/20 px-3 py-2 bg-background"
                placeholder="e.g., 1000"
                name="amount"
                aria-label="Desired amount"
                aria-describedby="usd-hint"
                required
              />
            </label>

            <label className="block text-sm font-medium">
              Currency
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full rounded-xl border border-foreground/20 px-3 py-2 bg-background"
                name="currency"
                aria-label="Currency"
                required
                disabled={isCurrenciesLoading}
              >
                {isCurrenciesLoading &&
                  FALLBACK_CURRENCIES.map((C) => (
                    <option key={C.code} value={C.code}>
                      {C.code} — {C.name}
                    </option>
                  ))}
                {!isCurrenciesLoading &&
                  currencyOptions.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>
          <button
            type="submit"
            className="
              rounded-xl border px-4 py-2 font-medium transition
              border-foreground/20 hover:bg-foreground/5
              focus-visible:ring-2 focus-visible:ring-foreground/30
              disabled:opacity-50 disabled:cursor-not-allowed
              disabled:hover:bg-transparent disabled:border-foreground/10
              disabled:shadow-none disabled:focus-visible:ring-0
            "
            disabled={
              isFetching || isError || rateToUSD === undefined || !amount
            }
            title={
              isError
                ? "Could not fetch rate"
                : isFetching
                  ? "Fetching rate…"
                  : rateToUSD === undefined
                    ? "No USD rate"
                    : "Convert to US Dollars"
            }
          >
            Convert to US Dollars
          </button>
          <p
            id="usd-hint"
            aria-live="polite"
            className="basis-full text-sm mt-1 opacity-75"
          >
            {isFetching && "Fetching USD rate…"}
            {isError && "Could not fetch rate. Please try again."}
            {!isFetching && !isError && usdAmount !== undefined && (
              <>≈ {formatCurrency(usdAmount, "USD")}</>
            )}
            {!isFetching && !isError && !usdAmount && <>≈ ... USD</>}
          </p>
        </form>
      </div>

      {/* Results table */}
      <section className="mt-8">
        <div className="overflow-x-auto rounded-2xl border border-foreground/20">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Original</th>
                <th className="text-left px-4 py-3 font-medium">Converted</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-3 opacity-70" colSpan={2}>
                    No rows yet — enter an amount and click “Convert to US
                    Dollars”.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => (
                  <tr key={i} className="border-t border-foreground/10">
                    <td className="px-4 py-3">
                      {`${new Intl.NumberFormat("cs-CZ", {
                        maximumFractionDigits: 2,
                      }).format(r.originalAmount)} ${r.originalCurrency}`}
                    </td>
                    <td className="px-4 py-3">
                      {formatCurrency(r.usdAmount, "USD")}{" "}
                      <span className="opacity-70">
                        — according to conversion rate on{" "}
                        {formatDateCZ(r.rateDateISO)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-4 text-right font-medium">
          Total: {formatCurrency(totalUSD, "USD")}
        </div>
      </section>
      <div className="absolute right-[15px] top-[10px]">
        <ThemeToggle></ThemeToggle>
      </div>
    </main>
  );
}
