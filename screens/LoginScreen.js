import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLORS } from '../constants/colors';
import {
  auth,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseConfig
} from '../services/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [isPhoneLogin, setIsPhoneLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmResult, setConfirmResult] = useState(null);

  // Animate underline on tab switch
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const recaptchaVerifier = useRef(null);

  const switchToPhone = () => {
    setIsPhoneLogin(true);
    setErrorMsg('');
    setSuccessMsg('');
    Animated.timing(underlineAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const switchToEmail = () => {
    setIsPhoneLogin(false);
    setErrorMsg('');
    setSuccessMsg('');
    Animated.timing(underlineAnim, {
      toValue: width / 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      // Ensure phone in proper format e.g. +919876543210
      if (!phone.startsWith('+')) {
        setLoading(false);
        setErrorMsg('Please enter phone number in international format with +');
        return;
      }
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier.current);
      setConfirmResult(confirmation);
      setOtpSent(true);
      setSuccessMsg('OTP sent successfully to your phone!');
    } catch (error) {
      setErrorMsg(error.message);
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (!confirmResult) {
        setErrorMsg('No OTP request found. Please resend OTP.');
        setLoading(false);
        return;
      }
      if (otp.length !== 6) {
        setErrorMsg('OTP must be 6 digits.');
        setLoading(false);
        return;
      }
      await confirmResult.confirm(otp);
      setSuccessMsg('OTP verified! Logging you in...');
      navigation.replace('Home');
    } catch (error) {
      setErrorMsg('Invalid OTP. Please try again.');
    }
    setLoading(false);
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (!email || password.length < 6) {
        setErrorMsg('Please enter a valid email and password (min 6 chars).');
        setLoading(false);
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('Home');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Prompt user to create account
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          setSuccessMsg('Account created! Logging you in...');
          navigation.replace('Home');
        } catch (signUpError) {
          setErrorMsg(signUpError.message);
        }
      } else {
        setErrorMsg(error.message);
      }
    }
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={[COLORS.primary, '#005C97']} style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%', justifyContent: 'center' }}
        >
          <View style={styles.header}>
            <Animatable.Text animation="fadeInDown" style={styles.title}>
              NEURAL RESQ
            </Animatable.Text>
            <Text style={styles.subtitle}>Secure Login to Save Lives</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={switchToPhone} style={styles.tab}>
              <Text style={[styles.tabText, isPhoneLogin && styles.activeTabText]}>Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={switchToEmail} style={styles.tab}>
              <Text style={[styles.tabText, !isPhoneLogin && styles.activeTabText]}>Email</Text>
            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              styles.underline,
              { transform: [{ translateX: underlineAnim }] },
              { width: width / 2 },
            ]}
          />

          <ScrollView
            style={{ flexGrow: 0 }}
            contentContainerStyle={{ marginTop: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {isPhoneLogin ? (
              <Animatable.View animation="fadeInRight" duration={700}>
                {!otpSent ? (
                  <>
                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="+91 9876543210"
                      placeholderTextColor="#aaa"
                      keyboardType="phone-pad"
                      maxLength={13}
                      value={phone}
                      onChangeText={(text) => setPhone(text)}
                    />
                    {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSendOtp}
                      disabled={!phone || loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Send OTP</Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.inputLabel}>Enter OTP</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="6-digit OTP"
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                      maxLength={6}
                      value={otp}
                      onChangeText={setOtp}
                    />
                    {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
                    {successMsg ? <Text style={styles.successText}>{successMsg}</Text> : null}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleVerifyOtp}
                      disabled={otp.length !== 6 || loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Verify OTP</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setOtpSent(false);
                        setOtp('');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      style={{ marginTop: 12, alignSelf: 'center' }}
                    >
                      <Text style={styles.linkText}>Change Phone Number</Text>
                    </TouchableOpacity>
                  </>
                )}
              </Animatable.View>
            ) : (
              <Animatable.View animation="fadeInLeft" duration={700}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="******"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleEmailLogin}
                  disabled={!email || !password || loading}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                </TouchableOpacity>
              </Animatable.View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New to NEURAL RESQ?</Text>
            <TouchableOpacity onPress={() => Alert.alert('Redirect to Sign Up')}>
              <Text style={[styles.linkText, { marginLeft: 8 }]}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLORS.background,
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textLight,
    opacity: 0.9,
    marginTop: 6,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 46,
    borderRadius: 30,
    backgroundColor: COLORS.inputBackground,
    marginTop: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: COLORS.textLight,
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  underline: {
    height: 3,
    backgroundColor: COLORS.secondary,
    borderRadius: 4,
    marginTop: -3,
    width: width / 2,
  },
  inputLabel: {
    fontSize: 15,
    color: COLORS.textLight,
    marginVertical: 8,
    marginLeft: 8,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    color: COLORS.textLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    marginTop: 20,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginTop: 6,
    marginLeft: 8,
  },
  successText: {
    color: COLORS.success,
    fontSize: 14,
    marginTop: 6,
    marginLeft: 8,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.secondary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;