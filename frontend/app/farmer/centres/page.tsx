'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { View, Text, ScrollView, StyleSheet } from 'react-native-web';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function FarmerCentresPage() {
  const { language, t } = useLanguage();
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/centres').then((res) => {
      setCentres(res);
      setLoading(false);
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.pageTitle}>{t('nearby_centres')}</Text>
          <Text style={styles.pageSubtitle}>
            Real-time live queue and wait times across all mandis
          </Text>
        </View>

        <Link href="/farmer/recommendation" style={{ textDecoration: 'none' }}>
          <View style={styles.aiPickButton}>
            <Sparkles size={13} color="#047857" />
            <Text style={styles.aiPickButtonText}>
              {language === 'hi' ? 'स्मार्ट सुझाव' : 'AI Pick'}
            </Text>
          </View>
        </Link>
      </View>

      <View style={styles.cardsList}>
        {centres.map((c) => {
          const isFull = c.waitLevel === 'Full';
          const isBusy = c.waitLevel === 'Busy' || c.waitLevel === 'Moderate';

          return (
            <View key={c.id} style={styles.centreCard}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <View style={styles.codeBadge}>
                    <Text style={styles.codeBadgeText}>{c.code}</Text>
                  </View>
                  <Text style={styles.centreName}>{c.name}</Text>
                  <View style={styles.metaRow}>
                    <MapPin size={12} color="#047857" />
                    <Text style={styles.metaText}>
                      {c.distanceKm} km away • {c.taluka}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.waitLevelBadge,
                    isFull
                      ? styles.waitLevelFull
                      : isBusy
                      ? styles.waitLevelBusy
                      : styles.waitLevelLow,
                  ]}
                >
                  <Text
                    style={[
                      styles.waitLevelText,
                      isFull
                        ? styles.waitLevelTextFull
                        : isBusy
                        ? styles.waitLevelTextBusy
                        : styles.waitLevelTextLow,
                    ]}
                  >
                    {c.waitLevel}
                  </Text>
                </View>
              </View>

              {/* 4 Metric Boxes */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Queue</Text>
                  <Text style={styles.metricVal}>{c.currentQueue}</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Wait</Text>
                  <Text style={styles.metricValGreen}>~{c.estimatedWaitMinutes}m</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Capacity</Text>
                  <Text style={styles.metricVal}>{c.capacityUtilization}%</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Slots</Text>
                  <Text style={styles.metricValGreen}>{c.availableSlots}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.speedLabel}>Speed: ~{c.processingSpeed}m/farmer</Text>
                <Link href={`/farmer/book?centreId=${c.id}`} style={{ textDecoration: 'none' }}>
                  <View style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Book Slot</Text>
                    <ArrowRight size={12} color="#ffffff" />
                  </View>
                </Link>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
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
  pageTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064e3b',
  },
  pageSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  aiPickButton: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiPickButtonText: {
    color: '#064e3b',
    fontSize: 11,
    fontWeight: '800',
  },
  cardsList: {
    gap: 12,
  },
  centreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#d1fae5',
    gap: 12,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  codeBadge: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  codeBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#047857',
  },
  centreName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#064e3b',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaText: {
    fontSize: 11,
    color: '#047857',
  },
  waitLevelBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  waitLevelLow: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  waitLevelBusy: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  waitLevelFull: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  waitLevelText: {
    fontSize: 9,
    fontWeight: '800',
  },
  waitLevelTextLow: {
    color: '#064e3b',
  },
  waitLevelTextBusy: {
    color: '#92400e',
  },
  waitLevelTextFull: {
    color: '#991b1b',
  },
  metricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#047857',
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#064e3b',
    marginTop: 2,
  },
  metricValGreen: {
    fontSize: 13,
    fontWeight: '900',
    color: '#047857',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  speedLabel: {
    fontSize: 10,
    color: '#047857',
  },
  bookButton: {
    backgroundColor: '#047857',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#047857',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
});
