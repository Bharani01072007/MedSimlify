import { Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, FileText, Home, MessageSquare, Pill, Stethoscope, User, Users } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Phone-width frame used by every screen. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen justify-center bg-muted">
      <div className="relative flex w-full max-w-[430px] flex-col bg-background shadow-card">
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  back,
  onBack,
  subtitle,
  right,
}: {
  title: string;
  back?: string;
  onBack?: () => void;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-card px-4 py-3">
      {onBack ? (
        <button
          onClick={onBack}
          aria-label="Go back"
          className="tap-target -ml-2 flex items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-5" />
        </button>
      ) : back ? (
        <Link
          to={back}
          aria-label="Go back"
          className="tap-target -ml-2 flex items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-5" />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[20px] font-bold">{title}</h2>
        {subtitle ? <p className="truncate text-[12px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}

export function Screen({
  children,
  withNav = false,
  className,
}: {
  children: ReactNode;
  withNav?: boolean;
  className?: string;
}) {
  return (
    <main className={cn("flex-1 px-4 py-4", withNav && "pb-28", className)}>{children}</main>
  );
}

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="sticky bottom-0 z-20 mx-auto w-full border-t border-border bg-card"
    >
      <ul className="flex">
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              aria-label={label}
              className="tap-target flex flex-col items-center gap-1 py-2 text-[12px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="size-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const doctorTabs = [
  { to: "/doctor/dashboard", label: "Home", icon: Home },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/messages", label: "Messages", icon: MessageSquare },
  { to: "/doctor/prescriptions", label: "Rx", icon: Stethoscope },
  { to: "/doctor/profile", label: "Profile", icon: User },
] as const;

export function BottomNavDoctor() {
  return (
    <nav
      aria-label="Doctor navigation"
      className="sticky bottom-0 z-20 mx-auto w-full border-t border-border bg-card"
    >
      <ul className="flex">
        {doctorTabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              aria-label={label}
              className="tap-target flex flex-col items-center gap-1 py-2 text-[12px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="size-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-2 mt-6 text-[18px] font-bold first:mt-0">{children}</h3>;
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
        {icon}
      </div>
      <p className="text-[18px] font-bold">{title}</p>
      <p className="text-[14px] text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
