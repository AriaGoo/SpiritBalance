import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import {
  BAIJIU_DEGREES,
  BEER_BRANDS,
  BEER_PACKAGES,
  calculatePureAlcohol,
  calculateBaijiuEquivalent,
} from "@/data/constants";
import type { BeerBrand } from "@/data/constants";
import { Wine, Beer, ChevronDown, ChevronUp, X, Minus, Plus } from "lucide-react";

export default function BeerToBaijiuPanel() {
  const {
    baijiuDegree,
    setBaijiuDegree,
    baijiuCustomDegree,
    setBaijiuCustomDegree,
    selectedBeerBrand,
    setSelectedBeerBrand,
    beerAbv,
    setBeerAbv,
    beerCustomAbv,
    setBeerCustomAbv,
    beerCalcMode,
    setBeerCalcMode,
    beerSelectedPackages,
    toggleBeerPackage,
    beerCustomAmount,
    setBeerCustomAmount,
  } = useAppStore();

  const [customBaijiuInput, setCustomBaijiuInput] = useState(
    baijiuCustomDegree?.toString() || ""
  );
  const [customBeerAbvInput, setCustomBeerAbvInput] = useState(
    beerCustomAbv?.toString() || ""
  );
  const [customBeerAmtInput, setCustomBeerAmtInput] = useState(
    beerCustomAmount?.toString() || ""
  );
  const [showBrandList, setShowBrandList] = useState(false);
  const [pkgCounts, setPkgCounts] = useState<Record<number, number>>({
    500: 1,
    330: 1,
    250: 1,
  });

  const effectiveBeerAbv =
    (beerCalcMode === "brand" ? selectedBeerBrand?.abv : beerAbv ?? beerCustomAbv) ?? null;
  const effectiveBaijiuDegree = baijiuDegree ?? baijiuCustomDegree ?? null;

  const totalBeerAmt = useMemo(() => {
    let t = 0;
    beerSelectedPackages.forEach((pkg) => {
      const size = BEER_PACKAGES.find((p) => p.value === pkg)?.value ?? pkg;
      t += size * (pkgCounts[pkg] || 1);
    });
    if (beerCustomAmount) t += beerCustomAmount;
    return t;
  }, [beerSelectedPackages, pkgCounts, beerCustomAmount]);

  // 动态计算
  const result = useMemo(() => {
    if (!effectiveBeerAbv || totalBeerAmt <= 0 || !effectiveBaijiuDegree) return null;
    const pure = calculatePureAlcohol(totalBeerAmt, effectiveBeerAbv);
    return calculateBaijiuEquivalent(pure, effectiveBaijiuDegree);
  }, [effectiveBeerAbv, totalBeerAmt, effectiveBaijiuDegree]);

  const updatePkgCount = (pkg: number, delta: number) => {
    setPkgCounts((prev) => ({
      ...prev,
      [pkg]: Math.max(1, (prev[pkg] || 1) + delta),
    }));
  };

  return (
    <div className="panel-container">
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
          <div className="field-group">
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
                  className="brand-dropdown"
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
              {/* 自定义chip放在chips-row内与其他chip自然换行对齐 */}
              {beerCustomAbv === null ? (
                <button
                  className="chip custom"
                  onClick={() => {
                    setBeerCustomAbv(4.0);
                    setCustomBeerAbvInput("4.0");
                  }}
                >
                  自定义
                </button>
              ) : (
                <button
                  className={`chip custom active`}
                  onClick={() => {
                    setBeerCustomAbv(null);
                    setCustomBeerAbvInput("");
                  }}
                >
                  <span>{beerCustomAbv}%</span>
                  <X size={10} style={{ marginLeft: 4 }} />
                </button>
              )}
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

        {/* 包装规格 - 带数量控制器 */}
        <div className="field-group">
          <label className="field-label">包装规格</label>
          <div className="package-list-vertical">
            {BEER_PACKAGES.map((pkg) => (
              <div key={pkg.value} className="package-row">
                <button
                  className={`pkg-chip-vertical ${
                    beerSelectedPackages.includes(pkg.value) ? "on" : ""
                  }`}
                  onClick={() => {
                    if (!beerSelectedPackages.includes(pkg.value)) {
                      toggleBeerPackage(pkg.value);
                    }
                  }}
                >
                  {pkg.label}
                </button>
                {beerSelectedPackages.includes(pkg.value) && (
                  <motion.div
                    className="pkg-counter"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <button
                      className="cnt-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePkgCount(pkg.value, -1);
                      }}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="cnt-val">{pkgCounts[pkg.value] || 1}</span>
                    <button
                      className="cnt-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePkgCount(pkg.value, 1);
                      }}
                    >
                      <Plus size={13} />
                    </button>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <div className="custom-inline-row">
            {beerCustomAmount === null ? (
              <button
                className="add-custom-btn"
                onClick={() => {
                  setBeerCustomAmount(500);
                  setCustomBeerAmtInput("500");
                }}
              >
                + 自定义量
              </button>
            ) : (
              <motion.div
                className="inline-input-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <input
                  type="number"
                  inputMode="decimal"
                  className="inline-input"
                  value={customBeerAmtInput}
                  onChange={(e) => {
                    setCustomBeerAmtInput(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > 0) setBeerCustomAmount(v);
                  }}
                />
                <span className="inline-unit">ml</span>
                <button
                  className="inline-clear"
                  onClick={() => {
                    setBeerCustomAmount(null);
                    setCustomBeerAmtInput("");
                  }}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 白酒选择 */}
      <section className="panel-section">
        <div className="section-label">
          <Wine size={15} />
          <span>白酒</span>
        </div>
        <div className="field-group">
          <label className="field-label">目标酒精度</label>
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
                  setBaijiuCustomDegree(52);
                  setCustomBaijiuInput("52");
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
                  value={customBaijiuInput}
                  onChange={(e) => {
                    setCustomBaijiuInput(e.target.value);
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > 0 && v <= 100) setBaijiuCustomDegree(v);
                  }}
                />
                <span className="inline-unit">度</span>
                <button
                  className="inline-clear"
                  onClick={() => {
                    setBaijiuCustomDegree(null);
                    setCustomBaijiuInput("");
                  }}
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
                src="/images/baijiu-cup.png"
                alt="白酒"
                className="result-inline-icon"
              />
              <span className="result-number">
                {Math.round(result.equivalentLiang * 10) / 10}
              </span>
              <span className="result-unit">两</span>
              <span className="result-divider">|</span>
              <span className="result-number secondary">
                {Math.round(result.equivalentMl * 10) / 10}
              </span>
              <span className="result-unit">ml</span>
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
