import { View, Text, Alert, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { useSignUp } from '@clerk/clerk-expo'
import { authStyles } from '../../assets/styles/auth.styles';
import { Image } from 'expo-image';
import { useState } from 'react';
import { COLORS } from '../../constants/colors.js';

const VerifyEmail = ({email, onBack}) => {
  const {isLoaded, signUp, setActive} = useSignUp();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerification = async() => {
    try {
      if(!isLoaded) return;

      setLoading(true)
      try {
        const signUpAttempt = await signUp.attemptEmailAddressVerification({code})
        if (signUpAttempt.status === "complete"){
          await setActive({session:signUpAttempt.createdSessionId })
        }
        else{
          Alert.alert("Error", "Verification failed. Please try again.");
          console.error(JSON.stringify(signUpAttempt, null, 2));
        }
    } catch (error) {
      Alert.alert("Error", err.errors?.[0]?.message || "Verification faied");
      console.error(JSON.stringify(err, null, 2));
    }
  }
    finally{
      setLoading(false)
    }
  }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
            style={authStyles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 70}
            >
              <ScrollView 
              contentContainerStyle={authStyles.scrollContent}
              showsVerticalScrollIndicator = {false}
              >
                {/* Image view */}
                <View style={authStyles.imageContainer}>
                  <Image source={require("../../assets/images/i3.png")}
                  style={authStyles.image}
                  contentFit='contain'
                  />
                  </View>
                  {/* Title */}
                  <Text style={authStyles.title}>Verify your Email</Text>
                <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>

                <View style={authStyles.formContainer}>
                  {/* Verification code input */}
                  <View style={authStyles.inputContainer}>
                    <TextInput
                    style={authStyles.textInput}
                    placeholder='Enter verification code'
                    placeholderTextColor={COLORS.textLight}
                    value={code}
                    onChangeText={setCode}
                    keyboardType='number-pad'
                    autoCapitalize='none'
                    />
                  </View>

                  {/* Verify Button */}
                  <TouchableOpacity
                  style={[authStyles.authButton, loading && authStyles.buttonDisabled]}
                  onPress={handleVerification}
                  disabled={loading}
                  activeOpacity={0.8}
                  >
                    <Text style={authStyles.buttonText}>{loading ? "Verification..." : "Verify email"}</Text>
                  </TouchableOpacity>

                  {/* Back to Sign Up */}
                  <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
                    <Text style={authStyles.linkText}>
                      <Text style={authStyles.link}>Back to Sign Up</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
    </View>
  )
}

export default VerifyEmail;