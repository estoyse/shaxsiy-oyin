import { ScrollView, View } from 'react-native';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import { Text } from '../ui/text';
import { BlurView } from 'expo-blur';
import { useGameStore } from '@/store/useGameStore';

export default function QuestionComponent() {
  const lockedBy = useGameStore((state) => state.lockedBy);
  const currentQuestion = useGameStore((state) => state.currentQuestion);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="pb-96"
      showsVerticalScrollIndicator={false}>
      <View className="gap-2">
        <Card className="mx-4 py-4">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>{currentQuestion?.category || 'Mavzu nomi'}</CardTitle>
            <CardDescription>
              <Badge variant={'default'} className="p-1 px-4">
                <Text className="text-md">{(currentQuestion?.difficulty || 1) * 10}</Text>
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="relative overflow-clip rounded-2xl">
            <Text>{currentQuestion?.text || 'Savol Matni'}</Text>
            {lockedBy && (
              <BlurView
                tint="dark"
                intensity={20}
                experimentalBlurMethod="dimezisBlurView"
                className="absolute top-0 right-4 bottom-0 left-4 items-center justify-center overflow-clip rounded-2xl py-2"></BlurView>
            )}
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
