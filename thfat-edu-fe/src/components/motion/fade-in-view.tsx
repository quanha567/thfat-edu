"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

type TFadeInViewProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  id?: string;
};

export function FadeInView({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  yOffset = 20,
  id,
}: TFadeInViewProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
