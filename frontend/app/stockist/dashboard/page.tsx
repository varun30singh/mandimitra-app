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
  Package,
  Building2,
  Phone,
  CheckCircle2,
  Clock,
  Layers,
  ShoppingBag,
  RefreshCw,
  Plus,
  AlertCircle,
  Truck,
  Warehouse,
  LogOut,
} from 'lucide-react';

export default function StockistDashboard() {
  const router = useRouter();
  const { authorized, user } = useRoleGuard(['stockist']);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mandimitra_token');
      localStorage.removeItem('mandimitra_user');
    }
    router.replace('/login');
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stockistProfile, setStockistProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Business Name update/init
  const [businessNameInput, setBusinessNameInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const loadStockistData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setRefreshing(true);
      setErrorMsg(null);

      // 1. Try fetching specific stockist profile by user ID
      let profile = null;
      try {
        const res = await fetchApi(`/stockists/${user.id}`);
        if (res && res.id) profile = res;
      } catch {}

      // 2. If not found by direct id, check list of stockists
      if (!profile) {
        try {
          const listRes = await fetchApi('/stockists');
          const allStockists = Array.isArray(listRes) ? listRes : [];
          profile = allStockists.find(
            (s: any) => String(s.userId) === String(user.id) || String(s.id) === String(user.id)
          );
        } catch {}
      }

      setStockistProfile(profile);

      // 3. Fetch related procurement orders
      try {
        const orderRes = await fetchApi('/orders');
        setOrders(Array.isArray(orderRes) ? orderRes : []);
      } catch {
        setOrders([]);
      }
    } catch (err: any) {
      console.error('Error fetching stockist details:', err);
      setErrorMsg(err.message || 'Failed to load stockist profile');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (authorized && user?.id) {
      loadStockistData();
    }

    const handleOrderSync = () => {
      fetchApi('/orders')
        .then((res) => {
          if (Array.isArray(res)) setOrders(res);
        })
        .catch(() => {});
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mandimitra_orders_updated', handleOrderSync);
      window.addEventListener('storage', handleOrderSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mandimitra_orders_updated', handleOrderSync);
        window.removeEventListener('storage', handleOrderSync);
      }
    };
  }, [authorized, user?.id, loadStockistData]);

  // Create or Initialize Profile via POST /stockists
  const handleCreateProfile = async () => {
    if (!businessNameInput.trim()) {
      setErrorMsg('Please enter your business or agency name');
      return;
    }

    setSavingProfile(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetchApi('/stockists', {
        method: 'POST',
        body: JSON.stringify({
          userId: String(user?.id),
          businessName: businessNameInput.trim(),
        }),
      });

      setStockistProfile(res?.data || res);
      setSuccessMsg('Stockist profile created and registered successfully!');
      setBusinessNameInput('');
      await loadStockistData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create stockist record');
    } finally {
      setSavingProfile(false);
    }
  };

  if (!authorized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Verifying Stockist Authorization...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.pageContainer} contentContainerStyle={styles.scrollContent}>
      {/* Top Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <View style={styles.roleBadgeRow}>
            <View style={styles.roleBadge}>
              <Warehouse size={12} color="#047857" />
              <Text style={styles.roleBadgeText}>STOCKIST PORTAL</Text>
            </View>
            <View style={styles.verifiedTag}>
              <CheckCircle2 size={10} color="#059669" />
              <Text style={styles.verifiedText}>APMC Licensed</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>
            {stockistProfile?.businessName || user?.name || 'Mandi Stockist Console'}
          </Text>
          <Text style={styles.headerSubtitle}>
            User ID #{user?.id} • Phone: {user?.phone || 'N/A'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={loadStockistData}
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

      {/* Notifications */}
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#047857" />
          <Text style={styles.loadingText}>Loading stockist records...</Text>
        </View>
      ) : (
        <>
          {/* Main Stockist Profile Card */}
          <View style={styles.cardItem}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Warehouse & Trader Profile</Text>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>ACTIVE</Text>
              </View>
            </View>

            {stockistProfile ? (
              <View style={styles.profileDetailsBlock}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>BUSINESS NAME</Text>
                  <Text style={styles.detailValue}>{stockistProfile.businessName}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>STOCKIST RECORD ID</Text>
                  <Text style={styles.detailValue}>{stockistProfile.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ACCOUNT USER ID</Text>
                  <Text style={styles.detailValue}>#{user?.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>CONTACT NUMBER</Text>
                  <Text style={styles.detailValue}>{user?.phone}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>REGISTERED DATE</Text>
                  <Text style={styles.detailValue}>
                    {stockistProfile.createdAt
                      ? String(stockistProfile.createdAt).slice(0, 10)
                      : 'Active Season 2026'}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.noProfileBox}>
                <Text style={styles.noProfileTitle}>Stockist Agency Record Not Initialized</Text>
                <Text style={styles.noProfileSub}>
                  Register your business trade name to link APMC mandi warehouse allocations.
                </Text>

                <View style={styles.initFormRow}>
                  <TextInput
                    value={businessNameInput}
                    onChangeText={setBusinessNameInput}
                    placeholder="Enter Business / Agency Name"
                    style={styles.textInput}
                  />
                  <TouchableOpacity
                    onPress={handleCreateProfile}
                    disabled={savingProfile}
                    style={styles.saveProfileBtn}
                  >
                    {savingProfile ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.saveProfileBtnText}>Register Stockist Profile</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Warehouse Metrics Overview */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Warehouse size={16} color="#047857" />
              <Text style={styles.metricVal}>4,850 qtl</Text>
              <Text style={styles.metricLabel}>GRAIN CAPACITY</Text>
            </View>

            <View style={styles.metricCard}>
              <Truck size={16} color="#059669" />
              <Text style={styles.metricVal}>12 Trucks</Text>
              <Text style={styles.metricLabel}>DAILY UNLOAD</Text>
            </View>

            <View style={styles.metricCard}>
              <Package size={16} color="#d97706" />
              <Text style={styles.metricVal}>{orders.length} Orders</Text>
              <Text style={styles.metricLabel}>LINKED TRADES</Text>
            </View>
          </View>

          {/* Related Orders / Inventory Movement */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Procurement & Stock Movement Orders</Text>
            <Text style={styles.badgeCount}>{orders.length} Active</Text>
          </View>

          {orders.length === 0 ? (
            <View style={styles.emptyCard}>
              <ShoppingBag size={24} color="#94a3b8" />
              <Text style={styles.emptyTitle}>No related orders yet</Text>
              <Text style={styles.emptySub}>
                Orders dispatched from the mandi procurement will appear here.
              </Text>
            </View>
          ) : (
            orders.map((ord) => (
              <View key={ord.id} style={styles.orderCard}>
                <View style={styles.orderTopRow}>
                  <View>
                    <Text style={styles.orderCode}>Order #{ord.id} • {ord.crop || 'Wheat'}</Text>
                    <Text style={styles.orderSub}>
                      Listing #{ord.listingId} • Buyer #{ord.buyerId} • Broker #{ord.brokerId || '301'}
                    </Text>
                  </View>
                  <View style={styles.orderStatusBadge}>
                    <Text style={styles.orderStatusText}>{ord.status || 'PENDING'}</Text>
                  </View>
                </View>

                <View style={styles.orderMetaGrid}>
                  <View style={styles.orderMetaCol}>
                    <Text style={styles.orderMetaLabel}>QUANTITY</Text>
                    <Text style={styles.orderMetaValue}>{ord.quantity} qtl</Text>
                  </View>
                  <View style={styles.orderMetaCol}>
                    <Text style={styles.orderMetaLabel}>AMOUNT</Text>
                    <Text style={styles.orderMetaValue}>₹{Number(ord.amount || 0).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.orderMetaCol}>
                    <Text style={styles.orderMetaLabel}>DATE</Text>
                    <Text style={styles.orderMetaValue}>
                      {String(ord.createdAt || '').slice(0, 10) || 'Recent'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

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
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 3,
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
  cardItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  activePill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803d',
  },
  profileDetailsBlock: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  noProfileBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  noProfileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  noProfileSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 12,
  },
  initFormRow: {
    gap: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  saveProfileBtn: {
    backgroundColor: '#047857',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  badgeCount: {
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#047857',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
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
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderCode: {
    fontSize: 15,
    fontWeight: '800',
    color: '#047857',
  },
  orderSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  orderStatusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  orderStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },
  orderMetaGrid: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
  },
  orderMetaCol: {
    flex: 1,
  },
  orderMetaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
  },
  orderMetaValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
});
