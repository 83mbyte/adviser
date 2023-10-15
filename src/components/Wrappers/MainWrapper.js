import { Box } from '@chakra-ui/react';
import React from 'react';

const MainWrapper = ({ direction = 'column', align = 'center', justify = 'space-between', children }) => {
    return (
        <Box
            bg=''
            display={"flex"}
            flexDirection={direction}
            w={"full"}
            h={"100%"}
            maxH={'100%'}
            width={["full", "full", "xl", "3xl"]}
            alignItems={align}
            justifyContent={justify}
            px={[1, 2]}
            overflow={'hidden'}
        >
            {children}
        </Box>
    );
};

export default MainWrapper;