'use client';

import React from 'react';
import Link from 'next/link';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native-web';
import { useLanguage } from '../lib/language-context';
import {
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface TokenTrackerProps {
  tokenData: any;
  onRefresh?: () => void;
  compact?: boolean;
}

export const TokenLiveTracker: React.FC<TokenTrackerProps> = ({
  tokenData,
  onRefresh,
  compact = false,
}) => {
  const { language, t } = useLanguage();

  if (!tokenData || !tokenData.token) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconBox}>
          <Clock size={24} color="#047857" />
        </View>
        <Text style={styles.emptyTitle}>
          {language === 'hi'
            ? 'आज के लिए कोई सक्रिय टोकन नहीं'
            : language === 'mr'
            ? 'आजसाठी कोणताही सक्रिय टोकन नाही'
            : 'No Active Procurement Token Today'}
        </Text>
        <Text style={styles.emptySubtitle}>
          {language === 'hi'
            ? 'बिना इंतज़ार अपनी फसल बेचने के लिए स्मार्ट केंद्र चुनें और टोकन स्लॉट बुक करें।'
            : 'Avoid waiting in long mandi lines. Schedule a guaranteed appointment slot.'}
        </Text>
        <View style={styles.emptyActions}>
          <Link href="/farmer/book" style={{ textDecoration: 'none' }}>
            <View style={styles.bookButton}>
              <Text style={styles.bookButtonText}>{t('book_slot')}</Text>
              <ArrowRight size={14} color="#ffffff" />
            </View>
          </Link>
          <Link href="/farmer/recommendation" style={{ textDecoration: 'none' }}>
            <View style={styles.recButton}>
              <Text style={styles.recButtonText}>{t('get_recommendation')}</Text>
            </View>
          </Link>
        </View>
      </View>
    );
  }

  const {
    token,
    centre,
    currentServing,
    nextInLine,
    queuePosition,
    farmersAhead,
    estimatedWaitMinutes,
    estimatedCallTime,
    recommendedDepartureTime,
    arrivalStatus,
    statusMessage,
    subMessage,
  } = tokenData;

  const isDepartureAlert = arrivalStatus === 'START_TRAVEL' || arrivalStatus === 'GET_READY';
  const isDoNotLeave = arrivalStatus === 'DO_NOT_LEAVE_YET';

  return (
    <View style={styles.cardContainer}>
      {/* Top Advisory Banner */}
      <View
        style={[
          styles.banner,
          isDepartureAlert
            ? styles.bannerAlert
            : isDoNotLeave
            ? styles.bannerWait
            : styles.bannerReady,
        ]}
      >
        <View style={styles.bannerLeft}>
          <View style={styles.bannerIconBox}>
            {isDepartureAlert ? (
              <Truck size={18} color="#ffffff" />
            ) : isDoNotLeave ? (
              <Clock size={18} color="#ffffff" />
            ) : (
              <CheckCircle2 size={18} color="#ffffff" />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerBadge}>
              {language === 'hi' ? 'प्रस्थान सलाह' : 'Departure Guide'}
            </Text>
            <Text style={styles.bannerTitle}>{statusMessage}</Text>
            <Text style={styles.bannerSub}>{subMessage}</Text>
          </View>
        </View>

        {isDoNotLeave && (
          <View style={styles.departureBox}>
            <Text style={styles.departureBoxLabel}>Depart At</Text>
            <Text style={styles.departureBoxTime}>{recommendedDepartureTime}</Text>
          </View>
        )}
      </View>

      {/* Main Token Info Card */}
      <View style={styles.tokenBody}>
        {/* Token Number & Details */}
        <View style={styles.tokenRow}>
          <View>
            <Text style={styles.tokenLabel}>YOUR TOKEN</Text>
            <Text style={styles.tokenNumber}>{token.tokenNumber}</Text>
            <View style={styles.mandiLocation}>
              <MapPin size={13} color="#047857" />
              <Text style={styles.mandiLocationText}>{centre.name}</Text>
            </View>
          </View>

          <View style={styles.tokenRight}>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{token.status}</Text>
            </View>
            <Text style={styles.tokenSlotText}>Slot: {token.appointmentTime}</Text>
            <Text style={styles.tokenCropText}>
              {token.booking?.crop} • {token.booking?.quantity} qtl
            </Text>
          </View>
        </View>

        {/* 4 Metric Boxes */}
        <View style={styles.grid2x2}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Users size={12} color="#047857" />
              <Text style={styles.metricLabel}>Farmers Ahead</Text>
            </View>
            <Text style={styles.metricValueLarge}>{farmersAhead}</Text>
            <Text style={styles.metricSub}>Position #{queuePosition}</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Clock size={12} color="#047857" />
              <Text style={styles.metricLabel}>Est. Wait</Text>
            </View>
            <Text style={styles.metricValueGreen}>
              {estimatedWaitMinutes} <Text style={{ fontSize: 13, fontWeight: '500' }}>min</Text>
            </Text>
            <Text style={styles.metricSub}>Turn ~{estimatedCallTime}</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Now Serving</Text>
            <Text style={styles.metricValueGreenDark}>
              {currentServing ? currentServing.tokenNumber : 'B-035'}
            </Text>
            <Text style={styles.metricSub}>Counter #1</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Next in Line</Text>
            <Text style={styles.metricValueAmber}>
              {nextInLine ? nextInLine.tokenNumber : 'B-036'}
            </Text>
            <Text style={styles.metricSub}>Counter #2</Text>
          </View>
        </View>

        {/* Track Full Page CTA */}
        {!compact && (
          <Link href="/farmer/token" style={{ textDecoration: 'none' }}>
            <View style={styles.fullTrackButton}>
              <Clock size={16} color="#ffffff" />
              <Text style={styles.fullTrackButtonText}>{t('track_my_token')}</Text>
            </View>
          </Link>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#064e3b',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'center',
    maxWidth: 280,
  },
  emptyActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  bookButton: {
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  recButton: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  recButtonText: {
    color: '#064e3b',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#a7f3d0',
    overflow: 'hidden',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  banner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  bannerAlert: {
    backgroundColor: '#d97706',
  },
  bannerWait: {
    backgroundColor: '#064e3b',
  },
  bannerReady: {
    backgroundColor: '#047857',
  },
  bannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#fef3c7',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ffffff',
  },
  bannerSub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  departureBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  departureBoxLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#a7f3d0',
  },
  departureBoxTime: {
    fontSize: 11,
    fontWeight: '900',
    color: '#ffffff',
  },
  tokenBody: {
    padding: 16,
    gap: 14,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ecfdf5',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  tokenLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  tokenNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#064e3b',
    letterSpacing: -0.5,
  },
  mandiLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  mandiLocationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
  },
  tokenRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  statusPill: {
    backgroundColor: '#d1fae5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#064e3b',
  },
  tokenSlotText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    marginTop: 2,
  },
  tokenCropText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#064e3b',
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
    textTransform: 'uppercase',
  },
  metricValueLarge: {
    fontSize: 22,
    fontWeight: '900',
    color: '#064e3b',
    marginVertical: 2,
  },
  metricValueGreen: {
    fontSize: 22,
    fontWeight: '900',
    color: '#047857',
    marginVertical: 2,
  },
  metricValueGreenDark: {
    fontSize: 19,
    fontWeight: '900',
    color: '#064e3b',
    marginVertical: 2,
  },
  metricValueAmber: {
    fontSize: 19,
    fontWeight: '900',
    color: '#d97706',
    marginVertical: 2,
  },
  metricSub: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
  },
  fullTrackButton: {
    backgroundColor: '#047857',
    borderRadius: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  fullTrackButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
});
