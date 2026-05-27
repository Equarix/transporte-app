import React from "react";
import { useBooking } from "@/context/BookingProvider";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

export default function PaymentMethods() {
  const { paymentMethod, setPaymentMethod } = useBooking();

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Métodos de Pago</h3>

      {/* Credit/Debit Cards */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-gray-900">Tarjetas de Crédito o Débito</h4>
          <div className="flex gap-1">
            {/* Mocked card icons */}
            <div className="w-6 h-4 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold text-gray-500">MC</div>
            <div className="w-6 h-4 bg-blue-800 rounded text-[8px] flex items-center justify-center font-bold text-white">VISA</div>
            <div className="w-6 h-4 bg-gray-300 rounded text-[8px] flex items-center justify-center font-bold text-gray-600">AX</div>
          </div>
        </div>
        <button 
          onClick={() => setPaymentMethod({ provider: "MERCADOPAGO", type: "CREDIT_CARD" })}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod?.provider === "MERCADOPAGO" ? "border-[#e87722] bg-[#fdf5f0]" : "border-transparent bg-[#f8f6f4] hover:bg-gray-100"}`}
        >
          <div className="flex items-center gap-3">
            <FaCreditCard className="text-[#8b5a2b] text-xl" />
            <span className="text-sm font-medium text-gray-800">Pagar con Mercado Pago</span>
          </div>
          <span className="text-gray-400">›</span>
        </button>
      </div>

      {/* Digital Wallets */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <h4 className="text-sm font-bold text-gray-900 mb-4">Billeteras Digitales</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setPaymentMethod({ provider: "YAPE", type: "DIGITAL_WALLET" })}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all border ${paymentMethod?.provider === "YAPE" ? "border-[#e87722] bg-[#fdf5f0]" : "border-transparent bg-[#f8f6f4] hover:bg-gray-100"}`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-purple-600 font-bold">Y</span>
            </div>
            <span className="text-xs font-bold text-gray-800">Yape</span>
          </button>
          <button 
            onClick={() => setPaymentMethod({ provider: "PLIN", type: "DIGITAL_WALLET" })}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all border ${paymentMethod?.provider === "PLIN" ? "border-[#e87722] bg-[#fdf5f0]" : "border-transparent bg-[#f8f6f4] hover:bg-gray-100"}`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-cyan-500 font-bold">P</span>
            </div>
            <span className="text-xs font-bold text-gray-800">Plin</span>
          </button>
          <button 
            onClick={() => setPaymentMethod({ provider: "BCP", type: "DIGITAL_WALLET" })}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all border ${paymentMethod?.provider === "BCP" ? "border-[#e87722] bg-[#fdf5f0]" : "border-transparent bg-[#f8f6f4] hover:bg-gray-100"}`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-blue-600 font-bold">B</span>
            </div>
            <span className="text-xs font-bold text-gray-800">BCP</span>
          </button>
          <button 
            onClick={() => setPaymentMethod({ provider: "INTERBANK", type: "DIGITAL_WALLET" })}
            className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl transition-all border ${paymentMethod?.provider === "INTERBANK" ? "border-[#e87722] bg-[#fdf5f0]" : "border-transparent bg-[#f8f6f4] hover:bg-gray-100"}`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <span className="text-green-600 font-bold text-[10px]">IB</span>
            </div>
            <span className="text-xs font-bold text-gray-800">Interbank</span>
          </button>
        </div>
      </div>

      {/* PagoEfectivo */}
      <button 
        onClick={() => setPaymentMethod({ provider: "PAGOEFECTIVO", type: "CASH" })}
        className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all shadow-sm ${paymentMethod?.provider === "PAGOEFECTIVO" ? "border-[#e87722] bg-[#fdf5f0]" : "border-gray-100 bg-white hover:bg-gray-50"}`}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#e87722] rounded-xl flex items-center justify-center text-white text-xl">
            <FaMoneyBillWave />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-gray-900">PagoEfectivo</h4>
            <p className="text-[10px] text-gray-500">Paga en agentes y bodegas</p>
          </div>
        </div>
        <span className="text-gray-400">›</span>
      </button>
    </div>
  );
}
