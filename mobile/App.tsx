/**
 * Airbnb Sesame Keypad - React Native App
 * Mobile keypad interface for door access
 */

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Display from './src/components/Display';
import Keypad from './src/components/Keypad';
import AdminPanel from './src/components/AdminPanel';
import { apiService } from './src/services/api';

function App() {
  const [pinBuffer, setPinBuffer] = useState('');
  const [status, setStatus] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  const appendDigit = (digit: string) => {
    if (pinBuffer.length >= 8) return;
    setPinBuffer((prev) => prev + digit);
    setStatus('');
  };

  const clearBuffer = () => {
    setPinBuffer('');
    setStatus('');
  };

  const submitCode = async () => {
    if (!pinBuffer) return;

    try {
      setStatus('Checking...');
      Vibration.vibrate(100);

      const response = await apiService.checkPin(pinBuffer);

      if (!response.ok) {
        setStatus(response.error || 'Invalid PIN');
        Vibration.vibrate([100, 50, 100]);
        setTimeout(() => {
          clearBuffer();
        }, 2000);
        return;
      }

      if (response.mode === 'admin') {
        setAdminToken(pinBuffer);
        setIsAdminMode(true);
        setStatus('✅ Admin mode unlocked');
        Vibration.vibrate([100, 50, 100, 50, 100]);
      } else {
        setStatus('✅ Door unlocked!');
        Vibration.vibrate([200, 100, 200]);
        setTimeout(() => {
          clearBuffer();
          setStatus('');
        }, 3000);
      }
    } catch (error) {
      console.error('PIN check error:', error);
      setStatus('❌ Network error');
      Vibration.vibrate([100, 50, 100, 50, 100, 50, 100]);
      setTimeout(() => {
        clearBuffer();
      }, 2000);
    }
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    setAdminToken('');
    clearBuffer();
    setStatus('');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#111111" />
        
        {!isAdminMode ? (
          <View style={styles.keypadView}>
            <View style={styles.header}>
              <Text style={styles.title}>🚪 Door Access</Text>
              {status ? (
                <Text
                  style={[
                    styles.status,
                    status.includes('✅') ? styles.statusSuccess : styles.statusError,
                  ]}
                >
                  {status}
                </Text>
              ) : null}
            </View>

            <Display value={pinBuffer} placeholder="Enter PIN" />

            <Keypad
              onDigitPress={appendDigit}
              onBackspace={clearBuffer}
              onSubmit={submitCode}
            />
          </View>
        ) : (
          <View style={styles.adminView}>
            <View style={styles.adminHeader}>
              <Text style={styles.title}>⚙️ Admin Panel</Text>
              <Text
                style={styles.exitButton}
                onPress={exitAdminMode}
              >
                ← Exit Admin
              </Text>
            </View>
            <AdminPanel adminToken={adminToken} />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  keypadView: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  adminView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  adminHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(74, 222, 128, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4ade80',
    marginBottom: 8,
  },
  status: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  statusSuccess: {
    color: '#4ade80',
  },
  statusError: {
    color: '#ef4444',
  },
  exitButton: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
