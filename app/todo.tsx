import { Check } from '@tamagui/lucide-icons'
import { Checkbox, CheckboxProps, Label, SizeTokens, Text, View, XStack, YStack } from 'tamagui'

const CheckboxWithLabel = ({
  size,
  label = 'Accept terms and conditions',
  ...checkboxProps
}: CheckboxProps & { size: SizeTokens; label?: string }) => {
  const id = `checkbox-${size.toString().slice(1)}`
  return (
    <XStack width={300} alignItems="center" space="$4" onLongPress={() => {
      console.log('long press')
    }}>
      <Checkbox size="$4">
        <Checkbox.Indicator>
          <Check />
        </Checkbox.Indicator>
      </Checkbox>

      <Label size={size} htmlFor={id}>
        {label}
      </Label>
    </XStack>
  )
}

export function CheckboxDemo() {
  return (
    <YStack width={300} alignItems="center" space="$2">
      <CheckboxWithLabel size="$3" />
      <CheckboxWithLabel size="$4" defaultChecked />
      <CheckboxWithLabel size="$5" disabled label="Accept terms (disabled)" />
    </YStack>
  )
}


export default function TabOneScreen() {
  return (
    <View flex={1} alignItems="center">
      <CheckboxDemo />
    </View>
  )
}
