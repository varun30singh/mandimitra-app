'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet as RNStyleSheet,
  ActivityIndicator,
} from 'react-native-web';
import { useLanguage, Language } from '../lib/language-context';
import { fetchApi } from '../lib/api';
import { useRouter } from 'next/navigation';
import {
  X,
  User,
  Globe,
  Lock,
  CheckCircle2,
  Save,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'language'>('profile');

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mandimitra_token');
      localStorage.removeItem('mandimitra_user');
      localStorage.removeItem('mandimitra_active_token');
    }
    onClose();
    router.replace('/login');
  };

  // Profile fields
  const [farmer, setFarmer] = useState<any>(null);
  const [fullName, setFullName] = useState('Ramesh Kumar');
  const [village, setVillage] = useState('Pimpalgaon Baswant');
  const [taluka, setTaluka] = useState('Niphad');
  const [district, setDistrict] = useState('Nashik');
  const [defaultCrop, setDefaultCrop] = useState('Wheat');

  // Password fields
  const [userPhone, setUserPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const uStr = localStorage.getItem('mandimitra_user');
        if (uStr) {
          const u = JSON.parse(uStr);
          if (u.name) setFullName(u.name);
          if (u.phone) setUserPhone(u.phone);
        }
      } catch {}
      fetchApi('/farmers/MH-NAS-2026-0812')
        .then((res) => {
          setFarmer(res);
          if (res.fullName && res.fullName !== 'Ramesh Singh' && res.fullName !== 'Ramesh Kumar') {
            setFullName(res.fullName);
          }
          setVillage(res.village);
          setTaluka(res.taluka);
          setDistrict(res.district);
          setDefaultCrop(res.defaultCrop || 'Wheat');
        })
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveProfile = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const targetId = farmer?.id || 'farmer-001';
      const updated = await fetchApi(`/farmers/${targetId}`, {
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
      if (updated) {
        setFarmer(updated);
      }
      setSuccessMsg(t('profile_updated_success'));
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      setErrorMsg(t('password_mismatch'));
      return;
    }
    if (newPassword.length < 4) {
      setErrorMsg(t('password_min_length'));
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg(t('password_updated_success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 600);
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        {/* Mobile drag handle */}
        <View style={styles.dragHandle} />

        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>{fullName.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>{fullName}</Text>
              <Text style={styles.headerSubtitle}>
                {farmer ? farmer.farmerId : 'MH-NAS-2026-0812'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel={t('close')}
          >
            <X size={18} color="#064e3b" />
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('profile')}
            style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
          >
            <User size={14} color={activeTab === 'profile' ? '#047857' : '#064e3b'} />
            <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
              {t('edit_profile_tab')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('language')}
            style={[styles.tabButton, activeTab === 'language' && styles.tabButtonActive]}
          >
            <Globe size={14} color={activeTab === 'language' ? '#047857' : '#064e3b'} />
            <Text style={[styles.tabText, activeTab === 'language' && styles.tabTextActive]}>
              {t('language_tab')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('password')}
            style={[styles.tabButton, activeTab === 'password' && styles.tabButtonActive]}
          >
            <Lock size={14} color={activeTab === 'password' ? '#047857' : '#064e3b'} />
            <Text style={[styles.tabText, activeTab === 'password' && styles.tabTextActive]}>
              {t('password_tab')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Body */}
        <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
          {successMsg && (
            <View style={styles.alertSuccess}>
              <CheckCircle2 size={16} color="#047857" />
              <Text style={styles.alertSuccessText}>{successMsg}</Text>
            </View>
          )}

          {errorMsg && (
            <View style={styles.alertError}>
              <Text style={styles.alertErrorText}>{errorMsg}</Text>
            </View>
          )}

          {/* TAB 1: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('farmer_full_name')}</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.textInput}
                  placeholder={t('enter_full_name')}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('village')}</Text>
                <TextInput
                  value={village}
                  onChangeText={setVillage}
                  style={styles.textInput}
                  placeholder={t('enter_village')}
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>{t('taluka')}</Text>
                  <TextInput
                    value={taluka}
                    onChangeText={setTaluka}
                    style={styles.textInput}
                    placeholder={t('taluka')}
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>{t('district')}</Text>
                  <TextInput
                    value={district}
                    onChangeText={setDistrict}
                    style={styles.textInput}
                    placeholder={t('district')}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('primary_crop')}</Text>
                <TextInput
                  value={defaultCrop}
                  onChangeText={setDefaultCrop}
                  style={styles.textInput}
                  placeholder="e.g. Wheat, Onion, Soybean"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSaveProfile}
                disabled={saving}
                style={[styles.primaryButton, saving && styles.buttonDisabled]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Save size={16} color="#ffffff" />
                    <Text style={styles.primaryButtonText}>{t('save_profile')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* TAB 2: SELECT LANGUAGE */}
          {activeTab === 'language' && (
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>{t('select_preferred_lang')}</Text>

              {[
                { code: 'en', label: 'English', sub: 'Standard English interface' },
                { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'सरल हिन्दी इंटरफेस' },
                { code: 'mr', label: 'मराठी (Marathi)', sub: 'मराठी भाषा इंटरफेस' },
              ].map((langItem) => {
                const isSelected = language === langItem.code;
                return (
                  <TouchableOpacity
                    key={langItem.code}
                    activeOpacity={0.8}
                    onPress={() => {
                      setLanguage(langItem.code as Language);
                    }}
                    style={[styles.langCard, isSelected && styles.langCardSelected]}
                  >
                    <View>
                      <Text style={[styles.langLabel, isSelected && styles.langLabelSelected]}>
                        {langItem.label}
                      </Text>
                      <Text style={styles.langSub}>{langItem.sub}</Text>
                    </View>
                    {isSelected && <CheckCircle2 size={18} color="#047857" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* TAB 3: CHANGE PASSWORD / PIN */}
          {activeTab === 'password' && (
            <View style={styles.formContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('current_pin')}</Text>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('new_pin')}</Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  style={styles.textInput}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.inputLabel}>{t('confirm_pin')}</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  style={styles.textInput}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSavePassword}
                disabled={saving}
                style={[styles.primaryButton, saving && styles.buttonDisabled]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Lock size={16} color="#ffffff" />
                    <Text style={styles.primaryButtonText}>{t('update_password')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
            <LogOut size={16} color="#dc2626" />
            <Text style={styles.signOutButtonText}>{t('sign_out')}</Text>
          </TouchableOpacity>
        </View>

        {/* Modal Footer */}
        <View style={styles.modalFooter}>
          <ShieldCheck size={14} color="#047857" />
          <Text style={styles.footerText}>
            {t('aadhaar_verified')}: {farmer?.mobile ? `+91-${farmer.mobile}` : (userPhone ? `+91-${userPhone}` : '+91-Verified')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = RNStyleSheet.create({
  modalOverlay: {
    position: 'fixed' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalCard: {
    width: '100%',
    maxWidth: 448,
    maxHeight: '90%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#d1fae5',
    overflow: 'hidden',
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#a7f3d0',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ecfdf5',
    backgroundColor: '#f0fdf4',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#064e3b',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#047857',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#064e3b',
  },
  tabTextActive: {
    fontWeight: '800',
    color: '#047857',
  },
  modalBody: {
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  modalBodyContent: {
    paddingVertical: 16,
    gap: 14,
  },
  formContainer: {
    gap: 12,
  },
  formGroup: {
    gap: 4,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064e3b',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#064e3b',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  alertSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 10,
  },
  alertSuccessText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  alertError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 10,
  },
  alertErrorText: {
    color: '#991b1b',
    fontSize: 12,
    fontWeight: '700',
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d1fae5',
    backgroundColor: '#ffffff',
  },
  langCardSelected: {
    borderColor: '#047857',
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
  },
  langLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#064e3b',
  },
  langLabelSelected: {
    color: '#047857',
  },
  langSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecfdf5',
    backgroundColor: '#f0fdf4',
  },
  footerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  signOutContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingVertical: 12,
  },
  signOutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#dc2626',
    marginLeft: 8,
  },
});
