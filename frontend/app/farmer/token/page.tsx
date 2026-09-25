'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { TokenLiveTracker } from '../../../components/TokenLiveTracker';
import {
  RefreshCw,
  QrCode,
  Truck,
} from 'lucide-react';

function TokenTrackerContent() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const paramToken = searchParams.get('token');

  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  const loadToken = async () => {
    try {
      setLoading(true);
      if (paramToken) {
        const res = await fetchApi(`/queue/token/${paramToken}`);
        setTokenDetails(res);
      } else {
        const farmer = await fetchApi('/farmers/MH-NAS-2026-0812');
        const activeRes = await fetchApi(`/queue/farmer/${farmer.id}/active`);
        setTokenDetails(activeRes);
      }
    } catch (err) {
      console.error('Failed to load token:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
    const interval = setInterval(loadToken, 6000);
    return () => clearInterval(interval);
  }, [paramToken]);

  const handleGateCheckIn = async () => {
    if (!tokenDetails?.token?.id) return;
    try {
      setCheckingIn(true);
      await fetchApi(`/queue/${tokenDetails.token.id}/check-in`, {
        method: 'POST',
        body: JSON.stringify({ operatorName: 'Gate Self-Kiosk' }),
      });
      await loadToken();
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.syncTag}>● {t('live_queue_sync')}</Text>
          <Text style={styles.pageTitle}>{t('my_digital_token')}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={loadToken}
          style={styles.refreshButton}
          accessibilityLabel="Refresh Token Status"
        >
          <RefreshCw size={13} color="#047857" />
          <Text style={styles.refreshButtonText}>{t('refresh')}</Text>
        </TouchableOpacity>
      </View>

      {/* Main Live Card */}
      <TokenLiveTracker tokenData={tokenDetails} onRefresh={loadToken} />

      {/* Digital Mandi Gate Pass QR Code Card */}
      {tokenDetails && (
        <View style={styles.qrCard}>
          <View style={styles.qrBadge}>
            <QrCode size={14} color="#047857" />
            <Text style={styles.qrBadgeText}>{t('mandi_entry_pass')}</Text>
          </View>

          <Text style={styles.qrInstructions}>{t('pass_instructions')}</Text>

          {/* QR Box */}
          <View style={styles.qrOuterBox}>
            <View style={styles.qrInnerWhite}>
              <View style={styles.qrGrid}>
                {Array.from({ length: 36 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrPixel,
                      (i % 2 === 0 || i % 5 === 0) ? styles.qrPixelFilled : styles.qrPixelEmpty,
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.qrTokenText}>{tokenDetails.token.tokenNumber}</Text>
          </View>

          {tokenDetails.token.status === 'BOOKED' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleGateCheckIn}
              disabled={checkingIn}
              style={styles.checkInButton}
            >
              {checkingIn ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Truck size={16} color="#ffffff" />
                  <Text style={styles.checkInButtonText}>{t('i_have_arrived')}</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
}

export default function TokenTrackerPage() {
  return (
    <Suspense
      fallback={
        <View style={{ padding: 32, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#047857" />
        </View>
      }
    >
      <TokenTrackerContent />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
  },
  content: {
    paddingBottom: 24,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  syncTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064e3b',
    marginTop: 2,
  },
  refreshButton: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  refreshButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#d1fae5',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  qrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  qrBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#064e3b',
    letterSpacing: 0.5,
  },
  qrInstructions: {
    fontSize: 11,
    color: '#047857',
    textAlign: 'center',
    maxWidth: 260,
  },
  qrOuterBox: {
    backgroundColor: '#064e3b',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#047857',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: 170,
  },
  qrInnerWhite: {
    width: 110,
    height: 110,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGrid: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#064e3b',
    borderRadius: 4,
    padding: 4,
  },
  qrPixel: {
    width: '16.66%',
    height: '16.66%',
  },
  qrPixelFilled: {
    backgroundColor: '#ffffff',
  },
  qrPixelEmpty: {
    backgroundColor: 'transparent',
  },
  qrTokenText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#fde047',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  checkInButton: {
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkInButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
