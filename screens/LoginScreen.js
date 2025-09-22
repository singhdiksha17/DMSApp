import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  // 1️⃣ Generate OTP
  const generateOtp = async () => {
    if (!mobile) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    try {
      const response = await axios.post(
        'https://apis.allsoft.co/api/documentManagement/generateOTP',
        { mobile_number: mobile }
      );
      console.log(response.data);
      Alert.alert('Success', 'OTP sent to your mobile number');
      setShowOtpInput(true);
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to generate OTP');
    }
  };

  // 2️⃣ Validate OTP
  const validateOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    try {
      const response = await axios.post(
        'https://apis.allsoft.co/api/documentManagement/validateOTP',
        { mobile_number: mobile, otp: otp }
      );
      console.log(response.data);

      const token = response.data.token;
      if (token) {
        Alert.alert('Success', 'Login successful');
        // Navigate to UploadScreen with token
        navigation.navigate('Upload', { token });
      } else {
        Alert.alert('Error', 'Invalid OTP');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'OTP verification failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="numeric"
        value={mobile}
        onChangeText={setMobile}
      />
      <Button title="Generate OTP" onPress={generateOtp} />

      {showOtpInput && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
          <Button title="Verify OTP" onPress={validateOtp} />
        </>
      )}
    </View>
  );
}

// 3️⃣ Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
});

