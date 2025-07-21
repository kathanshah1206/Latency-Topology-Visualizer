"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "echarts-gl";

interface ServerPair {
  from: [number, number];
  to: [number, number];
  fromCity: string;
  toCity: string;
}

const serverPairs: ServerPair[] = [
  {
    from: [72.8777, 19.076],
    to: [-74.006, 40.7128],
    fromCity: "Mumbai",
    toCity: "New York",
  },
  {
    from: [55.2708, 25.2048],
    to: [4.9041, 52.3676],
    fromCity: "Dubai",
    toCity: "Amsterdam",
  },
  {
    from: [126.978, 37.5665],
    to: [106.8456, -6.2088],
    fromCity: "Seoul",
    toCity: "Jakarta",
  },
  {
    from: [-118.2437, 34.0522],
    to: [126.978, 37.5665],
    fromCity: "Los Angeles",
    toCity: "Seoul",
  },
  {
    from: [126.978, 37.5665],
    to: [-0.1276, 51.5072],
    fromCity: "Seoul",
    toCity: "London",
  },
  {
    from: [-46.6333, -23.5505],
    to: [-122.4194, 37.7749],
    fromCity: "S\u00e3o Paulo",
    toCity: "San Francisco",
  },
  {
    from: [-74.006, 40.7128],
    to: [-87.6298, 41.8781],
    fromCity: "New York",
    toCity: "Chicago",
  },
  {
    from: [-0.1276, 51.5072],
    to: [-87.6298, 41.8781],
    fromCity: "London",
    toCity: "Chicago",
  },
  {
    from: [-0.1276, 51.5072],
    to: [8.6821, 50.1109],
    fromCity: "London",
    toCity: "Frankfurt",
  },
  {
    from: [114.1694, 22.3193],
    to: [-74.006, 40.7128],
    fromCity: "Hong Kong",
    toCity: "New York",
  },
  {
    from: [55.2708, 25.2048],
    to: [8.6821, 50.1109],
    fromCity: "Dubai",
    toCity: "Frankfurt",
  },
  {
    from: [103.851959, 1.29027],
    to: [55.2708, 25.2048],
    fromCity: "Singapore",
    toCity: "Dubai",
  },
  {
    from: [144.9631, -37.8136],
    to: [114.1694, 22.3193],
    fromCity: "Melbourne",
    toCity: "Hong Kong",
  },
  {
    from: [144.9631, -37.8136],
    to: [2.3522, 48.8566],
    fromCity: "Melbourne",
    toCity: "Paris",
  },
  {
    from: [151.2093, -33.8688],
    to: [103.851959, 1.29027],
    fromCity: "Sydney",
    toCity: "Singapore",
  },
  {
    from: [126.978, 37.5665],
    to: [151.2093, -33.8688],
    fromCity: "Seoul",
    toCity: "Sydney",
  },
  {
    from: [-122.4194, 37.7749],
    to: [-79.3832, 43.6532],
    fromCity: "San Francisco",
    toCity: "Toronto",
  },
  {
    from: [126.978, 37.5665],
    to: [-46.6333, -23.5505],
    fromCity: "Seoul",
    toCity: "S\u00e3o Paulo",
  },
  {
    from: [126.978, 37.5665],
    to: [2.3522, 48.8566],
    fromCity: "Seoul",
    toCity: "Paris",
  },
  {
    from: [28.0473, -26.2041],
    to: [114.1694, 22.3193],
    fromCity: "Johannesburg",
    toCity: "Hong Kong",
  },
  {
    from: [-122.4194, 37.7749],
    to: [103.851959, 1.29027],
    fromCity: "San Francisco",
    toCity: "Singapore",
  },
  {
    from: [126.978, 37.5665],
    to: [-0.1276, 51.5072],
    fromCity: "Seoul",
    toCity: "London",
  },
  {
    from: [-79.3832, 43.6532],
    to: [114.1694, 22.3193],
    fromCity: "Toronto",
    toCity: "Hong Kong",
  },
  {
    from: [-46.6333, -23.5505],
    to: [114.1694, 22.3193],
    fromCity: "S\u00e3o Paulo",
    toCity: "Hong Kong",
  },
  {
    from: [106.8456, -6.2088],
    to: [72.8777, 19.076],
    fromCity: "Jakarta",
    toCity: "Mumbai",
  },
  {
    from: [72.8777, 19.076],
    to: [126.978, 37.5665],
    fromCity: "Mumbai",
    toCity: "Seoul",
  },
  {
    from: [28.0473, -26.2041],
    to: [-0.1276, 51.5072],
    fromCity: "Johannesburg",
    toCity: "London",
  },
  {
    from: [-0.1276, 51.5072],
    to: [-46.6333, -23.5505],
    fromCity: "London",
    toCity: "S\u00e3o Paulo",
  },
  {
    from: [-46.6333, -23.5505],
    to: [-0.1276, 51.5072],
    fromCity: "S\u00e3o Paulo",
    toCity: "London",
  },
  {
    from: [-0.1276, 51.5072],
    to: [-46.6333, -23.5505],
    fromCity: "London",
    toCity: "S\u00e3o Paulo",
  },
  {
    from: [-122.4194, 37.7749],
    to: [126.978, 37.5665],
    fromCity: "San Francisco",
    toCity: "Seoul",
  },
  {
    from: [72.8777, 19.076],
    to: [8.6821, 50.1109],
    fromCity: "Mumbai",
    toCity: "Frankfurt",
  },
  {
    from: [2.3522, 48.8566],
    to: [144.9631, -37.8136],
    fromCity: "Paris",
    toCity: "Melbourne",
  },
  {
    from: [4.9041, 52.3676],
    to: [106.8456, -6.2088],
    fromCity: "Amsterdam",
    toCity: "Jakarta",
  },
  {
    from: [-79.3832, 43.6532],
    to: [-46.6333, -23.5505],
    fromCity: "Toronto",
    toCity: "S\u00e3o Paulo",
  },
  {
    from: [55.2708, 25.2048],
    to: [106.8456, -6.2088],
    fromCity: "Dubai",
    toCity: "Jakarta",
  },
  {
    from: [-118.2437, 34.0522],
    to: [-87.6298, 41.8781],
    fromCity: "Los Angeles",
    toCity: "Chicago",
  },
  {
    from: [4.9041, 52.3676],
    to: [2.3522, 48.8566],
    fromCity: "Amsterdam",
    toCity: "Paris",
  },
  {
    from: [72.8777, 19.076],
    to: [55.2708, 25.2048],
    fromCity: "Mumbai",
    toCity: "Dubai",
  },
  {
    from: [-118.2437, 34.0522],
    to: [-46.6333, -23.5505],
    fromCity: "Los Angeles",
    toCity: "S\u00e3o Paulo",
  },
  {
    from: [126.978, 37.5665],
    to: [151.2093, -33.8688],
    fromCity: "Seoul",
    toCity: "Sydney",
  },
  {
    from: [-46.6333, -23.5505],
    to: [126.978, 37.5665],
    fromCity: "S\u00e3o Paulo",
    toCity: "Seoul",
  },
  {
    from: [-122.4194, 37.7749],
    to: [151.2093, -33.8688],
    fromCity: "San Francisco",
    toCity: "Sydney",
  },
  {
    from: [8.6821, 50.1109],
    to: [55.2708, 25.2048],
    fromCity: "Frankfurt",
    toCity: "Dubai",
  },
  {
    from: [114.1694, 22.3193],
    to: [151.2093, -33.8688],
    fromCity: "Hong Kong",
    toCity: "Sydney",
  },
  {
    from: [139.6917, 35.6895],
    to: [2.3522, 48.8566],
    fromCity: "Tokyo",
    toCity: "Paris",
  },
  {
    from: [-79.3832, 43.6532],
    to: [-87.6298, 41.8781],
    fromCity: "Toronto",
    toCity: "Chicago",
  },
  {
    from: [151.2093, -33.8688],
    to: [-74.006, 40.7128],
    fromCity: "Sydney",
    toCity: "New York",
  },
  {
    from: [114.1694, 22.3193],
    to: [103.851959, 1.29027],
    fromCity: "Hong Kong",
    toCity: "Singapore",
  },
  {
    from: [-0.1276, 51.5072],
    to: [106.8456, -6.2088],
    fromCity: "London",
    toCity: "Jakarta",
  },
  {
    from: [-87.6298, 41.8781],
    to: [139.6917, 35.6895],
    fromCity: "Chicago",
    toCity: "Tokyo",
  },
  {
    from: [106.8456, -6.2088],
    to: [28.0473, -26.2041],
    fromCity: "Jakarta",
    toCity: "Johannesburg",
  },
  {
    from: [-87.6298, 41.8781],
    to: [139.6917, 35.6895],
    fromCity: "Chicago",
    toCity: "Tokyo",
  },
  {
    from: [28.0473, -26.2041],
    to: [8.6821, 50.1109],
    fromCity: "Johannesburg",
    toCity: "Frankfurt",
  },
  {
    from: [114.1694, 22.3193],
    to: [4.9041, 52.3676],
    fromCity: "Hong Kong",
    toCity: "Amsterdam",
  },
  {
    from: [72.8777, 19.076],
    to: [-79.3832, 43.6532],
    fromCity: "Mumbai",
    toCity: "Toronto",
  },
  {
    from: [144.9631, -37.8136],
    to: [-87.6298, 41.8781],
    fromCity: "Melbourne",
    toCity: "Chicago",
  },
  {
    from: [28.0473, -26.2041],
    to: [103.851959, 1.29027],
    fromCity: "Johannesburg",
    toCity: "Singapore",
  },
  {
    from: [-87.6298, 41.8781],
    to: [-74.006, 40.7128],
    fromCity: "Chicago",
    toCity: "New York",
  },
  {
    from: [106.8456, -6.2088],
    to: [139.6917, 35.6895],
    fromCity: "Jakarta",
    toCity: "Tokyo",
  },
  {
    from: [126.978, 37.5665],
    to: [4.9041, 52.3676],
    fromCity: "Seoul",
    toCity: "Amsterdam",
  },
  {
    from: [-118.2437, 34.0522],
    to: [8.6821, 50.1109],
    fromCity: "Los Angeles",
    toCity: "Frankfurt",
  },
  {
    from: [139.6917, 35.6895],
    to: [8.6821, 50.1109],
    fromCity: "Tokyo",
    toCity: "Frankfurt",
  },
  {
    from: [114.1694, 22.3193],
    to: [-0.1276, 51.5072],
    fromCity: "Hong Kong",
    toCity: "London",
  },
  {
    from: [-79.3832, 43.6532],
    to: [-118.2437, 34.0522],
    fromCity: "Toronto",
    toCity: "Los Angeles",
  },
  {
    from: [-74.006, 40.7128],
    to: [106.8456, -6.2088],
    fromCity: "New York",
    toCity: "Jakarta",
  },
  {
    from: [72.8777, 19.076],
    to: [151.2093, -33.8688],
    fromCity: "Mumbai",
    toCity: "Sydney",
  },
  {
    from: [151.2093, -33.8688],
    to: [-46.6333, -23.5505],
    fromCity: "Sydney",
    toCity: "S\u00e3o Paulo",
  },
  {
    from: [4.9041, 52.3676],
    to: [103.851959, 1.29027],
    fromCity: "Amsterdam",
    toCity: "Singapore",
  },
  {
    from: [151.2093, -33.8688],
    to: [-118.2437, 34.0522],
    fromCity: "Sydney",
    toCity: "Los Angeles",
  },
  {
    from: [114.1694, 22.3193],
    to: [-0.1276, 51.5072],
    fromCity: "Hong Kong",
    toCity: "London",
  },
  {
    from: [55.2708, 25.2048],
    to: [126.978, 37.5665],
    fromCity: "Dubai",
    toCity: "Seoul",
  },
  {
    from: [2.3522, 48.8566],
    to: [151.2093, -33.8688],
    fromCity: "Paris",
    toCity: "Sydney",
  },
  {
    from: [-87.6298, 41.8781],
    to: [126.978, 37.5665],
    fromCity: "Chicago",
    toCity: "Seoul",
  },
  {
    from: [114.1694, 22.3193],
    to: [8.6821, 50.1109],
    fromCity: "Hong Kong",
    toCity: "Frankfurt",
  },
  {
    from: [126.978, 37.5665],
    to: [55.2708, 25.2048],
    fromCity: "Seoul",
    toCity: "Dubai",
  },
  {
    from: [-79.3832, 43.6532],
    to: [28.0473, -26.2041],
    fromCity: "Toronto",
    toCity: "Johannesburg",
  },
  {
    from: [103.851959, 1.29027],
    to: [8.6821, 50.1109],
    fromCity: "Singapore",
    toCity: "Frankfurt",
  },
  {
    from: [103.851959, 1.29027],
    to: [-79.3832, 43.6532],
    fromCity: "Singapore",
    toCity: "Toronto",
  },
  {
    from: [144.9631, -37.8136],
    to: [114.1694, 22.3193],
    fromCity: "Melbourne",
    toCity: "Hong Kong",
  },
  {
    from: [-74.006, 40.7128],
    to: [-122.4194, 37.7749],
    fromCity: "New York",
    toCity: "San Francisco",
  },
  {
    from: [4.9041, 52.3676],
    to: [8.6821, 50.1109],
    fromCity: "Amsterdam",
    toCity: "Frankfurt",
  },
  {
    from: [4.9041, 52.3676],
    to: [144.9631, -37.8136],
    fromCity: "Amsterdam",
    toCity: "Melbourne",
  },
  {
    from: [72.8777, 19.076],
    to: [114.1694, 22.3193],
    fromCity: "Mumbai",
    toCity: "Hong Kong",
  },
  {
    from: [103.851959, 1.29027],
    to: [-46.6333, -23.5505],
    fromCity: "Singapore",
    toCity: "S\u00e3o Paulo",
  },
  {
    from: [55.2708, 25.2048],
    to: [-79.3832, 43.6532],
    fromCity: "Dubai",
    toCity: "Toronto",
  },
  {
    from: [-74.006, 40.7128],
    to: [-87.6298, 41.8781],
    fromCity: "New York",
    toCity: "Chicago",
  },
  {
    from: [-118.2437, 34.0522],
    to: [-0.1276, 51.5072],
    fromCity: "Los Angeles",
    toCity: "London",
  },
  {
    from: [139.6917, 35.6895],
    to: [-122.4194, 37.7749],
    fromCity: "Tokyo",
    toCity: "San Francisco",
  },
  {
    from: [-118.2437, 34.0522],
    to: [28.0473, -26.2041],
    fromCity: "Los Angeles",
    toCity: "Johannesburg",
  },
  {
    from: [139.6917, 35.6895],
    to: [103.851959, 1.29027],
    fromCity: "Tokyo",
    toCity: "Singapore",
  },
  {
    from: [106.8456, -6.2088],
    to: [139.6917, 35.6895],
    fromCity: "Jakarta",
    toCity: "Tokyo",
  },
  {
    from: [151.2093, -33.8688],
    to: [4.9041, 52.3676],
    fromCity: "Sydney",
    toCity: "Amsterdam",
  },
  {
    from: [114.1694, 22.3193],
    to: [-0.1276, 51.5072],
    fromCity: "Hong Kong",
    toCity: "London",
  },
  {
    from: [-0.1276, 51.5072],
    to: [-87.6298, 41.8781],
    fromCity: "London",
    toCity: "Chicago",
  },
  {
    from: [139.6917, 35.6895],
    to: [103.851959, 1.29027],
    fromCity: "Tokyo",
    toCity: "Singapore",
  },
  {
    from: [114.1694, 22.3193],
    to: [-122.4194, 37.7749],
    fromCity: "Hong Kong",
    toCity: "San Francisco",
  },
  {
    from: [-79.3832, 43.6532],
    to: [139.6917, 35.6895],
    fromCity: "Toronto",
    toCity: "Tokyo",
  },
  {
    from: [103.851959, 1.29027],
    to: [8.6821, 50.1109],
    fromCity: "Singapore",
    toCity: "Frankfurt",
  },
  {
    from: [-87.6298, 41.8781],
    to: [144.9631, -37.8136],
    fromCity: "Chicago",
    toCity: "Melbourne",
  },
  {
    from: [144.9631, -37.8136],
    to: [151.2093, -33.8688],
    fromCity: "Melbourne",
    toCity: "Sydney",
  },
  {
    from: [126.978, 37.5665],
    to: [144.9631, -37.8136],
    fromCity: "Seoul",
    toCity: "Melbourne",
  },
  {
    from: [-79.3832, 43.6532],
    to: [55.2708, 25.2048],
    fromCity: "Toronto",
    toCity: "Dubai",
  },
  {
    from: [-74.006, 40.7128],
    to: [114.1694, 22.3193],
    fromCity: "New York",
    toCity: "Hong Kong",
  },
  {
    from: [-87.6298, 41.8781],
    to: [144.9631, -37.8136],
    fromCity: "Chicago",
    toCity: "Melbourne",
  },
  {
    from: [139.6917, 35.6895],
    to: [72.8777, 19.076],
    fromCity: "Tokyo",
    toCity: "Mumbai",
  },
  {
    from: [103.851959, 1.29027],
    to: [-122.4194, 37.7749],
    fromCity: "Singapore",
    toCity: "San Francisco",
  },
  {
    from: [-46.6333, -23.5505],
    to: [-118.2437, 34.0522],
    fromCity: "S\u00e3o Paulo",
    toCity: "Los Angeles",
  },
  {
    from: [-46.6333, -23.5505],
    to: [55.2708, 25.2048],
    fromCity: "S\u00e3o Paulo",
    toCity: "Dubai",
  },
  {
    from: [-79.3832, 43.6532],
    to: [4.9041, 52.3676],
    fromCity: "Toronto",
    toCity: "Amsterdam",
  },
  {
    from: [4.9041, 52.3676],
    to: [72.8777, 19.076],
    fromCity: "Amsterdam",
    toCity: "Mumbai",
  },
  {
    from: [8.6821, 50.1109],
    to: [106.8456, -6.2088],
    fromCity: "Frankfurt",
    toCity: "Jakarta",
  },
  {
    from: [-87.6298, 41.8781],
    to: [139.6917, 35.6895],
    fromCity: "Chicago",
    toCity: "Tokyo",
  },
  {
    from: [-87.6298, 41.8781],
    to: [103.851959, 1.29027],
    fromCity: "Chicago",
    toCity: "Singapore",
  },
  {
    from: [2.3522, 48.8566],
    to: [28.0473, -26.2041],
    fromCity: "Paris",
    toCity: "Johannesburg",
  },
  {
    from: [126.978, 37.5665],
    to: [114.1694, 22.3193],
    fromCity: "Seoul",
    toCity: "Hong Kong",
  },
  {
    from: [8.6821, 50.1109],
    to: [-118.2437, 34.0522],
    fromCity: "Frankfurt",
    toCity: "Los Angeles",
  },
  {
    from: [139.6917, 35.6895],
    to: [2.3522, 48.8566],
    fromCity: "Tokyo",
    toCity: "Paris",
  },
  {
    from: [-122.4194, 37.7749],
    to: [55.2708, 25.2048],
    fromCity: "San Francisco",
    toCity: "Dubai",
  },
  {
    from: [2.3522, 48.8566],
    to: [103.851959, 1.29027],
    fromCity: "Paris",
    toCity: "Singapore",
  },
  {
    from: [114.1694, 22.3193],
    to: [-122.4194, 37.7749],
    fromCity: "Hong Kong",
    toCity: "San Francisco",
  },
  {
    from: [126.978, 37.5665],
    to: [-74.006, 40.7128],
    fromCity: "Seoul",
    toCity: "New York",
  },
  {
    from: [-74.006, 40.7128],
    to: [2.3522, 48.8566],
    fromCity: "New York",
    toCity: "Paris",
  },
  {
    from: [28.0473, -26.2041],
    to: [151.2093, -33.8688],
    fromCity: "Johannesburg",
    toCity: "Sydney",
  },
  {
    from: [8.6821, 50.1109],
    to: [28.0473, -26.2041],
    fromCity: "Frankfurt",
    toCity: "Johannesburg",
  },
  {
    from: [2.3522, 48.8566],
    to: [139.6917, 35.6895],
    fromCity: "Paris",
    toCity: "Tokyo",
  },
  {
    from: [-74.006, 40.7128],
    to: [55.2708, 25.2048],
    fromCity: "New York",
    toCity: "Dubai",
  },
  {
    from: [4.9041, 52.3676],
    to: [-122.4194, 37.7749],
    fromCity: "Amsterdam",
    toCity: "San Francisco",
  },
  {
    from: [103.851959, 1.29027],
    to: [106.8456, -6.2088],
    fromCity: "Singapore",
    toCity: "Jakarta",
  },
  {
    from: [2.3522, 48.8566],
    to: [-122.4194, 37.7749],
    fromCity: "Paris",
    toCity: "San Francisco",
  },
  {
    from: [-79.3832, 43.6532],
    to: [144.9631, -37.8136],
    fromCity: "Toronto",
    toCity: "Melbourne",
  },
  {
    from: [-87.6298, 41.8781],
    to: [28.0473, -26.2041],
    fromCity: "Chicago",
    toCity: "Johannesburg",
  },
  {
    from: [-0.1276, 51.5072],
    to: [106.8456, -6.2088],
    fromCity: "London",
    toCity: "Jakarta",
  },
  {
    from: [55.2708, 25.2048],
    to: [106.8456, -6.2088],
    fromCity: "Dubai",
    toCity: "Jakarta",
  },
  {
    from: [-87.6298, 41.8781],
    to: [-0.1276, 51.5072],
    fromCity: "Chicago",
    toCity: "London",
  },
  {
    from: [72.8777, 19.076],
    to: [-0.1276, 51.5072],
    fromCity: "Mumbai",
    toCity: "London",
  },
  {
    from: [-74.006, 40.7128],
    to: [72.8777, 19.076],
    fromCity: "New York",
    toCity: "Mumbai",
  },
  {
    from: [2.3522, 48.8566],
    to: [-118.2437, 34.0522],
    fromCity: "Paris",
    toCity: "Los Angeles",
  },
  {
    from: [103.851959, 1.29027],
    to: [-79.3832, 43.6532],
    fromCity: "Singapore",
    toCity: "Toronto",
  },
  {
    from: [8.6821, 50.1109],
    to: [55.2708, 25.2048],
    fromCity: "Frankfurt",
    toCity: "Dubai",
  },
  {
    from: [106.8456, -6.2088],
    to: [-0.1276, 51.5072],
    fromCity: "Jakarta",
    toCity: "London",
  },
  {
    from: [126.978, 37.5665],
    to: [106.8456, -6.2088],
    fromCity: "Seoul",
    toCity: "Jakarta",
  },
  {
    from: [103.851959, 1.29027],
    to: [-87.6298, 41.8781],
    fromCity: "Singapore",
    toCity: "Chicago",
  },
  {
    from: [72.8777, 19.076],
    to: [-79.3832, 43.6532],
    fromCity: "Mumbai",
    toCity: "Toronto",
  },
  {
    from: [55.2708, 25.2048],
    to: [4.9041, 52.3676],
    fromCity: "Dubai",
    toCity: "Amsterdam",
  },
  {
    from: [-118.2437, 34.0522],
    to: [106.8456, -6.2088],
    fromCity: "Los Angeles",
    toCity: "Jakarta",
  },
  {
    from: [4.9041, 52.3676],
    to: [-74.006, 40.7128],
    fromCity: "Amsterdam",
    toCity: "New York",
  },
  {
    from: [126.978, 37.5665],
    to: [4.9041, 52.3676],
    fromCity: "Seoul",
    toCity: "Amsterdam",
  },
  {
    from: [103.851959, 1.29027],
    to: [106.8456, -6.2088],
    fromCity: "Singapore",
    toCity: "Jakarta",
  },
  {
    from: [-87.6298, 41.8781],
    to: [114.1694, 22.3193],
    fromCity: "Chicago",
    toCity: "Hong Kong",
  },
];

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
          // preload(`${ROOT_PATH}/lake.hdr`), // Note: .hdr may not load like normal images
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
