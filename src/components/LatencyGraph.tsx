"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "echarts-gl";
import { serverPairs } from "@/utils/constants";

const LatencyGraph: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const ROOT_PATH = "/datasets";

  const generateSeries = () => {
    const lowLatency: [number, number][][] = [];
    const mediumLatency: [number, number][][] = [];
    const highLatency: [number, number][][] = [];

    serverPairs.forEach((pair) => {
      const latency = Math.floor(Math.random() * 300);
      const category =
        latency < 100 ? "low" : latency < 200 ? "medium" : "high";
      const data: [[number, number], [number, number]] = [pair.from, pair.to];

      if (category === "low") lowLatency.push(data);
      else if (category === "medium") mediumLatency.push(data);
      else highLatency.push(data);
    });

    return [
      {
        type: "lines3D",
        name: "Low Latency (<100ms)",
        effect: {
          show: true,
          trailWidth: 2,
          trailLength: 0.2,
          trailOpacity: 1,
          trailColor: "green",
        },
        lineStyle: {
          width: 2,
          color: "green",
          opacity: 0.6,
        },
        data: lowLatency,
      },
      {
        type: "lines3D",
        name: "Medium Latency (100–200ms)",
        effect: {
          show: true,
          trailWidth: 2,
          trailLength: 0.2,
          trailOpacity: 1,
          trailColor: "yellow",
        },
        lineStyle: {
          width: 2,
          color: "yellow",
          opacity: 0.6,
        },
        data: mediumLatency,
      },
      {
        type: "lines3D",
        name: "High Latency (>200ms)",
        effect: {
          show: true,
          trailWidth: 2,
          trailLength: 0.2,
          trailOpacity: 1,
          trailColor: "red",
        },
        lineStyle: {
          width: 2,
          color: "red",
          opacity: 0.6,
        },
        data: highLatency,
      },
    ];
  };

  useEffect(() => {
    if (!chartRef.current || chartRef.current.offsetWidth === 0) return;

    const preloadImages = async () => {
      const preload = (src: string) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
        });
      try {
        await Promise.all([
          preload(`${ROOT_PATH}/starfield.jpg`),
          preload(`${ROOT_PATH}/bathymetry_bw_composite_4k.jpg`),
        ]);
        const chart = echarts.init(chartRef.current);

        const updateChart = () => {
          chart.setOption({
            legend: {
              selectedMode: "multiple",
              left: "left",
              orient: "vertical",
              data: [
                "Low Latency (<100ms)",
                "Medium Latency (100–200ms)",
                "High Latency (>200ms)",
              ],
              textStyle: {
                color: "#fff",
              },
            },
            globe: {
              environment: `${ROOT_PATH}/starfield.jpg`,
              heightTexture: `${ROOT_PATH}/bathymetry_bw_composite_4k.jpg`,
              displacementScale: 0.1,
              displacementQuality: "high",
              baseColor: "#000",
              shading: "realistic",
              realisticMaterial: {
                roughness: 0.2,
                metalness: 0,
              },
              postEffect: {
                enable: true,
                depthOfField: {
                  enable: false,
                  focalDistance: 150,
                },
              },
              temporalSuperSampling: {
                enable: true,
              },
              light: {
                ambient: {
                  intensity: 0,
                },
                main: {
                  intensity: 0.1,
                  shadow: false,
                },
                ambientCubemap: {
                  texture: `${ROOT_PATH}/lake.hdr`,
                  exposure: 1,
                  diffuseIntensity: 0.5,
                  specularIntensity: 2,
                },
              },
              viewControl: {
                autoRotate: true,
                autoRotateAfterStill: 5,
              },
              silent: true,
            },
            series: generateSeries(),
          });
        };

        updateChart();
        const interval = setInterval(updateChart, 5000);

        return () => {
          clearInterval(interval);
          chart.dispose();
        };
      } catch (error) {
        console.error("Texture preload failed:", error);
      }
    };
    preloadImages();
  }, []);

  return <div ref={chartRef} style={{ height: "100vh", width: "100%" }} />;
};

export default LatencyGraph;
