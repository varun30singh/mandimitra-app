'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { FileText, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAudit = async () => {
    try {
      setLoading(true);
      const res = await fetchApi('/admin/audit?limit=50');
      setLogs(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Section 39: Immutable Governance & Transparency
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-serif mt-1">
            System Audit Trail & Queue Action Logs
          </h1>
          <p className="text-xs text-slate-700 mt-1">
            Every token call, slot booking, gate check-in, and priority adjustment is cryptographically recorded.
          </p>
        </div>

        <button
          onClick={loadAudit}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-4 py-4">Actor & Role</th>
                <th className="px-4 py-4">Action</th>
                <th className="px-4 py-4">Entity</th>
                <th className="px-6 py-4">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3.5 text-slate-700 font-sans">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-900 font-sans">{log.actor}</span>
                    <span className="block text-[10px] text-slate-700 uppercase">{log.actorRole}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700">
                    {log.entity} #{log.entityId?.slice(0, 8)}
                  </td>
                  <td className="px-6 py-3.5 text-[11px] text-slate-700 max-w-xs truncate">
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
