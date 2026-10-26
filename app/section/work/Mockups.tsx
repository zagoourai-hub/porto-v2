// Fake "screens" shown in each project tile. They are mock UIs and stay dark in both themes on purpose.
import type { ReactNode } from "react";

const cell = "min-w-0 bg-[#111827] border-[0.5px] border-[#1f2937]";

export const MockFrame = ({ title, right, footL, footR, tall, children }: {
    title: ReactNode
    right: ReactNode
    footL: ReactNode
    footR: ReactNode
    tall?: boolean
    children: ReactNode
}) => (
    <div className={`${tall ? "h-56 p-4" : "h-48 p-3.5"} flex flex-col justify-between bg-[#090d16] font-mono text-[10px] text-gray-400 select-none overflow-hidden`}>
        <div className="flex items-center justify-between gap-2 pb-2 border-b-[0.5px] border-[#1f2937] text-[9px]">
            <span className="min-w-0 truncate whitespace-nowrap tracking-widest text-gray-300">{title}</span>
            <span className="hidden min-[400px]:block shrink-0 text-gray-500">{right}</span>
        </div>
        {children}
        <div className="flex items-center justify-between gap-2 pt-1 text-[8px] text-gray-500 border-t border-gray-800">
            <span className="min-w-0 truncate">{footL}</span>
            <span className="hidden min-[400px]:block shrink-0">{footR}</span>
        </div>
    </div>
);

export const LapakMock = () => (
    <MockFrame title="LAPAK // STOREFRONT ENGINE" right="CART (3) — $480.00" footL="SSR CHECKOUT • STRIPE HOOKS" footR={<span className="text-emerald-400">99.8% CONVERSION</span>}>
        <div className="grid grid-cols-2 gap-2 my-auto">
            {[["MOCKUP ITEM A", "MECHANICAL KB-01", "$185.00"], ["MOCKUP ITEM B", "STUDIO MONITORS", "$295.00"]].map(([img, name, price]) => (
                <div key={name} className={`${cell} p-2.5 flex flex-col justify-between h-24`}>
                    <div className="w-full h-10 bg-[#172033] flex items-center justify-center text-[8px] text-gray-500 tracking-wider">{img}</div>
                    <div className="pt-1.5">
                        <div className="text-[9px] font-semibold text-gray-200">{name}</div>
                        <div className="text-[8px] text-gray-400">{price}</div>
                    </div>
                </div>
            ))}
        </div>
    </MockFrame>
);

export const BooklyMock = () => (
    <MockFrame title="BOOKLY // SCHEDULER MATRIX" right="TIMEZONE: GMT+7" footL="CALENDAR SYNC • WEBSOCKETS" footR="CONFIRMATION: 1.2s">
        <div className="grid grid-cols-4 gap-1.5 my-auto">
            {[["MON 14", "09:00", true], ["MON 14", "11:30", false], ["TUE 15", "14:00", true], ["WED 16", "16:30", true]].map(([day, time, open]) => (
                <div key={String(time)} className={`${open ? "bg-[#111827]" : "bg-[#172033]"} border-[0.5px] border-[#1f2937] p-2 text-center`}>
                    <div className="text-[8px] text-gray-500">{day}</div>
                    <div className="text-[11px] font-bold text-gray-200 mt-1">{time}</div>
                    <div className={`text-[7px] mt-0.5 ${open ? "text-emerald-400" : "text-gray-500"}`}>{open ? "OPEN" : "BOOKED"}</div>
                </div>
            ))}
        </div>
    </MockFrame>
);

