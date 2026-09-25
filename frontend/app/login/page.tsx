'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web';
import { fetchApi } from '../../lib/api';
import { useLanguage } from '../../lib/language-context';
import {
  Wheat,
  Phone,
  Lock,
  User,
  CreditCard,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

function LoginContent() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'login' or 'register'
  const [view, setView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (searchParams.get('mode') === 'register' || searchParams.get('view') === 'register') {
      setView('register');
    }
  }, [searchParams]);

  // LOGIN STATE (strictly Phone + Password)
  const [loginPhone, setLoginPhone] = useState('9822012345');
  const [loginPassword, setLoginPassword] = useState('1234');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // REGISTRATION STATE
  const [regName, setRegName] = useState('');
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRePassword, setRegRePassword] = useState('');
  const [regArea, setRegArea] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // HANDLE LOGIN
  const handleLogin = async () => {
    if (!loginPhone || loginPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          phone: String(loginPhone).trim(),
          mobile: String(loginPhone).trim(),
          password: String(loginPassword),
        }),
      });

      if (res?.accessToken || res?.access_token) {
        const token = res.accessToken || res.access_token;
        localStorage.setItem('mandimitra_token', token);
        localStorage.setItem('mandimitra_user', JSON.stringify(res.user || res));
      }

      router.push('/farmer/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  };

  // HANDLE REGISTER
  const handleRegister = async () => {
    if (!regName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!regAadhaar.trim() || regAadhaar.trim().length < 12) {
      setError('Please enter a valid 12-digit Aadhaar card number');
      return;
    }
    if (!regPhone.trim() || regPhone.trim().length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }
    if (regPassword !== regRePassword) {
      setError('Passwords do not match');
      return;
    }
    if (!regArea.trim()) {
      setError('Please enter your village, taluka, or area');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          phone: String(regPhone).trim(),
          mobile: String(regPhone).trim(),
          password: String(regPassword),
          role: 'farmer',
          name: regName.trim(),
          fullName: regName.trim(),
          aadhaarNumber: regAadhaar.trim(),
          area: regArea.trim(),
        }),
      });

      // On submit success: redirect to original login page with phone pre-filled
      setSuccessMsg('Account created successfully! Please enter your password to login.');
      setLoginPhone(regPhone.trim());
      setLoginPassword('');
      setView('login');
      // Reset registration form
      setRegName('');
      setRegAadhaar('');
      setRegPhone('');
      setRegPassword('');
      setRegRePassword('');
      setRegArea('');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top: ONLY Logo */}
      <View style={styles.topLogoContainer}>
        <Image
          source={{ uri: '/images/mandi-mitra-logo.jpg' }}
          style={styles.officialLogoImage}
          resizeMode="contain"
          accessibilityLabel="Mandi Mitra Official Logo"
        />
      </View>

      {/* Success Notification (e.g. after registration) */}
      {successMsg && (
        <View style={styles.successBanner}>
          <CheckCircle2 size={18} color="#047857" style={{ marginTop: 2 }} />
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      )}

      {/* Error Notification */}
      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={18} color="#991b1b" style={{ marginTop: 2 }} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* ========================================================= */}
      {/* 1. ORIGINAL LOGIN PAGE VIEW                               */}
      {/* ========================================================= */}
      {view === 'login' && (
        <View style={styles.loginCard}>
          <Text style={styles.loginHeading}>{t('farmer_login_heading')}</Text>

          {/* Box 1: Enter Phone Number */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('enter_phone')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <Phone size={16} color="#047857" />
              </View>
              <TextInput
                value={loginPhone}
                onChangeText={setLoginPhone}
                keyboardType="numeric"
                placeholder={t('phone_placeholder')}
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Box 2: Enter Password */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('enter_password')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <Lock size={16} color="#047857" />
              </View>
              <TextInput
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry={!showLoginPassword}
                placeholder={t('password_placeholder')}
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowLoginPassword(!showLoginPassword)}
                style={styles.eyeButton}
              >
                {showLoginPassword ? (
                  <EyeOff size={16} color="#047857" />
                ) : (
                  <Eye size={16} color="#047857" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>{t('login_button')}</Text>
                <ArrowRight size={18} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Bottom Message: New user create new account */}
          <View style={styles.bottomLinkContainer}>
            <Text style={styles.bottomMessageText}>{t('new_user_question')}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setError(null);
                setSuccessMsg(null);
                setView('register');
              }}
            >
              <Text style={styles.createAccountLink}>{t('create_new_account')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ========================================================= */}
      {/* 2. CREATE NEW ACCOUNT (REGISTRATION) VIEW                 */}
      {/* ========================================================= */}
      {view === 'register' && (
        <View style={styles.loginCard}>
          <View style={styles.registerHeader}>
            <Text style={styles.loginHeading}>{t('create_account_heading')}</Text>
            <Text style={styles.registerSub}>{t('create_account_sub')}</Text>
          </View>

          {/* 1. Name */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('name_field')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <User size={16} color="#047857" />
              </View>
              <TextInput
                value={regName}
                onChangeText={setRegName}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* 2. Aadhaar Card Number */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('aadhaar_field')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <CreditCard size={16} color="#047857" />
              </View>
              <TextInput
                value={regAadhaar}
                onChangeText={setRegAadhaar}
                keyboardType="numeric"
                maxLength={12}
                placeholder="12-digit Aadhaar number"
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* 3. Phone Number */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('phone_field')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <Phone size={16} color="#047857" />
              </View>
              <TextInput
                value={regPhone}
                onChangeText={setRegPhone}
                keyboardType="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* 4. Password */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('password_field')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <Lock size={16} color="#047857" />
              </View>
              <TextInput
                value={regPassword}
                onChangeText={setRegPassword}
                secureTextEntry={!showRegPassword}
                placeholder="Create password"
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowRegPassword(!showRegPassword)}
                style={styles.eyeButton}
              >
                {showRegPassword ? (
                  <EyeOff size={16} color="#047857" />
                ) : (
                  <Eye size={16} color="#047857" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. Re-Password */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('re_password_field')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <Lock size={16} color="#047857" />
              </View>
              <TextInput
                value={regRePassword}
                onChangeText={setRegRePassword}
                secureTextEntry={!showRegPassword}
                placeholder="Confirm password"
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* 6. Area where he is living */}
          <View style={styles.inputBlock}>
            <Text style={styles.inputLabel}>{t('area_field')}</Text>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconBox}>
                <MapPin size={16} color="#047857" />
              </View>
              <TextInput
                value={regArea}
                onChangeText={setRegArea}
                placeholder="e.g. Pimpalgaon Baswant, Niphad"
                placeholderTextColor="#9ca3af"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Submit Registration Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleRegister}
            disabled={loading}
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>{t('submit_button')}</Text>
                <ArrowRight size={18} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={styles.bottomLinkContainer}>
            <Text style={styles.bottomMessageText}>{t('already_have_account')}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setError(null);
                setView('login');
              }}
            >
              <Text style={styles.createAccountLink}>{t('login_here')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#047857" />
        </View>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    gap: 16,
    maxWidth: 448,
    marginHorizontal: 'auto',
    width: '100%',
  },
  topLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  officialLogoImage: {
    width: 220,
    height: 168,
    alignSelf: 'center',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    borderRadius: 16,
    padding: 14,
  },
  successText: {
    flex: 1,
    color: '#064e3b',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#fecaca',
    borderRadius: 16,
    padding: 14,
  },
  errorText: {
    flex: 1,
    color: '#991b1b',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  loginCard: {
    backgroundColor: '#ffffff',
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: '#d1fae5',
    gap: 16,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  loginHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#064e3b',
    textAlign: 'center',
  },
  registerHeader: {
    alignItems: 'center',
    gap: 2,
  },
  registerSub: {
    fontSize: 11,
    color: '#047857',
    textAlign: 'center',
  },
  inputBlock: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064e3b',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  inputIconBox: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#064e3b',
    fontWeight: '600',
  },
  eyeButton: {
    padding: 6,
  },
  primaryButton: {
    backgroundColor: '#047857',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  bottomLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  bottomMessageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  createAccountLink: {
    fontSize: 12,
    fontWeight: '900',
    color: '#064e3b',
    textDecorationLine: 'underline',
  },
});
