"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

// Type for latency data
interface LatencyPoint {
  time: number;
  latency: number;
}

const MOCK_SERVER_PAIRS = [
  { label: "AWS (N. Virginia) ↔ Azure (London)", value: "aws-azure" },
  { label: "Google Cloud (Frankfurt) ↔ AWS (Mumbai)", value: "gcp-aws" },
  { label: "Cloudflare (Singapore) ↔ AWS (Tokyo)", value: "cloudflare-aws" },
  { label: "DigitalOcean (NYC) ↔ Azure (Sao Paulo)", value: "do-azure" },
];

const TIME_RANGES = [
  { label: "Last 1 Hour", value: "1h" },
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
];

// Mock latency data generator
const generateMockLatencyData = (
  range: string,
  pairKey: string
): LatencyPoint[] => {
  const now = Date.now();
  let step: number, count: number;

  switch (range) {
    case "1h":
      step = 60 * 1000;
      count = 60;
      break;
    case "24h":
      step = 15 * 60 * 1000;
      count = 96;
      break;
    case "7d":
      step = 2 * 60 * 60 * 1000;
      count = 84;
      break;
    case "30d":
      step = 6 * 60 * 60 * 1000;
      count = 120;
      break;
    default:
      step = 60 * 1000;
      count = 60;
  }

  const pairBaseLatency: Record<string, number> = {
    "aws-azure": 80,
    "gcp-aws": 150,
    "cloudflare-aws": 100,
    "do-azure": 180,
  };

  const base = pairBaseLatency[pairKey] || 100;

  return Array.from({ length: count }, (_, i) => {
    const timestamp = now - (count - i) * step;
    const latency = base + Math.random() * 40 - 20;
    return { time: timestamp, latency };
  });
};

const HistoricalTrend: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [selectedPair, setSelectedPair] = useState<string>("aws-azure");
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [latencyData, setLatencyData] = useState<LatencyPoint[]>([]);

  useEffect(() => {
    const data = generateMockLatencyData(timeRange, selectedPair);
    setLatencyData(data);
  }, [selectedPair, timeRange]);

  useEffect(() => {
    if (!latencyData.length || !chartRef.current) return;

    const chartInstance = echarts.init(chartRef.current);
    const times = latencyData.map((d) => d.time);
    const values = latencyData.map((d) => d.latency);

    const min = Math.min(...values).toFixed(2);
    const max = Math.max(...values).toFixed(2);
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);

    const options: echarts.EChartsOption = {
      title: {
        text: `Latency Trends (${selectedPair})`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        formatter: (params: any) => {
          const d = new Date(params[0].value[0]);
          return `
            <b>${d.toLocaleString()}</b><br/>
            Latency: ${params[0].value[1].toFixed(2)} ms
          `;
        },
      },
      xAxis: {
        type: "time",
        axisLabel: {
          formatter: (value: number) => {
            const date = new Date(value);
            return timeRange === "1h"
              ? date.toLocaleTimeString()
              : date.toLocaleDateString();
          },
        },
      },
      yAxis: {
        type: "value",
        name: "Latency (ms)",
        min: "dataMin",
        max: "dataMax",
      },
      series: [
        {
          type: "line",
          data: latencyData.map((d) => [d.time, d.latency]),
          showSymbol: false,
          smooth: true,
          areaStyle: {},
        },
      ],
      grid: { left: 50, right: 20, bottom: 50, top: 60 },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      legend: {
        bottom: 0,
        data: [`Min: ${min}ms | Max: ${max}ms | Avg: ${avg}ms`],
      },
    };

    chartInstance.setOption(options);

    return () => chartInstance.dispose();
  }, [latencyData, selectedPair, timeRange]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📈 Historical Latency Trends</h2>
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <select
          value={selectedPair}
          onChange={(e) => setSelectedPair(e.target.value)}
        >
          {MOCK_SERVER_PAIRS.map((pair) => (
            <option key={pair.value} value={pair.value}>
              {pair.label}
            </option>
          ))}
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          {TIME_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div
        ref={chartRef}
        style={{ width: "100%", height: "400px", border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default HistoricalTrend;
