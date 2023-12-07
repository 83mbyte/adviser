import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Tooltip
} from '@chakra-ui/react'
import { useState, Fragment } from 'react';
import SliderLabels from './SliderLabels';

const SliderTemplate = ({ themeColor, value, callback, labels, valuesSettings, defaultTooltipValue, arialLabel }) => {
    const [sliderValue, setSliderValue] = useState(value);
    const [showTooltip, setShowTooltip] = useState(false);

    return (

        <Fragment key={`slider_${arialLabel}`}>
            <Slider aria-label={`slider-${arialLabel}-param`}
                defaultValue={value} min={valuesSettings.min} max={valuesSettings.max} step={valuesSettings.step}
                colorScheme={themeColor}
                onChange={(val) => setSliderValue(val)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onChangeEnd={(val) => callback(val)}
            >
                <SliderTrack height={'2'}>
                    <SliderFilledTrack />
                </SliderTrack>
                <Tooltip
                    hasArrow
                    bg={themeColor}
                    color='white'
                    placement='top'
                    isOpen={showTooltip}
                    label={sliderValue == defaultTooltipValue ? 'Default' : sliderValue}
                >
                    <SliderThumb boxSize={6} />
                </Tooltip>
            </Slider >
            <SliderLabels labels={labels} />
        </Fragment>
    )
}

export default SliderTemplate;