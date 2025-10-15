export const formatCurrency = (value: number, curr: string) => {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: curr,
    currencyDisplay: "code",
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDateCZ = (yyyyMmDd: string) => {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).toLocaleDateString(
    "cs-CZ",
  );
};
