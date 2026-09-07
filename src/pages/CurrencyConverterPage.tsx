import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRightLeft, TrendingUp, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const FALLBACK_RATE = 84.5;

const CurrencyConverterPage = () => {
  const mountedRef = useRef(true);
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRate = async () => {
    try {
      if (!mountedRef.current) return;
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/currency-rate`);
      const data = await response.json();

      if (!response.ok || !data?.success || !data.rate) {
        throw new Error(data?.error || "Unable to load the live conversion rate.");
      }

      if (!mountedRef.current) return;
      setRate(Number(data.rate));
    } catch (err) {
      console.error(err);
      if (!mountedRef.current) return;
      setRate(FALLBACK_RATE);
      setError("Live rate temporarily unavailable. Showing the latest fallback value.");
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchRate();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const convertedAmount = useMemo(() => {
    const parsed = Number(amount) || 0;
    if (!rate) return 0;
    return parsed * rate;
  }, [amount, rate]);

  return (
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-border bg-background shadow-soft overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-10 bg-gradient-to-br from-forest/10 via-background to-background">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Live conversion</p>
              <h1 className="apple-headline text-4xl md:text-5xl mt-4 mb-4">Currency Converter</h1>
              <p className="text-muted-foreground apple-body max-w-md">
                Convert US dollars to Bhutanese Ngultrum using the current live rate sourced from Google Finance.
              </p>

              <div className="mt-8 rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Live rate</span>
                  <button
                    onClick={fetchRate}
                    className="inline-flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                    aria-label="Refresh exchange rate"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xl font-semibold text-foreground">
                  <span>1 USD</span>
                  <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                  <span>{loading || !rate ? "--" : `Nu ${rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}</span>
                </div>

                {error && (
                  <p className="mt-3 text-sm text-red-600">{error}</p>
                )}
              </div>
            </div>

            <div className="p-8 md:p-10">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm text-muted-foreground">Amount in USD</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-2 w-full px-4 py-3 rounded-2xl border border-border bg-background text-foreground text-lg outline-none focus:ring-2 focus:ring-foreground/10"
                  />
                </label>

                <div className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <TrendingUp className="w-4 h-4" />
                    Converted amount
                  </div>
                  <div className="text-3xl font-semibold text-foreground">
                    {loading || !rate ? "Loading..." : `Nu ${convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CurrencyConverterPage;
