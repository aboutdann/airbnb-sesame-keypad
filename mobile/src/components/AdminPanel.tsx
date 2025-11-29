import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { apiService, Pin, CreatePinRequest } from '../services/api';

interface AdminPanelProps {
  adminToken: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminToken }) => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePinRequest>({
    code: '',
    type: 'temporary',
    label: '',
    phone: '',
  });

  useEffect(() => {
    loadPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPins = async () => {
    setLoading(true);
    const response = await apiService.getPins(adminToken);
    if (response.ok) {
      setPins(response.pins);
    } else {
      Alert.alert('Error', response.error || 'Failed to load pins');
    }
    setLoading(false);
  };

  const handleCreatePin = async () => {
    if (!formData.code && !formData.label) {
      Alert.alert('Error', 'Please enter a code or label');
      return;
    }

    setLoading(true);
    const response = await apiService.createPin(adminToken, formData);
    setLoading(false);

    if (response.ok) {
      Alert.alert('Success', 'PIN created successfully!');
      setFormData({
        code: '',
        type: 'temporary',
        label: '',
        phone: '',
      });
      loadPins();
    } else {
      Alert.alert('Error', response.error || 'Failed to create PIN');
    }
  };

  const handleDeletePin = async (id: number) => {
    Alert.alert(
      'Delete PIN',
      'Are you sure you want to delete this PIN?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await apiService.deletePin(adminToken, id);
            if (response.ok) {
              loadPins();
            } else {
              Alert.alert('Error', 'Failed to delete PIN');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ Admin Settings</Text>

      <TouchableOpacity style={styles.button} onPress={loadPins} disabled={loading}>
        <Text style={styles.buttonText}>🔄 Refresh Pins</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>➕ Create New PIN</Text>

        <TextInput
          style={styles.input}
          placeholder="Code (optional, auto-generated if empty)"
          placeholderTextColor="#888"
          value={formData.code}
          onChangeText={(text) => setFormData({ ...formData, code: text })}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Label (Guest name)"
          placeholderTextColor="#888"
          value={formData.label}
          onChangeText={(text) => setFormData({ ...formData, label: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone (+1234567890 for SMS)"
          placeholderTextColor="#888"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleCreatePin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>✅ Create & Notify</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Active Pins</Text>
        {loading && pins.length === 0 ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : pins.length === 0 ? (
          <Text style={styles.emptyText}>No pins</Text>
        ) : (
          pins.map((pin) => (
            <View key={pin.id} style={styles.pinItem}>
              <View style={styles.pinInfo}>
                <Text style={styles.pinCode}>{pin.code}</Text>
                <Text style={styles.pinLabel}>
                  {pin.label || `PIN ${pin.id}`} ({pin.type})
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePin(pin.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 30, 0.95)',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4ade80',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4ade80',
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'rgba(40, 40, 50, 0.8)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  button: {
    backgroundColor: 'rgba(60, 60, 80, 0.8)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#4ade80',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderRadius: 8,
  },
  pinInfo: {
    flex: 1,
  },
  pinCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  pinLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    padding: 20,
  },
});

export default AdminPanel;

