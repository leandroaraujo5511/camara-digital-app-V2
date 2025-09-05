import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '@/styles/colors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  disabled = false,
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.focused,
    error && styles.error,
    disabled && styles.disabled,
    style,
  ];

  const inputStyleArray = [
    styles.input,
    disabled && styles.disabledInput,
    inputStyle,
  ];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={inputContainerStyle}>
        <TextInput
          style={inputStyleArray}
          placeholder={placeholder}
          placeholderTextColor={colors.slate[500]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Text style={styles.eyeText}>
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.slate[100],
    marginBottom: 8,
  },
  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.slate[600],
    borderRadius: 8,
    backgroundColor: colors.slate[700],
    paddingHorizontal: 16,
    minHeight: 48,
  },
  
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.slate[100],
    paddingVertical: 12,
  },
  
  focused: {
    borderColor: colors.blue[500],
    borderWidth: 2,
    backgroundColor: colors.slate[600],
  },
  
  error: {
    borderColor: colors.red[500],
    backgroundColor: colors.red[900],
  },
  
  disabled: {
    backgroundColor: colors.slate[800],
    opacity: 0.6,
  },
  
  disabledInput: {
    color: colors.slate[500],
  },
  
  eyeButton: {
    padding: 8,
  },
  
  eyeText: {
    fontSize: 20,
  },
  
  errorText: {
    fontSize: 14,
    color: colors.red[400],
    marginTop: 4,
    marginLeft: 4,
  },
});

