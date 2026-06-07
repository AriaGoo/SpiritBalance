import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import {
  BAIJIU_DEGREES,
  BAIJIU_AMOUNTS,
  BEER_BRANDS,
  calculatePureAlcohol,
  calculateBeerEquivalent,
} from "@/data/constants";
import type { BeerBrand } from "@/data/constants";
import { Wine, Beer, ChevronDown, ChevronUp, X } from "lucide-react";

export default function BaijiuToBeerPanel() {
  const {
    baijiuDegree,
    setBaijiuDegree,
    baijiuCustomDegree,
    setBaijiuCustomDegree,
    baijiuSelectedAmounts,
    toggleBaijiuAmount,
    baijiuCustomAmount,
    setBaijiuCustomAmount,
    selectedBeerBrand,
    setSelectedBeerBrand,
    beerAbv,
    setBeerAbv,
    beerCustomAbv,
    setBeerCustomAbv,
    beerCalcMode,
    setBeerCalcMode,
  } = useAppStore();

  const [customDegreeInput, setCustomDegreeInput] = useState(
    baijiuCustomDegree?.toString() || ""
  );
  const [customAmountInput, setCustomAmountInput] = useState(
    baijiuCustomAmount?.toString() || ""
  );
  const [customBeerAbvInput, setCustomBeerAbvInput] = useState(
    beerCustomAbv?.toString() || ""
  );
  const [showBrandList, setShowBrandList] = useState(false);

  // 获取有效值
  const effectiveBaijiuDegree = baijiuDegree ?? baijiuCustomDegree ?? null;
  const effectiveBeerAbv =
    (beerCalcMode === "brand" ? selectedBeerBrand?.abv : beerAbv ?? beerCustomAbv) ?? null;

  const totalBaijiuAmount = useMemo(() => {
    let total = baijiuSelectedAmounts.reduce((s, a) => s + a, 0);
    if (baijiuCustomAmount) total += baijiuCustomAmount;
    return total;
  }, [baijiuSelectedAmounts, baijiuCustomAmount]);

  // 动态计算结果
  const result = useMemo(() => {
    if (!effectiveBaijiuDegree || totalBaijiuAmount <= 0 || !effectiveBeerAbv)
      return null;
    const pureAlcohol = calculatePureAlcohol(totalBaijiuAmount, effectiveBaijiuDegree);
    return calculateBeerEquivalent(pureAlcohol, effectiveBeerAbv);
  }, [effectiveBaijiuDegree, totalBaijiuAmount, effectiveBeerAbv]);

  return (
    <div className="panel-container">
      {/* 白酒选择 */}
      <section className="panel-section">
        <div className="section-label">
          <Wine size={15} />
          <span>白酒</span>
        </div>

        {/* 度数 */}
        <div className="field-group">
          <label className="field-label">酒精度</label>
          <div className="chips-row">
            {BAIJIU_DEGREES.map((d) => (
              <button
                key={d}
                className={`chip ${baijiuDegree === d ? "active" : ""}`}
                onClick={() => setBaijiuDegree(d)}
              >
                {d}°
              </button>
            ))}
            <button
              className={`chip custom ${baijiuCustomDegree !== null ? "active" : ""}`}
              onClick={() => {
                if (baijiuCustomDegree === null) {
                  setBaijiuCustomDegree(45);
                  setCustomDegreeInput("45");
                }
              }}
            >
              {baijiuCustomDegree !== null ? `${baijiuCustomDegree}°` : "自定义"}
            </button>
          </div>
          <AnimatePresence>
            {baijiuCustomDegree !== null && (
              <motion.div
                className="inline-input-wrap"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18 }}
              >
                <input
                  type="number"
                  inputMode="decimal"
                  className="inline-input"
                  value={customDegreeInput}
                  onChange={(e) => {
                    setCustomDegreeInput(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > 0 && v <= 100) setBaijiuCustomDegree(v);
                  }}
                />
                <span className="inline-unit">度</span>
                <button
                  className="inline-clear"
                  onClick={() => {
                    setBaijiuCustomDegree(null);
                    setCustomDegreeInput("");
                  }}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 杯量 */}
        <div className="field-group">
          <label className="field-label">饮用量</label>
          <div className="amount-chips">
            {BAIJIU_AMOUNTS.map((item) => (
              <button
                key={item.value}
                className={`amount-chip ${
                  baijiuSelectedAmounts.includes(item.value) ? "active" : ""
                }`}
                onClick={() => toggleBaijiuAmount(item.value)}
              >
                <span className="amount-chip-label">{item.label}</span>
                <span className="amount-chip-sub">{item.value}ml</span>
              </button>
            ))}
            {/* 自定义量按钮放在网格末尾，与1斤同行 */}
            {baijiuCustomAmount === null ? (
              <button
                className="amount-chip custom-chip"
                onClick={() => {
                  setBaijiuCustomAmount(100);
                  setCustomAmountInput("100");
                }}
              >
                <span className="amount-chip-label">+ 自定义</span>
                <span className="amount-chip-sub">输入ml</span>
              </button>
            ) : (
              <motion.div
                className="amount-chip custom-chip active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <input
                  type="number"
                  inputMode="decimal"
                  className="chip-input"
                  placeholder="ml"
                  value={customAmountInput}
                  onChange={(e) => {
                    setCustomAmountInput(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > 0) setBaijiuCustomAmount(v);
                  }}
                />
                <button
                  className="chip-clear"
                  onClick={() => {
                    setBaijiuCustomAmount(null);
                    setCustomAmountInput("");
                  }}
                >
                  <X size={10} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 啤酒选择 */}
      <section className="panel-section">
        <div className="section-label">
          <Beer size={15} />
          <span>啤酒</span>
        </div>

        {/* 切换 */}
        <div className="subtabs">
          <button
            className={`subtab ${beerCalcMode === "brand" ? "on" : ""}`}
            onClick={() => setBeerCalcMode("brand")}
          >
            品牌
          </button>
          <button
            className={`subtab ${beerCalcMode === "abv" ? "on" : ""}`}
            onClick={() => setBeerCalcMode("abv")}
          >
            酒精度
          </button>
        </div>

        {beerCalcMode === "brand" ? (
          <div className="field-group" style={{ position: 'relative' }}>
            <button
              className="brand-trigger"
              onClick={() => setShowBrandList(!showBrandList)}
            >
              {selectedBeerBrand ? (
                <div className="brand-trigger-inner">
                  <span className="brand-trigger-name">
                    {selectedBeerBrand.name}
                  </span>
                  <span className="brand-trigger-meta">
                    原麦汁 {selectedBeerBrand.og} · 醇干比 {selectedBeerBrand.ratio} · {selectedBeerBrand.taste}
                  </span>
                </div>
              ) : (
                <span className="brand-trigger-placeholder">选择啤酒品牌</span>
              )}
              {showBrandList ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            <AnimatePresence>
              {showBrandList && (
                <motion.div
                  className="brand-dropdown-up"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {BEER_BRANDS.map((brand: BeerBrand) => (
                    <button
                      key={brand.name}
                      className={`brand-row ${
                        selectedBeerBrand?.name === brand.name ? "on" : ""
                      }`}
                      onClick={() => {
                        setSelectedBeerBrand(brand);
                        setShowBrandList(false);
                      }}
                    >
                      <div className="brand-row-info">
                        <span className="brand-row-name">{brand.name}</span>
                        <span className="brand-row-meta">
                          原麦汁 {brand.og} · 醇干比 {brand.ratio} · {brand.taste}
                        </span>
                      </div>
                      <span className="brand-row-abv">{brand.abv}%</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="field-group">
            <div className="chips-row">
              {[2.5, 3.0, 3.1, 3.3, 3.5, 4.0, 4.5, 5.0, 5.5].map((abv) => (
                <button
                  key={abv}
                  className={`chip ${beerAbv === abv ? "active" : ""}`}
                  onClick={() => setBeerAbv(abv)}
                >
                  {abv % 1 === 0 ? `${abv.toFixed(1)}` : `${abv}`}%
                </button>
              ))}
              <button
                className={`chip custom ${beerCustomAbv !== null ? "active" : ""}`}
                onClick={() => {
                  if (beerCustomAbv === null) {
                    setBeerCustomAbv(4.0);
                    setCustomBeerAbvInput("4.0");
                  }
                }}
              >
                {beerCustomAbv !== null ? `${beerCustomAbv}%` : "自定义"}
              </button>
            </div>
            <AnimatePresence>
              {beerCustomAbv !== null && (
                <motion.div
                  className="inline-input-wrap"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <input
                    type="number"
                    inputMode="decimal"
                    className="inline-input"
                    value={customBeerAbvInput}
                    onChange={(e) => {
                      setCustomBeerAbvInput(e.target.value);
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v > 0 && v <= 20) setBeerCustomAbv(v);
                    }}
                  />
                  <span className="inline-unit">%</span>
                  <button
                    className="inline-clear"
                    onClick={() => {
                      setBeerCustomAbv(null);
                      setCustomBeerAbvInput("");
                    }}
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 动态结果直出 */}
      <AnimatePresence>
        {result && (
          <motion.section
            className="result-section"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="result-main-line">
              <img
                src="/images/beer-bottle.png"
                alt="啤酒"
                className="result-inline-icon"
              />
              <span className="result-number">
                {Math.round(result.equivalentBottles500 * 10) / 10}
              </span>
              <span className="result-unit">瓶</span>
              <span className="result-divider">|</span>
              <span className="result-number secondary">
                {Math.round(result.equivalentCans330 * 10) / 10}
              </span>
              <span className="result-unit">听</span>
            </div>

            <div className="result-meta">
              <span>
                纯酒精约 <strong>{Math.round(result.totalPureAlcohol * 10) / 10}ml</strong>
              </span>
              <span className="result-meta-dot">·</span>
              <span>{result.metabolismTime}代谢</span>
            </div>

            <div className="result-impact">
              <span
                className={`impact-dot impact-${
                  result.liverImpact === "轻度负担"
                    ? "low"
                    : result.liverImpact === "中度负担"
                    ? "mid"
                    : "high"
                }`}
              />
              <span className="impact-text">{result.liverImpact}</span>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

    </div>
  );
}
