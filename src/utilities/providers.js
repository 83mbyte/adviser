'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import ContextProvider from './ContextProvider'

const theme = extendTheme({

})
export function Providers({
    children
}) {


    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <ContextProvider>

                    {children}

                </ContextProvider>
            </ChakraProvider>
        </CacheProvider>
    )
}