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
  ShoppingCart,
  UserCheck,
  Phone,
  CheckCircle2,
  Clock,
  Plus,
  RefreshCw,
  AlertCircle,
  FileText,
  CreditCard,
  Building,
  LogOut,
} from 'lucide-react';

export default function BuyerDashboard() {
  const router = useRouter();
  const { authorized, user } = useRoleGuard(['buyer']);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mandimitra_token');
      localStorage.removeItem('mandimitra_user');
    }
    router.replace('/login');
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Purchase Order Form state
  const [listingId, setListingId] = useState('101');
  const [buyerId, setBuyerId] = useState('');
  const [brokerId, setBrokerId] = useState('301');
  const [crop, setCrop] = useState('Wheat');
  const [quantity, setQuantity] = useState('15');
  const [amount, setAmount] = useState('34125');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const cropRates: Record<string, number> = {
    Wheat: 2275,
    Mustard: 5650,
    Paddy: 2300,
    Soybean: 4892,
    Chana: 5440,
  };

  const handleQuantityChange = (newQty: string) => {
    setQuantity(newQty);
    const num = parseFloat(newQty);
    if (!isNaN(num) && num > 0) {
      const rate = cropRates[crop] || 2275;
      setAmount(String(Math.round(num * rate)));
    }
  };

  const handleCropChange = (newCrop: string) => {
    setCrop(newCrop);
    const num = parseFloat(quantity);
    if (!isNaN(num) && num > 0) {
      const rate = cropRates[newCrop] || 2275;
      setAmount(String(Math.round(num * rate)));
    }
  };

  const clearAlerts = () => {
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const loadBuyerData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setRefreshing(true);
      clearAlerts();

      // Set default buyer ID from logged-in user
      if (!buyerId) {
        setBuyerId(String(user.id));
      }

      // 1. Fetch buyer profile by ID (or list)
      let profile = null;
      try {
        const res = await fetchApi(`/buyers/${user.id}`);
        if (res && res.id) profile = res;
      } catch {}

      if (!profile) {
        try {
          const listRes = await fetchApi('/buyers');
          const all = Array.isArray(listRes) ? listRes : [];
          profile = all.find(
            (b: any) => String(b.userId) === String(user.id) || String(b.id) === String(user.id)
          );
        } catch {}
      }

      setBuyerProfile(profile);

      // 2. Fetch all orders
      const ordersRes = await fetchApi('/orders');
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
    } catch (err: any) {
      console.error('Error loading buyer data:', err);
      setErrorMsg(err.message || 'Failed to load buyer information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, buyerId]);

  useEffect(() => {
    if (authorized && user?.id) {
      loadBuyerData();
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
  }, [authorized, user?.id, loadBuyerData]);

  // Handle Create Purchase Order
  const handleCreateOrder = async () => {
    if (!listingId || !buyerId || !brokerId || !quantity || !amount) {
      setErrorMsg('Please enter all required purchase order fields');
      return;
    }

    setSubmittingOrder(true);
    clearAlerts();

    try {
      const payload = {
        listingId: parseInt(listingId, 10),
        buyerId: parseInt(buyerId, 10),
        brokerId: parseInt(brokerId, 10),
        quantity: parseFloat(quantity),
        amount: parseFloat(amount),
        crop,
        status: 'PENDING',
      };

      const newOrder = await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccessMsg(`Purchase Order #${newOrder?.id || ''} confirmed for ${quantity} qtl of ${crop}!`);
      // Refresh orders
      const refreshed = await fetchApi('/orders');
      setOrders(Array.isArray(refreshed) ? refreshed : []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create purchase order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  if (!authorized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
        <Text style={styles.loadingText}>Verifying Buyer Authorization...</Text>
      </View>
    );
  }

  // Calculate quick stats
  const totalPurchasedVolume = orders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0);
  const totalExpenditure = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  return (
    <ScrollView style={styles.pageContainer} contentContainerStyle={styles.scrollContent}>
      {/* Top Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerInfo}>
          <View style={styles.roleBadgeRow}>
            <View style={styles.roleBadge}>
              <ShoppingCart size={12} color="#047857" />
              <Text style={styles.roleBadgeText}>BUYER PORTAL</Text>
            </View>
            <View style={styles.verifiedTag}>
              <CheckCircle2 size={10} color="#059669" />
              <Text style={styles.verifiedText}>Verified Institutional Buyer</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>
            {user?.name || `Commercial Buyer #${user?.id}`}
          </Text>
          <Text style={styles.headerSubtitle}>
            Buyer ID #{buyerProfile?.id || user?.id} • Phone: {user?.phone || 'N/A'}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={loadBuyerData}
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
          <Text style={styles.loadingText}>Fetching buyer dashboard...</Text>
        </View>
      ) : (
        <>
          {/* Buyer Profile Card */}
          <View style={styles.cardItem}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Institutional Buyer Profile</Text>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>VERIFIED</Text>
              </View>
            </View>

            <View style={styles.profileDetailsBlock}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>BUYER ENTITY ID</Text>
                <Text style={styles.detailValue}>
                  {buyerProfile?.id ? `Buyer #${buyerProfile.id}` : `User #${user?.id}`}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>REGISTERED PHONE</Text>
                <Text style={styles.detailValue}>{user?.phone || 'N/A'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SETTLEMENT TYPE</Text>
                <Text style={styles.detailValue}>Direct Mandi Escrow / DBT</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>APPROVED APMC YARDS</Text>
                <Text style={styles.detailValue}>Nashik, Lasalgaon, Niphad</Text>
              </View>
            </View>
          </View>

          {/* Quick Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <FileText size={16} color="#047857" />
              <Text style={styles.metricVal}>{orders.length}</Text>
              <Text style={styles.metricLabel}>PURCHASES</Text>
            </View>

            <View style={styles.metricCard}>
              <ShoppingCart size={16} color="#059669" />
              <Text style={styles.metricVal}>{totalPurchasedVolume} qtl</Text>
              <Text style={styles.metricLabel}>GRAIN SECURED</Text>
            </View>

            <View style={styles.metricCard}>
              <CreditCard size={16} color="#d97706" />
              <Text style={styles.metricVal}>₹{(totalExpenditure / 1000).toFixed(1)}k</Text>
              <Text style={styles.metricLabel}>COMMITTED</Text>
            </View>
          </View>

          {/* Form to Create Purchase Order (POST /api/orders) */}
          <View style={styles.formCard}>
            <Text style={styles.formHeaderTitle}>Place New Purchase Order</Text>
            <Text style={styles.formHeaderSub}>
              Procure grains directly from APMC mandi market listings.
            </Text>

            <View style={styles.rowTwoCols}>
              <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Listing ID</Text>
                <TextInput
                  value={listingId}
                  onChangeText={setListingId}
                  keyboardType="numeric"
                  style={styles.textInput}
                  placeholder="e.g. 101"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Buyer ID</Text>
                <TextInput
                  value={buyerId}
                  onChangeText={setBuyerId}
                  keyboardType="numeric"
                  style={styles.textInput}
                  placeholder="Buyer ID"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Broker ID</Text>
              <TextInput
                value={brokerId}
                onChangeText={setBrokerId}
                keyboardType="numeric"
                style={styles.textInput}
                placeholder="Broker ID"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Crop / Commodity</Text>
              <select
                value={crop}
                onChange={(e) => handleCropChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#0f172a',
                  outline: 'none',
                }}
              >
                <option value="Wheat">Wheat (MSP ₹2,275/qtl)</option>
                <option value="Paddy">Paddy / Rice (MSP ₹2,300/qtl)</option>
                <option value="Mustard">Mustard (MSP ₹5,650/qtl)</option>
                <option value="Soybean">Soybean (MSP ₹4,892/qtl)</option>
                <option value="Chana">Chana / Gram (MSP ₹5,440/qtl)</option>
              </select>
            </View>

            <View style={styles.rowTwoCols}>
              <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.fieldLabel}>Quantity (Quintals)</Text>
                <TextInput
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  style={styles.textInput}
                  placeholder="e.g. 15"
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Total Amount (₹)</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  style={styles.textInput}
                  placeholder="e.g. 34125"
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCreateOrder}
              disabled={submittingOrder}
              style={styles.submitBtn}
            >
              {submittingOrder ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Plus size={16} color="#ffffff" />
                  <Text style={styles.submitBtnText}>Place Purchase Order</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* List of Orders (Read-only as required) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Procurement Purchase Orders ({orders.length})</Text>
          </View>

          {orders.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No purchase orders found</Text>
              <Text style={styles.emptySub}>Use the form above to book a grain lot from the mandi.</Text>
            </View>
          ) : (
            orders.map((ord) => (
              <View key={ord.id} style={styles.orderCard}>
                <View style={styles.orderTopRow}>
                  <View>
                    <Text style={styles.orderCode}>Order #{ord.id} • {ord.crop || 'Wheat'}</Text>
                    <Text style={styles.orderSub}>
                      Listing #{ord.listingId} • Broker #{ord.brokerId} • Buyer #{ord.buyerId}
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
                    <Text style={styles.orderMetaLabel}>TOTAL AMOUNT</Text>
                    <Text style={styles.orderMetaValue}>₹{Number(ord.amount || 0).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.orderMetaCol}>
                    <Text style={styles.orderMetaLabel}>CREATED</Text>
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
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 6,
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
  },
  emptySub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
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
