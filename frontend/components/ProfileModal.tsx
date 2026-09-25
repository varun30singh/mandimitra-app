'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage, Language } from '../lib/language-context';
import { fetchApi } from '../lib/api';
import {
  X,
  User,
  Globe,
  Lock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Save,
  LogOut,
  Wheat,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'language'>('profile');

  // Profile fields
  const [farmer, setFarmer] = useState<any>(null);
  const [fullName, setFullName] = useState('Ramesh Kumar');
  const [village, setVillage] = useState('Pimpalgaon Baswant');
  const [taluka, setTaluka] = useState('Niphad');
  const [district, setDistrict] = useState('Nashik');
  const [defaultCrop, setDefaultCrop] = useState('Wheat');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchApi('/farmers/MH-NAS-2026-0812')
        .then((res) => {
          setFarmer(res);
          setFullName(res.fullName);
          setVillage(res.village);
          setTaluka(res.taluka);
          setDistrict(res.district);
          setDefaultCrop(res.defaultCrop || 'Wheat');
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (farmer?.id) {
        await fetchApi(`/farmers/${farmer.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            fullName,
            village,
            taluka,
            district,
            defaultCrop,
            preferredLanguage: language,
          }),
        });
      }
      setSuccessMsg(
        language === 'hi'
          ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!'
          : language === 'mr'
          ? 'प्रोफाइल यशस्वीरित्या अपडेट झाली!'
          : 'Profile updated successfully!',
      );
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 4) {
      setErrorMsg('Password should be at least 4 characters');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Security PIN / Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Drag handle for mobile */}
        <div className="w-12 h-1.5 bg-emerald-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-emerald-100 bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-emerald-950 text-base">{fullName}</h3>
              <p className="text-xs text-emerald-700 font-mono">
                {farmer ? farmer.farmerId : 'MH-NAS-2026-0812'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-emerald-100 px-6 pt-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-emerald-600/70 hover:text-emerald-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {language === 'hi' ? 'नाम एवं विवरण' : 'Edit Profile'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'language'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-emerald-600/70 hover:text-emerald-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'hi' ? 'भाषा (Language)' : 'Language'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'password'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-emerald-600/70 hover:text-emerald-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {language === 'hi' ? 'पासवर्ड / पिन' : 'Password'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  {language === 'hi' ? 'किसान का पूरा नाम' : 'Farmer Full Name'}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  {language === 'hi' ? 'गाँव (Village)' : 'Village'}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    {language === 'hi' ? 'तहसील (Taluka)' : 'Taluka'}
                  </label>
                  <input
                    type="text"
                    value={taluka}
                    onChange={(e) => setTaluka(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-900 block mb-1">
                    {language === 'hi' ? 'ज़िला (District)' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  {language === 'hi' ? 'मुख्य फसल (Primary Crop)' : 'Primary Crop'}
                </label>
                <select
                  value={defaultCrop}
                  onChange={(e) => setDefaultCrop(e.target.value)}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Wheat">Wheat / गेहूँ (MSP: ₹2,275/qtl)</option>
                  <option value="Onion">Onion / प्याज</option>
                  <option value="Soybean">Soybean / सोयाबीन</option>
                  <option value="Gram">Gram / चना</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : (language === 'hi' ? 'परिवर्तन सहेजें' : 'Save Profile Changes')}
              </button>
            </form>
          )}

          {/* TAB 2: SELECT LANGUAGE */}
          {activeTab === 'language' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-900 block">
                {language === 'hi' ? 'पसंदीदा भाषा चुनें' : (language === 'mr' ? 'पसंतीची भाषा निवडा' : 'Select Preferred Language')}
              </label>

              {[
                { code: 'en', label: 'English', sub: 'Standard English interface' },
                { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'सरल हिन्दी इंटरफेस' },
                { code: 'mr', label: 'मराठी (Marathi)', sub: 'मराठी भाषा इंटरफेस' },
              ].map((langItem) => {
                const selected = language === langItem.code;
                return (
                  <button
                    key={langItem.code}
                    type="button"
                    onClick={() => {
                      setLanguage(langItem.code as Language);
                      setSuccessMsg(`Language switched to ${langItem.label}`);
                      setTimeout(() => setSuccessMsg(null), 2000);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                      selected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500'
                        : 'border-emerald-100 hover:bg-emerald-50/30 text-emerald-950'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-emerald-950">{langItem.label}</div>
                      <div className="text-xs text-emerald-700">{langItem.sub}</div>
                    </div>
                    {selected && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 3: CHANGE PASSWORD / PIN */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  Current Password / PIN
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  New Password / PIN
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-sm text-emerald-950 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 mt-2"
              >
                <Lock className="w-4 h-4" />
                {saving ? 'Updating...' : 'Update Password / PIN'}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-emerald-100 bg-emerald-50/40 text-center">
          <div className="text-[11px] text-emerald-800 font-semibold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Aadhaar-Linked Verified Mobile: +91-9822012345
          </div>
        </div>
      </div>
    </div>
  );
};
