"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type TCountUpOptions = {
  end: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  useDotSeparator?: boolean;
  countdownFrom?: number;
  finalText?: string;
};

type TAnimatedCounterProps = {
  value: string;
  countUp?: TCountUpOptions;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  countUp,
  duration = 2000,
  className,
}: TAnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-30px" });

  const [displayValue, setDisplayValue] = useState<string>(() => {
    if (!countUp) return value;
    if (countUp.countdownFrom !== undefined) {
      return `${countUp.prefix ?? ""}${countUp.countdownFrom}`;
    }

    return `${countUp.prefix ?? ""}0${countUp.suffix ?? ""}`;
  });

  useEffect(() => {
    if (!isInView || !countUp) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const {
      end,
      decimals = 0,
      suffix = "",
      prefix = "",
      useDotSeparator = false,
      countdownFrom,
      finalText,
    } = countUp;

    const start = countdownFrom ?? 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      if (progress < 1) {
        const currentVal = start + (end - start) * easeProgress;
        let formatted: string;

        if (decimals > 0) {
          formatted = currentVal.toFixed(decimals);
        } else {
          const intVal = Math.round(currentVal);
          if (useDotSeparator) {
            formatted = intVal.toLocaleString("vi-VN").replace(/,/g, ".");
          } else {
            formatted = String(intVal);
          }
        }

        setDisplayValue(`${prefix}${formatted}${suffix}`);
        animationFrameId = requestAnimationFrame(step);
      } else {
        if (finalText) {
          setDisplayValue(finalText);
        } else {
          let formatted: string;
          if (decimals > 0) {
            formatted = end.toFixed(decimals);
          } else {
            if (useDotSeparator) {
              formatted = end.toLocaleString("vi-VN").replace(/,/g, ".");
            } else {
              formatted = String(end);
            }
          }
          setDisplayValue(`${prefix}${formatted}${suffix}`);
        }
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, countUp, duration, value]);

  return (
    <span ref={containerRef} className={className}>
      {displayValue}
    </span>
  );
}
