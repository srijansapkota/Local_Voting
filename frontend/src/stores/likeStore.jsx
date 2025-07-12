// stores/likeStore.js
import { create } from "zustand";

const useLikeStore = create((set) => ({
  totalLike: parseInt(localStorage.getItem("totalLike") ?? "0") || 0,
  totalDislike: parseInt(localStorage.getItem("totalDislike") ?? "0") || 0,
  increment: () =>
    set((state) => {
      const newTotalLike = state.totalLike + 1;
      localStorage.setItem("totalLike", newTotalLike);
      return { totalLike: newTotalLike };
    }),
  decrement: () =>
    set((state) => {
      const newTotalDislike = state.totalDislike + 1;
      localStorage.setItem("totalDislike", newTotalDislike);
      return { totalDislike: newTotalDislike };
    }),
}));

export default useLikeStore;