export const AdminkitMock = () => (
    <MockFrame title="ADMINKIT // ENTERPRISE CMS" right="ROLE: SUPERADMIN" footL="RBAC • AUDIT LOGS" footR="500+ DAILY SEATS">
        <div className={`${cell} my-auto overflow-hidden text-[8px]`}>
            <div className="grid grid-cols-4 px-2 py-1 bg-[#172033] text-[7.5px] font-semibold uppercase tracking-wider border-b border-gray-800">
                <span>CLIENT</span><span>TIER</span><span className="text-right">REVENUE</span><span className="text-right">STATUS</span>
            </div>
            {[["ACME CORP", "ENTERPRISE", "$12,400", "ACTIVE"], ["VERTEX LABS", "GROWTH", "$4,800", "ACTIVE"], ["SYNTHETIX", "CUSTOM", "$8,250", "PENDING"]].map(([c, t, r, s]) => (
                <div key={c} className="grid grid-cols-4 px-2 py-1 text-gray-300 border-b border-gray-800/60 last:border-b-0">
                    <span className="truncate">{c}</span>
                    <span className="text-gray-500">{t}</span>
                    <span className="text-right">{r}</span>
                    <span className={`text-right ${s === "ACTIVE" ? "text-emerald-400" : "text-amber-400"}`}>{s}</span>
                </div>
            ))}
        </div>
    </MockFrame>
);

const bars = [30, 45, 35, 60, 50, 95, 70, 40, 55, 65, 30, 48];

export const NexusMock = () => (
    <MockFrame
        tall
        title={
            <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-primary inline-block" />
                <span className="font-semibold text-gray-200">NEXUS // REALTIME TELEMETRY</span>
                <span className="px-1.5 py-px bg-primary text-white text-[8px] font-bold">FEATURED</span>
            </span>
        }
        right={<>LATENCY: 14MS · STATUS: <span className="text-emerald-400">HEALTHY</span></>}
        footL="NODE ID: US-EAST-091A"
        footR="POSTGRES 16.2 / READ REPLICAS SYNCED"
    >
        <div className="grid grid-cols-3 gap-2 my-2">
            {[["TOTAL THROUGHPUT", "8.42M", "↑ +14.2% vs last cycle", "text-emerald-400"], ["AVG RESPONSE TIME", "32ms", "p99 < 95ms", "text-gray-400"], ["CRITICAL FAULTS", "0.00%", "99.998% UPTIME", "text-emerald-400"]].map(([l, v, s, c]) => (
                <div key={l} className={`${cell} p-2`}>
                    <div className="truncate text-[8px] text-gray-500 tracking-wider">{l}</div>
                    <div className="text-sm md:text-base font-bold text-gray-100 mt-0.5">{v}</div>
                    <div className={`text-[7.5px] mt-0.5 ${c}`}>{s}</div>
                </div>
            ))}
        </div>
        <div className={`${cell} p-2.5`}>
            <div className="flex items-center justify-between text-[8px] text-gray-500 mb-1.5">
                <span>DISTRIBUTED INGEST PEAKS (HOURLY)</span><span>CLUSTER #04 ACTIVE</span>
            </div>
            <div className="flex items-end gap-1.5 h-10 w-full pt-1">
                {bars.map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className={`flex-1 relative ${h === 95 ? "bg-primary" : "bg-[#1f2937]"}`}>
                        {h === 95 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] text-primary font-bold">PEAK</span>}
                    </div>
                ))}
            </div>
        </div>
    </MockFrame>
);

export const PulseMock = () => (
    <MockFrame tall title="PULSE // CLOUD MARKETING" right={<span className="text-emerald-400">LIGHTHOUSE: 100</span>} footL="35KB INITIAL BUNDLE" footR="ACCESSIBILITY: AAA">
        <div className={`${cell} my-auto p-4 text-center flex flex-col items-center justify-center`}>
            <span className="text-[7.5px] tracking-widest text-primary uppercase mb-1">V2.4 LAUNCH</span>
            <div className="text-xs font-bold text-gray-100 font-sans uppercase tracking-tight">NEXT-GEN DEVELOPER TOOLS</div>
            <div className="text-[8px] text-gray-500 mt-1 max-w-45 leading-tight">Zero-config builds with instant preview deployments.</div>
            <div className="mt-2.5 px-2.5 py-0.5 bg-primary text-white text-[7.5px] font-semibold tracking-wider uppercase">GET STARTED</div>
        </div>
    </MockFrame>
);
