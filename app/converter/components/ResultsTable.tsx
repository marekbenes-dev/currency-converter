import { memo, useMemo } from "react";
import { formatCurrency, formatDateCZ } from "../format";
import type { Row } from "../types";

interface Props {
  rows: Row[];
  totalUSD: number;
}

const ResultsTable = memo(function ResultsTable({ rows, totalUSD }: Props) {
  // Create a number formatter once per component instance
  const nf = useMemo(
    () => new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }),
    [],
  );

  return (
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
                <tr id={String(i)} className="border-t border-foreground/10">
                  <td className="px-4 py-3">
                    {`${nf.format(r.originalAmount)} ${r.originalCurrency}`}
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

      <div className="mt-4 text-right font-medium">
        Total: {formatCurrency(totalUSD, "USD")}
      </div>
    </section>
  );
});

export default ResultsTable;
