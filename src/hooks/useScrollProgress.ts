import { useTransform, type MotionValue } from "framer-motion";
import { globalScrollProgress } from "@/components/SmoothScroll";

interface UseScrollProgressOptions {
  inputRange: [number, number];
  outputRange?: [number, number];
}

export const useScrollProgress = ({
  inputRange,
  outputRange = [0, 1],
}: UseScrollProgressOptions): { progress: MotionValue<number>; mapped: MotionValue<number> } => {
  const mapped = useTransform(globalScrollProgress, inputRange, outputRange, { clamp: true });
  return { progress: globalScrollProgress, mapped };
};
