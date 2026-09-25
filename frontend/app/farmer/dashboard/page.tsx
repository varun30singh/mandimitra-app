'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native-web';
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
} from 'lucide-react';

export default function FarmerDashboard() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [farmer, setFarmer] = useState<any>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [centres, setCentres] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const farmerRes = await fetchApi('/farmers/MH-NAS-2026-0812');
      setFarmer(farmerRes);

      const activeTok = await fetchApi(`/queue/farmer/${farmerRes.id}/active`);
      setTokenData(activeTok);

      const centresRes = await fetchApi('/centres?lat=20.1700&lng=74.0500');
      setCentres(centresRes);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
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

          <Text style={styles.farmerName}>{farmer ? farmer.fullName : 'Ramesh Kumar'}</Text>

          <View style={styles.locationRow}>
            <MapPin size={13} color="#047857" />
            <Text style={styles.locationText}>
              {farmer ? `${farmer.village}, ${farmer.taluka}` : 'Pimpalgaon, Niphad'}
            </Text>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.cropText}>
              {language === 'mr' ? 'गहू' : language === 'hi' ? 'गेहूँ' : 'Wheat'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={loadDashboardData}
          disabled={refreshing}
          style={styles.refreshButton}
          accessibilityLabel="Refresh Dashboard"
        >
          <RefreshCw size={16} color="#047857" />
        </TouchableOpacity>
      </View>

      {/* Main Token & Procurement Card */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Wheat size={16} color="#047857" />
            <Text style={styles.sectionTitle}>{t('your_procurement')}</Text>
          </View>
          <Text style={styles.syncText}>{t('live_queue_sync')}</Text>
        </View>

        <TokenLiveTracker
          tokenData={tokenData}
          onRefresh={loadDashboardData}
          compact={false}
        />
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionRow}>
        <Link href="/farmer/book" style={{ textDecoration: 'none', flex: 1 }}>
          <View style={styles.primaryActionCard}>
            <Calendar size={20} color="#fde047" style={{ marginBottom: 6 }} />
            <View>
              <Text style={styles.primaryActionTitle}>{t('book_slot')}</Text>
              <Text style={styles.primaryActionSub}>{t('book_slot_sub')}</Text>
            </View>
          </View>
        </Link>

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
                    {t('speed')}: ~{c.processingSpeed} {t('per_farmer')}
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
});
