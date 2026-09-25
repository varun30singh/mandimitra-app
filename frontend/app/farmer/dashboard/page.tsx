'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator } from 'react-native-web';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { TokenLiveTracker } from '../../../components/TokenLiveTracker';
import {
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Wheat,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function FarmerDashboard() {
  const { language, t, translateCrop } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Procurement Box & Quick Booking States
  const [showProcurementBox, setShowProcurementBox] = useState<boolean>(false);
  const [selectedCentreId, setSelectedCentreId] = useState<string>('');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('10:00 AM');
  const [bookingCrop, setBookingCrop] = useState<string>('Wheat');
  const [bookingQuantity, setBookingQuantity] = useState<string>('50');
  const [bookingSubmitting, setBookingSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const procurementBoxRef = useRef<any>(null);

  const availableSlotTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      let uStr: any = null;
      let userPhone = '';
      if (typeof window !== 'undefined') {
        try {
          const s = localStorage.getItem('mandimitra_user');
          if (s) {
            uStr = JSON.parse(s);
            userPhone = uStr.phone || uStr.mobile || '';
            setCurrentUser(uStr);
          }
        } catch {}
      }

      const farmerId = uStr?.farmerId || (userPhone === '9209281432' ? 'MH-NAS-2026-9209' : 'MH-NAS-2026-0812');
      const farmerRes = await fetchApi(`/farmers/${farmerId}`);
      if (farmerRes) {
        setFarmer(farmerRes);
        if (farmerRes.defaultCrop) setBookingCrop(farmerRes.defaultCrop);
        if (farmerRes.defaultQuantity) setBookingQuantity(String(farmerRes.defaultQuantity));
      }

      const activeTok = await fetchApi(`/queue/farmer/${farmerRes?.id || farmerId}/active`);
      setTokenData(activeTok);
      if (activeTok && activeTok.token) {
        setShowProcurementBox(true);
      }

      const centresRes = await fetchApi('/centres?lat=20.1700&lng=74.0500');
      const centreList = Array.isArray(centresRes) ? centresRes : [];
      setCentres(centreList);
      if (centreList.length > 0) {
        setSelectedCentreId((prev) => prev || centreList[0].id);
      }

      const ordersRes = await fetchApi('/orders').catch(() => []);
      setRecentOrders(Array.isArray(ordersRes) ? ordersRes : []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleQuickBookSubmit = async () => {
    const centreId = selectedCentreId || (centres.length > 0 ? centres[0].id : '1');
    const selectedCentreObj = centres.find((c) => String(c.id) === String(centreId));
    const centreName = selectedCentreObj?.name || 'Mandi Procurement Centre';

    setBookingSubmitting(true);
    setBookingError(null);

    try {
      const qVal = parseFloat(bookingQuantity) || 50;
      await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          centreId,
          centreName,
          crop: bookingCrop,
          quantity: qVal,
          slotTime: selectedSlotTime,
        }),
      });

      await loadDashboardData();
      setShowProcurementBox(true);
    } catch (err: any) {
      setBookingError(err.message || 'Failed to book slot. Please try again.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      const uStr = localStorage.getItem('mandimitra_user');
      if (uStr) setCurrentUser(JSON.parse(uStr));
    } catch {}
    loadDashboardData();

    const handleOrderSync = () => {
      fetchApi('/orders')
        .then((res) => {
          if (Array.isArray(res)) setRecentOrders(res);
        })
        .catch(() => {});
    };

    const handleCentresSync = () => {
      fetchApi('/centres?lat=20.1700&lng=74.0500')
        .then((res) => {
          if (Array.isArray(res)) setCentres(res);
        })
        .catch(() => {});
    };

    const handleProfileSync = () => {
      try {
        const uStr = localStorage.getItem('mandimitra_user');
        if (uStr) setCurrentUser(JSON.parse(uStr));
      } catch {}
      fetchApi('/farmers/MH-NAS-2026-0812')
        .then((f) => {
          if (f) setFarmer(f);
        })
        .catch(() => {});
    };

    const handleTokenSync = () => {
      loadDashboardData();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mandimitra_token_updated', handleTokenSync);
      window.addEventListener('mandimitra_orders_updated', handleOrderSync);
      window.addEventListener('mandimitra_centres_updated', handleCentresSync);
      window.addEventListener('mandimitra_profile_updated', handleProfileSync);
      window.addEventListener('storage', () => {
        handleTokenSync();
        handleOrderSync();
        handleCentresSync();
        handleProfileSync();
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mandimitra_token_updated', handleTokenSync);
        window.removeEventListener('mandimitra_orders_updated', handleOrderSync);
        window.removeEventListener('mandimitra_centres_updated', handleCentresSync);
        window.removeEventListener('mandimitra_profile_updated', handleProfileSync);
        window.removeEventListener('storage', handleOrderSync);
      }
    };
  }, []);

  return (
    <ScrollView style={styles.pageContainer} contentContainerStyle={styles.scrollContent}>
      {/* Top Greeting Card */}
      <View style={styles.greetingCard}>
        <View style={styles.greetingInfo}>
          <View style={styles.greetingTagRow}>
            <Text style={styles.greetingTagText}>{t('good_morning')},</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedBadgeText}>{t('verified')}</Text>
            </View>
          </View>

          <Text style={styles.farmerName}>
            {currentUser?.name || (farmer ? farmer.fullName : 'Farmer')}
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={13} color="#047857" />
            <Text style={styles.locationText}>
              {farmer ? `${farmer.village}, ${farmer.taluka}` : 'Pimpalgaon, Niphad'}
            </Text>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.cropText}>
              {translateCrop(farmer ? farmer.defaultCrop : 'Wheat')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={loadDashboardData}
          disabled={refreshing}
          style={styles.refreshButton}
          accessibilityLabel={t('refresh')}
        >
          <RefreshCw size={16} color="#047857" />
        </TouchableOpacity>
      </View>

      {/* Main Token & Procurement Card - ONLY displayed when user clicks 'Book Slot' or has an active token */}
      {(showProcurementBox || Boolean(tokenData?.token)) && (
        <div ref={procurementBoxRef} style={{ display: 'contents' }}>
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Wheat size={16} color="#047857" />
                <Text style={styles.sectionTitle}>{t('your_procurement')}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.syncText}>{t('live_queue_sync')}</Text>
                {!tokenData?.token && (
                  <TouchableOpacity
                    onPress={() => setShowProcurementBox(false)}
                    style={styles.closeBoxBtn}
                    accessibilityLabel={t('close')}
                  >
                    <X size={15} color="#065f46" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {tokenData?.token ? (
              <TokenLiveTracker
                tokenData={tokenData}
                onRefresh={loadDashboardData}
                compact={false}
              />
            ) : (
              <View style={styles.quickBookBox}>
                <View style={styles.quickBookHeader}>
                  <View>
                    <Text style={styles.quickBookTitle}>{t('book_procurement_slot') || 'Book Procurement Slot'}</Text>
                    <Text style={styles.quickBookSub}>Guaranteed 30-min window at nearest mandi centre</Text>
                  </View>
                  <View style={styles.guaranteePill}>
                    <Text style={styles.guaranteePillText}>Instant Pass</Text>
                  </View>
                </View>

                {bookingError && (
                  <View style={styles.quickBookError}>
                    <Text style={styles.quickBookErrorText}>{bookingError}</Text>
                  </View>
                )}

                {/* 1. Centre Selection */}
                <View style={styles.qbFieldGroup}>
                  <Text style={styles.qbFieldLabel}>{t('step_1_centre') || '1. Select Procurement Centre'}</Text>
                  <View style={styles.qbSelectWrapper}>
                    <select
                      value={selectedCentreId}
                      onChange={(e) => setSelectedCentreId(e.target.value)}
                      style={htmlSelectStyle}
                    >
                      {centres.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.distanceKm || 3.5} km • {c.waitLevel || 'Low'} Wait)
                        </option>
                      ))}
                    </select>
                  </View>
                </View>

                {/* 2. Slot Window Selection */}
                <View style={styles.qbFieldGroup}>
                  <Text style={styles.qbFieldLabel}>{t('step_3_slot') || '2. Select Arrival Slot'}</Text>
                  <View style={styles.slotsRow}>
                    {availableSlotTimes.map((time) => {
                      const isSelected = selectedSlotTime === time;
                      return (
                        <TouchableOpacity
                          key={time}
                          onPress={() => setSelectedSlotTime(time)}
                          style={[styles.slotPill, isSelected && styles.slotPillActive]}
                        >
                          <Clock size={12} color={isSelected ? '#ffffff' : '#047857'} />
                          <Text style={[styles.slotPillText, isSelected && styles.slotPillTextActive]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* 3. Crop & Quantity Row */}
                <View style={styles.qbRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.qbFieldLabel}>Crop</Text>
                    <View style={styles.qbSelectWrapper}>
                      <select
                        value={bookingCrop}
                        onChange={(e) => setBookingCrop(e.target.value)}
                        style={htmlSelectStyle}
                      >
                        <option value="Wheat">Wheat (MSP: ₹2,275/qtl)</option>
                        <option value="Onion">Onion (Graded Red)</option>
                        <option value="Soybean">Soybean (MSP: ₹4,892/qtl)</option>
                        <option value="Gram">Gram / Chana (MSP: ₹5,440/qtl)</option>
                      </select>
                    </View>
                  </View>

                  <View style={{ width: 120 }}>
                    <Text style={styles.qbFieldLabel}>Qty ({t('qtl') || 'qtl'})</Text>
                    <TextInput
                      value={bookingQuantity}
                      onChangeText={setBookingQuantity}
                      keyboardType="numeric"
                      style={styles.qbTextInput}
                      placeholder="50"
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.qbActionRow}>
                  <TouchableOpacity
                    onPress={handleQuickBookSubmit}
                    disabled={bookingSubmitting}
                    style={styles.qbSubmitBtn}
                  >
                    {bookingSubmitting ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <>
                        <CheckCircle2 size={16} color="#ffffff" />
                        <Text style={styles.qbSubmitBtnText}>
                          {t('confirm_generate_token') || 'Confirm Slot & Get Token'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <Link href={`/farmer/book${selectedCentreId ? `?centreId=${selectedCentreId}` : ''}`} style={{ textDecoration: 'none' }}>
                    <View style={styles.qbAdvancedBtn}>
                      <Text style={styles.qbAdvancedBtnText}>Full Form</Text>
                      <ArrowRight size={13} color="#047857" />
                    </View>
                  </Link>
                </View>
              </View>
            )}
          </View>
        </div>
      )}

      {/* Quick Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setShowProcurementBox(true);
            setTimeout(() => {
              if (procurementBoxRef.current) {
                procurementBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
          style={{ flex: 1 }}
        >
          <View style={styles.primaryActionCard}>
            <Calendar size={20} color="#fde047" style={{ marginBottom: 6 }} />
            <View>
              <Text style={styles.primaryActionTitle}>{t('book_slot')}</Text>
              <Text style={styles.primaryActionSub}>{t('book_slot_sub')}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Link href="/farmer/recommendation" style={{ textDecoration: 'none', flex: 1 }}>
          <View style={styles.secondaryActionCard}>
            <Sparkles size={20} color="#047857" style={{ marginBottom: 6 }} />
            <View>
              <Text style={styles.secondaryActionTitle}>{t('best_mandi')}</Text>
              <Text style={styles.secondaryActionSub}>{t('zero_wait_prediction')}</Text>
            </View>
          </View>
        </Link>
      </View>

      {/* Live Interconnected Mandi Orders */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <ShoppingBag size={16} color="#047857" />
            <Text style={styles.sectionTitle}>Live Mandi Market Orders</Text>
          </View>
          <Link href="/farmer/procurement" style={{ textDecoration: 'none' }}>
            <Text style={styles.viewAllText}>{t('view_all')}</Text>
          </Link>
        </View>

        {recentOrders.length === 0 ? (
          <View style={styles.emptyOrdersCard}>
            <Text style={styles.emptyOrdersText}>No active market procurement orders yet.</Text>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {recentOrders.slice(0, 2).map((ord) => {
              const isApproved = ord.status === 'APPROVED' || ord.status === 'COMPLETED' || ord.status === 'VERIFIED';
              return (
                <View key={ord.id} style={styles.liveOrderCard}>
                  <View style={styles.liveOrderHeader}>
                    <View style={styles.orderIdTag}>
                      <Text style={styles.orderIdText}>MM-ORD-00{ord.id}</Text>
                    </View>
                    <View style={[styles.orderStatusPill, isApproved ? styles.statusPillApproved : styles.statusPillPending]}>
                      <Text style={[styles.orderStatusPillText, isApproved ? styles.statusPillTextApproved : styles.statusPillTextPending]}>
                        {ord.status || 'PENDING'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.liveOrderBody}>
                    <View>
                      <Text style={styles.liveOrderCropTitle}>
                        {translateCrop(ord.crop || 'Wheat')} — {ord.quantity || 20} qtl
                      </Text>
                      <Text style={styles.liveOrderMetaSub}>
                        Buyer #{ord.buyerId || '201'} • Broker #{ord.brokerId || '301'}
                      </Text>
                    </View>

                    <View style={styles.liveOrderAmountBox}>
                      <Text style={styles.liveOrderAmountLabel}>Value</Text>
                      <Text style={styles.liveOrderAmountValue}>
                        ₹{Number(ord.amount || 0).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>

                  <Link href="/farmer/procurement" style={{ textDecoration: 'none' }}>
                    <View style={styles.liveOrderFooter}>
                      <Text style={styles.liveOrderFooterText}>Track in Procurement Ledger</Text>
                      <ArrowRight size={12} color="#047857" />
                    </View>
                  </Link>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Nearby Centres Cards */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MapPin size={16} color="#047857" />
            <Text style={styles.sectionTitle}>{t('nearby_centres')}</Text>
          </View>
          <Link href="/farmer/centres" style={{ textDecoration: 'none' }}>
            <Text style={styles.viewAllText}>{t('view_all')}</Text>
          </Link>
        </View>

        <View style={styles.centresList}>
          {centres.slice(0, 3).map((c) => {
            const isFull = c.waitLevel === 'Full';
            const isBusy = c.waitLevel === 'Busy' || c.waitLevel === 'Moderate';

            const waitLabel =
              c.waitLevel === 'Low'
                ? t('wait_low')
                : c.waitLevel === 'Busy'
                ? t('wait_busy')
                : c.waitLevel === 'Moderate'
                ? t('wait_moderate')
                : t('wait_full');

            return (
              <View key={c.id} style={styles.centreCard}>
                <View style={styles.centreCardHeader}>
                  <View>
                    <Text style={styles.centreName}>{c.name}</Text>
                    <View style={styles.centreMetaRow}>
                      <Text style={styles.centreDistance}>{c.distanceKm} km {t('away')}</Text>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.centreTaluka}>{c.taluka}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.waitBadge,
                      isFull
                        ? styles.waitBadgeFull
                        : isBusy
                        ? styles.waitBadgeBusy
                        : styles.waitBadgeLow,
                    ]}
                  >
                    <Text
                      style={[
                        styles.waitBadgeText,
                        isFull
                          ? styles.waitBadgeTextFull
                          : isBusy
                          ? styles.waitBadgeTextBusy
                          : styles.waitBadgeTextLow,
                      ]}
                    >
                      {waitLabel}
                    </Text>
                  </View>
                </View>

                {/* 3 Metric Pills */}
                <View style={styles.centreMetricsRow}>
                  <View style={styles.centreMetricBox}>
                    <Text style={styles.centreMetricLabel}>{t('queue')}</Text>
                    <Text style={styles.centreMetricValue}>{c.currentQueue}</Text>
                  </View>
                  <View style={styles.centreMetricBox}>
                    <Text style={styles.centreMetricLabel}>{t('est_wait')}</Text>
                    <Text style={styles.centreMetricValueGreen}>~{c.estimatedWaitMinutes}m</Text>
                  </View>
                  <View style={styles.centreMetricBox}>
                    <Text style={styles.centreMetricLabel}>{t('open_slots')}</Text>
                    <Text style={styles.centreMetricValue}>{c.availableSlots}</Text>
                  </View>
                </View>

                <View style={styles.centreCardFooter}>
                  <Text style={styles.speedText}>
                    {t('speed_format', { min: c.processingSpeed })}
                  </Text>
                  <Link href={`/farmer/book?centreId=${c.id}`} style={{ textDecoration: 'none' }}>
                    <View style={styles.selectButton}>
                      <Text style={styles.selectButtonText}>{t('select')}</Text>
                      <ArrowRight size={12} color="#ffffff" />
                    </View>
                  </Link>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const htmlSelectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '14px',
  border: 'none',
  backgroundColor: '#f0fdf4',
  fontSize: '13px',
  fontWeight: '600',
  color: '#064e3b',
  outline: 'none',
  cursor: 'pointer',
};

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 16,
  },
  greetingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d1fae5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  greetingInfo: {
    gap: 3,
  },
  greetingTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
    textTransform: 'uppercase',
  },
  verifiedBadge: {
    backgroundColor: '#d1fae5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  verifiedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#064e3b',
  },
  farmerName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#064e3b',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#064e3b',
  },
  bullet: {
    fontSize: 11,
    color: '#047857',
  },
  cropText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBlock: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#064e3b',
  },
  syncText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryActionCard: {
    backgroundColor: '#047857',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryActionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  primaryActionSub: {
    color: '#d1fae5',
    fontSize: 10,
    marginTop: 2,
  },
  secondaryActionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  secondaryActionTitle: {
    color: '#064e3b',
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryActionSub: {
    color: '#047857',
    fontSize: 10,
    marginTop: 2,
  },
  centresList: {
    gap: 10,
  },
  centreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#d1fae5',
    gap: 10,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  centreCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  centreName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#064e3b',
  },
  centreMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  centreDistance: {
    fontSize: 11,
    color: '#047857',
  },
  centreTaluka: {
    fontSize: 11,
    color: '#047857',
  },
  waitBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  waitBadgeLow: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  waitBadgeBusy: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  waitBadgeFull: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  waitBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  waitBadgeTextLow: {
    color: '#064e3b',
  },
  waitBadgeTextBusy: {
    color: '#92400e',
  },
  waitBadgeTextFull: {
    color: '#991b1b',
  },
  centreMetricsRow: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  centreMetricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centreMetricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857',
  },
  centreMetricValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#064e3b',
    marginTop: 2,
  },
  centreMetricValueGreen: {
    fontSize: 13,
    fontWeight: '900',
    color: '#047857',
    marginTop: 2,
  },
  centreCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  speedText: {
    fontSize: 10,
    color: '#047857',
  },
  selectButton: {
    backgroundColor: '#047857',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  ordersList: {
    gap: 10,
  },
  emptyOrdersCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  emptyOrdersText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  liveOrderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  liveOrderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderIdTag: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  orderIdText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  orderStatusPill: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusPillPending: {
    backgroundColor: '#fef3c7',
  },
  statusPillApproved: {
    backgroundColor: '#dcfce7',
  },
  orderStatusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusPillTextPending: {
    color: '#92400e',
  },
  statusPillTextApproved: {
    color: '#166534',
  },
  liveOrderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveOrderCropTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  liveOrderMetaSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  liveOrderAmountBox: {
    alignItems: 'flex-end',
  },
  liveOrderAmountLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  liveOrderAmountValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#047857',
  },
  liveOrderFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  liveOrderFooterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  closeBoxBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  quickBookBox: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#d1fae5',
    gap: 16,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  quickBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  quickBookTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#064e3b',
  },
  quickBookSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#047857',
    marginTop: 2,
  },
  guaranteePill: {
    backgroundColor: '#d1fae5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  guaranteePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065f46',
    textTransform: 'uppercase',
  },
  qbFieldGroup: {
    gap: 6,
  },
  qbFieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064e3b',
    textTransform: 'uppercase',
  },
  qbSelectWrapper: {
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 14,
    backgroundColor: '#f0fdf4',
    overflow: 'hidden',
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 2,
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  slotPillActive: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  slotPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  slotPillTextActive: {
    color: '#ffffff',
  },
  qbRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  qbTextInput: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#064e3b',
  },
  qbActionRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  qbSubmitBtn: {
    flex: 1,
    backgroundColor: '#047857',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  qbSubmitBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  qbAdvancedBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qbAdvancedBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  quickBookError: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  quickBookErrorText: {
    color: '#b91c1c',
    fontSize: 12,
    fontWeight: '600',
  },
});
