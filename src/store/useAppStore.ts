import { create } from "zustand";
import type { BeerBrand } from "@/data/constants";

export type AppMode = "baijiu_to_beer" | "beer_to_baijiu";
export type BeerCalcMode = "brand" | "abv";

interface AppState {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;

  baijiuDegree: number | null;
  setBaijiuDegree: (degree: number | null) => void;
  baijiuCustomDegree: number | null;
  setBaijiuCustomDegree: (degree: number | null) => void;
  baijiuSelectedAmounts: number[];
  toggleBaijiuAmount: (amount: number) => void;
  baijiuCustomAmount: number | null;
  setBaijiuCustomAmount: (amount: number | null) => void;

  beerCalcMode: BeerCalcMode;
  setBeerCalcMode: (mode: BeerCalcMode) => void;
  selectedBeerBrand: BeerBrand | null;
  setSelectedBeerBrand: (brand: BeerBrand | null) => void;
  beerAbv: number | null;
  setBeerAbv: (abv: number | null) => void;
  beerCustomAbv: number | null;
  setBeerCustomAbv: (abv: number | null) => void;
  beerSelectedPackages: number[];
  toggleBeerPackage: (pkg: number) => void;
  beerCustomAmount: number | null;
  setBeerCustomAmount: (amount: number | null) => void;

  resetAll: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  appMode: "baijiu_to_beer",
  setAppMode: (mode) => set({ appMode: mode }),

  baijiuDegree: null,
  setBaijiuDegree: (degree) =>
    set({ baijiuDegree: degree, baijiuCustomDegree: null }),
  baijiuCustomDegree: null,
  setBaijiuCustomDegree: (degree) =>
    set({ baijiuCustomDegree: degree, baijiuDegree: null }),
  baijiuSelectedAmounts: [],
  toggleBaijiuAmount: (amount) =>
    set((state) => ({
      baijiuSelectedAmounts: state.baijiuSelectedAmounts.includes(amount)
        ? state.baijiuSelectedAmounts.filter((a) => a !== amount)
        : [...state.baijiuSelectedAmounts, amount],
    })),
  baijiuCustomAmount: null,
  setBaijiuCustomAmount: (amount) => set({ baijiuCustomAmount: amount }),

  beerCalcMode: "brand",
  setBeerCalcMode: (mode) => set({ beerCalcMode: mode }),
  selectedBeerBrand: null,
  setSelectedBeerBrand: (brand) => set({ selectedBeerBrand: brand }),
  beerAbv: null,
  setBeerAbv: (abv) => set({ beerAbv: abv, beerCustomAbv: null }),
  beerCustomAbv: null,
  setBeerCustomAbv: (abv) => set({ beerCustomAbv: abv, beerAbv: null }),
  beerSelectedPackages: [],
  toggleBeerPackage: (pkg) =>
    set((state) => ({
      beerSelectedPackages: state.beerSelectedPackages.includes(pkg)
        ? state.beerSelectedPackages.filter((p) => p !== pkg)
        : [...state.beerSelectedPackages, pkg],
    })),
  beerCustomAmount: null,
  setBeerCustomAmount: (amount) => set({ beerCustomAmount: amount }),

  resetAll: () =>
    set({
      baijiuDegree: null,
      baijiuCustomDegree: null,
      baijiuSelectedAmounts: [],
      baijiuCustomAmount: null,
      selectedBeerBrand: null,
      beerAbv: null,
      beerCustomAbv: null,
      beerSelectedPackages: [],
      beerCustomAmount: null,
    }),
}));
