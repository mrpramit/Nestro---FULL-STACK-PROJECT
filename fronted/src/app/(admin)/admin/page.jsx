"use client";

import React, { useState } from "react";

export default function AdminDashboard() {
  const [trafficTab, setTrafficTab] = useState("today");

  // Mock data for Traffic Stats based on selection
  const trafficStatsData = {
    today: { subscribers: "567K", trend: "+3.85%", rate: "27.6%", rateTrend: "+1.2%" },
    week: { subscribers: "3.4M", trend: "+12.4%", rate: "28.1%", rateTrend: "+2.5%" },
    month: { subscribers: "15.2M", trend: "+24.8%", rate: "29.4%", rateTrend: "+5.1%" }
  };

  return (
    <div className="space-y-6">

      {/* 1. Overview Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">

        {/* Card 1: Avg. Client Rating */}
        <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc] dark:bg-[#24303f] text-[#3c50e0] dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-sm font-medium text-slate-400 dark:text-slate-400">Avg. Client Rating</span>
              <h4 className="mt-1 text-2xl font-bold text-black dark:text-white">7.8/10</h4>
            </div>
            <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 dark:text-emerald-400">
              +20% <span className="text-[10px] text-slate-400 dark:text-slate-400">Vs last month</span>
            </span>
          </div>
        </div>

        {/* Card 2: Instagram Followers */}
        <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc] dark:bg-[#24303f] text-[#3c50e0] dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-sm font-medium text-slate-400 dark:text-slate-400">Instagram Followers</span>
              <h4 className="mt-1 text-2xl font-bold text-black dark:text-white">5,934</h4>
            </div>
            <span className="flex items-center gap-1 rounded bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-500 dark:text-rose-400">
              -3.59% <span className="text-[10px] text-slate-400 dark:text-slate-400">Vs last month</span>
            </span>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-[#f7f9fc] dark:bg-[#24303f] text-[#3c50e0] dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16M3 5h18M3 19h18" />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="text-sm font-medium text-slate-400 dark:text-slate-400">Total Revenue</span>
              <h4 className="mt-1 text-2xl font-bold text-black dark:text-white">$9,758</h4>
            </div>
            <span className="flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 dark:text-emerald-400">
              +15% <span className="text-[10px] text-slate-400 dark:text-slate-400">Vs last month</span>
            </span>
          </div>
        </div>

      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 md:gap-6">

        {/* Main Chart: Impression & Data Traffic */}
        <div className="lg:col-span-2 rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
          <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
            <div>
              <h3 className="text-xl font-bold text-black dark:text-white">Impression & Data Traffic</h3>
              <p className="text-sm font-medium text-slate-400">Jun 1, 2024 - Dec 1, 2025</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-black dark:text-white">$9,758.00</span>
              <span className="rounded bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                +7.96%
              </span>
            </div>
          </div>

          {/* SVG Multi-Line Chart Replica */}
          <div className="relative mt-8 h-80 w-full">
            <svg className="h-full w-full" viewBox="0 0 800 300" preserveAspectRatio="none">
              <defs>
                {/* Glow Gradients */}
                <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3c50e0" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3c50e0" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#80caee" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#80caee" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Background Grid Lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
              <line x1="0" y1="50" x2="800" y2="50" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

              <line x1="0" y1="125" x2="800" y2="125" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
              <line x1="0" y1="125" x2="800" y2="125" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

              <line x1="0" y1="200" x2="800" y2="200" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
              <line x1="0" y1="200" x2="800" y2="200" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

              <line x1="0" y1="275" x2="800" y2="275" stroke="#e2e8f0" strokeDasharray="4 4" className="dark:hidden" />
              <line x1="0" y1="275" x2="800" y2="275" stroke="#2e3a47" strokeDasharray="4 4" className="hidden dark:block" />

              {/* Area Under Curves */}
              <path
                d="M0,275 Q100,180 200,210 T400,170 T600,230 T800,130 L800,275 L0,275 Z"
                fill="url(#chartGrad1)"
              />
              <path
                d="M0,275 Q120,230 240,250 T480,210 T720,260 T800,185 L800,275 L0,275 Z"
                fill="url(#chartGrad2)"
              />

              {/* Curve 1 (Indigo-Blue) */}
              <path
                d="M0,275 Q100,180 200,210 T400,170 T600,230 T800,130"
                fill="none"
                stroke="#3c50e0"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Curve 2 (Light Blue) */}
              <path
                d="M0,275 Q120,230 240,250 T480,210 T720,260 T800,185"
                fill="none"
                stroke="#80caee"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive Dot Highlights */}
              <circle cx="400" cy="170" r="6" fill="#3c50e0" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
              <circle cx="480" cy="210" r="6" fill="#80caee" stroke="#fff" strokeWidth="2" className="drop-shadow-sm" />
            </svg>
          </div>
        </div>

        {/* Side Widget: Traffic Stats */}
        <div className="rounded-sm border border-[#e2e8f0] bg-white p-6 shadow-sm dark:border-[#2e3a47] dark:bg-[#1c2434] transition-colors duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-black dark:text-white">Traffic Stats</h3>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* Today, Week, Month switcher */}
          <div className="mt-5 flex gap-1 rounded bg-[#f1f5f9] dark:bg-[#24303f] p-1">
            {["today", "week", "month"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTrafficTab(tab)}
                className={`flex-1 rounded py-1.5 text-xs font-semibold uppercase transition-all duration-200 ${trafficTab === tab
                  ? "bg-white text-black dark:bg-[#1c2434] dark:text-white shadow-sm"
                  : "text-slate-400 hover:text-black dark:hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Stats content details */}
          <div className="mt-7 space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-400">New Subscribers</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-black dark:text-white">
                  {trafficStatsData[trafficTab].subscribers}
                </span>
                <span className="text-xs font-medium text-emerald-500">
                  {trafficStatsData[trafficTab].trend} <span className="text-[10px] text-slate-400">then last week</span>
                </span>
              </div>

              {/* Sparkline mini-graph */}
              <div className="mt-3 h-12 w-full">
                <svg className="h-full w-full" viewBox="0 0 200 40">
                  <path
                    d="M0,35 Q30,10 60,30 T120,15 T180,25 L200,10"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <div className="border-t border-[#e2e8f0] dark:border-[#2e3a47] pt-5">
              <p className="text-sm font-medium text-slate-400">Conversion Rate</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-black dark:text-white">
                  {trafficStatsData[trafficTab].rate}
                </span>
                <span className="text-xs font-medium text-emerald-500">
                  {trafficStatsData[trafficTab].rateTrend}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
