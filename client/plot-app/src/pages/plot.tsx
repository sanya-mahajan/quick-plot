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
  const [newX, setNewX] = useState<number>(0);
  const [newY, setNewY] = useState<number>(0);
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
              label: "Label",
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

  const handleAddData = async () => {
    try {
      const response = await fetch("http://localhost:8000/plots/new/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ x: newX, y: newY }),
      });

      if (response.ok) {
        const newData: DataEntry = await response.json();
        setTableData([...tableData, newData]);
        setNewX(0);
        setNewY(0);
      } else {
        console.error("Error adding data");
      }
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">Overview</h6>
              
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

          <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">Add Data</h3>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="X Value"
                value={newX}
                onChange={(e) => setNewX(parseFloat(e.target.value))}
                className="border p-2"
              />
              <input
                type="number"
                placeholder="Y Value"
                value={newY}
                onChange={(e) => setNewY(parseFloat(e.target.value))}
                className="border p-2"
              />
              <button onClick={handleAddData} className="bg-blue-500 text-blue px-4 py-2">
                Add
              </button>
            </div>
          </div>
      
   
    </>
  );
}
