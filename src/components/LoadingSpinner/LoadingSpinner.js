import { Box, CircularProgress, CircularProgressLabel } from '@chakra-ui/react';

const LoadingSpinner = ({ spinnerColor, progress }) => {

    return (

        <Box
            display={'flex'}
            height={'100%'}
            flexDirection={'column'}
            flex={1}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <CircularProgress value={progress} color={`${spinnerColor}.500`}>
                <CircularProgressLabel>{`${progress}%`}</CircularProgressLabel>
            </CircularProgress>
        </Box>
    );
};

export default LoadingSpinner;