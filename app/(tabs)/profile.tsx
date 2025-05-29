import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { 
  ChevronRight, 
  Bell, 
  Lock, 
  HelpCircle, 
  LogOut,
  Moon,
  User as UserIcon,
  Settings,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import ProfileHeader from '../../components/profile/ProfileHeader';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  
  // Mock user data while waiting for real user data from context
  const mockUser = user || {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: 'https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    joinDate: '2023-01-15T00:00:00.000Z',
    workoutStreak: 5,
    totalWorkouts: 42,
    totalCaloriesBurned: 12580,
    createdAt: '2023-01-15T00:00:00.000Z',
    updatedAt: '2023-05-20T00:00:00.000Z',
  };
  
  // Handle logout
  const handleLogout = async () => {
    await logout();
  };
  
  // Toggle notifications
  const toggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);
  };
  
  // Render a menu item
  const renderMenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightElement,
    tintColor,
  }: { 
    icon: React.ReactNode; 
    title: string; 
    subtitle?: string;
    onPress: () => void;
    rightElement?: React.ReactNode;
    tintColor?: string;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.menuIconContainer,
        tintColor ? { backgroundColor: `${tintColor}20` } : {}
      ]}>
        {React.cloneElement(icon as React.ReactElement, { 
          color: tintColor || Colors.text.primary,
          size: 20,
        })}
      </View>
      
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      
      {rightElement || (
        <ChevronRight size={20} color={Colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View 
        style={styles.container}
        entering={FadeIn.duration(300)}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <ProfileHeader user={mockUser} />
          
          {/* Account Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            {renderMenuItem({
              icon: <UserIcon />,
              title: 'Personal Information',
              subtitle: 'Update your profile details',
              onPress: () => {},
            })}
            
            {renderMenuItem({
              icon: <Lock />,
              title: 'Password & Security',
              subtitle: 'Manage your account security',
              onPress: () => {},
            })}
            
            {renderMenuItem({
              icon: <Bell />,
              title: 'Notifications',
              onPress: toggleNotifications,
              rightElement: (
                <Switch
                  trackColor={{ false: Colors.input.background, true: `${Colors.accent.primary}80` }}
                  thumbColor={isNotificationsEnabled ? Colors.accent.primary : '#f4f3f4'}
                  ios_backgroundColor={Colors.input.background}
                  onValueChange={toggleNotifications}
                  value={isNotificationsEnabled}
                />
              ),
              tintColor: Colors.status.info,
            })}
          </View>
          
          {/* App Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            
            {renderMenuItem({
              icon: <Moon />,
              title: 'Dark Mode',
              subtitle: 'Currently using dark theme',
              onPress: () => {},
              tintColor: Colors.accent.primary,
            })}
            
            {renderMenuItem({
              icon: <Settings />,
              title: 'Preferences',
              subtitle: 'Customize your app experience',
              onPress: () => {},
            })}
            
            {renderMenuItem({
              icon: <HelpCircle />,
              title: 'Help & Support',
              subtitle: 'FAQs, contact us, privacy policy',
              onPress: () => {},
              tintColor: Colors.status.info,
            })}
          </View>
          
          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={20} color={Colors.status.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Layout.Spacing.xxl,
  },
  section: {
    marginTop: Layout.Spacing.l,
    paddingHorizontal: Layout.Spacing.m,
  },
  sectionTitle: {
    fontSize: Layout.FontSize.m,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.Spacing.m,
    marginLeft: Layout.Spacing.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Layout.Radius.l,
    padding: Layout.Spacing.m,
    marginBottom: Layout.Spacing.m,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Layout.Radius.m,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.Spacing.m,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Layout.FontSize.m,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  menuSubtitle: {
    fontSize: Layout.FontSize.s,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: Layout.Radius.l,
    padding: Layout.Spacing.m,
    marginHorizontal: Layout.Spacing.m,
    marginTop: Layout.Spacing.xl,
  },
  logoutText: {
    fontSize: Layout.FontSize.m,
    fontWeight: '600',
    color: Colors.status.error,
    marginLeft: Layout.Spacing.s,
  },
  versionText: {
    textAlign: 'center',
    color: Colors.text.tertiary,
    fontSize: Layout.FontSize.xs,
    marginTop: Layout.Spacing.l,
  },
});