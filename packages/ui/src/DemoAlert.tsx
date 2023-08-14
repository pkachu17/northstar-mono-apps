import { AlertDialog, Button, XStack, YStack } from 'tamagui'

export function DemoAlert() {
    return (
        <AlertDialog native>
            <AlertDialog.Trigger asChild>
                <Button my="$8">Signin with Google</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay
                    key="overlay"
                    animation="quick"
                    o={0.5}
                    enterStyle={{ o: 0 }}
                    exitStyle={{ o: 0 }}
                />
            </AlertDialog.Portal>
            <AlertDialog.Content
                bordered
                elevate
                key="content"
                animation={[
                    'quick',
                    {
                        opacity: {
                            overshootClamping: true,
                        },
                    },
                ]}
                enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                x={0}
                scale={1}
                opacity={1}
                y={0}
            >
                <YStack space>
                    <AlertDialog.Title>Under construction</AlertDialog.Title>
                    <AlertDialog.Description>
                        This feature is a work in progress!
                    </AlertDialog.Description>
                    <AlertDialog.Cancel asChild>
                        <Button>Cancel</Button>
                    </AlertDialog.Cancel>
                </YStack>
            </AlertDialog.Content>
        </AlertDialog>
    )
}
