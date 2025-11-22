"use client"

import React, { useMemo } from "react"
import { Poppins } from "next/font/google"
import { SparklesText } from "./sparkles-text"

// Data Configuration
const layersData = [
  { className: "layer-6", speed: "120s", size: "222px", zIndex: 1, image: "6" },
  { className: "layer-5", speed: "95s", size: "311px", zIndex: 1, image: "5" },
  { className: "layer-4", speed: "75s", size: "468px", zIndex: 1, image: "4" },
  {
    className: "bike-1",
    speed: "10s",
    size: "75px",
    zIndex: 2,
    image: "bike",
    animation: "parallax_bike",
    bottom: "100px",
    noRepeat: true,
  },
  {
    className: "bike-2",
    speed: "15s",
    size: "75px",
    zIndex: 2,
    image: "bike",
    animation: "parallax_bike",
    bottom: "100px",
    noRepeat: true,
  },
  { className: "layer-3", speed: "55s", size: "158px", zIndex: 3, image: "3" },
  { className: "layer-2", speed: "30s", size: "145px", zIndex: 4, image: "2" },
  { className: "layer-1", speed: "20s", size: "136px", zIndex: 5, image: "1" },
]

const poppins = Poppins({ weight: ["300", "400", "600", "700"], subsets: ["latin"] })

const MountainVistaParallax = ({ title = "", subtitle = "", children }) => {
  // Generate dynamic CSS for each layer
  const dynamicStyles = useMemo(() => {
    return layersData
      .map((layer) => {
        const url = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/24650/${layer.image}.png`
        return `
          .${layer.className} {
            background-image: url(${url});
            animation-duration: ${layer.speed};
            background-size: auto ${layer.size};
            z-index: ${layer.zIndex};
            ${layer.animation ? `animation-name: ${layer.animation};` : ""}
            ${layer.bottom ? `bottom: ${layer.bottom};` : ""}
            ${layer.noRepeat ? "background-repeat: no-repeat;" : ""}
          }
        `
      })
      .join("\n")
  }, [])

  return (
    <section className="hero-container" aria-label="An animated parallax landscape of mountains and cyclists.">
      {/* Inject dynamic layer styles */}
      <style>{dynamicStyles}</style>

      {/* Render each parallax layer */}
      {layersData.map((layer) => (
        <div key={layer.className} className={`parallax-layer ${layer.className}`} />
      ))}

      {/* Hero text and widget */}
      <div className="hero-content">
        <SparklesText
          text={title}
          className={`${poppins.className} hero-title`}
          colors={{ first: "#60A5FA", second: "#3B82F6" }}
          sparklesCount={12}
        />
        <p className={`${poppins.className} hero-subtitle`}>{subtitle}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}

export default React.memo(MountainVistaParallax)
