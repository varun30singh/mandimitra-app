'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web';
import { useLanguage } from '../../../lib/language-context';
import { fetchApi } from '../../../lib/api';
import {
  Clock,
  MapPin,
  Wheat,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function BookSlotContent() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCentreId = searchParams.get('centreId');

  const [centres, setCentres] = useState<any[]>([]);
  const [selectedCentreId, setSelectedCentreId] = useState<string>('');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [crop, setCrop] = useState<string>('Wheat');
  const [quantity, setQuantity] = useState<string>('85');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available crop options
  const cropOptions = [
    { label: 'Wheat / गेहूँ (MSP: ₹2,275)', value: 'Wheat' },
    { label: 'Onion / प्याज (Graded Red)', value: 'Onion' },
    { label: 'Soybean / सोयाबीन (MSP: ₹4,892)', value: 'Soybean' },
    { label: 'Gram (Chana) / चना (MSP: ₹5,440)', value: 'Gram' },
  ];

  // Load centres
  useEffect(() => {
    fetchApi('/centres').then((res) => {
      setCentres(res);
      if (preselectedCentreId) {
        setSelectedCentreId(preselectedCentreId);
      } else if (res.length > 0) {
        const centreB = res.find((c: any) => c.code === 'MANDI-NPH') || res[0];
        setSelectedCentreId(centreB.id);
      }
    });
  }, [preselectedCentreId]);

  // Load slots whenever centre changes
  useEffect(() => {
    if (!selectedCentreId) return;

    setLoadingSlots(true);
    setSelectedSlotId('');
    fetchApi(`/slots/centre/${selectedCentreId}`)
      .then((res) => {
        setSlots(res);
        const available = res.find((s: any) => s.status !== 'Full');
        if (available) setSelectedSlotId(available.id);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSlots(false));
  }, [selectedCentreId]);

  const handleBooking = async () => {
    if (!selectedSlotId || !selectedCentreId) return;

    setBookingLoading(true);
    setError(null);

    try {
      const farmer = await fetchApi('/farmers/MH-NAS-2026-0812');

      const result = await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          farmerId: farmer.id,
          centreId: selectedCentreId,
          slotId: selectedSlotId,
          crop,
          quantity: parseFloat(quantity) || 85,
        }),
      });

      router.push(`/farmer/token?token=${result.token.tokenNumber}&new=true`);
    } catch (err: any) {
      setError(err.message || 'Failed to book slot');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'hi' ? 'खरीद स्लॉट बुकिंग' : (language === 'mr' ? 'खरेदी स्लॉट बुकिंग' : 'Book Procurement Slot')}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'hi'
            ? 'अपनी पसंद का केंद्र, फसल और 30-मिनट का स्लॉट चुनें। टोकन तुरंत जारी होगा।'
            : 'Select centre, crop, and guaranteed 30-minute arrival window.'}
        </Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <AlertCircle size={16} color="#991b1b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Main Form Card */}
      <View style={styles.formCard}>
        {/* Step 1: Select Centre */}
        <View style={styles.stepSection}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitleRow}>
              <MapPin size={14} color="#047857" />
              <Text style={styles.stepTitle}>
                1. {language === 'hi' ? 'खरीद केंद्र चुनें' : 'Select Procurement Centre'}
              </Text>
            </View>
            <Text style={styles.stepHint}>
              {language === 'hi' ? 'अनुशंसित: केंद्र B' : 'Recommended: Centre B'}
            </Text>
          </View>

          <View style={styles.centresList}>
            {centres.map((c) => {
              const selected = c.id === selectedCentreId;
              const isRecommended = c.code === 'MANDI-NPH';

              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCentreId(c.id)}
                  style={[styles.centreTile, selected && styles.centreTileSelected]}
                >
                  {isRecommended && (
                    <View style={styles.bestChoiceBadge}>
                      <Sparkles size={10} color="#064e3b" />
                      <Text style={styles.bestChoiceText}>Best Choice</Text>
                    </View>
                  )}
                  <Text style={styles.centreTileName}>{c.name}</Text>
                  <Text style={styles.centreTileSub}>{c.address}, {c.taluka}</Text>
                  <View style={styles.centreTileMeta}>
                    <Text style={styles.metaItem}>{c.distanceKm} km</Text>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.metaItem}>Queue: {c.currentQueue}</Text>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.metaItem}>Wait: ~{c.estimatedWaitMinutes}m</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Step 2: Produce & Quantity */}
        <View style={styles.stepSection}>
          <View style={styles.stepTitleRow}>
            <Wheat size={14} color="#047857" />
            <Text style={styles.stepTitle}>
              2. {language === 'hi' ? 'फसल एवं मात्रा' : 'Crop & Quantity'}
            </Text>
          </View>

          <View style={styles.cropSelectorRow}>
            {cropOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                activeOpacity={0.8}
                onPress={() => setCrop(opt.value)}
                style={[styles.cropChip, crop === opt.value && styles.cropChipSelected]}
              >
                <Text style={[styles.cropChipText, crop === opt.value && styles.cropChipTextSelected]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {language === 'hi' ? 'अनुमानित मात्रा (क्विंटल)' : 'Approx Quantity (Quintals)'}
            </Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="e.g. 85"
              placeholderTextColor="#9ca3af"
              style={styles.textInput}
            />
          </View>
        </View>

        {/* Step 3: Dynamic Slot Selection */}
        <View style={styles.stepSection}>
          <View style={styles.stepHeader}>
            <View style={styles.stepTitleRow}>
              <Clock size={14} color="#047857" />
              <Text style={styles.stepTitle}>
                3. {language === 'hi' ? '30-मिनट का स्लॉट चुनें' : 'Select 30-Min Arrival Slot'}
              </Text>
            </View>
            <Text style={styles.stepHint}>Today</Text>
          </View>

          {loadingSlots ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#047857" />
              <Text style={styles.loadingText}>Loading available slots...</Text>
            </View>
          ) : (
            <View style={styles.slotsGrid}>
              {slots.map((s) => {
                const isSelected = s.id === selectedSlotId;
                const isFull = s.status === 'Full';
                const isLimited = s.status === 'Limited';

                return (
                  <TouchableOpacity
                    key={s.id}
                    activeOpacity={0.8}
                    disabled={isFull}
                    onPress={() => setSelectedSlotId(s.id)}
                    style={[
                      styles.slotTile,
                      isSelected
                        ? styles.slotTileSelected
                        : isFull
                        ? styles.slotTileFull
                        : isLimited
                        ? styles.slotTileLimited
                        : styles.slotTileDefault,
                    ]}
                  >
                    <Text
                      style={[
                        styles.slotTime,
                        isSelected ? styles.slotTimeSelected : styles.slotTimeDefault,
                      ]}
                    >
                      {s.startTime} - {s.endTime}
                    </Text>
                    <Text
                      style={[
                        styles.slotWindow,
                        isSelected ? styles.slotWindowSelected : styles.slotWindowDefault,
                      ]}
                    >
                      {s.timeWindow}
                    </Text>
                    <View style={styles.slotFooter}>
                      <Text
                        style={[
                          styles.slotStatus,
                          isSelected ? styles.slotStatusSelected : styles.slotStatusDefault,
                        ]}
                      >
                        {s.status}
                      </Text>
                      <Text
                        style={[
                          styles.slotSpots,
                          isSelected ? styles.slotSpotsSelected : styles.slotSpotsDefault,
                        ]}
                      >
                        {s.remainingCapacity} spots
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleBooking}
          disabled={bookingLoading || !selectedSlotId}
          style={[styles.submitButton, (!selectedSlotId || bookingLoading) && styles.submitButtonDisabled]}
        >
          {bookingLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>
                {language === 'hi' ? 'पुष्टि करें एवं टोकन प्राप्त करें' : 'Confirm & Generate Token'}
              </Text>
              <ArrowRight size={16} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.footerGuarantees}>
          ✓ Instant digital token • Anti-overbooking buffer protected
        </Text>
      </View>
    </ScrollView>
  );
}

export default function BookSlotPage() {
  return (
    <Suspense fallback={<View style={{ padding: 32, alignItems: 'center' }}><ActivityIndicator size="small" color="#047857" /></View>}>
      <BookSlotContent />
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
  header: {
    paddingHorizontal: 4,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064e3b',
  },
  subtitle: {
    fontSize: 11,
    color: '#047857',
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
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#d1fae5',
    gap: 18,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  stepSection: {
    gap: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064e3b',
  },
  stepHint: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
  },
  centresList: {
    gap: 8,
  },
  centreTile: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 16,
    padding: 12,
    gap: 2,
    position: 'relative',
  },
  centreTileSelected: {
    borderColor: '#047857',
    backgroundColor: '#ecfdf5',
    borderWidth: 2,
  },
  bestChoiceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fde047',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bestChoiceText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#064e3b',
  },
  centreTileName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064e3b',
  },
  centreTileSub: {
    fontSize: 10,
    color: '#047857',
  },
  centreTileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  metaItem: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
  },
  bullet: {
    fontSize: 10,
    color: '#a7f3d0',
  },
  cropSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cropChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1fae5',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  cropChipSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#047857',
    borderWidth: 1.5,
  },
  cropChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#064e3b',
  },
  cropChipTextSelected: {
    fontWeight: '800',
    color: '#047857',
  },
  inputGroup: {
    gap: 4,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#064e3b',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#064e3b',
  },
  loadingBox: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  loadingText: {
    fontSize: 11,
    color: '#047857',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotTile: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    gap: 2,
  },
  slotTileDefault: {
    backgroundColor: '#ffffff',
    borderColor: '#d1fae5',
  },
  slotTileSelected: {
    backgroundColor: '#047857',
    borderColor: '#047857',
  },
  slotTileLimited: {
    backgroundColor: '#fef3c7',
    borderColor: '#fde68a',
  },
  slotTileFull: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    opacity: 0.5,
  },
  slotTime: {
    fontSize: 12,
    fontWeight: '800',
  },
  slotTimeDefault: {
    color: '#064e3b',
  },
  slotTimeSelected: {
    color: '#ffffff',
  },
  slotWindow: {
    fontSize: 9,
  },
  slotWindowDefault: {
    color: '#047857',
  },
  slotWindowSelected: {
    color: '#d1fae5',
  },
  slotFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  slotStatus: {
    fontSize: 9,
    fontWeight: '700',
  },
  slotStatusDefault: {
    color: '#047857',
  },
  slotStatusSelected: {
    color: '#fde047',
  },
  slotSpots: {
    fontSize: 9,
    fontWeight: '600',
  },
  slotSpotsDefault: {
    color: '#047857',
  },
  slotSpotsSelected: {
    color: '#ffffff',
  },
  submitButton: {
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
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  footerGuarantees: {
    fontSize: 10,
    color: '#047857',
    textAlign: 'center',
  },
});
