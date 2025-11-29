import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';

interface KeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

const Keypad: React.FC<KeypadProps> = ({
  onDigitPress,
  onBackspace,
  onSubmit,
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handlePress = (key: string, action: () => void) => {
    Vibration.vibrate(50);
    setPressedKey(key);
    action();
    setTimeout(() => setPressedKey(null), 150);
  };

  const keys = [
    { label: '1', value: '1', type: 'digit' },
    { label: '2', value: '2', type: 'digit' },
    { label: '3', value: '3', type: 'digit' },
    { label: '4', value: '4', type: 'digit' },
    { label: '5', value: '5', type: 'digit' },
    { label: '6', value: '6', type: 'digit' },
    { label: '7', value: '7', type: 'digit' },
    { label: '8', value: '8', type: 'digit' },
    { label: '9', value: '9', type: 'digit' },
    { label: '⌫', value: 'backspace', type: 'action' },
    { label: '0', value: '0', type: 'digit' },
    { label: '✓', value: 'submit', type: 'action' },
  ];


  return (
    <View style={styles.keypadContainer}>
      {keys.map((key) => {
        const isPressed = pressedKey === key.value;
        const isAction = key.type === 'action';
        const isZero = key.value === '0';

        return (
          <View
            key={key.value}
            style={[styles.keyWrapper, isZero && styles.keyZeroWrapper]}
          >
            <TouchableOpacity
              style={[
                styles.key,
                isPressed && styles.keyPressed,
                isZero && styles.keyZero,
                isAction && styles.actionKey,
              ]}
              onPress={() => {
                if (key.value === 'backspace') {
                  handlePress(key.value, onBackspace);
                } else if (key.value === 'submit') {
                  handlePress(key.value, onSubmit);
                } else {
                  handlePress(key.value, () => onDigitPress(key.value));
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.keyText, isAction && styles.actionKeyText]}>
                {key.label}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  keyWrapper: {
    width: '28%',
    margin: 6,
  },
  key: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(60, 60, 80, 0.8)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  keyPressed: {
    backgroundColor: 'rgba(74, 222, 128, 0.3)',
    borderColor: '#4ade80',
    transform: [{ scale: 0.95 }],
  },
  keyZero: {
    width: '60%',
  },
  keyZeroWrapper: {
    width: '60%',
    margin: 6,
  },
  actionKey: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
  },
  keyText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  actionKeyText: {
    color: '#4ade80',
    fontSize: 24,
  },
});

export default Keypad;

