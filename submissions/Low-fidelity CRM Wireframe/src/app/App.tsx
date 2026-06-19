import { useState } from "react";
import {
  Shield,
  ChevronRight,
  Phone,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  CreditCard,
  User,
  Lock,
  ArrowLeft,
  Headphones,
  Clock,
  Info,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen =
  | "landing"
  | "identity"
  | "account-summary"
  | "choose-action"
  | "promise-to-pay"
  | "payment-plan"
  | "confirmation"
  | "route-agent";

interface CRMState {
  screen: Screen;
  verificationMethod: "dob" | "otp" | null;
  selectedAction: "ptp" | "plan" | "dispute" | "callback" | null;
  ptpDate: string;
  ptpAmount: string;
  planMonths: string;
  planStartDate: string;
  confirmationType: "ptp" | "plan" | null;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`font-mono text-[11px] tracking-widest uppercase text-muted-foreground ${className}`}
    >
      {children}
    </span>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warning" | "danger" | "success";
}) {
  const colors = {
    default: "bg-secondary text-secondary-foreground",
    warning: "bg-amber-100 text-amber-800 border border-amber-300",
    danger: "bg-red-100 text-destructive border border-red-300",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  };
  return (
    <span
      className={`font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-sm ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

function Button({
  children,
  variant = "primary",
  onClick,
  disabled = false,
  className = "",
  icon,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-[#243660] border border-primary",
    secondary:
      "bg-card text-foreground hover:bg-secondary border border-border",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent",
    danger: "bg-destructive text-destructive-foreground hover:bg-[#9a2f17] border border-destructive",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  hint,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[11px] tracking-widest uppercase text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-input-background border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
      />
      {hint && <p className="text-[11px] text-muted-foreground font-mono">{hint}</p>}
    </div>
  );
}

function Rule() {
  return <hr className="border-border" />;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const steps = [
    "Identity",
    "Account",
    "Action",
    "Agreement",
    "Confirm",
  ];
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const active = stepNum === current;
        const done = stepNum < current;
        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 ${
                active
                  ? "bg-primary text-primary-foreground"
                  : done
                  ? "bg-secondary text-muted-foreground"
                  : "bg-transparent text-muted-foreground"
              }`}
            >
              <span className="font-mono text-[10px] tracking-widest">
                {done ? "✓" : String(stepNum).padStart(2, "0")}
              </span>
              <span className="text-[11px] font-medium hidden sm:block">{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px w-4 ${done ? "bg-border" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Layout wrapper ───────────────────────────────────────────────────────────

function Shell({
  children,
  step,
  onBack,
  showNav = true,
}: {
  children: React.ReactNode;
  step?: number;
  onBack?: () => void;
  showNav?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-foreground leading-none">Legacy-Trust Bank</p>
            <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground leading-none mt-0.5">
              Smart-Recovery CRM · Internal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {showNav && step && <ProgressBar current={step} total={5} />}
          <div className="flex items-center gap-2 pl-4 border-l border-border">
            <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                Agent
              </p>
              <p className="text-[11px] font-medium text-foreground leading-none">D. Reyes #4421</p>
            </div>
          </div>
        </div>
      </header>

      {/* Back nav */}
      {onBack && (
        <div className="bg-card border-b border-border px-6 py-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border px-6 py-2.5 flex items-center justify-between shrink-0">
        <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          Session · REF-20240618-7742 · Smart-Recovery Initiative v1
        </p>
        <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
          Encrypted · FCA CONC compliant · GDPR
        </p>
      </footer>
    </div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <Shell showNav={false}>
      <div className="flex-1 flex">
        {/* Left panel */}
        <div className="w-64 bg-primary text-primary-foreground flex flex-col p-6 shrink-0">
          <div className="mb-8">
            <Label className="text-primary-foreground/50">My Queue</Label>
            <p className="text-2xl font-semibold mt-1">14</p>
            <p className="text-[11px] text-primary-foreground/60 mt-0.5">accounts pending today</p>
          </div>
          <Rule />
          <div className="mt-4 mb-4">
            <Label className="text-primary-foreground/50">Portfolio · All agents</Label>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-[11px] text-primary-foreground/60">Open accounts</span>
                <span className="font-mono text-[11px] text-primary-foreground">103,842</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-primary-foreground/60">Active agents</span>
                <span className="font-mono text-[11px] text-primary-foreground">52</span>
              </div>
            </div>
          </div>
          <Rule />
          <div className="mt-4 space-y-4">
            {[
              { label: "Outbound calls", val: "6" },
              { label: "Promise-to-pay", val: "3" },
              { label: "Payment plans", val: "4" },
              { label: "Escalations", val: "1" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-[12px] text-primary-foreground/70">{item.label}</span>
                <span className="font-mono text-[12px] text-primary-foreground">{item.val}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <Rule />
            <div className="mt-4 space-y-2">
              <p className="font-mono text-[9px] tracking-widest uppercase text-primary-foreground/40">
                Agent Status
              </p>
              <Badge variant="success">● Available</Badge>
            </div>
          </div>
        </div>

        {/* Center — welcome */}
        <div className="flex-1 flex flex-col items-center justify-center p-10 gap-8">
          <div className="max-w-md w-full">
            <div className="border border-border bg-card p-8">
              <Label>Smart-Recovery Initiative · Agent Portal</Label>
              <h1 className="text-2xl font-semibold mt-3 mb-1">Initiate Recovery Session</h1>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Legacy-Trust Bank's Smart-Recovery CRM consolidates account data, communications and
                case history into a single view. All sessions are recorded and subject to regulatory review.
              </p>
              <Rule />
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: <Phone className="w-4 h-4" />, label: "Inbound Call", sub: "Customer initiated" },
                  { icon: <Phone className="w-4 h-4 rotate-12" />, label: "Outbound Call", sub: "Agent initiated" },
                  { icon: <FileText className="w-4 h-4" />, label: "Written Request", sub: "Letter / email" },
                  { icon: <User className="w-4 h-4" />, label: "Walk-in", sub: "Branch visit" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="border border-border bg-background p-3 text-left hover:bg-secondary hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-muted-foreground">{item.icon}</span>
                      <span className="text-[13px] font-medium">{item.label}</span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground">{item.sub}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={onStart} className="w-full justify-center" icon={<ChevronRight className="w-4 h-4" />}>
                  Open Case — Inbound Call
                </Button>
              </div>
            </div>

            <div className="mt-4 border border-border bg-amber-50 border-amber-200 p-4 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-medium text-amber-900">Compliance reminder</p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
                  Confirm consent to record before proceeding. Do not make payment arrangements without
                  completing identity verification. Do not update account status across external spreadsheets —
                  all changes must be recorded in this system only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — recent activity */}
        <div className="w-56 bg-card border-l border-border p-4 flex flex-col gap-4 shrink-0 hidden lg:flex">
          <Label>Recent Sessions</Label>
          <div className="space-y-3">
            {[
              { ref: "REF-7741", name: "M. Okonkwo", status: "PTP agreed", time: "11:42" },
              { ref: "REF-7740", name: "J. Fairbanks", status: "Escalated", time: "11:18" },
              { ref: "REF-7739", name: "A. Mertens", status: "Plan set", time: "10:54" },
              { ref: "REF-7738", name: "R. Castellano", status: "No answer", time: "10:31" },
            ].map((item) => (
              <div key={item.ref} className="border border-border p-2.5 bg-background">
                <div className="flex justify-between items-start">
                  <p className="text-[12px] font-medium">{item.name}</p>
                  <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{item.ref}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function IdentityScreen({ onVerified, onBack }: { onVerified: () => void; onBack: () => void }) {
  const [method, setMethod] = useState<"dob" | "otp">("dob");
  const [step, setStep] = useState<"select" | "verify">("select");
  const [dob, setDob] = useState("");
  const [postcode, setPostcode] = useState("");
  const [otp, setOtp] = useState("");

  const canVerify = method === "dob" ? dob && postcode : otp.length === 6;

  return (
    <Shell step={1} onBack={onBack}>
      <div className="flex-1 flex">
        {/* Account lookup sidebar */}
        <div className="w-64 border-r border-border bg-card p-5 shrink-0 flex flex-col gap-5">
          <div>
            <Label>Account Lookup</Label>
            <div className="mt-3 space-y-3">
              <Input label="Account number" placeholder="e.g. 00274-8812" />
              <Input label="Surname" placeholder="e.g. Okonkwo" />
              <Button variant="secondary" className="w-full justify-center text-[12px]">
                Search
              </Button>
            </div>
          </div>
          <Rule />
          <div>
            <Label>Pre-loaded</Label>
            <div className="mt-3 border border-border bg-background p-3">
              <p className="text-[12px] font-semibold">Marcus A. Okonkwo</p>
              <p className="font-mono text-[10px] text-muted-foreground mt-1">Acc · 00274-8812</p>
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">Balance</span>
                  <span className="font-mono text-[11px] text-destructive font-medium">£4,280.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">DPD</span>
                  <span className="font-mono text-[11px]">87 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">Product</span>
                  <span className="font-mono text-[11px]">Personal Loan</span>
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="danger">Pre-legal</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Identity form */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <Label>Step 01 · Identity Verification</Label>
            </div>
            <h2 className="text-xl font-semibold mb-1">Verify Customer Identity</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Two-factor verification required before accessing account details or making arrangements.
            </p>

            {/* Method selector */}
            <div className="flex gap-2 mb-6">
              {[
                { id: "dob" as const, label: "Date of Birth + Postcode" },
                { id: "otp" as const, label: "SMS One-Time Passcode" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex-1 border px-3 py-2.5 text-[12px] font-medium transition-colors text-left ${
                    method === m.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="border border-border bg-card p-6 space-y-4">
              {method === "dob" ? (
                <>
                  <Input
                    label="Date of birth"
                    type="date"
                    value={dob}
                    onChange={setDob}
                    hint="Must match account records exactly"
                  />
                  <Input
                    label="Postcode"
                    placeholder="e.g. SW1A 1AA"
                    value={postcode}
                    onChange={setPostcode}
                    hint="Current address postcode on file"
                  />
                </>
              ) : (
                <>
                  <div className="bg-secondary border border-border p-3 flex gap-2">
                    <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p className="text-[12px] text-muted-foreground">
                      A 6-digit code will be sent to the mobile number ending ••• 4821.
                    </p>
                  </div>
                  <Button variant="secondary" className="text-[12px]">
                    Send OTP
                  </Button>
                  <Input
                    label="Enter 6-digit code"
                    placeholder="000 000"
                    value={otp}
                    onChange={setOtp}
                    hint="Code expires in 10 minutes"
                  />
                </>
              )}

              <Rule />

              <div className="flex items-start gap-2">
                <input type="checkbox" id="consent" className="mt-1" />
                <label htmlFor="consent" className="text-[12px] text-muted-foreground leading-relaxed cursor-pointer">
                  I confirm the customer has consented to recording and has been read the regulatory disclosure statement.
                </label>
              </div>

              <Button
                onClick={onVerified}
                disabled={!canVerify}
                className="w-full justify-center"
                icon={<Shield className="w-4 h-4" />}
              >
                Verify Identity
              </Button>
            </div>

            <div className="mt-3 border border-border border-dashed p-3 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[11px] text-muted-foreground">
                If identity cannot be verified after 3 attempts, escalate to supervisor and document the session.
              </p>
            </div>
          </div>
        </div>

        {/* Verification log */}
        <div className="w-52 border-l border-border bg-card p-4 shrink-0 hidden lg:flex flex-col gap-4">
          <Label>Verification Log</Label>
          <div className="space-y-2">
            {[
              { time: "11:55:02", event: "Session opened", ok: true },
              { time: "11:55:08", event: "Account loaded", ok: true },
              { time: "11:55:14", event: "DOB attempt 1", ok: false },
            ].map((log, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className={`font-mono text-[9px] mt-0.5 ${log.ok ? "text-emerald-600" : "text-destructive"}`}>
                  {log.ok ? "●" : "✗"}
                </span>
                <div>
                  <p className="text-[11px]">{log.event}</p>
                  <p className="font-mono text-[9px] text-muted-foreground">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function AccountSummaryScreen({
  onContinue,
  onBack,
}: {
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <Shell step={2} onBack={onBack}>
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {/* Verified banner */}
        <div className="mb-5 bg-emerald-50 border border-emerald-300 px-4 py-2.5 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-[12px] text-emerald-800 font-medium">
            Identity verified · 11:55:31 · Method: Date of birth + Postcode
          </p>
        </div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <Label>Step 02 · Account Summary</Label>
            <h2 className="text-xl font-semibold mt-1">Marcus A. Okonkwo</h2>
            <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
              Acc · 00274-8812 · DOB 14 Mar 1984 · Personal Loan
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="danger">Pre-legal</Badge>
            <Badge variant="warning">87 DPD</Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          {/* Outstanding balance */}
          {[
            { label: "Outstanding Balance", value: "£4,280.00", sub: "As of 18 Jun 2024", highlight: true },
            { label: "Missed Payments", value: "3", sub: "Apr · May · Jun 2024", highlight: false },
            { label: "Monthly Instalment", value: "£142.67", sub: "Next due: 01 Jul 2024", highlight: false },
          ].map((card) => (
            <div
              key={card.label}
              className={`border p-4 ${card.highlight ? "border-destructive bg-red-50" : "border-border bg-card"}`}
            >
              <Label>{card.label}</Label>
              <p
                className={`text-2xl font-semibold mt-2 font-mono ${card.highlight ? "text-destructive" : ""}`}
              >
                {card.value}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Payment history */}
          <div className="border border-border bg-card p-4">
            <Label className="mb-3 block">Payment History · Last 6 Months</Label>
            <div className="space-y-2">
              {[
                { month: "Jun 2024", amount: "£0.00", status: "missed" },
                { month: "May 2024", amount: "£0.00", status: "missed" },
                { month: "Apr 2024", amount: "£0.00", status: "missed" },
                { month: "Mar 2024", amount: "£142.67", status: "paid" },
                { month: "Feb 2024", amount: "£142.67", status: "paid" },
                { month: "Jan 2024", amount: "£142.67", status: "paid" },
              ].map((p) => (
                <div
                  key={p.month}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${p.status === "paid" ? "bg-emerald-500" : "bg-destructive"}`}
                    />
                    <span className="font-mono text-[12px]">{p.month}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[12px]">{p.amount}</span>
                    <Badge variant={p.status === "paid" ? "success" : "danger"}>
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account details */}
          <div className="border border-border bg-card p-4">
            <Label className="mb-3 block">Account Details</Label>
            <div className="space-y-3">
              {[
                { label: "Product", value: "Personal Unsecured Loan" },
                { label: "Opened", value: "15 Jan 2022" },
                { label: "Original amount", value: "£8,500.00" },
                { label: "Interest rate", value: "12.9% APR" },
                { label: "Term", value: "60 months" },
                { label: "Remaining term", value: "22 months" },
                { label: "Collection stage", value: "Collections — Pre-legal" },
                { label: "Previous arrangements", value: "None on record" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                  <span className="text-[12px] text-muted-foreground">{row.label}</span>
                  <span className="font-mono text-[12px]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border border-border border-dashed p-3">
              <Label className="mb-1 block">Agent Notes</Label>
              <p className="text-[12px] text-muted-foreground italic">
                Apr — no answer (3 attempts). May — voicemail x2, no callback. Jun 18 — first live
                contact. Customer states reduced income following Feb redundancy. Note: account
                previously flagged as "pending" in Team 4 spreadsheet — status inconsistent with CRM record.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onContinue} icon={<ChevronRight className="w-4 h-4" />}>
            Proceed to Action Selection
          </Button>
        </div>
      </div>
    </Shell>
  );
}

function ChooseActionScreen({
  onAction,
  onBack,
}: {
  onAction: (action: "ptp" | "plan" | "dispute" | "callback" | "agent") => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const actions = [
    {
      id: "ptp",
      icon: <CreditCard className="w-5 h-5" />,
      title: "Promise to Pay",
      sub: "Customer commits to a specific payment by an agreed date",
      tag: "Recommended",
      tagVariant: "success" as const,
    },
    {
      id: "plan",
      icon: <Calendar className="w-5 h-5" />,
      title: "Payment Plan",
      sub: "Arrange a structured repayment schedule over multiple months",
      tag: "Available",
      tagVariant: "default" as const,
    },
    {
      id: "dispute",
      icon: <FileText className="w-5 h-5" />,
      title: "Raise a Dispute",
      sub: "Customer contests the balance, charges, or account ownership",
      tag: "Regulatory",
      tagVariant: "warning" as const,
    },
    {
      id: "callback",
      icon: <Phone className="w-5 h-5" />,
      title: "Schedule Callback",
      sub: "Customer cannot engage now — book a future contact attempt",
      tag: "Available",
      tagVariant: "default" as const,
    },
    {
      id: "agent",
      icon: <Headphones className="w-5 h-5" />,
      title: "Route to Senior Agent",
      sub: "Case requires specialist handling or customer is distressed",
      tag: "Escalate",
      tagVariant: "danger" as const,
    },
  ];

  return (
    <Shell step={3} onBack={onBack}>
      <div className="flex-1 flex">
        <div className="flex-1 p-6 max-w-2xl mx-auto w-full">
          <Label>Step 03 · Next Action</Label>
          <h2 className="text-xl font-semibold mt-1 mb-1">Choose Next Action</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Based on account status and customer circumstances, select the appropriate course of action.
          </p>

          <div className="space-y-2 mb-6">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => setSelected(action.id)}
                className={`w-full border p-4 text-left flex items-start gap-4 transition-colors ${
                  selected === action.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-secondary hover:border-primary/50"
                }`}
              >
                <div
                  className={`mt-0.5 ${selected === action.id ? "text-primary" : "text-muted-foreground"}`}
                >
                  {action.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[14px] font-semibold">{action.title}</p>
                    <Badge variant={action.tagVariant}>{action.tag}</Badge>
                  </div>
                  <p className="text-[12px] text-muted-foreground">{action.sub}</p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center ${
                    selected === action.id ? "border-primary bg-primary" : "border-border"
                  }`}
                >
                  {selected === action.id && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-[12px] text-muted-foreground">
              {selected
                ? `Selected: ${actions.find((a) => a.id === selected)?.title}`
                : "No action selected"}
            </p>
            <Button
              disabled={!selected}
              onClick={() => selected && onAction(selected as any)}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Guidance panel */}
        <div className="w-64 border-l border-border bg-card p-5 shrink-0 hidden lg:flex flex-col gap-4">
          <Label>Decision Guidance</Label>
          <div className="space-y-3 text-[12px] text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground block mb-1">Promise to Pay</strong>
              Suitable for straightforward cases with clear customer intent and capacity. Obtain a
              specific date and amount — do not accept vague commitments.
            </p>
            <Rule />
            <p>
              <strong className="text-foreground block mb-1">Payment Plan</strong>
              Use when customer has genuine hardship. Affordability assessment required. Cannot waive
              interest without supervisor approval (level 2+).
            </p>
            <Rule />
            <p>
              <strong className="text-foreground block mb-1">Dispute</strong>
              Mandatory if customer questions debt validity. All collections activity must cease
              immediately per FCA CONC 7.14. Do not re-attempt contact until resolved.
            </p>
            <Rule />
            <p className="text-[11px]">
              <strong className="text-foreground block mb-1">Smart-Recovery routing</strong>
              PTP and plan cases under £5,000 with no prior escalation history are candidates for
              self-serve. Route to agent only when human judgement is genuinely required.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function PromiseToPayScreen({
  onComplete,
  onBack,
}: {
  onComplete: (type: "ptp") => void;
  onBack: () => void;
}) {
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank-transfer");
  const [confirmed, setConfirmed] = useState(false);

  const canSubmit = date && amount && confirmed;

  return (
    <Shell step={4} onBack={onBack}>
      <div className="flex-1 flex">
        <div className="flex-1 p-6 max-w-xl mx-auto w-full">
          <Label>Step 04 · Promise to Pay</Label>
          <h2 className="text-xl font-semibold mt-1 mb-1">Record Promise to Pay</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Record the customer's commitment to make a specific payment. Both parties acknowledge this is a
            voluntary arrangement.
          </p>

          <div className="border border-border bg-card p-6 space-y-5">
            <div className="bg-secondary border border-border p-3">
              <div className="flex justify-between mb-1">
                <span className="text-[12px] text-muted-foreground">Outstanding balance</span>
                <span className="font-mono text-[13px] text-destructive font-semibold">£4,280.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-muted-foreground">Minimum to clear arrears</span>
                <span className="font-mono text-[13px]">£428.01</span>
              </div>
            </div>

            <Input
              label="Payment amount (£)"
              placeholder="e.g. 428.01"
              type="number"
              value={amount}
              onChange={setAmount}
              hint="Enter the agreed amount. Partial payment acceptable."
            />

            <Input
              label="Promise date"
              type="date"
              value={date}
              onChange={setDate}
              hint="Must be within 30 days from today"
            />

            <div className="flex flex-col gap-1.5">
              <Label>Payment method</Label>
              <div className="space-y-2">
                {[
                  { id: "bank-transfer", label: "Bank transfer (faster payments)" },
                  { id: "card", label: "Debit card (online portal)" },
                  { id: "branch", label: "Branch / counter payment" },
                ].map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 border border-border p-2.5 cursor-pointer hover:bg-secondary"
                  >
                    <input
                      type="radio"
                      name="method"
                      value={m.id}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                      className="accent-primary"
                    />
                    <span className="text-[13px]">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Rule />

            <div className="flex flex-col gap-2">
              <Label>Verbal agreement script</Label>
              <div className="bg-background border border-dashed border-border p-3">
                <p className="text-[12px] text-muted-foreground italic leading-relaxed">
                  "I confirm that you, Marcus Okonkwo, agree to pay{" "}
                  <strong>{amount ? `£${amount}` : "[amount]"}</strong> toward your Legacy-Trust Bank loan account
                  ending 8812, on or before <strong>{date || "[date]"}</strong>, via{" "}
                  <strong>
                    {method === "bank-transfer"
                      ? "bank transfer"
                      : method === "card"
                      ? "debit card"
                      : "branch payment"}
                  </strong>
                  . Do you confirm?"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="ptp-confirm"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <label htmlFor="ptp-confirm" className="text-[12px] text-muted-foreground cursor-pointer leading-relaxed">
                Customer has verbally confirmed the promise. I have read the agreement script in full.
              </label>
            </div>

            <Button
              onClick={() => onComplete("ptp")}
              disabled={!canSubmit}
              className="w-full justify-center"
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Record Promise to Pay
            </Button>
          </div>
        </div>

        {/* Side notes */}
        <div className="w-56 border-l border-border bg-card p-4 shrink-0 hidden lg:flex flex-col gap-4">
          <Label>PTP Rules</Label>
          <div className="space-y-3 text-[11px] text-muted-foreground leading-relaxed">
            <p>Max 2 PTP arrangements per 90-day period.</p>
            <p>If payment not received by promise date +2 days, auto-escalate to supervisor queue — do not re-attempt contact manually.</p>
            <p>A confirmation SMS is sent to the customer's registered mobile automatically — no separate email or spreadsheet update required.</p>
            <p>Agent must log outcome within 24 hrs of promise date. Cases left at "pending" after 48 hrs will flag in the manager dashboard.</p>
          </div>
          <Rule />
          <Label>Auto-actions on save</Label>
          <div className="space-y-1.5">
            {["SMS confirmation sent", "Calendar reminder set", "CRM record updated", "Supervisor notified"].map(
              (a) => (
                <div key={a} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="text-emerald-600">✓</span>
                  {a}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function PaymentPlanScreen({
  onComplete,
  onBack,
}: {
  onComplete: (type: "plan") => void;
  onBack: () => void;
}) {
  const [months, setMonths] = useState("12");
  const [startDate, setStartDate] = useState("");
  const [freezeInterest, setFreezeInterest] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const balance = 4280;
  const monthly = months ? (balance / parseInt(months)).toFixed(2) : "—";
  const canSubmit = months && startDate && confirmed;

  return (
    <Shell step={4} onBack={onBack}>
      <div className="flex-1 flex">
        <div className="flex-1 p-6 max-w-xl mx-auto w-full">
          <Label>Step 04 · Payment Plan</Label>
          <h2 className="text-xl font-semibold mt-1 mb-1">Configure Payment Plan</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Arrange a structured repayment schedule. An affordability assessment must be completed before
            finalising.
          </p>

          <div className="border border-border bg-card p-6 space-y-5">
            <div className="bg-secondary border border-border p-3 grid grid-cols-2 gap-3">
              <div>
                <Label>Total balance</Label>
                <p className="font-mono text-lg text-destructive font-semibold mt-1">£4,280.00</p>
              </div>
              <div>
                <Label>Monthly payment</Label>
                <p className="font-mono text-lg font-semibold mt-1">£{monthly}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Repayment term (months)</Label>
              <div className="flex gap-2 flex-wrap">
                {["3", "6", "9", "12", "18", "24"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={`border px-3 py-2 font-mono text-[12px] transition-colors ${
                      months === m
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground hover:border-primary"
                    }`}
                  >
                    {m}mo
                    <br />
                    <span className="text-[10px] opacity-70">
                      £{(balance / parseInt(m)).toFixed(0)}/mo
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="First payment date"
              type="date"
              value={startDate}
              onChange={setStartDate}
              hint="Must be within 14 days"
            />

            <div className="border border-border p-3 flex items-start gap-3">
              <input
                type="checkbox"
                id="freeze"
                checked={freezeInterest}
                onChange={(e) => setFreezeInterest(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <label htmlFor="freeze" className="text-[12px] leading-relaxed cursor-pointer">
                <strong className="block text-foreground">Freeze interest during plan</strong>
                <span className="text-muted-foreground">
                  Requires supervisor approval (level 2). Check if eligible under hardship policy.
                </span>
              </label>
            </div>

            {freezeInterest && (
              <div className="bg-amber-50 border border-amber-200 p-3 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-amber-800">
                  Interest freeze requires supervisor sign-off. A request will be sent to your team lead
                  automatically.
                </p>
              </div>
            )}

            <Rule />

            {/* Plan summary table */}
            {months && startDate && (
              <div>
                <Label className="mb-2 block">Plan Summary</Label>
                <div className="border border-border">
                  {[
                    { label: "Monthly payment", value: `£${monthly}` },
                    { label: "Number of payments", value: months },
                    { label: "First payment", value: startDate },
                    { label: "Final payment", value: "Calculated on save" },
                    { label: "Interest status", value: freezeInterest ? "Frozen (pending approval)" : "Accruing" },
                    { label: "Total to repay", value: freezeInterest ? `£${balance.toFixed(2)}` : "£4,280.00 + interest" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between px-3 py-2 border-b border-border last:border-0 odd:bg-secondary/40"
                    >
                      <span className="text-[12px] text-muted-foreground">{row.label}</span>
                      <span className="font-mono text-[12px]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="plan-confirm"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 accent-primary"
              />
              <label htmlFor="plan-confirm" className="text-[12px] text-muted-foreground cursor-pointer leading-relaxed">
                Affordability assessment completed. Customer verbally agreed to the payment plan terms.
              </label>
            </div>

            <Button
              onClick={() => onComplete("plan")}
              disabled={!canSubmit}
              className="w-full justify-center"
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Confirm Payment Plan
            </Button>
          </div>
        </div>

        <div className="w-56 border-l border-border bg-card p-4 shrink-0 hidden lg:flex flex-col gap-4">
          <Label>Affordability Check</Label>
          <div className="space-y-3">
            {[
              { label: "Monthly income (stated)", value: "£1,450" },
              { label: "Essential outgoings", value: "£820" },
              { label: "Disposable income", value: "£630" },
              { label: "Max safe payment", value: "£315/mo" },
            ].map((r) => (
              <div key={r.label} className="border-b border-border pb-2">
                <p className="text-[11px] text-muted-foreground">{r.label}</p>
                <p className="font-mono text-[12px] font-medium">{r.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-2">
            <p className="text-[11px] text-emerald-800">
              Selected plan of <strong>£{monthly}/mo</strong> is within affordability.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ConfirmationScreen({
  type,
  onNewSession,
  onBack,
}: {
  type: "ptp" | "plan" | null;
  onNewSession: () => void;
  onBack: () => void;
}) {
  return (
    <Shell step={5} onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-lg w-full">
          {/* Success header */}
          <div className="border border-emerald-300 bg-emerald-50 p-6 text-center mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <Label className="text-emerald-700">Step 05 · Confirmed</Label>
            <h2 className="text-xl font-semibold mt-2 mb-1">
              {type === "ptp" ? "Promise to Pay Recorded" : "Payment Plan Confirmed"}
            </h2>
            <p className="text-[13px] text-emerald-700">
              Reference <span className="font-mono">PTP-2024-7742-A</span> has been issued.
            </p>
          </div>

          {/* Summary */}
          <div className="border border-border bg-card p-5 mb-4">
            <Label className="mb-3 block">Arrangement Summary</Label>
            <div className="space-y-2">
              {(type === "ptp"
                ? [
                    { label: "Type", value: "Promise to Pay" },
                    { label: "Customer", value: "Marcus A. Okonkwo" },
                    { label: "Account", value: "00274-8812" },
                    { label: "Amount promised", value: "£428.01" },
                    { label: "Promise date", value: "25 Jun 2024" },
                    { label: "Payment method", value: "Bank transfer" },
                    { label: "Reference", value: "PTP-2024-7742-A" },
                    { label: "Recorded by", value: "D. Reyes #4421" },
                    { label: "Session time", value: "12:04:37" },
                  ]
                : [
                    { label: "Type", value: "Payment Plan" },
                    { label: "Customer", value: "Marcus A. Okonkwo" },
                    { label: "Account", value: "00274-8812" },
                    { label: "Monthly amount", value: "£356.67" },
                    { label: "Term", value: "12 months" },
                    { label: "First payment", value: "01 Jul 2024" },
                    { label: "Reference", value: "PLAN-2024-7742-B" },
                    { label: "Recorded by", value: "D. Reyes #4421" },
                  ]
              ).map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between border-b border-border pb-1.5 last:border-0 last:pb-0"
                >
                  <span className="text-[12px] text-muted-foreground">{row.label}</span>
                  <span className="font-mono text-[12px]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="border border-border bg-card p-5 mb-6">
            <Label className="mb-3 block">Next Steps</Label>
            <div className="space-y-2">
              {[
                { icon: "✓", text: "Confirmation SMS sent to customer (••• 4821)", done: true },
                { icon: "✓", text: "CRM record updated with arrangement details", done: true },
                { icon: "✓", text: "Supervisor notification sent", done: true },
                {
                  icon: "○",
                  text: type === "ptp"
                    ? "Monitor payment receipt by 25 Jun 2024 (+2 day grace)"
                    : "First direct debit mandate created — confirm by 28 Jun",
                  done: false,
                },
                { icon: "○", text: "Log call outcome in telephony system", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className={`font-mono text-[12px] mt-0.5 ${step.done ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {step.icon}
                  </span>
                  <p className={`text-[13px] ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 justify-center" icon={<FileText className="w-4 h-4" />}>
              Print / Export Summary
            </Button>
            <Button onClick={onNewSession} className="flex-1 justify-center" icon={<ChevronRight className="w-4 h-4" />}>
              New Session
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function RouteAgentScreen({ onBack, onNewSession }: { onBack: () => void; onNewSession: () => void }) {
  const [reason, setReason] = useState("");
  const [transferred, setTransferred] = useState(false);

  return (
    <Shell step={3} onBack={onBack}>
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-lg w-full">
          {!transferred ? (
            <>
              <div className="border border-amber-200 bg-amber-50 p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Headphones className="w-6 h-6 text-amber-600" />
                  <div>
                    <Label className="text-amber-700">Smart-Recovery · Unsupported Case</Label>
                    <h2 className="text-lg font-semibold mt-0.5">Route to Senior Agent</h2>
                  </div>
                </div>
                <p className="text-[13px] text-amber-800 leading-relaxed">
                  This case falls outside Smart-Recovery's automated scope. Complete the form below before transferring — do not leave the customer on hold without logging the reason.
                </p>
              </div>

              <div className="border border-border bg-card p-5 space-y-4 mb-4">
                <Label className="block">Escalation Reason</Label>
                <div className="space-y-2">
                  {[
                    { id: "hardship", label: "Customer reports financial hardship / vulnerability" },
                    { id: "dispute", label: "Customer disputes debt validity" },
                    { id: "third-party", label: "Third party (solicitor / debt advisor) involved" },
                    { id: "distress", label: "Customer showing signs of distress" },
                    { id: "deceased", label: "Account holder deceased — estate matter" },
                    { id: "complaint", label: "Formal complaint raised" },
                    { id: "other", label: "Other (describe below)" },
                  ].map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-3 border border-border p-2.5 cursor-pointer hover:bg-secondary"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.id}
                        onChange={() => setReason(r.id)}
                        className="accent-primary"
                      />
                      <span className="text-[13px]">{r.label}</span>
                    </label>
                  ))}
                </div>

                {reason === "other" && (
                  <div className="flex flex-col gap-1.5">
                    <Label>Description</Label>
                    <textarea
                      rows={3}
                      className="w-full bg-input-background border border-border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                      placeholder="Describe the reason for escalation..."
                    />
                  </div>
                )}

                <Rule />

                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-border p-3 bg-background">
                    <Label className="mb-1 block">Available Senior Agents</Label>
                    <div className="space-y-1.5 mt-2">
                      {[
                        { name: "K. Adeyemi", id: "#5501", status: "available" },
                        { name: "P. Brennan", id: "#5498", status: "available" },
                        { name: "S. Kowalski", id: "#5502", status: "busy" },
                      ].map((a) => (
                        <div key={a.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${a.status === "available" ? "bg-emerald-500" : "bg-amber-400"}`}
                            />
                            <span className="text-[12px]">
                              {a.name} <span className="text-muted-foreground">{a.id}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border border-border p-3 bg-background">
                    <Label className="mb-1 block">Estimated Wait</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono text-lg font-semibold">~3 min</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">K. Adeyemi available now</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setTransferred(true)}
                disabled={!reason}
                className="w-full justify-center"
                icon={<Headphones className="w-4 h-4" />}
              >
                Transfer to Senior Agent — K. Adeyemi
              </Button>
            </>
          ) : (
            <>
              <div className="border border-border bg-card p-6 text-center mb-6">
                <Headphones className="w-10 h-10 text-primary mx-auto mb-3" />
                <Label>Transfer Complete</Label>
                <h2 className="text-xl font-semibold mt-2 mb-1">Customer Transferred</h2>
                <p className="text-[13px] text-muted-foreground">
                  Marcus Okonkwo has been transferred to{" "}
                  <strong>K. Adeyemi (#5501)</strong> at 12:07:22.
                </p>
              </div>

              <div className="border border-border bg-card p-5 mb-4">
                <Label className="mb-3 block">Your Next Steps</Label>
                <div className="space-y-2">
                  {[
                    "Complete your call notes in the telephony system",
                    "Mark account status as 'Escalated — Senior Agent'",
                    "No further outbound contact until resolution from K. Adeyemi",
                    "Check escalation outcome log within 48 hours",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[13px]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                onClick={onNewSession}
                className="w-full justify-center"
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Return to Dashboard
              </Button>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [state, setState] = useState<CRMState>({
    screen: "landing",
    verificationMethod: null,
    selectedAction: null,
    ptpDate: "",
    ptpAmount: "",
    planMonths: "12",
    planStartDate: "",
    confirmationType: null,
  });

  const go = (screen: Screen, extra?: Partial<CRMState>) =>
    setState((s) => ({ ...s, screen, ...extra }));

  const reset = () =>
    setState({
      screen: "landing",
      verificationMethod: null,
      selectedAction: null,
      ptpDate: "",
      ptpAmount: "",
      planMonths: "12",
      planStartDate: "",
      confirmationType: null,
    });

  const { screen } = state;

  if (screen === "landing") return <LandingScreen onStart={() => go("identity")} />;
  if (screen === "identity")
    return <IdentityScreen onVerified={() => go("account-summary")} onBack={() => go("landing")} />;
  if (screen === "account-summary")
    return <AccountSummaryScreen onContinue={() => go("choose-action")} onBack={() => go("identity")} />;
  if (screen === "choose-action")
    return (
      <ChooseActionScreen
        onAction={(action) => {
          if (action === "ptp") go("promise-to-pay", { selectedAction: "ptp" });
          else if (action === "plan") go("payment-plan", { selectedAction: "plan" });
          else go("route-agent", { selectedAction: action as any });
        }}
        onBack={() => go("account-summary")}
      />
    );
  if (screen === "promise-to-pay")
    return (
      <PromiseToPayScreen
        onComplete={(type) => go("confirmation", { confirmationType: type })}
        onBack={() => go("choose-action")}
      />
    );
  if (screen === "payment-plan")
    return (
      <PaymentPlanScreen
        onComplete={(type) => go("confirmation", { confirmationType: type })}
        onBack={() => go("choose-action")}
      />
    );
  if (screen === "confirmation")
    return (
      <ConfirmationScreen
        type={state.confirmationType}
        onNewSession={reset}
        onBack={() => go(state.confirmationType === "ptp" ? "promise-to-pay" : "payment-plan")}
      />
    );
  if (screen === "route-agent")
    return <RouteAgentScreen onBack={() => go("choose-action")} onNewSession={reset} />;

  return null;
}
