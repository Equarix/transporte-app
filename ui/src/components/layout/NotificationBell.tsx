"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { instance } from "@/config/axios";
import { LuBell, LuCheck, LuTag, LuCopy } from "react-icons/lu";
import { cn } from "@/utils/cn";
import { useAuth } from "@/context/AuthContext";

interface PromoAlert {
  alertId: number;
  title: string;
  message: string;
  code: string | null;
  discount: string | null;
  sentAt: string;
  isRead: boolean;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Only fetch alerts if user is authenticated
  const { data: alerts = [] } = useQuery<PromoAlert[]>({
    queryKey: ["user-alerts", user?.userId],
    queryFn: async () => {
      const res = await instance.get<any>("/notifications/alerts");
      return res.data?.body || [];
    },
    enabled: !!user,
    refetchInterval: 10000, // Refresh every 10 seconds to catch massive alerts in real time!
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
        title="Notificaciones"
      >
        <LuBell size={20} className={cn(unreadCount > 0 && "animate-swing")} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 size-4 bg-red-500 text-white rounded-full text-[9px] font-black flex items-center justify-center border border-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-150 rounded-3xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[420px]">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <LuBell size={14} className="text-amber-600" />
              Notificaciones
            </h4>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                {unreadCount} nuevas
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 divide-y divide-slate-100/50">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <LuBell className="mx-auto size-8 opacity-45" />
                <p className="text-xs font-medium">No tienes alertas o promociones aún.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.alertId}
                  className={cn(
                    "pt-3 first:pt-0 flex flex-col gap-1.5",
                    !alert.isRead && "bg-amber-50/20 rounded-2xl p-2.5 border border-amber-100/30"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-slate-800 leading-tight">
                      {alert.title}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold shrink-0">
                      {new Date(alert.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {alert.message}
                  </p>
                  
                  {/* Coupon layout */}
                  {alert.code && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <LuTag size={10} /> {alert.discount}
                      </span>
                      <button
                        onClick={() => handleCopy(alert.code!)}
                        className="text-[9px] font-bold text-slate-500 hover:text-amber-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedCode === alert.code ? (
                          <>
                            <LuCheck size={10} className="text-emerald-600" /> Copiado
                          </>
                        ) : (
                          <>
                            <LuCopy size={10} /> {alert.code}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
