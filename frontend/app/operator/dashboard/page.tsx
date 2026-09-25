'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native-web';
import { useRoleGuard } from '../../../lib/useRoleGuard';
import { fetchApi } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Layers,
  Calendar,
  Building2,
  Wheat,
  RefreshCw,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Edit2,
  Save,
  X,
  AlertCircle,
  LogOut,
  ShoppingBag,
} from 'lucide-react';

type Tab = 'queue' | 'slots' | 'centres' | 'crops' | 'orders';

export default function OperatorDashboard() {
  const router = useRouter();
  const { authorized, user } = useRoleGuard(['operator', 'admin']);
  const [activeTab, setActiveTab] = useState<Tab>('queue');

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mandimitra_token');
      localStorage.removeItem('mandimitra_user');
    }
    router.replace('/login');
  };

  // Loading & notification states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Data states
  const [queueItems, setQueueItems] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);
  const [crops, setCrops] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Action states: advancing queue item or approving order
  const [updatingQueueId, setUpdatingQueueId] = useState<number | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Form states: Create Slot
  const [slotCentreId, setSlotCentreId] = useState<string>('');
  const [slotCropId, setSlotCropId] = useState<string>('');
  const [slotDate, setSlotDate] = useState<string>('2026-09-28');
  const [slotStartTime, setSlotStartTime] = useState<string>('09:00');
  const [slotEndTime, setSlotEndTime] = useState<string>('10:00');
  const [slotCapacity, setSlotCapacity] = useState<string>('30');
  const [submittingSlot, setSubmittingSlot] = useState(false);

  // Form states: Create Centre
  const [centreName, setCentreName] = useState('');
  const [centreLocation, setCentreLocation] = useState('');
  const [centreCapacityPerSlot, setCentreCapacityPerSlot] = useState('35');
  const [centreProcessingRate, setCentreProcessingRate] = useState('100');
  const [submittingCentre, setSubmittingCentre] = useState(false);

  // Form states: Create Crop
  const [cropName, setCropName] = useState('');
  const [cropMsp, setCropMsp] = useState('');
  const [cropUnit, setCropUnit] = useState('quintal');
  const [submittingCrop, setSubmittingCrop] = useState(false);

  // Inline Edit Crop
  const [editingCropId, setEditingCropId] = useState<number | null>(null);
  const [editingMspValue, setEditingMspValue] = useState<string>('');
  const [savingCropId, setSavingCropId] = useState<number | null>(null);

  const clearAlerts = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const loadAllData = useCallback(async () => {
    try {
      setRefreshing(true);
      clearAlerts();

      // Parallel fetch
      const [qData, sData, cData, crData, oData] = await Promise.all([
        fetchApi('/queue').catch(() => []),
        fetchApi('/slots').catch(() => []),
        fetchApi('/procurement-centres').catch(() => []),
        fetchApi('/crops').catch(() => []),
        fetchApi('/orders').catch(() => []),
      ]);

      setQueueItems(Array.isArray(qData) ? qData : []);
      setSlots(Array.isArray(sData) ? sData : []);
      setOrders(Array.isArray(oData) ? oData : []);

      const validCentres = Array.isArray(cData) ? cData : [];
      setCentres(validCentres);
      if (validCentres.length > 0) {
        setSlotCentreId((prev) => prev || String(validCentres[0].id));
      }

      const validCrops = Array.isArray(crData) ? crData : [];
      setCrops(validCrops);
      if (validCrops.length > 0) {
        setSlotCropId((prev) => prev || String(validCrops[0].id));
      }
    } catch (err: any) {
      console.error('Failed to load operator data:', err);
      setErrorMsg(err.message || 'Failed to load operator records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (authorized) {
      loadAllData();
    }

    const handleOrdersSync = () => {
      fetchApi('/orders')
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(() => {});
    };

    const handleCentresSync = () => {
      fetchApi('/procurement-centres')
        .then((data) => {
          if (Array.isArray(data)) setCentres(data);
        })
        .catch(() => {});
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mandimitra_orders_updated', handleOrdersSync);
      window.addEventListener('mandimitra_centres_updated', handleCentresSync);
      window.addEventListener('storage', () => {
        handleOrdersSync();
        handleCentresSync();
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mandimitra_orders_updated', handleOrdersSync);
        window.removeEventListener('mandimitra_centres_updated', handleCentresSync);
        window.removeEventListener('storage', handleOrdersSync);
      }
    };
  }, [authorized, loadAllData]);

  // Toggle/Approve Order Status
  const handleToggleOrderStatus = async (orderId: number, currentStatus: string) => {
    setUpdatingOrderId(orderId);
    clearAlerts();
    const nextStatus = currentStatus === 'APPROVED' ? 'PENDING' : 'APPROVED';
    try {
      await fetchApi(`/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      setSuccessMsg(`Order #${orderId} status updated to ${nextStatus}!`);
      const refreshed = await fetchApi('/orders');
      setOrders(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Advance Queue Status
  const handleAdvanceQueue = async (item: any) => {
    const cycleMap: Record<string, string> = {
      waiting: 'quality_check',
      quality_check: 'weighing',
      weighing: 'done',
      done: 'waiting',
    };
    const nextStatus = cycleMap[item.status] || 'waiting';

    setUpdatingQueueId(item.id);
    clearAlerts();

    try {
      await fetchApi(`/queue/${item.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });

      // Update state locally
      setQueueItems((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: nextStatus } : q))
      );
      setSuccessMsg(`Queue token #${item.id} advanced to "${nextStatus.replace('_', ' ')}"`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to advance queue status');
    } finally {
      setUpdatingQueueId(null);
    }
  };

  // Create Slot
  const handleCreateSlot = async () => {
    const centreIdToUse = slotCentreId || (centres[0]?.id ? String(centres[0].id) : '');
    const cropIdToUse = slotCropId || (crops[0]?.id ? String(crops[0].id) : '');

    if (!centreIdToUse || !cropIdToUse || !slotDate || !slotStartTime || !slotEndTime || !slotCapacity) {
      setErrorMsg('Please fill all slot fields (Centre, Crop, Date, Times, Capacity)');
      return;
    }

    setSubmittingSlot(true);
    clearAlerts();

    try {
      const payload = {
        centre_id: parseInt(centreIdToUse, 10),
        crop_id: parseInt(cropIdToUse, 10),
        date: `${slotDate}T00:00:00.000Z`,
        start_time: `${slotDate}T${slotStartTime}:00.000Z`,
        end_time: `${slotDate}T${slotEndTime}:00.000Z`,
        capacity: parseInt(slotCapacity, 10),
        booked_count: 0,
      };

      const res: any = await fetchApi('/slots', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const slotId = res?.id || (res?.data && res.data.id) || 'NEW';
      setSuccessMsg(`Slot #${slotId} created successfully with capacity ${slotCapacity}`);

      // Refresh slots
      const refreshedSlots = await fetchApi('/slots');
      setSlots(Array.isArray(refreshedSlots) ? refreshedSlots : []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create slot');
    } finally {
      setSubmittingSlot(false);
    }
  };

  // Create Centre
  const handleCreateCentre = async () => {
    if (!centreName.trim() || !centreLocation.trim()) {
      setErrorMsg('Centre name and location are required');
      return;
    }

    setSubmittingCentre(true);
    clearAlerts();

    try {
      const payload = {
        name: centreName.trim(),
        location: centreLocation.trim(),
        capacity_per_slot: parseInt(centreCapacityPerSlot, 10) || 30,
        processing_rate: parseInt(centreProcessingRate, 10) || 100,
      };

      await fetchApi('/procurement-centres', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMsg(`Procurement centre "${centreName}" created successfully!`);
      setCentreName('');
      setCentreLocation('');

      // Refresh centres
      const refreshed = await fetchApi('/procurement-centres');
      setCentres(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create procurement centre');
    } finally {
      setSubmittingCentre(false);
    }
  };

  // Create Crop
  const handleCreateCrop = async () => {
    if (!cropName.trim() || !cropMsp.trim()) {
      setErrorMsg('Crop name and MSP rate are required');
      return;
    }

    setSubmittingCrop(true);
    clearAlerts();

    try {
      const payload = {
        name: cropName.trim(),
        mspRate: parseInt(cropMsp, 10),
        unit: cropUnit.trim() || 'quintal',
      };

      await fetchApi('/crops', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMsg(`Crop "${cropName}" added successfully with MSP ₹${cropMsp}!`);
      setCropName('');
      setCropMsp('');

      // Refresh crops
      const refreshed = await fetchApi('/crops');
      setCrops(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add crop');
    } finally {
      setSubmittingCrop(false);
    }
  };

  // Inline Edit Crop Save
  const handleSaveCropMsp = async (cropId: number) => {
    const rate = parseInt(editingMspValue, 10);
    if (!rate || isNaN(rate) || rate <= 0) {
      setErrorMsg('Please enter a valid MSP rate');
      return;
    }

    setSavingCropId(cropId);
    clearAlerts();

    try {
      await fetchApi(`/crops/${cropId}`, {
        method: 'PATCH',
        body: JSON.stringify({ mspRate: rate }),
      });

      setSuccessMsg(`Updated MSP for crop #${cropId} to ₹${rate}`);
      setEditingCropId(null);

      // Refresh crops
      const refreshed = await fetchApi('/crops');
      setCrops(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update MSP rate');
    } finally {
      setSavingCropId(null);
    }
  };

  if (!authorized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Verifying Operator Authorization...</Text>
      </View>
    );
  }

  // Filter slots for selected centre in Tab 2
  const activeCentreFilter = slotCentreId || (centres[0]?.id ? String(centres[0].id) : '');
  const selectedCentreSlots = slots.filter(
    (s) => String(s.centre_id ?? s.centreId ?? '') === String(activeCentreFilter)
  );

  return (
    <ScrollView style={styles.pageContainer} contentContainerStyle={styles.scrollContent}>
      {/* Top Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <View style={styles.roleBadgeRow}>
            <View style={styles.roleBadge}>
              <Shield size={12} color="#047857" />
              <Text style={styles.roleBadgeText}>
                {user?.role?.toUpperCase() || 'OPERATOR'} ACCESS
              </Text>
            </View>
            <Text style={styles.liveIndicator}>● LIVE BACKEND</Text>
          </View>
          <Text style={styles.headerTitle}>Mandi Operations Centre</Text>
          <Text style={styles.headerSubtitle}>
            {user?.name || user?.phone || 'Central Control Console'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={loadAllData}
            disabled={refreshing}
            style={styles.refreshBtn}
            accessibilityLabel="Refresh Data"
          >
            <RefreshCw size={16} color="#047857" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSignOut}
            style={styles.signOutHeaderBtn}
            accessibilityLabel="Sign Out"
          >
            <LogOut size={16} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Messages */}
      {successMsg && (
        <View style={styles.successBanner}>
          <CheckCircle2 size={16} color="#065f46" />
          <Text style={styles.successText}>{successMsg}</Text>
        </View>
      )}

      {errorMsg && (
        <View style={styles.errorBanner}>
          <AlertCircle size={16} color="#991b1b" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* 4 Tabs Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('queue')}
          style={[styles.tabButton, activeTab === 'queue' && styles.tabButtonActive, { cursor: 'pointer' } as any]}
        >
          <Layers size={14} color={activeTab === 'queue' ? '#047857' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'queue' && styles.tabTextActive]}>
            Queue ({queueItems.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('slots')}
          style={[styles.tabButton, activeTab === 'slots' && styles.tabButtonActive, { cursor: 'pointer' } as any]}
        >
          <Calendar size={14} color={activeTab === 'slots' ? '#047857' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'slots' && styles.tabTextActive]}>
            Slots ({slots.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('centres')}
          style={[styles.tabButton, activeTab === 'centres' && styles.tabButtonActive, { cursor: 'pointer' } as any]}
        >
          <Building2 size={14} color={activeTab === 'centres' ? '#047857' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'centres' && styles.tabTextActive]}>
            Centres ({centres.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('crops')}
          style={[styles.tabButton, activeTab === 'crops' && styles.tabButtonActive, { cursor: 'pointer' } as any]}
        >
          <Wheat size={14} color={activeTab === 'crops' ? '#047857' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'crops' && styles.tabTextActive]}>
            Crops & MSP ({crops.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('orders')}
          style={[styles.tabButton, activeTab === 'orders' && styles.tabButtonActive, { cursor: 'pointer' } as any]}
        >
          <ShoppingBag size={14} color={activeTab === 'orders' ? '#047857' : '#64748b'} />
          <Text style={[styles.tabText, activeTab === 'orders' && styles.tabTextActive]}>
            Orders ({orders.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.sectionLoading}>
          <ActivityIndicator size="small" color="#047857" />
          <Text style={styles.loadingText}>Fetching operational records...</Text>
        </View>
      ) : (
        <>
          {/* ============================================================= */}
          {/* TAB 1: QUEUE MANAGEMENT */}
          {/* ============================================================= */}
          {activeTab === 'queue' && (
            <View style={styles.tabContentBlock}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Live Yard Token Queue</Text>
                <Text style={styles.sectionBadge}>
                  {queueItems.filter((q) => q.status !== 'done').length} Active
                </Text>
              </View>

              {queueItems.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>Queue is currently clear</Text>
                  <Text style={styles.emptySub}>No tokens awaiting processing in the yard.</Text>
                </View>
              ) : (
                queueItems.map((item) => {
                  const isUpdating = updatingQueueId === item.id;
                  const nextActionText: Record<string, string> = {
                    waiting: 'Start Quality Check →',
                    quality_check: 'Move to Weighing →',
                    weighing: 'Mark Complete (Done) ✓',
                    done: 'Reset to Waiting ↺',
                  };

                  const statusColorMap: Record<string, { bg: string; text: string }> = {
                    waiting: { bg: '#fef3c7', text: '#92400e' },
                    quality_check: { bg: '#e0e7ff', text: '#3730a3' },
                    weighing: { bg: '#fed7aa', text: '#9a3412' },
                    done: { bg: '#d1fae5', text: '#065f46' },
                  };
                  const currentTheme = statusColorMap[item.status] || { bg: '#f1f5f9', text: '#334155' };

                  return (
                    <View key={item.id} style={styles.cardItem}>
                      <View style={styles.cardHeaderRow}>
                        <View>
                          <Text style={styles.tokenCode}>Token #Q-{item.id}</Text>
                          <Text style={styles.cardSubText}>Booking #{item.booking_id} • Centre #{item.centre_id}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: currentTheme.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: currentTheme.text }]}>
                            {String(item.status).toUpperCase().replace('_', ' ')}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.metaGrid}>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaLabel}>FARMER</Text>
                          <Text style={styles.metaValue}>Farmer #{item.booking_id}</Text>
                        </View>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaLabel}>COMMODITY</Text>
                          <Text style={styles.metaValue}>Wheat / Grain</Text>
                        </View>
                        <View style={styles.metaCol}>
                          <Text style={styles.metaLabel}>QUANTITY</Text>
                          <Text style={styles.metaValue}>40.0 qtl</Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleAdvanceQueue(item)}
                        disabled={isUpdating}
                        style={[
                          styles.actionBtn,
                          item.status === 'done' ? styles.actionBtnSecondary : styles.actionBtnPrimary,
                        ]}
                      >
                        {isUpdating ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <Text style={styles.actionBtnText}>{nextActionText[item.status] || 'Advance'}</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* ============================================================= */}
          {/* TAB 2: SLOTS MANAGEMENT */}
          {/* ============================================================= */}
          {activeTab === 'slots' && (
            <View style={styles.tabContentBlock}>
              <View style={styles.formCard}>
                <Text style={styles.formHeaderTitle}>Create New Procurement Slot</Text>
                <Text style={styles.formHeaderSub}>
                  Adds a booking time window for farmers at a selected centre.
                </Text>

                {/* Centre Dropdown */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Procurement Centre</Text>
                  <select
                    value={slotCentreId}
                    onChange={(e: any) => setSlotCentreId(e.target.value)}
                    style={selectStyle}
                  >
                    {centres.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (#{c.id})
                      </option>
                    ))}
                  </select>
                </View>

                {/* Crop Dropdown */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Crop / Commodity</Text>
                  <select
                    value={slotCropId}
                    onChange={(e: any) => setSlotCropId(e.target.value)}
                    style={selectStyle}
                  >
                    {crops.map((cr) => (
                      <option key={cr.id} value={cr.id}>
                        {cr.name} (MSP: ₹{cr.mspRate})
                      </option>
                    ))}
                  </select>
                </View>

                {/* Date & Capacity */}
                <View style={styles.rowTwoCols}>
                  <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>Date</Text>
                    <input
                      type="date"
                      value={slotDate}
                      onChange={(e: any) => setSlotDate(e.target.value)}
                      style={inputStyle}
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Capacity (Trucks)</Text>
                    <TextInput
                      value={slotCapacity}
                      onChangeText={setSlotCapacity}
                      keyboardType="numeric"
                      style={styles.textInput}
                      placeholder="e.g. 30"
                    />
                  </View>
                </View>

                {/* Time Range */}
                <View style={styles.rowTwoCols}>
                  <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>Start Time (HH:MM)</Text>
                    <TextInput
                      value={slotStartTime}
                      onChangeText={setSlotStartTime}
                      style={styles.textInput}
                      placeholder="09:00"
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>End Time (HH:MM)</Text>
                    <TextInput
                      value={slotEndTime}
                      onChangeText={setSlotEndTime}
                      style={styles.textInput}
                      placeholder="10:00"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCreateSlot}
                  disabled={submittingSlot}
                  style={styles.submitBtn}
                >
                  {submittingSlot ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Plus size={16} color="#ffffff" />
                      <Text style={styles.submitBtnText}>Create Slot (booked_count: 0)</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Existing Slots List for Selected Centre */}
              <View style={styles.subSectionHeader}>
                <Text style={styles.sectionTitle}>
                  Existing Slots for Centre #{activeCentreFilter} ({selectedCentreSlots.length})
                </Text>
              </View>

              {selectedCentreSlots.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No slots found for this centre</Text>
                  <Text style={styles.emptySub}>Use the form above to add available booking slots.</Text>
                </View>
              ) : (
                selectedCentreSlots.map((slot) => {
                  const startTimeFmt = String(slot.start_time || '').includes('T')
                    ? String(slot.start_time).split('T')[1].slice(0, 5)
                    : slot.start_time;
                  const endTimeFmt = String(slot.end_time || '').includes('T')
                    ? String(slot.end_time).split('T')[1].slice(0, 5)
                    : slot.end_time;

                  return (
                    <View key={slot.id} style={styles.slotRowCard}>
                      <View style={styles.slotInfoLeft}>
                        <Text style={styles.slotTimeText}>
                          {startTimeFmt} - {endTimeFmt}
                        </Text>
                        <Text style={styles.slotDateText}>
                          Date: {String(slot.date || '').slice(0, 10)} • Slot #{slot.id}
                        </Text>
                      </View>
                      <View style={styles.slotCapacityBadge}>
                        <Text style={styles.slotCapacityText}>
                          {slot.booked_count ?? 0} / {slot.capacity} Booked
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}

          {/* ============================================================= */}
          {/* TAB 3: CENTRES MANAGEMENT */}
          {/* ============================================================= */}
          {activeTab === 'centres' && (
            <View style={styles.tabContentBlock}>
              <View style={styles.formCard}>
                <Text style={styles.formHeaderTitle}>Add Procurement Centre</Text>
                <Text style={styles.formHeaderSub}>
                  Register a new APMC or MSP yard for farmers to deliver produce.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Centre Name</Text>
                  <TextInput
                    value={centreName}
                    onChangeText={setCentreName}
                    style={styles.textInput}
                    placeholder="e.g. Lasalgaon APMC Sub-Yard"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Location / Full Address</Text>
                  <TextInput
                    value={centreLocation}
                    onChangeText={setCentreLocation}
                    style={styles.textInput}
                    placeholder="e.g. Market Yard Road, Niphad, Nashik"
                  />
                </View>

                <View style={styles.rowTwoCols}>
                  <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>Capacity / Slot</Text>
                    <TextInput
                      value={centreCapacityPerSlot}
                      onChangeText={setCentreCapacityPerSlot}
                      keyboardType="numeric"
                      style={styles.textInput}
                      placeholder="e.g. 35"
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Processing Rate</Text>
                    <TextInput
                      value={centreProcessingRate}
                      onChangeText={setCentreProcessingRate}
                      keyboardType="numeric"
                      style={styles.textInput}
                      placeholder="e.g. 100"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCreateCentre}
                  disabled={submittingCentre}
                  style={styles.submitBtn}
                >
                  {submittingCentre ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Plus size={16} color="#ffffff" />
                      <Text style={styles.submitBtnText}>Create Procurement Centre</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Existing Centres List (Read-only) */}
              <View style={styles.subSectionHeader}>
                <Text style={styles.sectionTitle}>Registered Centres ({centres.length})</Text>
              </View>

              {centres.map((c) => (
                <View key={c.id} style={styles.cardItem}>
                  <View style={styles.cardHeaderRow}>
                    <View>
                      <Text style={styles.cardTitle}>{c.name}</Text>
                      <Text style={styles.cardSubText}>{c.location}</Text>
                    </View>
                    <View style={styles.centreIdBadge}>
                      <Text style={styles.centreIdText}>ID: #{c.id}</Text>
                    </View>
                  </View>

                  <View style={styles.centreMetricsGrid}>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricBoxLabel}>CAPACITY / SLOT</Text>
                      <Text style={styles.metricBoxValue}>{c.capacity_per_slot ?? 30}</Text>
                    </View>
                    <View style={styles.metricBox}>
                      <Text style={styles.metricBoxLabel}>PROCESSING RATE</Text>
                      <Text style={styles.metricBoxValue}>{c.processing_rate ?? 100} /hr</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ============================================================= */}
          {/* TAB 4: CROPS & MSP MANAGEMENT */}
          {/* ============================================================= */}
          {activeTab === 'crops' && (
            <View style={styles.tabContentBlock}>
              {/* Form to Add Crop */}
              <View style={styles.formCard}>
                <Text style={styles.formHeaderTitle}>Add New Commodity / Crop</Text>
                <Text style={styles.formHeaderSub}>
                  Define official Government Minimum Support Price (MSP) rate.
                </Text>

                <View style={styles.rowTwoCols}>
                  <View style={[styles.fieldGroup, { flex: 1.5, marginRight: 8 }]}>
                    <Text style={styles.fieldLabel}>Crop Name</Text>
                    <TextInput
                      value={cropName}
                      onChangeText={setCropName}
                      style={styles.textInput}
                      placeholder="e.g. Mustard, Gram"
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>MSP Rate (₹)</Text>
                    <TextInput
                      value={cropMsp}
                      onChangeText={setCropMsp}
                      keyboardType="numeric"
                      style={styles.textInput}
                      placeholder="e.g. 5650"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCreateCrop}
                  disabled={submittingCrop}
                  style={styles.submitBtn}
                >
                  {submittingCrop ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Plus size={16} color="#ffffff" />
                      <Text style={styles.submitBtnText}>Add Crop to MSP Register</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {/* Crops List with Inline MSP Edit */}
              <View style={styles.subSectionHeader}>
                <Text style={styles.sectionTitle}>Official MSP Register ({crops.length})</Text>
              </View>

              {crops.map((cr) => {
                const isEditing = editingCropId === cr.id;
                const isSaving = savingCropId === cr.id;

                return (
                  <View key={cr.id} style={styles.cropRowCard}>
                    <View style={styles.cropInfoLeft}>
                      <Wheat size={18} color="#047857" />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.cropName}>{cr.name}</Text>
                        <Text style={styles.cropUnit}>Unit: per {cr.unit || 'quintal'}</Text>
                      </View>
                    </View>

                    {isEditing ? (
                      <View style={styles.inlineEditRow}>
                        <TextInput
                          value={editingMspValue}
                          onChangeText={setEditingMspValue}
                          keyboardType="numeric"
                          style={styles.inlineInput}
                          placeholder="Rate"
                        />
                        <TouchableOpacity
                          onPress={() => handleSaveCropMsp(cr.id)}
                          disabled={isSaving}
                          style={styles.inlineSaveBtn}
                        >
                          {isSaving ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            <Save size={14} color="#ffffff" />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setEditingCropId(null)}
                          style={styles.inlineCancelBtn}
                        >
                          <X size={14} color="#64748b" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.cropRightCol}>
                        <Text style={styles.cropRateText}>₹{cr.mspRate}</Text>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            setEditingCropId(cr.id);
                            setEditingMspValue(String(cr.mspRate));
                          }}
                          style={styles.editCropBtn}
                        >
                          <Edit2 size={12} color="#047857" />
                          <Text style={styles.editCropBtnText}>Edit MSP</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* ============================================================= */}
          {/* TAB 5: PROCUREMENT & MARKET ORDERS */}
          {/* ============================================================= */}
          {activeTab === 'orders' && (
            <View style={styles.tabContent}>
              {/* Metric Highlights */}
              <View style={styles.metricsRow}>
                <View style={[styles.metricCard, { borderLeftColor: '#047857' }]}>
                  <Text style={styles.metricLabel}>TOTAL ORDERS</Text>
                  <Text style={styles.metricValue}>{orders.length}</Text>
                  <Text style={styles.metricSub}>Mandi network trades</Text>
                </View>

                <View style={[styles.metricCard, { borderLeftColor: '#0284c7' }]}>
                  <Text style={styles.metricLabel}>TOTAL VOLUME</Text>
                  <Text style={styles.metricValue}>
                    {orders.reduce((acc, o) => acc + (Number(o.quantity) || 0), 0)} qtl
                  </Text>
                  <Text style={styles.metricSub}>Procured grains</Text>
                </View>

                <View style={[styles.metricCard, { borderLeftColor: '#10b981' }]}>
                  <Text style={styles.metricLabel}>TRADE TURNOVER</Text>
                  <Text style={styles.metricValue}>
                    ₹{orders.reduce((acc, o) => acc + (Number(o.amount) || 0), 0).toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.metricSub}>Gross traded value</Text>
                </View>

                <View style={[styles.metricCard, { borderLeftColor: '#f59e0b' }]}>
                  <Text style={styles.metricLabel}>PENDING VERIFICATION</Text>
                  <Text style={styles.metricValue}>
                    {orders.filter((o) => o.status === 'PENDING').length}
                  </Text>
                  <Text style={styles.metricSub}>Awaiting sign-off</Text>
                </View>
              </View>

              <View style={styles.subSectionHeader}>
                <Text style={styles.sectionTitle}>Procurement Orders Ledger ({orders.length})</Text>
              </View>

              {orders.length === 0 ? (
                <View style={styles.emptyStateCard}>
                  <ShoppingBag size={32} color="#94a3b8" />
                  <Text style={styles.emptyStateTitle}>No Orders Placed Yet</Text>
                  <Text style={styles.emptyStateSub}>
                    Orders created by Brokers and Buyers will appear here for verification and tracking.
                  </Text>
                </View>
              ) : (
                orders.map((ord) => {
                  const isApproved = ord.status === 'APPROVED' || ord.status === 'COMPLETED' || ord.status === 'VERIFIED';
                  const isUpdating = updatingOrderId === ord.id;

                  return (
                    <View key={ord.id} style={styles.orderListItem}>
                      <View style={styles.orderItemHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={styles.orderTag}>
                            <Text style={styles.orderTagText}>MM-ORD-00{ord.id}</Text>
                          </View>
                          <View
                            style={[
                              styles.orderStatusBadge,
                              isApproved ? styles.statusBadgeApproved : styles.statusBadgePending,
                            ]}
                          >
                            <Text
                              style={[
                                styles.orderStatusBadgeText,
                                isApproved ? styles.statusTextApproved : styles.statusTextPending,
                              ]}
                            >
                              {ord.status || 'PENDING'}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.orderCreatedText}>
                          {String(ord.createdAt || '').slice(0, 10) || 'Recent'}
                        </Text>
                      </View>

                      <View style={styles.orderItemBody}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.orderCropTitle}>
                            {ord.crop || 'Wheat'} — {ord.quantity} qtl
                          </Text>
                          <Text style={styles.orderPartiesText}>
                            Buyer #{ord.buyerId || '201'} • Broker #{ord.brokerId || '301'} • Listing #{ord.listingId || '101'}
                          </Text>
                        </View>

                        <View style={styles.orderAmountBox}>
                          <Text style={styles.orderAmountLabel}>TOTAL AMOUNT</Text>
                          <Text style={styles.orderAmountValue}>
                            ₹{Number(ord.amount || 0).toLocaleString('en-IN')}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.orderItemFooter}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleToggleOrderStatus(ord.id, ord.status)}
                          disabled={isUpdating}
                          style={[
                            styles.orderActionBtn,
                            isApproved ? styles.orderActionBtnApproved : styles.orderActionBtnPending,
                          ]}
                        >
                          {isUpdating ? (
                            <ActivityIndicator size="small" color={isApproved ? '#047857' : '#ffffff'} />
                          ) : (
                            <>
                              <CheckCircle2 size={13} color={isApproved ? '#047857' : '#ffffff'} />
                              <Text
                                style={[
                                  styles.orderActionBtnText,
                                  isApproved ? styles.actionTextApproved : styles.actionTextPending,
                                ]}
                              >
                                {isApproved ? 'Mark Status as Pending' : 'Verify & Approve Order'}
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const selectStyle: any = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: '10px',
  border: '1.5px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  fontSize: '14px',
  fontWeight: '500',
  color: '#0f172a',
  outline: 'none',
};

const inputStyle: any = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: '10px',
  border: '1.5px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  fontSize: '14px',
  fontWeight: '500',
  color: '#0f172a',
  outline: 'none',
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sectionLoading: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
  },
  roleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginRight: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  liveIndicator: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  signOutHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#6ee7b7',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  successText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065f46',
    marginLeft: 8,
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#991b1b',
    marginLeft: 8,
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    cursor: 'pointer' as any,
  },
  tabButtonActive: {
    backgroundColor: '#ecfdf5',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 4,
  },
  tabTextActive: {
    color: '#047857',
    fontWeight: '700',
  },
  tabContentBlock: {
    width: '100%',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#047857',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  cardItem: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tokenCode: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardSubText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  metaGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  actionBtn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPrimary: {
    backgroundColor: '#047857',
  },
  actionBtnSecondary: {
    backgroundColor: '#475569',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 16,
  },
  formHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  formHeaderSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },
  rowTwoCols: {
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  submitBtn: {
    backgroundColor: '#047857',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    cursor: 'pointer' as any,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 6,
  },
  subSectionHeader: {
    marginVertical: 10,
  },
  slotRowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slotInfoLeft: {
    flex: 1,
  },
  slotTimeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  slotDateText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  slotCapacityBadge: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  slotCapacityText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  centreIdBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  centreIdText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  centreMetricsGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  metricBox: {
    flex: 1,
  },
  metricBoxLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
  metricBoxValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  cropRowCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cropInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  cropUnit: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  cropRightCol: {
    alignItems: 'flex-end',
  },
  cropRateText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#047857',
  },
  editCropBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  editCropBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 3,
  },
  inlineEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineInput: {
    width: 80,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#047857',
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
    backgroundColor: '#ecfdf5',
  },
  inlineSaveBtn: {
    backgroundColor: '#047857',
    padding: 7,
    borderRadius: 6,
    marginLeft: 6,
  },
  inlineCancelBtn: {
    backgroundColor: '#f1f5f9',
    padding: 7,
    borderRadius: 6,
    marginLeft: 4,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  tabContent: {
    gap: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderLeftWidth: 4,
    gap: 2,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  metricSub: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  emptyStateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  emptyStateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 320,
  },
  orderListItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  orderItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderTag: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  orderTagText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  orderStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusBadgePending: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeApproved: {
    backgroundColor: '#dcfce7',
  },
  orderStatusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextPending: {
    color: '#92400e',
  },
  statusTextApproved: {
    color: '#166534',
  },
  orderCreatedText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  orderItemBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderCropTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  orderPartiesText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '500',
  },
  orderAmountBox: {
    alignItems: 'flex-end',
  },
  orderAmountLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  orderAmountValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#047857',
  },
  orderItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  orderActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 6,
  },
  orderActionBtnPending: {
    backgroundColor: '#047857',
  },
  orderActionBtnApproved: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  orderActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionTextPending: {
    color: '#ffffff',
  },
  actionTextApproved: {
    color: '#047857',
  },
});
