import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer, Invoice, Payment } from '../types';
import {
  Smartphone,
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  Building,
  Coins,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PipMascot } from './PipMascot';

interface CustomerPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  preselectedInvoice?: Invoice | null;
  onPaymentSuccess?: (payment: Payment) => void;
}

export const CustomerPaymentModal: React.FC<CustomerPaymentModalProps> = ({
  isOpen,
  onClose,
  customer,
  preselectedInvoice,
  onPaymentSuccess,
}) => {
  const { recordPayment, invoices, setSelectedReceipt } = useApp();

  // Find unpaid invoices for customer
  const customerUnpaidInvoices = invoices.filter(
    (inv) => inv.customerId === customer.id && inv.balance > 0
  );

  const initialAmount = preselectedInvoice
    ? preselectedInvoice.balance
    : customer.balance > 0
    ? customer.balance
    : 500;

  const [paymentMethod, setPaymentMethod] = useState<'mpesa_express' | 'mpesa_manual' | 'card'>(
    'mpesa_express'
  );
  const [phoneNumber, setPhoneNumber] = useState(customer.phone || '+254 7');
  const [amount, setAmount] = useState<number>(initialAmount);
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState<string>(
    preselectedInvoice ? preselectedInvoice.invoiceNumber : ''
  );
  const [manualReference, setManualReference] = useState('');

  // Interactive STK Simulation State
  const [stkStage, setStkStage] = useState<'idle' | 'prompt_sent' | 'completed'>('idle');
  const [simulatedReceipt, setSimulatedReceipt] = useState<Payment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleTriggerMpesaPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    if (paymentMethod === 'mpesa_express') {
      setIsProcessing(true);
      // Simulate sending STK Push to phone
      setTimeout(() => {
        setIsProcessing(false);
        setStkStage('prompt_sent');
      }, 700);
    } else {
      // Manual M-Pesa Paybill code entry or Card
      finalizePayment(manualReference || `QK${Math.floor(100000 + Math.random() * 900000)}X`);
    }
  };

  const finalizePayment = (refCode: string) => {
    const paymentDate =
      new Date().toISOString().split('T')[0] +
      ' ' +
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPayment = recordPayment({
      customerId: customer.id,
      amount,
      paymentMethod: 'M-Pesa',
      transactionReference: refCode,
      paymentDate,
      notes: `Customer portal self-service payment via Paybill 400200 (${phoneNumber})`,
      specificInvoiceNumber: selectedInvoiceNumber || undefined,
    });

    setSimulatedReceipt(newPayment);
    setStkStage('completed');
    if (onPaymentSuccess) {
      onPaymentSuccess(newPayment);
    }
  };

  const handleSimulatePinEntered = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedRef = `QK${Math.floor(100000 + Math.random() * 900000)}M`;
      finalizePayment(generatedRef);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#164E63]">
                Pay Water Bill
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">
                Account: {customer.accountNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {/* STAGE 1: FORM INPUT */}
          {stkStage === 'idle' && (
            <form onSubmit={handleTriggerMpesaPush} className="space-y-4 text-xs">
              {/* Account & Outstanding Balance Summary Box */}
              <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E7E2D6] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Outstanding Balance
                  </span>
                  <span className="text-2xl font-black font-mono text-rose-600 tabular-nums">
                    KSh {customer.balance.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Resident</span>
                  <span className="font-bold text-slate-900 text-xs block">
                    {customer.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{customer.zone}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Choose Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa_express')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'mpesa_express'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-xs">M-Pesa Express</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Instant STK Push prompt to your phone
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa_manual')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMethod === 'mpesa_manual'
                        ? 'border-[#399D9D] bg-[#E6F3F3] text-[#164E63] ring-2 ring-[#399D9D]/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-[#399D9D]" />
                      <span className="font-extrabold text-xs">Paybill 400200</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Enter M-Pesa SMS confirmation code
                    </span>
                  </button>
                </div>
              </div>

              {/* Amount to Pay */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Payment Amount (KSh) <span className="text-rose-500">*</span>
                  </label>
                  {customer.balance > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount(customer.balance)}
                      className="text-[11px] font-bold text-[#399D9D] hover:underline"
                    >
                      Pay Full Balance (KSh {customer.balance.toLocaleString()})
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount in KSh"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono text-base font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[46px]"
                />
              </div>

              {/* Specific Bill Allocation */}
              {customerUnpaidInvoices.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Apply to Bill (Optional)
                  </label>
                  <select
                    value={selectedInvoiceNumber}
                    onChange={(e) => setSelectedInvoiceNumber(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] text-xs font-medium"
                  >
                    <option value="">Apply automatically to earliest unpaid balance</option>
                    {customerUnpaidInvoices.map((inv) => (
                      <option key={inv.id} value={inv.invoiceNumber}>
                        {inv.invoiceNumber} ({inv.period}) · Due: KSh {inv.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* M-Pesa Phone Number */}
              {paymentMethod === 'mpesa_express' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    M-Pesa Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    You will receive an official Safaricom M-Pesa popup prompt on this phone.
                  </span>
                </div>
              )}

              {/* Manual Paybill Instructions & Code Entry */}
              {paymentMethod === 'mpesa_manual' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 leading-relaxed">
                    <strong>Lipa na M-Pesa Instructions:</strong><br />
                    1. Go to M-Pesa &gt; Lipa na M-Pesa &gt; <strong>Paybill</strong><br />
                    2. Business No: <strong className="font-mono">400200</strong><br />
                    3. Account No: <strong className="font-mono">{customer.accountNumber}</strong><br />
                    4. Amount: <strong className="font-mono">KSh {amount.toLocaleString()}</strong>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      M-Pesa Confirmation Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={manualReference}
                      onChange={(e) => setManualReference(e.target.value.toUpperCase())}
                      placeholder="e.g. QK8912KLOP"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || amount <= 0}
                  className="w-full py-3.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-60 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[46px]"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending M-Pesa Prompt...</span>
                    </>
                  ) : paymentMethod === 'mpesa_express' ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>Request M-Pesa Prompt (KSh {amount.toLocaleString()})</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Complete Payment</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted 256-bit automated settlement with Kikuyu Community Scheme</span>
              </div>
            </form>
          )}

          {/* STAGE 2: STK PUSH PROMPT SENT TO PHONE (SIMULATION) */}
          {stkStage === 'prompt_sent' && (
            <div className="text-center py-4 space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50 animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-extrabold text-[#164E63]">
                  M-Pesa STK Prompt Sent!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Please check your mobile phone{' '}
                  <strong className="text-slate-900 font-mono">{phoneNumber}</strong> and enter your M-Pesa PIN to complete payment of{' '}
                  <strong className="text-emerald-700 font-mono">KSh {amount.toLocaleString()}</strong>.
                </p>
              </div>

              {/* Simulated Phone Popup Box */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl max-w-xs mx-auto text-left shadow-lg border border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>M-PESA NOTICE</span>
                  <span>SIMULATED</span>
                </div>
                <p className="text-xs font-mono text-emerald-400 font-semibold leading-snug">
                  Do you want to pay KSh {amount.toLocaleString()} to Kikuyu Water Scheme (Acc: {customer.accountNumber})?
                </p>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleSimulatePinEntered}
                    className="px-3 py-1.5 text-[11px] font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1"
                  >
                    {isProcessing ? (
                      <span className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>Enter PIN & Confirm</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStkStage('idle')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                >
                  &larr; Change Amount or Phone Number
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: PAYMENT COMPLETED SUCCESS */}
          {stkStage === 'completed' && simulatedReceipt && (
            <div className="text-center py-4 space-y-5 animate-in fade-in">
              <PipMascot state="celebrating" size={100} className="mb-1" />

              <div>
                <h4 className="text-lg font-extrabold text-emerald-900">
                  Payment Received & Verified!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  Thank you! Your payment of{' '}
                  <strong className="text-slate-900 font-mono">KSh {simulatedReceipt.amount.toLocaleString()}</strong> has been credited to Account{' '}
                  <strong className="text-slate-900 font-mono">{customer.accountNumber}</strong>.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E7E2D6] text-xs space-y-1.5 max-w-sm mx-auto text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Receipt:</span>
                  <span className="font-mono font-bold text-[#164E63]">{simulatedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-slate-800">{simulatedReceipt.transactionReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Remaining Balance:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    KSh {Math.max(0, customer.balance).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setSelectedReceipt(simulatedReceipt);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
                >
                  View & Download Receipt
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
