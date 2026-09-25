'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web';
import { fetchApi } from '../../lib/api';
import { useLanguage } from '../../lib/language-context';
import {
  Wheat,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();

  // Farmer OTP State
  const [mobile, setMobile] = useState('9822012345');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async () => {
    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await fetchApi('/auth/farmer/otp/request', {
        method: 'POST',
        body: JSON.stringify({ mobile }),
      });
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchApi('/auth/farmer/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ mobile, otp }),
      });
      if (res?.accessToken) {
        localStorage.setItem('mandimitra_token', res.accessToken);
        localStorage.setItem('mandimitra_user', JSON.stringify(res.user));
      }
      router.push('/farmer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const quickFarmerLogin = () => {
    setMobile('9822012345');
    setOtp('123456');
    router.push('/farmer/dashboard');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.logoTile}>
          <Wheat size={30} color="#fde047" />
        </View>
        <Text style={styles.brandTitle}>MANDI SETU</Text>
        <Text style={styles.brandSubtitle}>
          {language === 'hi'
            ? 'किसान प्रवेश पोर्टल • मंडी सेतु'
            : (language === 'mr' ? 'शेतकरी लॉगिन पोर्टल • मंडी सेतु' : 'Farmer Access Portal')}
        </Text>
        <View style={styles.farmerOnlyBadge}>
          <ShieldCheck size={13} color="#047857" />
          <Text style={styles.farmerOnlyBadgeText}>
            {language === 'hi' ? 'केवल पंजीकृत किसानों के लिए' : 'Exclusively for Farmers'}
          </Text>
        </View>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <AlertCircle size={15} color="#991b1b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Main Login Card */}
      <View style={styles.card}>
        {!otpSent ? (
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {language === 'hi' ? 'किसान मोबाइल नंबर' : 'Farmer Mobile Number'}
              </Text>
              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="numeric"
                  placeholder="9822012345"
                  placeholderTextColor="#9ca3af"
                  style={styles.phoneTextInput}
                />
              </View>
              <Text style={styles.hintText}>
                {language === 'hi'
                  ? 'अपने आधार-लिंक्ड 10-अंकीय मोबाइल नंबर से लॉगिन करें।'
                  : 'Enter your 10-digit Aadhaar-registered mobile number.'}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRequestOtp}
              disabled={loading}
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {language === 'hi' ? 'ओटीपी प्राप्त करें' : 'Send OTP'}
                  </Text>
                  <ArrowRight size={16} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formSection}>
            <View style={styles.otpNoticeBox}>
              <CheckCircle2 size={16} color="#047857" />
              <View style={{ flex: 1 }}>
                <Text style={styles.otpNoticeTitle}>OTP Sent to +91-{mobile}</Text>
                <Text style={styles.otpNoticeSub}>Demo OTP: 123456</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {language === 'hi' ? '6-अंकीय ओटीपी दर्ज करें' : 'Enter 6-Digit OTP'}
              </Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                placeholder="123456"
                placeholderTextColor="#9ca3af"
                style={styles.otpTextInput}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleVerifyOtp}
              disabled={loading}
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>
                    {language === 'hi' ? 'सत्यापित करें एवं आगे बढ़ें' : 'Verify & Enter App'}
                  </Text>
                  <ArrowRight size={16} color="#ffffff" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setOtpSent(false)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Change Mobile Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Instant Demo Farmer Login Card */}
      <View style={styles.demoCard}>
        <View style={styles.demoHeader}>
          <Sparkles size={14} color="#047857" />
          <Text style={styles.demoTitle}>
            {language === 'hi' ? 'त्वरित किसान प्रवेश' : 'One-Tap Demo Farmer Login'}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={quickFarmerLogin}
          style={styles.demoFarmerButton}
        >
          <View style={styles.demoAvatar}>
            <Text style={styles.demoAvatarText}>R</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.demoFarmerName}>Ramesh Kumar (रमेश कुमार)</Text>
            <Text style={styles.demoFarmerMeta}>
              MH-NAS-2026-0812 • Pimpalgaon, Niphad
            </Text>
          </View>
          <ArrowRight size={16} color="#047857" />
        </TouchableOpacity>
      </View>

      {/* Security Guarantee */}
      <View style={styles.securityBox}>
        <ShieldCheck size={16} color="#047857" />
        <Text style={styles.securityText}>
          Protected by Govt MSP e-Procurement Security Standards
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    gap: 18,
  },
  brandHeader: {
    alignItems: 'center',
    gap: 4,
  },
  logoTile: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 6,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064e3b',
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  farmerOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 6,
  },
  farmerOnlyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#064e3b',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: '#991b1b',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d1fae5',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formSection: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064e3b',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  countryCodeBox: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: '#d1fae5',
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857',
  },
  phoneTextInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#064e3b',
  },
  hintText: {
    fontSize: 10,
    color: '#047857',
    marginTop: 2,
  },
  otpNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    padding: 12,
  },
  otpNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064e3b',
  },
  otpNoticeSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
    marginTop: 1,
  },
  otpTextInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    fontWeight: '900',
    color: '#064e3b',
    textAlign: 'center',
    letterSpacing: 6,
  },
  primaryButton: {
    backgroundColor: '#047857',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  demoCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
    gap: 10,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#064e3b',
    textTransform: 'uppercase',
  },
  demoFarmerButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  demoAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoAvatarText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
  },
  demoFarmerName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064e3b',
  },
  demoFarmerMeta: {
    fontSize: 10,
    color: '#047857',
    marginTop: 1,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  securityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
    textAlign: 'center',
  },
});
