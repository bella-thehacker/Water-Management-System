import React from 'react';
import { Invoice } from '../types';
import { Printer, X, CreditCard, Droplets } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onRecordPayment?: (invoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  onClose,
  onRecordPayment,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Water Invoice
            </span>
            <span className="text-xs font-mono font-semibold text-[#164E63]">
              {invoice.invoiceNumber}
            </span>
            <StatusBadge status={invoice.status} size="sm" />
          </div>
          <div className="flex items-center gap-2">
            {invoice.balance > 0 && onRecordPayment && (
              <button
                onClick={() => {
                  onClose();
                  onRecordPayment(invoice);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-lg shadow-xs transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Payment</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 bg-white text-slate-900 printable-document">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#164E63] flex items-center justify-center p-2.5 shrink-0 shadow-xs">
                <img
                  src="/assets/aistudio/image_0d358796.png"
                  alt="Kikuyu Water"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#164E63] tracking-tight">
                  KIKUYU WATER
                </h2>
                <p className="text-xs font-medium text-[#399D9D]">
                  Community Water Supply Scheme
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  P.O. Box 244-00902 Kikuyu, Kiambu County, Kenya<br />
                  Tel: +254 722 000 111 · Email: billing@kikuyuwater.co.ke
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-2.5 py-1 text-xs font-mono font-bold text-[#164E63] bg-[#E6F3F3] rounded">
                INVOICE
              </span>
              <p className="text-lg font-bold font-mono text-slate-900 mt-1">
                {invoice.invoiceNumber}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Date: <strong className="text-slate-700">{invoice.invoiceDate}</strong>
              </p>
              <p className="text-xs text-slate-500">
                Due Date: <strong className="text-rose-700">{invoice.dueDate}</strong>
              </p>
            </div>
          </div>

          {/* Customer & Billing Period Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <p className="font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Billed To
              </p>
              <h3 className="text-base font-bold text-slate-900">
                {invoice.customerName}
              </h3>
              <p className="font-mono text-slate-600 font-semibold mt-0.5">
                Account: {invoice.customerAccount}
              </p>
              <p className="text-slate-600 mt-1">{invoice.customerAddress}</p>
              <p className="text-slate-600">{invoice.customerZone}</p>
              <p className="text-slate-500 mt-0.5">Phone: {invoice.customerPhone}</p>
            </div>

            <div className="sm:text-right space-y-1.5">
              <div>
                <span className="text-slate-500">Billing Period: </span>
                <span className="font-bold text-slate-900">{invoice.period}</span>
              </div>
              <div>
                <span className="text-slate-500">Applied Tariff: </span>
                <span className="font-medium text-[#164E63]">{invoice.tariffName}</span>
              </div>
              <div>
                <span className="text-slate-500">Invoice Status: </span>
                <span className="font-semibold capitalize text-slate-800">{invoice.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Meter Readings Strip */}
          <div className="my-6 p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="block text-xs text-slate-500 font-medium">Previous Reading</span>
              <span className="text-base font-bold font-mono text-slate-800 tabular-nums">
                {invoice.previousReading} m³
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">Current Reading</span>
              <span className="text-base font-bold font-mono text-slate-800 tabular-nums">
                {invoice.currentReading} m³
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-medium">Net Consumption</span>
              <span className="text-base font-extrabold font-mono text-[#399D9D] tabular-nums">
                {invoice.consumption} m³
              </span>
            </div>
          </div>

          {/* Itemized Financial Table */}
          <table className="w-full text-xs text-left mb-6">
            <thead>
              <tr className="border-b border-slate-300 text-slate-600 uppercase tracking-wider font-semibold">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-right">Units (m³)</th>
                <th className="py-2.5 text-right">Rate (KSh)</th>
                <th className="py-2.5 text-right">Amount (KSh)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.breakdown.map((item, idx) => (
                <tr key={idx} className="text-slate-700">
                  <td className="py-2.5 font-medium">{item.bandName}</td>
                  <td className="py-2.5 text-right font-mono tabular-nums">{item.units}</td>
                  <td className="py-2.5 text-right font-mono tabular-nums">{item.rate.toFixed(2)}</td>
                  <td className="py-2.5 text-right font-mono font-semibold tabular-nums text-slate-900">
                    {item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="text-slate-700">
                <td className="py-2.5 font-medium">Fixed Meter Maintenance & Service Charge</td>
                <td className="py-2.5 text-right font-mono tabular-nums">1</td>
                <td className="py-2.5 text-right font-mono tabular-nums">{invoice.fixedCharge.toFixed(2)}</td>
                <td className="py-2.5 text-right font-mono font-semibold tabular-nums text-slate-900">
                  {invoice.fixedCharge.toLocaleString()}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-300">
                <td colSpan={3} className="pt-3 text-right font-bold text-slate-700">
                  Total Current Bill:
                </td>
                <td className="pt-3 text-right font-bold font-mono text-slate-900 text-sm tabular-nums">
                  KSh {invoice.totalAmount.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="py-1 text-right text-emerald-700 font-medium">
                  Less Amount Paid:
                </td>
                <td className="py-1 text-right font-semibold font-mono text-emerald-700 tabular-nums">
                  - KSh {invoice.amountPaid.toLocaleString()}
                </td>
              </tr>
              <tr className="border-t border-slate-200">
                <td colSpan={3} className="pt-2 text-right font-extrabold text-[#164E63] text-sm">
                  Remaining Balance Due:
                </td>
                <td className="pt-2 text-right font-extrabold font-mono text-rose-700 text-base tabular-nums">
                  KSh {invoice.balance.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Payment Instructions Box */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs">
            <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
              <Droplets className="w-4 h-4 text-emerald-600" />
              <span>M-Pesa Payment Instructions</span>
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              1. Go to M-Pesa Menu · 2. Select <strong>Lipa na M-Pesa</strong> &gt; <strong>Paybill</strong><br />
              3. Business No: <strong className="font-mono text-emerald-950">400200</strong> · 
              4. Account No: <strong className="font-mono text-emerald-950">{invoice.customerAccount}</strong><br />
              5. Enter Amount: <strong className="font-mono text-emerald-950">KSh {invoice.balance.toLocaleString()}</strong> · 
              6. Enter your M-Pesa PIN and confirm.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] text-slate-500 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Every drop matters. Every community counts.</span>
            <span>Computer-generated document · Kikuyu Water Scheme</span>
          </div>
        </div>
      </div>
    </div>
  );
};
