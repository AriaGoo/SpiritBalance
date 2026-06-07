// 白酒预置度数选项
export const BAIJIU_DEGREES = [38, 42, 50, 52, 53] as const;

// 白酒固定杯量选项
export interface AmountOption {
  label: string;
  value: number; // ml
}

export const BAIJIU_AMOUNTS: AmountOption[] = [
  { label: "1 两", value: 50 },
  { label: "2 两", value: 100 },
  { label: "2.5 两", value: 125 },
  { label: "3.5 两", value: 165 },
  { label: "半 斤", value: 250 },
  { label: "8 两", value: 400 },
  { label: "1 斤", value: 500 },
];

// 啤酒品牌数据
export interface BeerBrand {
  name: string;
  og: string; // 原麦汁浓度
  abv: number; // 酒精度数 %
  ratio: string; // 醇干比
  taste: string; // 口味风格
}

export const BEER_BRANDS: BeerBrand[] = [
  { name: "青岛经典", og: "10.0°P", abv: 4.0, ratio: "1:2.5", taste: "清爽麦香" },
  { name: "青岛纯生", og: "8.0°P", abv: 3.1, ratio: "1:2.58", taste: "鲜爽纯净" },
  { name: "青岛白啤", og: "11.0°P", abv: 4.1, ratio: "1:2.68", taste: "果香醇厚" },
  { name: "银麦金麦", og: "8.0°P", abv: 3.1, ratio: "1:2.58", taste: "麦香柔和" },
  { name: "银麦经典", og: "10.0°P", abv: 3.3, ratio: "1:3.03", taste: "清爽淡爽" },
  { name: "银麦纯生", og: "8.0°P", abv: 3.1, ratio: "1:2.58", taste: "清新爽口" },
  { name: "雪花勇闯天涯", og: "8.0°P", abv: 3.0, ratio: "1:2.67", taste: "清爽畅快" },
  { name: "雪花纯生", og: "8.0°P", abv: 3.1, ratio: "1:2.58", taste: "鲜爽柔和" },
  { name: "雪花清爽", og: "8.0°P", abv: 2.9, ratio: "1:2.76", taste: "清淡爽口" },
  { name: "燕京 U8", og: "8.0°P", abv: 2.5, ratio: "1:3.2", taste: "清爽低度" },
  { name: "燕京 V10", og: "10.0°P", abv: 3.3, ratio: "1:3.03", taste: "醇厚麦香" },
  { name: "燕京纯生", og: "10.0°P", abv: 3.6, ratio: "1:2.78", taste: "鲜爽顺滑" },
  { name: "燕京清爽", og: "8.0°P", abv: 2.5, ratio: "1:3.2", taste: "清淡爽口" },
  { name: "保拉纳黑啤", og: "12.4°P", abv: 5.3, ratio: "1:2.34", taste: "焦香浓郁" },
  { name: "保拉纳白啤", og: "12.5°P", abv: 5.5, ratio: "1:2.27", taste: "麦香醇厚" },
];

// 啤酒预置酒精度选项
export const BEER_ABV_OPTIONS = [2.5, 3.0, 3.1, 3.3, 3.5, 4.0, 4.5, 5.0, 5.5] as const;

// 啤酒包装规格
export interface BeerPackage {
  label: string;
  value: number; // ml
}

export const BEER_PACKAGES: BeerPackage[] = [
  { label: "瓶装 500ml", value: 500 },
  { label: "听装 330ml", value: 330 },
  { label: "小瓶 250ml", value: 250 },
];

// 饮酒场景
export const OCCASIONS = ["日常小酌", "好友聚餐", "商务宴请", "正式宴席"] as const;

// 肝脏负担等级
export type LiverImpact = "轻度负担" | "中度负担" | "重度负担";

export interface CalculationResult {
  equivalentBottles500: number;
  equivalentCans330: number;
  equivalentMl: number;
  liverImpact: LiverImpact;
  metabolismTime: string;
  totalPureAlcohol: number; // ml 纯酒精
}

// 计算纯酒精摄入量
export function calculatePureAlcohol(volumeMl: number, abv: number): number {
  return volumeMl * (abv / 100);
}

// 根据纯酒精量计算啤酒等价物
export function calculateBeerEquivalent(
  pureAlcohol: number,
  beerAbv: number
): CalculationResult {
  const equivalentMl = pureAlcohol / (beerAbv / 100);
  const equivalentBottles500 = equivalentMl / 500;
  const equivalentCans330 = equivalentMl / 330;

  let liverImpact: LiverImpact;
  let metabolismTime: string;

  if (pureAlcohol < 100) {
    liverImpact = "轻度负担";
    metabolismTime = "约 6-8 小时";
  } else if (pureAlcohol < 200) {
    liverImpact = "中度负担";
    metabolismTime = "约 12-16 小时";
  } else {
    liverImpact = "重度负担";
    metabolismTime = "约 24 小时以上";
  }

  return {
    equivalentBottles500,
    equivalentCans330,
    equivalentMl,
    liverImpact,
    metabolismTime,
    totalPureAlcohol: pureAlcohol,
  };
}

// 根据纯酒精量计算白酒等价物
export function calculateBaijiuEquivalent(
  pureAlcohol: number,
  baijiuDegree: number
): {
  equivalentMl: number;
  equivalentLiang: number;
  liverImpact: LiverImpact;
  metabolismTime: string;
  totalPureAlcohol: number;
} {
  const equivalentMl = pureAlcohol / (baijiuDegree / 100);
  const equivalentLiang = equivalentMl / 50; // 1两 = 50ml

  let liverImpact: LiverImpact;
  let metabolismTime: string;

  if (pureAlcohol < 100) {
    liverImpact = "轻度负担";
    metabolismTime = "约 6-8 小时";
  } else if (pureAlcohol < 200) {
    liverImpact = "中度负担";
    metabolismTime = "约 12-16 小时";
  } else {
    liverImpact = "重度负担";
    metabolismTime = "约 24 小时以上";
  }

  return {
    equivalentMl,
    equivalentLiang,
    liverImpact,
    metabolismTime,
    totalPureAlcohol: pureAlcohol,
  };
}
