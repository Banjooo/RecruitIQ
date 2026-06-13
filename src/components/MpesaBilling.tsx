import React, { useState } from "react";
import { CreditCard, Phone, Check, Receipt, Building, ExternalLink, Calendar, CircleHelp, AlertCircle, RefreshCw, Landmark, ShieldCheck } from "lucide-react";
import { TenantConfig, InVoice } from "../types";

interface MpesaBillingProps {
  tenant: TenantConfig;
  invoices: InVoice[];
  onRefreshBilling: () => void;
  onInitiateStkPush: (phone: string, amount: number) => Promise<any>;
  onGenerateInvoice: (amount: number, description: string) => Promise<any>;
  onMarkInvoicePaid: (id: string) => Promise<any>;
  onInitiateBankPayment: (bankDetails: {
    amount: number;
    bankName: string;
    paymentMethod: "card" | "transfer";
    accountOrCardNumber: string;
    accountName: string;
  }) => Promise<any>;
}

export default function MpesaBilling({
  tenant,
  invoices,
  onRefreshBilling,
  onInitiateStkPush,
  onGenerateInvoice,
  onMarkInvoicePaid,
  onInitiateBankPayment
}: MpesaBillingProps) {
  const [phoneNumber, setPhoneNumber] = useState("0712345678");
  const [stkAmount, setStkAmount] = useState(4500);
  const [invoiceDescription, setInvoiceDescription] = useState("SaaS active recruiting month subscription credit - East Africa server context");
  const [invoiceAmount, setInvoiceAmount] = useState(4500);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Active Billing sub tab inside the page
  const [billingTab, setBillingTab] = useState<"mpesa_stk" | "mpesa_paybill" | "bank_gateway" | "mpesa_buygoods">("mpesa_buygoods");

  // M-Pesa Buy Goods & Services Till State
  const [tillReceipt, setTillReceipt] = useState("");
  const [tillAmount, setTillAmount] = useState(4500);
  const [tillPhone, setTillPhone] = useState("");
  const [tillSuccess, setTillSuccess] = useState(false);
  const [tillError, setTillError] = useState("");

  // Kenyan Bank State Parameters
  const [bankName, setBankName] = useState("Kenya Commercial Bank");
  const [bankPaymentMethod, setBankPaymentMethod] = useState<"card" | "transfer">("transfer");
  const [bankAccountNumber, setBankAccountNumber] = useState("1347795588");
  const [bankAccountName, setBankAccountName] = useState("MORGGY TECHNOLOGIES");
  const [bankExpiry, setBankExpiry] = useState("");
  const [bankCvv, setBankCvv] = useState("");
  const [bankAmount, setBankAmount] = useState(4500);
  const [bankSuccess, setBankSuccess] = useState(false);
  const [bankError, setBankError] = useState("");

  const handleStkPush = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSuccess(false);
    try {
      await onInitiateStkPush(phoneNumber, stkAmount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setBankError("");
    setBankSuccess(false);

    if (!bankAccountNumber) {
      setBankError("Please input your card digits or bank account number of your selected organization.");
      setIsLoading(false);
      return;
    }

    try {
      await onInitiateBankPayment({
        amount: bankAmount,
        bankName,
        paymentMethod: bankPaymentMethod,
        accountOrCardNumber: bankAccountNumber,
        accountName: bankAccountName || `${tenant.name} corporate checking`
      });

      setBankSuccess(true);
      setTimeout(() => {
        setBankSuccess(false);
      }, 5000);
    } catch (err: any) {
      setBankError(err.message || "Failed secure clearance of bank transfer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onGenerateInvoice(invoiceAmount, invoiceDescription);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPlanLabel = (plan: string) => {
    switch (plan) {
      case "pay_as_you_go":
        return "Pay-As-You-Go Month (KES 4,500/mo)";
      case "standard":
        return "Quarterly Pack (3 Active Months - KES 12,000)";
      case "premium":
        return "Half-Year Pack (6 Active Months - KES 22,000)";
      default:
        return plan;
    }
  };

  return (
    <div className="space-y-6" id="billing-module">
      {/* 🌟 Dedicated Pricing Plans and Benefits Grid */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-950 space-y-6">
        <div className="text-center md:text-left max-w-xl space-y-1">
          <span className="text-[10px] font-mono font-bold bg-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-full uppercase tracking-wider border border-teal-500/20">
            Morggy Technologies Subscription Suite
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight font-sans">Corporate Subscription Plans & Benefits</h2>
          <p className="text-xs text-indigo-200">Scale your recruitment capabilities safely and compliant with KDPA regulations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan 1 */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 flex flex-col justify-between space-y-4 hover:border-indigo-500/30 transition-all">
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-slate-300 bg-slate-700/50 px-2 py-0.5 rounded uppercase">Basic Seasonal</span>
              <h3 className="text-base font-bold text-white">Pay-As-You-Go Monthly</h3>
              <p className="text-xl font-black text-white">KES 4,500 <span className="text-xs font-normal text-slate-300">/mo</span></p>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">Perfect for startups managing occasional individual vacancy requirements.</p>
              
              <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-750/60">
                <li className="flex items-center gap-1.5 text-orange-350 font-semibold font-mono">
                  ⚠️ Limit: 25 Reviews / Job
                </li>
                <li>✓ Standard cv storage</li>
                <li>✓ Anti-CV fraud blitz check</li>
                <li>✓ Local phone KDPA consent gate</li>
              </ul>
            </div>
            <button 
              onClick={() => { setTillAmount(4500); setBillingTab("mpesa_buygoods"); }}
              className="w-full text-center py-2 bg-slate-700 hover:bg-slate-650 text-white font-bold rounded-lg text-xs transition cursor-pointer"
            >
              Select Pay-As-You-Go
            </button>
          </div>

          {/* Plan 2 */}
          <div className="bg-gradient-to-b from-indigo-950/40 to-indigo-900/40 rounded-xl p-5 border border-indigo-500/30 flex flex-col justify-between space-y-4 relative overflow-hidden ring-1 ring-indigo-500/25">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white font-bold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-bl">
              Most Popular
            </div>
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-950/50 px-2 py-0.5 rounded uppercase">Corporate Standard</span>
              <h3 className="text-base font-bold text-white">Standard Quarterly Pack</h3>
              <p className="text-xl font-black text-white">KES 12,000 <span className="text-xs font-normal text-slate-300">/3 mos</span></p>
              <p className="text-[11px] text-indigo-200 leading-relaxed">Best for medium enterprises with active multi-department vacancy requirements.</p>
              
              <ul className="text-[11px] text-indigo-200 space-y-1.5 pt-2 border-t border-indigo-905/50 font-sans">
                <li className="flex items-center gap-1.5 text-indigo-100 font-semibold font-mono">
                  ✔️ Limit: 70 Reviews / Job
                </li>
                <li>✓ Higher review capacity limit</li>
                <li>✓ Standard developer vetting</li>
                <li>✓ Corporate team admins console</li>
                <li>✓ Prioritised KDPA records logs</li>
              </ul>
            </div>
            <button 
              onClick={() => { setTillAmount(12000); setBillingTab("mpesa_buygoods"); }}
              className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition shadow cursor-pointer"
            >
              Select Corporate Standard
            </button>
          </div>

          {/* Plan 3 */}
          <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-5 border border-slate-700/50 flex flex-col justify-between space-y-4 hover:border-indigo-500/30 transition-all">
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/30 px-2 py-0.5 rounded uppercase border border-amber-500/20">Enterprise Premium</span>
              <h3 className="text-base font-bold text-white">Premium Half-Year</h3>
              <p className="text-xl font-black text-white">KES 22,000 <span className="text-xs font-normal text-slate-300">/6 mos</span></p>
              <p className="text-[11px] text-slate-300 leading-relaxed">Unlimited processing for recruitment agencies and high-yield corporations.</p>
              
              <ul className="text-[11px] text-slate-400 space-y-1.5 pt-2 border-t border-slate-750/60 font-sans">
                <li className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
                  💎 Unlimited Reviews & Processes
                </li>
                <li>✓ Endless candidate submissions</li>
                <li>✓ Premium compatibility checks</li>
                <li>✓ Multi-role objective generator</li>
                <li>✓ Dual-Signatory Kenya Paybills</li>
              </ul>
            </div>
            <button 
              onClick={() => { setTillAmount(22000); setBillingTab("mpesa_buygoods"); }}
              className="w-full text-center py-2 bg-slate-700 hover:bg-slate-650 text-white font-bold rounded-lg text-xs transition cursor-pointer"
            >
              Select Premium Tier
            </button>
          </div>
        </div>
      </div>

      {/* Overview Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tier status card */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400">Current Subscription</span>
            <h3 className="text-lg font-bold text-slate-800">{currentPlanLabel(tenant.billingPlan)}</h3>
            <p className="text-xs text-slate-500 leading-relaxed mt-1">
              Provides robust server-side processing for high-volume jobs using Safaricom API pipelines.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">Status:</span>
            {tenant.hasActiveSubscription ? (
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded border border-emerald-200">
                ✔️ Subscribed (Active)
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2 py-1 rounded border border-amber-200">
                🔒 Inactive Credits
              </span>
            )}
          </div>
        </div>

        {/* Caching savings calculation card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <span className="bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              RecruitIQ Economizer Engine
            </span>
          </div>

          <h3 className="font-semibold text-slate-800 text-base mb-3">
            SaaS Pay-As-You-Go Model (No Recruiter Lock-In)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 max-w-xl">
            Kenyan companies hire seasonally. Why pay high prices year-round when you only hire occasionally? RecruitIQ is a pure Pay-As-You-Go SaaS. You purchase <strong>Active Recruitment Months</strong> as needed (KES 4,500/mo). When you do not have open postings, your account downgrades to a free read-only vault where data remains secured & fully compliant with Section 35 of the Kenya Data Protection Act.
          </p>

          <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-3 text-center border border-slate-200 font-mono text-xs">
            <div>
              <p className="text-slate-400 text-[9px] uppercase">Job Boards</p>
              <p className="font-bold text-slate-700 mt-0.5">KES 18,000+</p>
              <span className="text-[10px] text-slate-400">1 standard post only</span>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-emerald-600 font-bold text-[9px] uppercase">RecruitIQ SaaS</p>
              <p className="font-extrabold text-emerald-600 mt-0.5">KES 4,500/mo</p>
              <span className="text-[10px] text-emerald-600">Pure Pay-As-You-Go</span>
            </div>
            <div>
              <p className="text-slate-400 text-[9px] uppercase font-bold">Standard Agency</p>
              <p className="font-bold text-slate-700 mt-0.5">KES 35,000</p>
              <span className="text-[10px] text-slate-400">Per position retained</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Payment Settlement Center */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" id="settlement-gateway-panel">
        <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <CreditCard size={16} className="text-indigo-600" /> Choose Your Preferred Billing Channel
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Select from mobile funds or direct institutional clearing pipelines inside Kenya.</p>
          </div>
          
          <div className="flex bg-slate-200/60 p-1 rounded-xl border border-slate-200 w-max font-sans flex-wrap gap-1">
            <button
              onClick={() => setBillingTab("mpesa_buygoods")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                billingTab === "mpesa_buygoods"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏷️ Buy Goods (4567952)
            </button>
            <button
              onClick={() => setBillingTab("mpesa_stk")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                billingTab === "mpesa_stk"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📱 M-Pesa STK
            </button>
            <button
              onClick={() => setBillingTab("mpesa_paybill")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                billingTab === "mpesa_paybill"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏢 Corporate Paybill
            </button>
            <button
              onClick={() => setBillingTab("bank_gateway")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                billingTab === "bank_gateway"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏦 Bank & Cards
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* TAB 4: MPESA BUY GOODS TILL */}
          {billingTab === "mpesa_buygoods" && (
            <div className="space-y-5 max-w-xl animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 w-2.5 h-2.5 rounded-full ring-4 ring-emerald-500/20"></span>
                <h4 className="font-semibold text-slate-900 text-sm">Direct Lipa Na M-Pesa (Buy Goods & Services)</h4>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-4 space-y-3">
                <p className="text-xs text-slate-705 leading-relaxed font-sans">
                  The fastest and most reliable payment method inside East Africa. Send funds directly to our verified till terminal and submit your reference code for immediate account activation:
                </p>

                <div className="bg-white rounded-lg p-3.5 border border-emerald-150 space-y-2.5 font-mono text-xs shadow-3xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5/10">
                    <span className="text-slate-500 text-[10px]">MERCHANT PROVIDER:</span>
                    <strong className="text-slate-800">Morggy Technologies</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-1.5/10">
                    <span className="text-slate-500 text-[10px]">ROUTE:</span>
                    <strong className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded text-[11px] font-bold">BUY GOODS AND SERVICES</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[10px]">TILL NUMBER:</span>
                    <strong className="text-emerald-800 text-lg font-black tracking-widest bg-emerald-50 border border-emerald-250/60 px-3 py-0.5 rounded select-all">4567952</strong>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-emerald-600 uppercase tracking-wider font-extrabold">Instructions (How to Pay):</span>
                  <ol className="text-[11px] text-slate-600 list-decimal pl-4 space-y-1 font-sans">
                    <li>Go to your safaricom SIM toolkit or open your **M-Pesa App**</li>
                    <li>Choose <strong>Lipa na M-Pesa</strong> menu, then select <strong>Buy Goods and Services</strong></li>
                    <li>Input Till Number: <strong className="font-bold text-emerald-950">4567952</strong></li>
                    <li>Enter amount for your selected plan (e.g. <strong>KES 4,500</strong>, <strong>KES 12,000</strong> or <strong>KES 22,000</strong>)</li>
                    <li>Enter pin, confirm recipient is <strong>Morggy Technologies</strong>, and authorize the settlement</li>
                  </ol>
                </div>
              </div>

              {tillError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-lg flex items-center gap-2 font-medium">
                  <span className="font-bold text-rose-600 block bg-rose-100 px-1.5 rounded">!</span>
                  {tillError}
                </div>
              )}

              {tillSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-4 rounded-lg flex items-start gap-2.5 font-sans">
                  <div className="p-1.5 bg-emerald-500/20 text-emerald-600 rounded">✓</div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-emerald-950 text-xs">M-Pesa Settlement Confirmed!</p>
                    <p className="text-[11px] text-emerald-700 leading-normal">
                      Your receipt reference has been reconciled. Unlimited corporate vacancy postings, technical verification blitzes, and full scale KDPA registries have been updated instantly. Status: <strong>ACTIVE</strong>.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsLoading(true);
                setTillError("");
                setTillSuccess(false);
                if (!tillReceipt.trim() || tillReceipt.trim().length < 8) {
                  setTillError("Please provide a valid M-Pesa transaction receipt ID (e.g QHG8X97B30).");
                  setIsLoading(false);
                  return;
                }
                try {
                  await onRefreshBilling();
                  setTillSuccess(true);
                } catch(err: any) {
                  setTillError(err.message || "Failed to complete transaction lookup.");
                } finally {
                  setIsLoading(false);
                }
              }} className="space-y-3.5 border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 block">M-Pesa Voucher Code (Receipt ID)</label>
                    <input
                      type="text"
                      value={tillReceipt}
                      onChange={(e) => setTillReceipt(e.target.value.toUpperCase())}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white font-mono"
                      placeholder="e.g. RJG8X97B30"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-600 block">Settled Amount (KES)</label>
                    <input
                      type="number"
                      value={tillAmount}
                      onChange={(e) => setTillAmount(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  Verify and Approve Payment
                </button>
              </form>
            </div>
          )}

          {/* TAB 1: MPESA STK */}
          {billingTab === "mpesa_stk" && (
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 w-2.5 h-2.5 rounded-full ring-4 ring-emerald-500/20"></span>
                <h4 className="font-semibold text-slate-900 text-sm">Instant Safaricom M-Pesa STK Push</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Specify your registered Safaricom line. This will dispatch a secure prompt instantly to your mobile device, requesting validation PIN input to unlock recruiting.
              </p>

              <form onSubmit={handleStkPush} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Phone size={13} /> Mobile Number
                    </label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                      placeholder="e.g. 0712345678"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Select Subscription Package</label>
                    <select
                      value={stkAmount}
                      onChange={(e) => setStkAmount(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-850"
                    >
                      <option value="4500">1 Active Recruiting Month (KES 4,500)</option>
                      <option value="12000">3 Active Recruiting Months (KES 12,000 - Save 11%)</option>
                      <option value="22000">6 Active Recruiting Months (KES 22,000 - Save 18%)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading && <RefreshCw size={12} className="animate-spin" />}
                  Send Mobile STK Pin Prompt
                </button>

                {isSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-lg flex items-start gap-2 max-w-xl">
                    <Check className="h-4 w-4 mt-0.5 text-emerald-600" />
                    <div>
                      <p className="font-semibold">STK Push simulated successfully!</p>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Premium features unlocked immediately. In-memory tenant status set to ACTIVE subscription.
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: MPESA PAYBILL */}
          {billingTab === "mpesa_paybill" && (
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="bg-blue-500 w-2.5 h-2.5 rounded-full ring-4 ring-blue-500/20"></span>
                <h4 className="font-semibold text-slate-900 text-sm">Corporate M-Pesa Bill Manager (Invoiced Flow)</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generates a formal invoice voucher referencing your company unique billing reference. Preferred for corporate accounting offices using bank transfers, checklists, or dual-signatory paybills.
              </p>

              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-slate-600">Bill Description</label>
                    <input
                      type="text"
                      value={invoiceDescription}
                      onChange={(e) => setInvoiceDescription(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 font-mono">Business Paybill Number</label>
                    <input
                      type="text"
                      value={tenant.mpesaShortCode}
                      disabled
                      className="w-full text-xs border border-slate-100 bg-slate-100 text-slate-500 rounded-lg px-3 py-2.5"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Bill Invoice Amount (KES)</label>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 text-xs font-bold bg-slate-900 hover:bg-slate-850 text-white rounded-lg py-2.5 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  Generate Corporate Invoice Voucher
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: KENYAN BANK SYSTEM PAYMENTS */}
          {billingTab === "bank_gateway" && (
            <div className="space-y-4 max-w-2xl animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500 w-2.5 h-2.5 rounded-full ring-4 ring-indigo-500/20"></span>
                <Landmark className="text-indigo-600" size={18} />
                <h4 className="font-semibold text-slate-900 text-sm">Kenyan Bank Transfer & Debit Card Settlement Portal</h4>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed">
                Approve your subscription using funds in registered accounts across verified clearing houses operating inside Kenya, or clear instantly with locally-issued corporate Visa and Mastercard cards.
              </p>

              {bankError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-lg font-medium flex items-center gap-2 max-w-xl">
                  <span className="p-1 bg-rose-500/15 text-rose-500 rounded font-bold font-mono">!</span>
                  {bankError}
                </div>
              )}

              {bankSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-4 rounded-lg flex items-start gap-2.5 max-w-xl">
                  <div className="p-1 bg-emerald-500/20 text-emerald-600 rounded">✓</div>
                  <div>
                    <p className="font-bold">Remittance Approved!</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Your business subscription has been updated. Standard/Premium active status is unlocked and fully updated now.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleBankPaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select bank entity */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-650 block">Select Kenyan Clearing Bank</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="Equity Bank Kenya">Equity Bank (Equity Online / Equitel)</option>
                      <option value="Kenya Commercial Bank">KCB Bank Kenya (KCB App / Paybill)</option>
                      <option value="Co-operative Bank of Kenya">Co-operative Bank of Kenya (M-Co-op Cash)</option>
                      <option value="NCBA Bank Kenya">NCBA Bank Kenya (Loop / Banking Portal)</option>
                      <option value="Absa Bank Kenya">Absa Bank Kenya</option>
                      <option value="Stanbic Bank Kenya">Stanbic Bank Kenya</option>
                    </select>
                  </div>

                  {/* Payment route toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-650 block font-sans">Payment Route Method</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setBankPaymentMethod("card")}
                        className={`py-1.5 text-xs font-bold rounded-md transition ${
                          bankPaymentMethod === "card"
                            ? "bg-white text-indigo-700 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        💳 Debit/Credit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setBankPaymentMethod("transfer")}
                        className={`py-1.5 text-xs font-bold rounded-md transition ${
                          bankPaymentMethod === "transfer"
                            ? "bg-white text-indigo-700 shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        🏦 Direct Bank Remit
                      </button>
                    </div>
                  </div>

                  {/* dynamic input fields depending on route method */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-650 block">
                      {bankPaymentMethod === "card" ? "Debit/Credit Card digits" : "Company Bank Account Number"}
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white font-mono"
                      placeholder={bankPaymentMethod === "card" ? "4111 2222 3333 4444 (Kenyan issued)" : "0110 3224 5591 00 (Equity/KCB standard)"}
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      required
                    />
                  </div>

                  {/* expiry / CVV for card route */}
                  {bankPaymentMethod === "card" && (
                    <div className="grid grid-cols-2 gap-4 md:col-span-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 block">Expiry Date</label>
                        <input
                          type="text"
                          className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white font-mono"
                          placeholder="MM/YY"
                          value={bankExpiry}
                          onChange={(e) => setBankExpiry(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 block">Security Code (CVV)</label>
                        <input
                          type="password"
                          className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white font-mono"
                          placeholder="•••"
                          maxLength={3}
                          value={bankCvv}
                          onChange={(e) => setBankCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Account / card holder name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Cardholder or Account Name</label>
                    <input
                      type="text"
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                      placeholder="e.g. SAFARI TECH SOLUTIONS"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                    />
                  </div>

                  {/* subscription packages */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">Active Subscription Tier</label>
                    <select
                      value={bankAmount}
                      onChange={(e) => setBankAmount(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                    >
                      <option value="4500">1 Active Recruiting Month (KES 4,500)</option>
                      <option value="12000">3 Active Recruiting Months (KES 12,000 - Save 11%)</option>
                      <option value="22000">6 Active Recruiting Months (KES 22,000 - Save 18%)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isLoading ? "Processing bank clearing..." : "Authorize Bank Payment"}
                  </button>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                    <ShieldCheck className="text-emerald-500" size={14} /> Verified via Central Bank of Kenya compliance framework
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* list of invoices */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-1.5">
            <Receipt size={18} className="text-slate-500" /> Organization Settlement Invoices
          </h3>
          <button
            onClick={onRefreshBilling}
            className="text-xs font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RefreshCw size={12} /> Sync Transactions
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full text-xs border-collapse text-left">
            <thead className="bg-slate-50 text-slate-500 font-mono">
              <tr>
                <th className="py-2 px-3 border-b border-slate-100">Invoice ID</th>
                <th className="py-2 px-3 border-b border-slate-100">Account Reference</th>
                <th className="py-2 px-3 border-b border-slate-100">Description</th>
                <th className="py-2 px-3 border-b border-slate-100 text-right">Amount (KES)</th>
                <th className="py-2 px-3 border-b border-slate-100 text-center">Status</th>
                <th className="py-2 px-3 border-b border-slate-100 text-center">Simulate Callback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 font-mono font-semibold">{inv.id}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{inv.accountNo}</td>
                    <td className="py-2 px-3">{inv.description}</td>
                    <td className="py-2 px-3 text-right font-semibold text-slate-800">
                      {inv.amount.toLocaleString()} KES
                    </td>
                    <td className="py-2 px-3 text-center">
                      {inv.status === "PAID" ? (
                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold">
                          PAID
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold">
                          UNPAID
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {inv.status === "PENDING" ? (
                        <button
                          onClick={async () => {
                            await onMarkInvoicePaid(inv.id);
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-2 py-0.5 text-[9px] font-bold rounded font-mono transition"
                        >
                          💸 Simulate Paybill Clearing
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Settled ✔️</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No active invoice trails generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
