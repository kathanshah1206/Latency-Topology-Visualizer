"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

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
        textStyle: {
          fontSize: 16,
        },
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
          fontSize: window.innerWidth < 768 ? 8 : 12,
          rotate: window.innerWidth < 768 ? 45 : 0,
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
        axisLabel: {
          fontSize: window.innerWidth < 768 ? 10 : 12,
        },
      },
      series: [
        {
          type: "line",
          data: latencyData.map((d) => [d.time, d.latency]),
          showSymbol: false,
          smooth: true,
          areaStyle: {
            opacity: 0.2,
            color: "#ff0000c9",
          },
          lineStyle: {
            color: "#ff0000ff",
            width: 2,
          },
        },
      ],
      grid: { left: 40, right: 20, bottom: 50, top: 60 },
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
    <div className="video-bg-wrapper2">
      <video autoPlay muted loop playsInline className="video-bg">
        <source src="/datasets/bluehd.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="container py-4">
        <div className="card shadow rounded-4">
          <div className="card-body">
            <h3 className="card-title text-center mb-4">
              📈 Historical Latency Trends
            </h3>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <select
                  value={selectedPair}
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="form-select form-select-lg"
                >
                  {MOCK_SERVER_PAIRS.map((pair) => (
                    <option key={pair.value} value={pair.value}>
                      {pair.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="form-select form-select-lg"
                >
                  {TIME_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              ref={chartRef}
              className="w-100"
              style={{
                height: "450px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTrend;
