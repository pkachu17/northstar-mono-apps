import React, { useState } from 'react';
import { View, Text } from 'react-native';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Paragraph, XStack } from 'tamagui';

const RatingComponent = (props: { defaultRating: number, totalCount: number, isEditable: boolean, onRatingChange: undefined }) => {
    const { defaultRating, totalCount, isEditable, onRatingChange } = props
    const [rating, setRating] = useState<number>(defaultRating);

    const onStarRatingPress = (rating: number): void => {
        setRating(rating);
        onRatingChange(rating)
    };
    return (
        <XStack ai="center" space="$3">
            <Paragraph fontSize={15}>{rating}</Paragraph>
            {
                isEditable ? (
                    <StarRating
                        maxStars={5.0}
                        rating={rating}
                        starSize={20}
                        color={'orange'}
                        onChange={(rating: number) => onStarRatingPress(rating)}
                        starStyle={{ width: 12 }}
                    />
                ) : (
                    <StarRatingDisplay
                        maxStars={5.0}
                        rating={rating}
                        starSize={20}
                        color={'orange'}
                        style={{}}
                        starStyle={{ width: 12 }}
                    />
                )
            }

            <Paragraph fontSize={15}>{"( " + totalCount + " )"}</Paragraph>
        </XStack>
    );
};

export default RatingComponent;
