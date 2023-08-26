"use client"
import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js";

interface DataEntry {
    id: number;
    x: number;
    y: number;
  }
  

export default function Plot(): JSX.Element {
  const [chartData, setChartData] = useState<{ labels: number[]; datasets: Chart.ChartDataSets[] }>({
    labels: [],
    datasets: [],
  });
  const [tableData, setTableData] = useState<DataEntry[]>([]);

  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/plots/get/"); // Replace with your API URL
        const data: DataEntry[] = await response.json();
        console.log(data);
        const xCoordinates = data.map(entry => entry.x);
        const yCoordinates = data.map(entry => entry.y);

        setChartData({
          labels: xCoordinates,
          datasets: [
            {
              label: new Date().getFullYear().toString(),
              backgroundColor: "#3182ce",
              borderColor: "#3182ce",
              data: yCoordinates,
              fill: false,
            },
          ],
        });
        setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.labels.length > 0 && chartRef.current !== null) {
      chartRef.current.data = chartData;
      chartRef.current.update();
    } else {
      const ctx = document.getElementById("line-chart") as HTMLCanvasElement;
      chartRef.current = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          // Your existing options here
        },
      });
    }
  }, [chartData]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">Overview</h6>
              <h2 className="text-white text-xl font-semibold">Sales value</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>


      <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">Table of Data</h3>
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">X Value</th>
                  <th className="px-4 py-2">Y Value</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((entry) => (
                  <tr key={entry.id}>
                    <td className="border px-4 py-2">{entry.id}</td>
                    <td className="border px-4 py-2">{entry.x}</td>
                    <td className="border px-4 py-2">{entry.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      
   
    </>
  );
}
