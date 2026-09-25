'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet as RNStyleSheet } from 'react-native-web';
import Link from 'next/link';
import { Wheat, User } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const MobileHeader: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerInner}>
          {/* Left: Mandi Setu Logo */}
          <Link href="/farmer/dashboard" style={{ textDecoration: 'none' }}>
            <View style={styles.logoRow}>
              <View style={styles.logoIconBox}>
                <Wheat size={22} color="#fde047" />
              </View>
              <View style={styles.logoTextBox}>
                <Text style={styles.logoTitle}>MANDI SETU</Text>
                <Text style={styles.logoSubtitle}>मंडी सेतु • किसान सेवा</Text>
              </View>
            </View>
          </Link>

          {/* Right: Farmer Profile Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setProfileOpen(true)}
            style={styles.profileButton}
            accessibilityLabel="Open Farmer Profile"
          >
            <View style={styles.profileAvatar}>
              <User size={16} color="#ffffff" />
            </View>
            <View style={styles.profileMeta}>
              <Text style={styles.profileName}>Ramesh</Text>
              <Text style={styles.profileSub}>Profile & Settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
};

const styles = RNStyleSheet.create({
  headerContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 40,
    position: 'sticky' as any,
    top: 0,
  },
  headerInner: {
    maxWidth: 448,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  logoTextBox: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#064e3b',
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    letterSpacing: 0.3,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 24,
    paddingVertical: 4,
    paddingHorizontal: 10,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMeta: {
    flexDirection: 'column',
  },
  profileName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#064e3b',
    lineHeight: 14,
  },
  profileSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#047857',
    lineHeight: 11,
  },
});
