import React from "react";
import { LuArmchair } from "react-icons/lu";
import { SeatSelection } from "@/context/BookingProvider";

export interface PassengerData {
  documentType: string;
  documentNumber: string;
  names: string;
  lastName: string;
  motherLastName: string;
  gender: string;
  birthDate: string;
}

interface PassengerFormProps {
  seat: SeatSelection;
  isLocked: boolean;
  data: PassengerData;
  onChange: (data: PassengerData) => void;
}

export default function PassengerForm({ seat, isLocked, data, onChange }: PassengerFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleGenderChange = (gender: string) => {
    onChange({ ...data, gender });
  };

  if (isLocked) {
    return (
      <div className="bg-gray-50/50 rounded-3xl p-8 border border-gray-100 flex flex-col items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-4 w-full mb-8 opacity-50">
          <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
            <LuArmchair className="text-[#8b5a2b] text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Asiento {seat.name}</h3>
            <p className="text-sm text-gray-500">Piso {seat.floor} • {seat.type}</p>
          </div>
        </div>
        <p className="text-gray-400 text-sm italic text-center">Complete el pasajero anterior para desbloquear este formulario</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm transition-all">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#f5e6db] flex items-center justify-center">
          <LuArmchair className="text-[#8b5a2b] text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Asiento {seat.name}</h3>
          <p className="text-sm text-gray-500">Piso {seat.floor} • {seat.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Tipo Documento</label>
          <select 
            name="documentType"
            value={data.documentType}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#e87722] focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700"
          >
            <option value="">Seleccione...</option>
            <option value="DNI">DNI - Documento Nacional</option>
            <option value="CE">CE - Carnet de Extranjería</option>
            <option value="PASSPORT">Pasaporte</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">N° Documento</label>
          <input 
            type="text" 
            name="documentNumber"
            value={data.documentNumber}
            onChange={handleChange}
            placeholder="Ej: 71234567" 
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#e87722] focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Nombres</label>
        <input 
          type="text" 
          name="names"
          value={data.names}
          onChange={handleChange}
          placeholder="Nombre completo" 
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#e87722] focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Apellido Paterno</label>
          <input 
            type="text" 
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
            placeholder="Ej: García" 
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#e87722] focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Apellido Materno</label>
          <input 
            type="text" 
            name="motherLastName"
            value={data.motherLastName}
            onChange={handleChange}
            placeholder="Ej: Rojas" 
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#e87722] focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Sexo</label>
          <div className="flex gap-4">
            <button 
              type="button"
              onClick={() => handleGenderChange('M')}
              className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${data.gender === 'M' ? 'bg-white border-[#8b5a2b] text-[#8b5a2b] shadow-sm' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
            >
              Masculino
            </button>
            <button 
              type="button"
              onClick={() => handleGenderChange('F')}
              className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${data.gender === 'F' ? 'bg-white border-[#8b5a2b] text-[#8b5a2b] shadow-sm' : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
            >
              Femenino
            </button>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Fecha Nacimiento</label>
          <input 
            type="date" 
            name="birthDate"
            value={data.birthDate}
            onChange={handleChange}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#e87722] focus:ring-1 focus:ring-[#e87722] text-sm text-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
