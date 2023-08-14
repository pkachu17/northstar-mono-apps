import React, { useState, useEffect } from 'react'
import { Button, Input, XStack } from 'tamagui'

const MySearchBar = ({ onSearching, query }) => {

    const [searchText, setSearchText] = useState(query)
    const [searching, setSearching] = useState(true)

    useEffect(() => {
    }, [searchText])

    return (
        <XStack ai="center" space="$3">
            <Input
                f={1}
                maw={'75%'}
                placeholder={`Search..`}
                onChangeText={setSearchText}
                value={searchText}
                onSubmitEditing={() => onSearching(searchText)}
            // autoFocus={true}
            />
            <Button size="$4" fontSize={14} onPress={() => onSearching(searchText)}>Go</Button>
        </XStack>
    )
}
export default MySearchBar