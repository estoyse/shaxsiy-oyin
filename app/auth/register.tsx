import React from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { EyeOff } from 'lucide-react-native';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { router, Stack } from 'expo-router';
import { SocialConnections } from '@/components/social-connections';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner-native';

const RegisterScreen = () => {
  const [email, setEmail] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const passwordInputRef = React.useRef<TextInput>(null);
  const emailInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onFullNameSubmitEditing() {
    emailInputRef.current?.focus();
  }

  async function signUpWithEmail() {
    setLoading(true);
    console.log({ email, password, fullName });
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    console.log({ session, error });

    if (error) {
      console.log(error);
      toast.error(error.message);
    } else if (!session) {
      toast.info('Please check your inbox for email verification!');
    } else {
      toast.success('Successfully signed up!');
    }
    setLoading(false);
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1 bg-black"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Background Glow - Simulated with absolute views */}
        <View className="absolute top-0 right-0 left-0 h-1/2 rounded-b-[100px] bg-[#3a441c]/20" />

        {/* Hero Content */}
        <View className="mt-8 items-center px-8">
          {/* Central Orb / Graphic */}
          <View className="h-24 w-24 items-center justify-center rounded-full border border-white/5 bg-[#caff33]/10 shadow-2xl">
            <View className="h-16 w-16 rounded-full bg-[#caff33]/30" />
          </View>

          <Text className="mt-8 text-3xl font-bold tracking-tight text-white">
            Create Your Account
          </Text>
          <Text className="mt-3 px-4 text-center leading-5 text-gray-400">
            Create your account to explore exciting features
          </Text>
        </View>

        {/* Form Section */}
        <View className="mt-12 gap-y-6 px-8">
          <View className="gap-y-2">
            <Label className="text-md ml-1 text-gray-300">Full name</Label>
            <Input
              placeholder="Alex Smith"
              value={fullName}
              onChangeText={setFullName}
              keyboardType="default"
              autoComplete="name"
              autoCapitalize="words"
              onSubmitEditing={onFullNameSubmitEditing}
              returnKeyType="next"
              submitBehavior="submit"
              className="h-14 rounded-2xl border-white/10 bg-transparent text-white"
            />
          </View>

          {/* Email Field */}
          <View className="gap-y-2">
            <Label className="text-md ml-1 text-gray-300">Email address*</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              onSubmitEditing={onEmailSubmitEditing}
              returnKeyType="next"
              submitBehavior="submit"
              ref={emailInputRef}
              className="h-14 rounded-2xl border-white/10 bg-transparent text-white"
            />
          </View>

          {/* Password Field */}
          <View className="gap-y-2">
            <Label className="text-md ml-1 text-gray-300">Password*</Label>
            <View className="border-red relative border-2">
              <Input
                ref={passwordInputRef}
                id="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={signUpWithEmail}
                placeholder="@Sn123hsn#"
                className="h-14 rounded-2xl border-white/10 bg-transparent pr-12 text-white"
              />
              <View className="absolute top-1/2 right-4 -translate-y-1/2">
                <Icon as={EyeOff} size={20} color="#6b7280" />
              </View>
            </View>
          </View>

          {/* Primary Action */}
          <Button
            className="h-16 flex-row gap-x-2 rounded-full bg-[#caff33] active:opacity-90"
            disabled={loading}
            onPress={signUpWithEmail}>
            <Text className="text-lg font-bold text-black">
              {loading ? 'Loading...' : 'Sign up'}
            </Text>
          </Button>
        </View>

        {/* Social Login */}
        <View className="mt-10 px-8">
          <View className="mb-8 flex-row items-center">
            <View className="h-px flex-1 bg-white/10" />
            <Text className="text-md mx-4 font-bold tracking-widest text-gray-500 uppercase">
              Or continue with
            </Text>
            <View className="h-px flex-1 bg-white/10" />
          </View>

          <View className="flex-row gap-x-4">
            <SocialConnections />
          </View>

          <View className="mt-12 flex-row items-center justify-center pb-10">
            <Text className="text-md text-gray-400">Don't have an account?&nbsp;</Text>
            <Pressable onPress={() => router.replace('/auth/register')}>
              <Text className="text-md font-bold text-white">Sign up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default RegisterScreen;
