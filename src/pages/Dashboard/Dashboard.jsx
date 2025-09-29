import React, { useState } from "react";
import { useSelector } from "react-redux";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./Dashboard.css";
import SpecialHead from "../../components/SpecialHead/SpecialHead";

function Dashboard() {
  const { currentUser, profiles } = useSelector((s) => s.auth);
  const tasks = useSelector((s) => s.tasks.items);

  const [selectedAssignee, setSelectedAssignee] = useState(null);

  let userTasks;
  if (currentUser?.role === "admin") {
    if (selectedAssignee) {
      userTasks = tasks.filter(
        (t) => String(t.assigneeId) === String(selectedAssignee)
      );
    } else {
      userTasks = tasks;
    }
  } else {
    userTasks = tasks.filter(
      (t) => String(t.assigneeId) === String(currentUser.id)
    );
  }

  const intervals = [
    { start: "2025-09-00", end: "2025-10-00", label: "2025-09" },
    { start: "2025-10-00", end: "2025-11-00", label: "2025-10" },
    { start: "2025-11-00", end: "2025-12-00", label: "2025-11" },
  ];

  const seriesData = {
    pending: [],
    inProgress: [],
    completed: [],
    rejected: [],
  };

  intervals.forEach((interval) => {
    const tasksInInterval = userTasks.filter((t) => {
      if (!t.date) return false;
      return t.date >= interval.start && t.date < interval.end;
    });

    seriesData.pending.push(
      tasksInInterval.filter((t) => t.status === "Pending").length
    );
    seriesData.inProgress.push(
      tasksInInterval.filter((t) => t.status === "In Progress").length
    );
    seriesData.completed.push(
      tasksInInterval.filter((t) => t.status === "Completed").length
    );
    seriesData.rejected.push(
      tasksInInterval.filter((t) => t.status === "Rejected").length
    );
  });

  const pendingCount = userTasks.filter((t) => t.status === "Pending").length;
  const inProgressCount = userTasks.filter(
    (t) => t.status === "In Progress"
  ).length;
  const completedCount = userTasks.filter(
    (t) => t.status === "Completed"
  ).length;
  const rejectedCount = userTasks.filter(
    (t) => t.status === "Rejected"
  ).length;

  const categories = ["Pending", "In Progress", "Completed", "Rejected"];
  const values = [
    pendingCount,
    inProgressCount,
    completedCount,
    rejectedCount,
  ];
  const statusColors = [
    "var(--status-pending)",
    "var(--status-inprogress)",
    "var(--status-completed)",
    "var(--status-rejected)",
  ];

  const piePalette = [
    "#2196f3", "#1787e0", "#4caf50", "#ff9800", "#f44336",
    "#9c27b0", "#00bcd4", "#8bc34a", "#ff5722", "#795548",
    "#3f51b5", "#009688"
  ];

  const lineOptions = {
    chart: { type: "line", backgroundColor: "transparent", height: 300 },
    title: {
      text: selectedAssignee
        ? `📈 Task Timeline of ${
            profiles.find((p) => String(p.id) === String(selectedAssignee))?.name
          }`
        : "📈 Task Status Timeline",
      style: { color: "var(--main-color)" },
    },
    xAxis: {
      categories: intervals.map((i) => i.label),
      labels: { style: { color: "var(--dark-color)" } },
    },
    yAxis: {
      title: { text: "Number of Tasks", style: { color: "var(--dark-color)" } },
      labels: { style: { color: "var(--dark-color)" } },
    },
    tooltip: { shared: true, valueSuffix: " tasks" },
    legend: {
      itemStyle: {
        color: "var(--dark-color)", 
        fontWeight: "bold",     
      },
      itemHoverStyle: {
        color: "#9CA3AF",                   
      },
      itemHiddenStyle: {
        color: "#9CA3AF",        
        textDecoration: "line-through",  
      }
    },
    series: [
      { name: "Pending", data: seriesData.pending, color: "var(--status-pending)" },
      { name: "In Progress", data: seriesData.inProgress, color: "var(--status-inprogress)" },
      { name: "Completed", data: seriesData.completed, color: "var(--status-completed)" },
      { name: "Rejected", data: seriesData.rejected, color: "var(--status-rejected)" },
    ],
  };

  const columnOptions = {
    chart: { type: "column", backgroundColor: "transparent", height: 300 },
    title: {
      text: selectedAssignee
        ? `📊 Tasks by Status for ${
            profiles.find((p) => String(p.id) === String(selectedAssignee))?.name
          }`
        : "📊 Tasks by Status",
      style: { color: "var(--main-color)" },
    },
    xAxis: { categories, labels: { style: { color: "var(--dark-color)" } } },
    yAxis: { title: { text: "Tasks", style: { color: "var(--dark-color)" } }, labels: { style: { color: "var(--dark-color)" } } },
    tooltip: { valueSuffix: " tasks" },
    legend: {
      itemStyle: {
        color: "var(--dark-color)",      
        fontWeight: "bold",
      },
      itemHoverStyle: {
        color: "#9CA3AF",                  
      },
      itemHiddenStyle: {
        color: "var(--dark-color)",        
        textDecoration: "line-through",  
      }
    },
    series: [{ name: "Tasks", data: values, colorByPoint: true, colors: statusColors }],
  };

  let pieData;
  if (currentUser?.role === "admin") {
    pieData = profiles
      .map((p, index) => {
        const count = tasks.filter((t) => String(t.assigneeId) === String(p.id)).length;
        return {
          name: p.name,
          y: count,
          id: p.id,
          color: piePalette[index % piePalette.length],
        };
      })
      .filter((d) => d.y > 0);
  } else {
    pieData = categories.map((c, i) => ({
      name: c,
      y: values[i],
      color: statusColors[i],
    }));
  }

  const pieOptions = {
    chart: { type: "pie", backgroundColor: "transparent", height: 300 },
    title: {
      text:
        currentUser?.role === "admin"
          ? "🍩 Task Distribution by Assignee"
          : "🍩 Task Distribution by Status",
      style: { color: "var(--main-color)" },
    },
    tooltip: { pointFormat: "<b>{point.percentage:.1f}%</b> ({point.y} tasks)" },
    plotOptions: {
      pie: {
        allowPointSelect: currentUser?.role === "admin",
        cursor: currentUser?.role === "admin" ? "pointer" : "default",
        point: {
          events:
            currentUser?.role === "admin"
              ? {
                  click: function () {
                    if (selectedAssignee === this.id) {
                      setSelectedAssignee(null);
                    } else {
                      setSelectedAssignee(this.id);
                    }
                  },
                }
              : {},
        },
      },
    },
    series: [
      {
        name: "Tasks",
        colorByPoint: true,
        data: pieData,
      },
    ],
  };

  return (
    <section id="Dashboard">
      <div className="container">
        <SpecialHead Heading="📊 Dashboard"/>
        <div className="chart-full">
          <HighchartsReact highcharts={Highcharts} options={lineOptions} />
        </div>

        <div className="charts-row">
          <div className="chart-half">
            <HighchartsReact highcharts={Highcharts} options={columnOptions} />
          </div>
          <div className="chart-half">
            <HighchartsReact highcharts={Highcharts} options={pieOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
