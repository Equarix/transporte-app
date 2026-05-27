import React from "react";
import { useBooking } from "@/context/BookingProvider";

export default function PayerForm() {
  const { payerData, setPayerData } = useBooking();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setPayerData({ ...payerData, [name]: value });
  };

  return (
    <div className="mb-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Información del Pagador
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Tipo de Documento
          </label>
          <select
            name="documentType"
            value={payerData.documentType}
            onChange={handleChange}
            className="w-full bg-[#f8f6f4] border-none rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700 font-medium"
          >
            <option value="">Seleccione...</option>
            <option value="DNI">DNI - Documento Nacional</option>
            <option value="CE">CE - Carnet de Extranjería</option>
            <option value="PASSPORT">Pasaporte</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            N° de Documento
          </label>
          <input
            type="text"
            name="documentNumber"
            value={payerData.documentNumber}
            onChange={handleChange}
            placeholder="Ej. 70453218"
            className="w-full bg-[#f8f6f4] border-none rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Nombres
          </label>
          <input
            type="text"
            name="names"
            value={payerData.names}
            onChange={handleChange}
            placeholder="Ej. Carlos Alberto"
            className="w-full bg-[#f8f6f4] border-none rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700 font-medium"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Apellidos
          </label>
          <input
            type="text"
            name="lastName"
            value={payerData.lastName}
            onChange={handleChange}
            placeholder="Ej. Rodriguez Paz"
            className="w-full bg-[#f8f6f4] border-none rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700 font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Teléfono
          </label>
          <input
            type="text"
            name="phone"
            value={payerData.phone}
            onChange={handleChange}
            placeholder="+51 987 654 321"
            className="w-full bg-[#f8f6f4] border-none rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700 font-medium"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            name="birthDate"
            value={payerData.birthDate}
            onChange={handleChange}
            className="w-full bg-[#f8f6f4] border-none rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700 font-medium"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="email"
          value={payerData.email}
          onChange={handleChange}
          placeholder="carlos.rodriguez@email.com"
          className="w-full bg-[#f8f6f4] border-none rounded-xl px-4 py-4 outline-none focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700 font-medium"
        />
      </div>
    </div>
  );
}
