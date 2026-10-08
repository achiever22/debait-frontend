import { LogOut, ShieldCheck, Cpu } from "lucide-react";
import { AdminAuthService } from "@/lib/admin-api";

interface AdminHeaderProps {
  operatorName: string;
  onLogout: () => void;
}

export function AdminHeader({ operatorName, onLogout }: AdminHeaderProps) {
  const status = AdminAuthService.getBackendStatus();

  return (
    <header className="border-b-4 border-line bg-surface px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-[1700px] flex-wrap items-center justify-between gap-4">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-type text-xs uppercase tracking-widest text-sun">
                DE&apos;BAIT 2026
              </span>
              <span className="border border-line bg-canvas px-2 py-0.5 font-type text-[10px] uppercase tracking-wider text-hot font-bold">
                RURAL
              </span>
            </div>
            <h1 className="display mt-0.5 text-2xl tracking-wide text-paper md:text-3xl">
              OPERATIONAL <span className="text-sun">DESK</span>
            </h1>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 border border-line bg-canvas px-3 py-1 font-type text-xs text-mist/80">
            <Cpu size={13} className="text-sun" />
            <span className="uppercase">{status.label}</span>
          </div>

          <div className="flex items-center gap-1.5 border border-line bg-canvas px-3 py-1 font-type text-xs text-mist/90">
            <ShieldCheck size={13} className="text-hot" />
            <span className="uppercase">
              OPERATOR: <span className="font-bold text-paper">{operatorName}</span>
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 border-2 border-line bg-surface-raised px-4 py-2 font-type text-xs uppercase tracking-wider text-mist hover:border-hot hover:bg-hot hover:text-paper transition-colors"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
