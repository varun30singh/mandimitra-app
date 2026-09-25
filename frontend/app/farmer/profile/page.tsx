'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { User, MapPin, Wheat, ShieldCheck, CheckCircle2, Phone, Save, LogOut } from 'lucide-react';

export default function FarmerProfilePage() {
  const router = useRouter();
  const { language, t, translateCrop } = useLanguage();
  const [farmer, setFarmer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mandimitra_token');
      localStorage.removeItem('mandimitra_user');
    }
    router.replace('/login');
  };

  useEffect(() => {
    fetchApi('/farmers/MH-NAS-2026-0812')
      .then((res) => {
        setFarmer(res);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) return;
    try {
      const updated = await fetchApi(`/farmers/${farmer.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullName: farmer.fullName,
          village: farmer.village,
          taluka: farmer.taluka,
          defaultCrop: farmer.defaultCrop,
          defaultQuantity: parseFloat(farmer.defaultQuantity),
          preferredLanguage: farmer.preferredLanguage,
        }),
      });
      if (updated) {
        setFarmer(updated);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!farmer) {
    return <div className="p-8 text-center text-slate-700">{t('loading')}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 font-serif">
          {t('profile_title')}
        </h1>
        <p className="text-xs text-slate-700 mt-1">
          {t('create_account_sub')}
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {t('profile_updated_success')}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs text-slate-700 block">Registered Farmer ID:</span>
            <span className="font-mono text-xl font-bold text-slate-900">{farmer.farmerId}</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {farmer.registrationStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('name_field')}</label>
            <input
              type="text"
              value={farmer.fullName}
              onChange={(e) => setFarmer({ ...farmer, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('aadhaar_verified')}</label>
            <input
              type="text"
              value={farmer.mobile}
              disabled
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('village')}</label>
            <input
              type="text"
              value={farmer.village}
              onChange={(e) => setFarmer({ ...farmer, village: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('taluka')}</label>
            <input
              type="text"
              value={farmer.taluka}
              onChange={(e) => setFarmer({ ...farmer, taluka: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('primary_crop')}</label>
            <input
              type="text"
              value={farmer.defaultCrop}
              onChange={(e) => setFarmer({ ...farmer, defaultCrop: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">{t('approx_quantity')}</label>
            <input
              type="number"
              value={farmer.defaultQuantity}
              onChange={(e) => setFarmer({ ...farmer, defaultQuantity: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSignOut}
            className="border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs text-sm"
          >
            <LogOut className="w-4 h-4" /> {t('sign_out')}
          </button>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs text-sm"
          >
            <Save className="w-4 h-4" /> {t('save_profile')}
          </button>
        </div>
      </form>
    </div>
  );
}
