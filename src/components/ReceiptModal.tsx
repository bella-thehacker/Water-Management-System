import React from 'react';
import { Payment } from '../types';
import { Printer, X, CheckCircle2 } from 'lucide-react';
import { PipMascot } from './PipMascot';

interface ReceiptModalProps {
  payment: Payment | null;
  customerBalance?: number;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  customerBalance = 0,
  onClose,
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Payment Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pip Celebration Banner (Hidden during print) */}
        <div className="bg-gradient-to-r from-[#E6F3F3] to-[#EDF5F4] px-6 py-4 flex items-center gap-4 border-b border-[#399D9D]/20 no-print">
          <PipMascot state="celebrating" size={64} showRipple={false} />
          <div>
            <h4 className="text-sm font-bold text-[#164E63]">
              Payment Recorded Successfully!
            </h4>
            <p className="text-xs text-slate-600">
              Pip celebrated! Account balance and records have been updated.
            </p>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 bg-white text-slate-900 printable-document">
          {/* Header */}
          <div className="text-center pb-6 border-b border-dashed border-slate-300">
            <div className="w-10 h-10 rounded-xl bg-[#164E63] flex items-center justify-center p-2 mx-auto mb-2 shadow-xs">
              <img
                src="/assets/aistudio/image_0d358796.png"
                alt="Kikuyu Water"
                className="w-full h-full object-contain filter brightness-110"
              />
            </div>
            <h2 className="text-lg font-extrabold text-[#164E63] tracking-tight">
              KIKUYU WATER
            </h2>
            <p className="text-xs text-slate-500">
              Community Water Supply Scheme · Official Receipt
            </p>
            <p className="text-xs font-mono font-bold text-slate-800 mt-2">
              Receipt No: {payment.receiptNumber}
            </p>
            <p className="text-[11px] text-slate-500">{payment.date}</p>
          </div>

          {/* Customer Details */}
          <div className="py-4 border-b border-slate-200 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Received From:</span>
              <span className="font-bold text-slate-900">{payment.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Account Number:</span>
              <span className="font-mono font-semibold text-slate-800">{payment.customerAccount}</span>
            </div>
            {payment.payerPhone && (
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="text-slate-700">{payment.payerPhone}</span>
              </div>
            )}
          </div>

          {/* Payment Method & Amount Details */}
          <div className="py-4 border-b border-slate-200 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-semibold text-slate-900">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction Reference:</span>
              <span className="font-mono font-bold text-[#164E63]">{payment.transactionReference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Receiving Officer:</span>
              <span className="text-slate-700">{payment.receivingOfficer}</span>
            </div>

            {payment.allocatedInvoices.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-100">
                <span className="text-slate-500 block mb-1">Invoice Allocations:</span>
                {payment.allocatedInvoices.map((alloc, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 pl-2">
                    <span className="font-mono">{alloc.invoiceNumber}</span>
                    <span className="font-mono tabular-nums">KSh {alloc.amountAllocated.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Large Total Amount Strip */}
          <div className="my-5 p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] text-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Amount Paid
            </span>
            <span className="text-2xl font-black font-mono text-[#399D9D] tabular-nums mt-0.5 block">
              KSh {payment.amount.toLocaleString()}.00
            </span>
          </div>

          {/* Remaining Balance & Footer */}
          <div className="text-xs space-y-1 text-slate-600 text-center pb-2">
            <p>
              Current Outstanding Balance:{' '}
              <strong className="font-mono text-slate-900">
                KSh {customerBalance.toLocaleString()}
              </strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-3">
              Thank you for supporting Kikuyu community water sustainability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
