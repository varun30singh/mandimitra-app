'use client';

import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet as RNStyleSheet } from 'react-native-web';
import Link from 'next/link';
import { User } from 'lucide-react';
import { ProfileModal } from './ProfileModal';

export const MobileHeader: React.FC = () => {
  const [profileOpen, setProfileOpen] = useState(false);

  const [logoHref, setLogoHref] = useState('/farmer/dashboard');

  React.useEffect(() => {
    try {
      const uStr = localStorage.getItem('mandimitra_user');
      if (uStr) {
        const u = JSON.parse(uStr);
        const r = String(u.role || '').toLowerCase();
        if (r === 'operator' || r === 'admin') setLogoHref('/operator/dashboard');
        else if (r === 'stockist') setLogoHref('/stockist/dashboard');
        else if (r === 'broker') setLogoHref('/broker/dashboard');
        else if (r === 'buyer') setLogoHref('/buyer/dashboard');
      }
    } catch {}
  }, []);

  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.headerInner}>
          {/* Left: Official Mandi Mitra Logo */}
          <Link href={logoHref} style={{ textDecoration: 'none' }}>
            <View style={styles.logoRow}>
              <Image
                source={{ uri: '/images/mandi-mitra-logo.jpg' }}
                style={styles.headerLogoImage}
                resizeMode="contain"
                accessibilityLabel="Mandi Mitra Logo"
              />
            </View>
          </Link>

          {/* Right: ONLY Profile Logo/Icon (No name, no text) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setProfileOpen(true)}
            style={styles.profileIconButton}
            accessibilityLabel="Open Farmer Profile"
          >
            <User size={20} color="#047857" />
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
    paddingVertical: 10,
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
  },
  headerLogoImage: {
    width: 140,
    height: 40,
  },
  profileIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
});
