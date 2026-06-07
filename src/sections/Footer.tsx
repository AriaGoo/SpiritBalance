import { useState, useEffect } from "react";

export default function Footer() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="app-footer">
      <p className="footer-line">© 2026 斟酌 | Spirit Balance. All rights reserved.</p>
      <p className="footer-line">AriaGoo</p>

      <div className="footer-disclaimer">
        <button className="disclaimer-toggle" onClick={() => setIsOpen(!isOpen)}>
          「隐私&免责声明 {isOpen ? "▲" : "▼"}」
        </button>

        {isOpen && (
          <div className="disclaimer-content">
            <p className="disclaimer-section-title">隐私声明</p>
            <p className="disclaimer-text">
              本页面为纯静态网页，不收集、存储或传输任何用户数据。所有计算均在您的设备本地完成。
            </p>

            <p className="disclaimer-section-title">免责声明</p>
            <p className="disclaimer-text">
              本工具仅供娱乐及参考，计算结果基于标准公式估算，不构成医学建议或饮酒指导。
            </p>
            <p className="disclaimer-text">
              实际酒精代谢受个体差异、身体状况、饮酒环境等多种因素影响。
            </p>
            <p className="disclaimer-text">
              请理性饮酒，过量饮酒有害健康。未成年人禁止饮酒。
            </p>
          </div>
        )}
      </div>
    </footer>
  );
}
