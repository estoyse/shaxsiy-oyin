import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';

export default function SafeArea({ children, ...props }: SafeAreaViewProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} {...props}>
      {children}
    </SafeAreaView>
  );
}
