'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../lib/language-context';
import { View, Text, TouchableOpacity, StyleSheet as RNStyleSheet } from 'react-native-web';
import {
  Home,
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { language } = useLanguage();

  const handleChatbotClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('mandimitra:toggle-chatbot'));
    }
  };

  const navButtons = [
    {
      id: 'home',
      label: language === 'hi' ? 'होम' : (language === 'mr' ? 'मुख्य' : 'Home'),
      href: '/farmer/dashboard',
      icon: Home,
      isActive: pathname === '/farmer/dashboard' || pathname === '/',
    },
    {
      id: 'book',
      label: language === 'hi' ? 'स्लॉट बुक' : (language === 'mr' ? 'स्लॉट बुक' : 'Book'),
      href: '/farmer/book',
      icon: Calendar,
      isActive: pathname === '/farmer/book',
    },
    {
      id: 'centres',
      label: language === 'hi' ? 'मंडी केंद्र' : (language === 'mr' ? 'खरेदी केंद्र' : 'Centres'),
      href: '/farmer/centres',
      icon: MapPin,
      isActive: pathname === '/farmer/centres',
    },
    {
      id: 'recent',
      label: language === 'hi' ? 'मेरा टोकन' : (language === 'mr' ? 'माझा टोकन' : 'My Token'),
      href: '/farmer/token',
      icon: Clock,
      isActive: pathname === '/farmer/token',
    },
    {
      id: 'chatbot',
      label: language === 'hi' ? 'सहायक' : (language === 'mr' ? 'सहाय्यक' : 'Chatbot'),
      action: handleChatbotClick,
      icon: MessageSquare,
      isSpecial: true,
      isActive: false,
    },
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.navInner}>
        {navButtons.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          if (item.action) {
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={item.action}
                style={styles.navItem}
                accessibilityLabel={item.label}
              >
                <View style={styles.specialButtonCircle}>
                  <Icon size={18} color="#fde047" />
                </View>
                <Text style={styles.specialButtonLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href!}
              style={{ textDecoration: 'none', flex: 1 }}
            >
              <View style={[styles.navItem, active ? styles.navItemActive : undefined]}>
                <View style={[styles.iconWrapper, active ? styles.iconWrapperActive : undefined]}>
                  <Icon
                    size={20}
                    color={active ? '#064e3b' : '#047857'}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </View>
                <Text style={[styles.navLabel, active ? styles.navLabelActive : undefined]}>
                  {item.label}
                </Text>
              </View>
            </Link>
          );
        })}
      </View>
    </View>
  );
};

const styles = RNStyleSheet.create({
  navContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 40,
    position: 'fixed' as any,
    bottom: 0,
    left: 0,
    right: 0,
  },
  navInner: {
    maxWidth: 448,
    marginHorizontal: 'auto',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navItemActive: {},
  iconWrapper: {
    padding: 4,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: '#d1fae5',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#047857',
    marginTop: 2,
    textAlign: 'center',
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '900',
    color: '#064e3b',
  },
  specialButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  specialButtonLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#064e3b',
    marginTop: 1,
    textAlign: 'center',
  },
});
