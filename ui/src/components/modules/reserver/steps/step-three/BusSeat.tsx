import React from "react";
import { LuPawPrint } from "react-icons/lu";

interface BusSeatProps {
  number: string;
  status: "free" | "selected" | "sold" | "reserved";
  isPetFriendly?: boolean;
  onSelect: () => void;
}

export default function BusSeat({ number, status, isPetFriendly, onSelect }: BusSeatProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "free":
        return "bg-gray-100 text-gray-500 hover:bg-gray-200";
      case "selected":
        return "bg-[#e87722] text-white shadow-md shadow-orange-500/40";
      case "sold":
        return "bg-gray-300 text-gray-400 cursor-not-allowed";
      case "reserved":
        return "bg-[#f27166] text-white cursor-not-allowed";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <button
      disabled={status === "sold" || status === "reserved"}
      onClick={onSelect}
      className={`relative w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all active:scale-95 ${getStatusStyles()}`}
    >
      {/* Pet Friendly Dashed Border Indicator */}
      {isPetFriendly && (
        <div className="absolute inset-[-4px] border border-dashed border-[#8b5a2b] rounded-2xl pointer-events-none flex items-end justify-center pb-[2px]">
          <LuPawPrint className="text-[#8b5a2b] text-[10px] absolute -top-3" />
        </div>
      )}
      {number}
    </button>
  );
}
