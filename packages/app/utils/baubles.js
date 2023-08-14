import { PixelRatio } from 'react-native'
import { Dimensions } from 'react-native';

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

export const isTablet = () => {
    let pixelDensity = PixelRatio.get();
    const screenWidth = screenDimensions.width
    const screenHeight = screenDimensions.height

    const adjustedWidth = screenWidth * pixelDensity;
    const adjustedHeight = screenHeight * pixelDensity;

    if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
        return true;
    } else
        return (
            pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
        );
};

export function printObj(msg, obj) {
    console.log(msg, JSON.stringify(obj, null, '\t'))
}