import React, { useState } from 'react'
import { X } from '@tamagui/lucide-icons'
import {
    Adapt,
    Button,
    Dialog,
    Fieldset,
    Input,
    Paragraph,
    Sheet,
    Unspaced,
    YStack,
} from 'tamagui'

export function ManualPaperAddDialog({ triggerChild, onSubmit }) {
    const [name, setName] = useState("")
    const [url, setURL] = useState("")

    return (
        <Dialog modal>
            <Dialog.Trigger asChild>
                {triggerChild}
            </Dialog.Trigger>

            <Adapt when="sm" platform="touch">
                <Sheet zIndex={200000} modal dismissOnSnapToBottom>
                    <Sheet.Frame padding="$4" space>
                        <Adapt.Contents />
                    </Sheet.Frame>
                    <Sheet.Overlay />
                </Sheet>
            </Adapt>

            <Dialog.Portal>
                <Dialog.Overlay
                    key="overlay"
                    animation="quick"
                    opacity={0.5}
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                />

                <Dialog.Content
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
                    space
                >
                    <Dialog.Title>Add Paper</Dialog.Title>
                    <Dialog.Description>
                        Type in the information below manually.
                    </Dialog.Description>
                    <Fieldset space="$4" horizontal>
                        <Paragraph width={120} justifyContent="flex-end" htmlFor="name">
                            Paper Title
                        </Paragraph>
                        <Input flex={1} id="ManualAddPaperDialogName" value={name} onChangeText={setName} />
                    </Fieldset>
                    <Fieldset space="$4" horizontal>
                        <Paragraph width={120} justifyContent="flex-end" htmlFor="name">
                            Paper URL
                        </Paragraph>
                        <Input flex={1} id="ManualAddPaperDialogURL" value={url} onChangeText={setURL} />
                    </Fieldset>

                    <YStack alignItems="flex-end" marginTop="$2">
                        <Dialog.Close displayWhenAdapted asChild>
                            <Button theme="alt1" aria-label="Close" onPress={() => onSubmit({ name, url })}>
                                Add
                            </Button>
                        </Dialog.Close>
                    </YStack>

                    <Unspaced>
                        <Dialog.Close asChild>
                            <Button position="absolute" top="$3" right="$3" size="$2" circular icon={X} />
                        </Dialog.Close>
                    </Unspaced>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog>
    )
}