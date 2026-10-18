import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  weight: string;
};

type SavedCalculation = {
  id: number;
  createdAt: string;
  products: Product[];
  totalGrams: string;
  totalPrice: string;
  currency: string;
};

const HISTORY_KEY = "gramsplit-history";

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "CAD", symbol: "C$" },
];

const initialProducts: Product[] = [
  { id: 1, name: "Product 1", weight: "250" },
  { id: 2, name: "Product 2", weight: "400" },
  { id: 3, name: "Product 3", weight: "350" },
];

function ScaleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 8.25h10M5.75 21h12.5a1.75 1.75 0 0 0 1.71-2.12l-2.2-10A2.4 2.4 0 0 0 15.42 7H8.58a2.4 2.4 0 0 0-2.34 1.88l-2.2 10A1.75 1.75 0 0 0 5.75 21Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 11.25v2.5m-2.2-1.25h4.4"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 10 .4 7m5.2 0 .4-7M4.5 7h15m-10.75 0 .5-2h5.5l.5 2m2.5 0-.65 12.2A2 2 0 0 1 15.1 21H8.9a2 2 0 0 1-2-1.8L6.25 7"
      />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 12a8.25 8.25 0 1 0 2.42-5.83L3.75 8.59m0 0V4.75m0 3.84h3.84M12 7.75V12l2.75 1.75"
      />
    </svg>
  );
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value || 0);
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalGrams, setTotalGrams] = useState("1000");
  const [totalPrice, setTotalPrice] = useState("42.50");
  const [currency, setCurrency] = useState("USD");
  const [nextId, setNextId] = useState(4);
  const [view, setView] = useState<"calculator" | "history">("calculator");
  const [saveStatus, setSaveStatus] = useState("Save calculation");
  const [history, setHistory] = useState<SavedCalculation[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const productWeight = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + (Number(product.weight) || 0),
        0,
      ),
    [products],
  );

  const totalWeightNumber = Number(totalGrams) || 0;
  const totalPriceNumber = Number(totalPrice) || 0;
  const allocationPercent =
    totalWeightNumber > 0 ? (productWeight / totalWeightNumber) * 100 : 0;

  const formatPrice = (value: number) => formatCurrency(value, currency);

  const updateProduct = (
    id: number,
    field: "name" | "weight",
    value: string,
  ) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const addProduct = () => {
    setProducts((current) => [
      ...current,
      { id: nextId, name: `Product ${nextId}`, weight: "" },
    ]);
    setNextId((id) => id + 1);
  };

  const removeProduct = (id: number) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const updateHistory = (items: SavedCalculation[]) => {
    setHistory(items);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  };

  const saveCalculation = () => {
    const calculation: SavedCalculation = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      products: products.map((product) => ({ ...product })),
      totalGrams,
      totalPrice,
      currency,
    };

    updateHistory([calculation, ...history]);
    setSaveStatus("Saved to history");
    window.setTimeout(() => setSaveStatus("Save calculation"), 1800);
  };

  const restoreCalculation = (calculation: SavedCalculation) => {
    setProducts(calculation.products.map((product) => ({ ...product })));
    setTotalGrams(calculation.totalGrams);
    setTotalPrice(calculation.totalPrice);
    setCurrency(calculation.currency);
    setNextId(
      Math.max(...calculation.products.map((product) => product.id), 0) + 1,
    );
    setView("calculator");
  };

  const deleteCalculation = (id: number) => {
    updateHistory(history.filter((calculation) => calculation.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#f4f5f2] px-4 py-8 text-[#17201c] sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173f34] text-white shadow-[0_8px_20px_rgba(23,63,52,0.18)]">
              <ScaleIcon />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.18em] text-[#66716c] uppercase">
                Weight-based pricing
              </p>
              <h1 className="text-xl font-semibold tracking-[-0.03em]">
                GramSplit
              </h1>
            </div>
          </div>
          <div className="flex rounded-xl bg-[#e8ebe8] p-1">
            <button
              type="button"
              onClick={() => setView("calculator")}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${
                view === "calculator"
                  ? "bg-white text-[#173f34] shadow-sm"
                  : "text-[#68726d] hover:text-[#173f34]"
              }`}
            >
              Calculator
            </button>
            <button
              type="button"
              onClick={() => setView("history")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 ${
                view === "history"
                  ? "bg-white text-[#173f34] shadow-sm"
                  : "text-[#68726d] hover:text-[#173f34]"
              }`}
            >
              <HistoryIcon />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#173f34] px-1 text-[10px] text-white">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {view === "calculator" ? (
        <section className="grid overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_24px_70px_rgba(31,44,38,0.09)] lg:grid-cols-[1.55fr_0.85fr]">
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-[#d47f25]">
                Price calculator
              </p>
              <h2 className="max-w-xl text-3xl font-semibold tracking-[-0.045em] text-[#17201c] sm:text-4xl">
                Split a total price by product weight.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#68726d] sm:text-base">
                Add each product and its weight. We’ll calculate its exact share
                of the total price.
              </p>
            </div>

            <div className="mb-3 hidden grid-cols-[1fr_150px_128px_36px] gap-3 px-1 text-[11px] font-bold tracking-[0.12em] text-[#8a938f] uppercase sm:grid">
              <span>Product</span>
              <span>Weight</span>
              <span className="text-right">Price</span>
              <span />
            </div>

            <div className="space-y-3">
              {products.map((product, index) => {
                const weight = Number(product.weight) || 0;
                const productPrice =
                  totalWeightNumber > 0
                    ? (weight / totalWeightNumber) * totalPriceNumber
                    : 0;

                return (
                  <div
                    key={product.id}
                    className="group grid grid-cols-[1fr_36px] gap-3 rounded-2xl border border-[#e5e8e5] bg-[#fbfcfa] p-3 transition-colors focus-within:border-[#8ba79d] sm:grid-cols-[1fr_150px_128px_36px] sm:items-center sm:bg-white sm:p-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#edf1ee] text-xs font-bold text-[#50605a]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <input
                        aria-label={`Name of product ${index + 1}`}
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#a7afab]"
                        value={product.name}
                        placeholder="Product name"
                        onChange={(event) =>
                          updateProduct(product.id, "name", event.target.value)
                        }
                      />
                    </div>

                    <label className="relative col-start-1 row-start-2 sm:col-start-2 sm:row-start-1">
                      <span className="mb-1 block text-[10px] font-bold tracking-wider text-[#909894] uppercase sm:hidden">
                        Weight
                      </span>
                      <input
                        aria-label={`Weight of ${product.name || `product ${index + 1}`} in grams`}
                        className="h-10 w-full rounded-xl border border-[#e2e6e3] bg-white px-3 pr-8 text-sm font-semibold outline-none transition focus:border-[#507b6c] focus:ring-3 focus:ring-[#507b6c]/10"
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={product.weight}
                        placeholder="0"
                        onChange={(event) =>
                          updateProduct(
                            product.id,
                            "weight",
                            event.target.value,
                          )
                        }
                      />
                      <span className="absolute right-3 bottom-2.5 text-xs font-medium text-[#89928e]">
                        g
                      </span>
                    </label>

                    <div className="col-start-1 row-start-3 flex items-center justify-between sm:col-start-3 sm:row-start-1 sm:block sm:text-right">
                      <span className="text-[10px] font-bold tracking-wider text-[#909894] uppercase sm:hidden">
                        Product price
                      </span>
                      <span className="text-sm font-bold text-[#173f34]">
                        {formatPrice(productPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-label={`Remove ${product.name || `product ${index + 1}`}`}
                      className="col-start-2 row-span-3 row-start-1 flex h-9 w-9 items-center justify-center self-center rounded-xl text-[#9aa19e] transition hover:bg-[#fff0ec] hover:text-[#b64c35] disabled:cursor-not-allowed disabled:opacity-30 sm:row-span-1"
                      disabled={products.length === 1}
                      onClick={() => removeProduct(product.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={addProduct}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#bdc8c2] text-sm font-semibold text-[#3d6256] transition hover:border-[#6b8f83] hover:bg-[#f7faf8]"
            >
              <span className="text-xl font-light leading-none">+</span>
              Add another product
            </button>
          </div>

          <aside className="flex flex-col bg-[#173f34] p-5 text-white sm:p-8 lg:p-10">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#a9c0b8] uppercase">
                Order details
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">
                Enter your totals
              </h3>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#c5d4cf]">
                  Total weight
                </span>
                <div className="relative">
                  <input
                    className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.08] px-4 pr-14 text-xl font-semibold text-white outline-none transition placeholder:text-white/30 focus:border-[#e5aa5c] focus:bg-white/[0.11] focus:ring-3 focus:ring-[#e5aa5c]/15"
                    type="number"
                    min="0"
                    step="any"
                    inputMode="decimal"
                    value={totalGrams}
                    placeholder="0"
                    onChange={(event) => setTotalGrams(event.target.value)}
                  />
                  <span className="absolute top-[18px] right-4 text-sm font-medium text-[#abc0b9]">
                    grams
                  </span>
                </div>
                <button
                  type="button"
                  className="mt-2 text-xs font-semibold text-[#e5aa5c] transition hover:text-[#f4c787]"
                  onClick={() => setTotalGrams(String(productWeight))}
                >
                  Use product total ({productWeight.toLocaleString()} g)
                </button>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-[#c5d4cf]">
                  Total price
                </span>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <span className="absolute top-[15px] left-4 text-lg text-[#abc0b9]">
                      {currencies.find((item) => item.code === currency)?.symbol}
                    </span>
                    <input
                      className="h-14 w-full rounded-2xl border border-white/15 bg-white/[0.08] pr-4 pl-10 text-xl font-semibold text-white outline-none transition placeholder:text-white/30 focus:border-[#e5aa5c] focus:bg-white/[0.11] focus:ring-3 focus:ring-[#e5aa5c]/15"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={totalPrice}
                      placeholder="0.00"
                      onChange={(event) => setTotalPrice(event.target.value)}
                    />
                  </div>
                  <select
                    aria-label="Currency"
                    className="h-14 rounded-2xl border border-white/15 bg-[#244e42] px-3 text-xs font-bold text-white outline-none focus:border-[#e5aa5c]"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                  >
                    {currencies.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
            </div>

            <div className="my-8 h-px bg-white/10" />

            <div className="rounded-[22px] bg-white p-5 text-[#17201c] shadow-[0_16px_35px_rgba(5,22,16,0.18)]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#75807b]">
                    Price allocated
                  </p>
                  <p className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[#173f34]">
                    {formatPrice(
                      totalWeightNumber > 0
                        ? (productWeight / totalWeightNumber) * totalPriceNumber
                        : 0,
                    )}
                  </p>
                </div>
                <span className="rounded-full bg-[#edf3ef] px-3 py-1.5 text-xs font-bold text-[#426b5d]">
                  {Math.min(allocationPercent, 999).toFixed(1)}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8ece9]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    allocationPercent > 100 ? "bg-[#c8654d]" : "bg-[#e69a38]"
                  }`}
                  style={{ width: `${Math.min(allocationPercent, 100)}%` }}
                />
              </div>
              <div className="mt-4 flex justify-between text-xs">
                <span className="text-[#75807b]">Products weight</span>
                <span
                  className={`font-bold ${
                    allocationPercent > 100
                      ? "text-[#b44f39]"
                      : "text-[#34453f]"
                  }`}
                >
                  {productWeight.toLocaleString()} /{" "}
                  {totalWeightNumber.toLocaleString()} g
                </span>
              </div>
              {allocationPercent > 100 && (
                <p className="mt-3 rounded-xl bg-[#fff0ec] px-3 py-2 text-xs font-medium leading-5 text-[#a84632]">
                  Product weights exceed the total by{" "}
                  {(productWeight - totalWeightNumber).toLocaleString()} g.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={totalWeightNumber <= 0 || totalPriceNumber <= 0}
              onClick={saveCalculation}
              className="mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#e5aa5c] px-4 text-sm font-bold text-[#173328] transition hover:bg-[#efb96e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HistoryIcon />
              {saveStatus}
            </button>

            <p className="mt-auto pt-8 text-xs leading-5 text-[#9db5ad]">
              Each price is calculated as product weight ÷ total weight × total
              price.
            </p>
          </aside>
        </section>
        ) : (
          <section className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_24px_70px_rgba(31,44,38,0.09)]">
            <div className="flex flex-col gap-5 border-b border-[#e8ebe8] p-6 sm:flex-row sm:items-end sm:justify-between sm:p-9">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#d47f25]">
                  Saved calculations
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
                  Your pricing history
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#68726d]">
                  Review or reuse your previous weight-based price splits.
                </p>
              </div>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => updateHistory([])}
                  className="self-start rounded-xl border border-[#e3e6e4] px-4 py-2.5 text-xs font-semibold text-[#9e4938] transition hover:border-[#e0b7ae] hover:bg-[#fff5f2] sm:self-auto"
                >
                  Clear all history
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex min-h-[440px] flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#edf2ef] text-[#496c60]">
                  <svg
                    aria-hidden="true"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3.75h10.5A1.75 1.75 0 0 1 19 5.5v15l-7-3.75-7 3.75v-15a1.75 1.75 0 0 1 1.75-1.75Z"
                    />
                  </svg>
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">
                  No saved calculations yet
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#74807b]">
                  Save a calculation to keep its product weights and prices
                  here for later.
                </p>
                <button
                  type="button"
                  onClick={() => setView("calculator")}
                  className="mt-6 rounded-xl bg-[#173f34] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#225446]"
                >
                  Go to calculator
                </button>
              </div>
            ) : (
              <div className="grid gap-4 p-5 sm:p-8 lg:grid-cols-2">
                {history.map((calculation) => {
                  const savedTotalGrams = Number(calculation.totalGrams) || 0;
                  const savedTotalPrice = Number(calculation.totalPrice) || 0;

                  return (
                    <article
                      key={calculation.id}
                      className="flex flex-col rounded-[22px] border border-[#e3e7e4] bg-[#fbfcfa] p-5"
                    >
                      <div className="flex items-start justify-between gap-4 border-b border-[#e4e8e5] pb-4">
                        <div>
                          <p className="text-lg font-bold tracking-[-0.03em] text-[#173f34]">
                            {formatCurrency(
                              savedTotalPrice,
                              calculation.currency,
                            )}
                          </p>
                          <p className="mt-1 text-xs text-[#7d8782]">
                            {new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }).format(new Date(calculation.createdAt))}
                          </p>
                        </div>
                        <div className="rounded-xl bg-[#edf2ef] px-3 py-2 text-right">
                          <p className="text-xs font-bold text-[#3e6256]">
                            {Number(
                              calculation.totalGrams,
                            ).toLocaleString()}{" "}
                            g
                          </p>
                          <p className="mt-0.5 text-[10px] text-[#7a8883]">
                            {calculation.products.length} product
                            {calculation.products.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>

                      <div className="my-4 space-y-3">
                        {calculation.products.map((product) => {
                          const productPrice =
                            savedTotalGrams > 0
                              ? ((Number(product.weight) || 0) /
                                  savedTotalGrams) *
                                savedTotalPrice
                              : 0;

                          return (
                            <div
                              key={product.id}
                              className="flex items-center justify-between gap-4 text-sm"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-[#34413c]">
                                  {product.name || "Unnamed product"}
                                </p>
                                <p className="mt-0.5 text-xs text-[#8a938f]">
                                  {(Number(product.weight) || 0).toLocaleString()}{" "}
                                  g
                                </p>
                              </div>
                              <span className="shrink-0 font-bold text-[#173f34]">
                                {formatCurrency(
                                  productPrice,
                                  calculation.currency,
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-auto flex gap-2 border-t border-[#e4e8e5] pt-4">
                        <button
                          type="button"
                          onClick={() => restoreCalculation(calculation)}
                          className="flex-1 rounded-xl bg-[#173f34] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#225446]"
                        >
                          Use again
                        </button>
                        <button
                          type="button"
                          aria-label="Delete calculation"
                          onClick={() => deleteCalculation(calculation.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e1e5e2] text-[#8d9692] transition hover:border-[#e0b7ae] hover:bg-[#fff3ef] hover:text-[#ad4e39]"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
