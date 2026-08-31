import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import ShadTooltip from "@/components/common/shadTooltipComponent";

export interface NavItem {
  id: string;
  label: string;
  subtitle: string;
  icon: string;
  path: string;
  badge?: string;
}

export const EXECUTIVE_NAV_ITEMS: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    subtitle: "Painel Calmo Executivo",
    icon: "LayoutDashboard",
    path: "/overview",
  },
  {
    id: "content",
    label: "Content OS",
    subtitle: "Agenda IA & Mídias",
    icon: "CalendarDays",
    path: "/content",
    badge: "30d",
  },
  {
    id: "creative",
    label: "Studio Creative",
    subtitle: "Canvas & Elenco Digital",
    icon: "Sparkles",
    path: "/creative",
  },
  {
    id: "flows",
    label: "Flow Canvas",
    subtitle: "Visual Graph Builder",
    icon: "GitFork",
    path: "/studio/flows",
    badge: "DAG",
  },
  {
    id: "insights",
    label: "Insights & Performance",
    subtitle: "Retenção & Algoritmos",
    icon: "TrendingUp",
    path: "/insights",
  },
  {
    id: "settings",
    label: "Configurações",
    subtitle: "Studio & Keys (Isolado)",
    icon: "Settings",
    path: "/settings",
  },
];

export const ExecutiveSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActivePath = (itemPath: string) => {
    if (itemPath === "/overview" && (location.pathname === "/" || location.pathname === "/overview")) {
      return true;
    }
    if (itemPath === "/studio/flows" && location.pathname.startsWith("/flow/")) {
      return true;
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <aside
      className="z-20 flex h-full w-[240px] shrink-0 flex-col border-r border-border/40 bg-background/80 backdrop-blur-md transition-all duration-200 select-none"
      data-testid="executive-sidebar"
    >
      {/* Brand Header */}
      <div className="flex h-[52px] items-center gap-3 px-4 border-b border-border/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 text-white shadow-md shadow-purple-500/20 font-bold text-sm">
          V8
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm tracking-tight text-foreground">
            V8 Studio OS
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            CASOSEX Engine v1.0
          </span>
        </div>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Executive Workspaces
        </div>
        {EXECUTIVE_NAV_ITEMS.map((item) => {
          const active = isActivePath(item.path);
          return (
            <ShadTooltip
              key={item.id}
              content={item.subtitle}
              side="right"
              delayDuration={300}
            >
              <button
                type="button"
                onClick={() => navigate(item.path)}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all duration-150 ${
                  active
                    ? "bg-secondary/80 text-foreground font-semibold shadow-sm border border-border/50"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "bg-transparent text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <ForwardedIconComponent
                    name={item.icon}
                    className="h-4 w-4"
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                </div>
                <div className="flex flex-1 flex-col truncate">
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="ml-auto rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary border border-primary/20">
                    {item.badge}
                  </span>
                )}
              </button>
            </ShadTooltip>
          );
        })}
      </div>

      {/* Footer Status Badge */}
      <div className="border-t border-border/40 p-3 bg-secondary/20">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px]">REST :7860</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-500/90">Calm Mode</span>
        </div>
      </div>
    </aside>
  );
};

export default ExecutiveSidebar;
