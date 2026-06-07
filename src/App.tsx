import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import BaijiuToBeerPanel from "@/sections/BaijiuToBeerPanel";
import BeerToBaijiuPanel from "@/sections/BeerToBaijiuPanel";
import Footer from "@/sections/Footer";
import { ArrowRightLeft } from "lucide-react";
import "./App.css";

function App() {
  const { appMode, setAppMode } = useAppStore();

  return (
    <div className="app-container">
      {/* 雅致 Header */}
      <header className="app-header">
        <div className="logo-area">
          <img src="/images/logo.png" alt="斟酌" className="app-logo" />
          <div className="title-group">
            <h1 className="app-title-cn">斟酌</h1>
            <span className="app-title-en">Spirit Balance</span>
          </div>
        </div>

        {/* 方向切换 */}
        <button
          className="direction-toggle"
          onClick={() =>
            setAppMode(
              appMode === "baijiu_to_beer" ? "beer_to_baijiu" : "baijiu_to_beer"
            )
          }
        >
          <AnimatePresence mode="wait">
            {appMode === "baijiu_to_beer" ? (
              <motion.span
                key="btb"
                className="direction-label"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                白酒
                <ArrowRightLeft size={12} />
                啤酒
              </motion.span>
            ) : (
              <motion.span
                key="btb2"
                className="direction-label"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                啤酒
                <ArrowRightLeft size={12} />
                白酒
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* 主体内容 */}
      <main className="app-body">
        <AnimatePresence mode="wait">
          {appMode === "baijiu_to_beer" ? (
            <motion.div
              key="baijiu-to-beer"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <BaijiuToBeerPanel />
            </motion.div>
          ) : (
            <motion.div
              key="beer-to-baijiu"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <BeerToBaijiuPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
