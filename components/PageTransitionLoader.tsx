"use client"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function PageTransitionLoader({ show = false }: { show?: boolean }) {
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && iconRef.current) {
      gsap.to(iconRef.current, {
        rotateY: 360,
        duration: 1.2,
        repeat: -1,
        ease: "power2.inOut",
      });
    } else if (iconRef.current) {
      gsap.set(iconRef.current, { rotateY: 0 });
    }
    return () => {
      if (iconRef.current) {
        gsap.killTweensOf(iconRef.current);
      }
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-indigo-200/80 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
      <div ref={iconRef} className="flex flex-col items-center">
        <Image
          src="/RenThing_LOGO.svg"
          alt="RenThing"
          width={80}
          height={80}
          className="drop-shadow-lg"
          style={{ filter: "brightness(0) saturate(100%) invert(21%) sepia(99%) saturate(5000%) hue-rotate(215deg) brightness(1.1)" }}
        />
        <span className="mt-4 text-lg font-bold text-blue-700 dark:text-white tracking-wide animate-pulse">Loading...</span>
      </div>
    </div>
  );
}
