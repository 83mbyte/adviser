import { Box, HStack } from '@chakra-ui/react';

const SliderLabels = ({ labels }) => {
    const labelStyles = {
        mt: '-1',
        fontSize: 'xs',
    }
    return (

        <HStack justifyContent={'space-between'}>
            <Box flex={1} {...labelStyles}>
                {labels[0]}
            </Box>
            <Box flex={1} textAlign={'center'} {...labelStyles}>
                {labels[1]}
            </Box>
            <Box flex={1} textAlign={'end'} {...labelStyles}>
                {labels[2]}
            </Box>
        </HStack>
    );
};

export default SliderLabels;