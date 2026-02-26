import { Pressable, PressableProps } from 'react-native';

export default function TactileButton({ children, ...props }: PressableProps) {
  return (
    <Pressable
      className="bg-primary h-12 w-full flex-row items-center justify-center gap-2 rounded-xl active:translate-y-1"
      style={{
        boxShadow: '0px 4px 0px #02661c',
      }}
      {...props}>
      {children}
    </Pressable>
  );
}
