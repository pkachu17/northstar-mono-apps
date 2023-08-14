import React from 'react'
import { H4, Spinner, YStack } from 'tamagui'

const FullscreenLoader = (props) => {
    return (
        <YStack f={1} ai="center" jc="center" bg="$background" {...props}>
            <YStack ai="center" jc="center" bg="$backgroundFocus" p="$5" br="$4">
                <Spinner size="large" color="$orange10" />
                <H4>Loading</H4>
            </YStack>
        </YStack>
    )
}
export default FullscreenLoader