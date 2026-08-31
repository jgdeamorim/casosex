import ForwardedIconComponent from "@/components/common/genericIconComponent";

export function CustomLangflowCounts() {
  return (
    <div className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-emerald-500 bg-emerald-500/10 rounded-full border border-emerald-500/20 select-none">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <ForwardedIconComponent name="ShieldCheck" className="h-3.5 w-3.5" ariaHidden={true} />
      <span>Telemetria Soberana</span>
    </div>
  );
}

export default CustomLangflowCounts;
