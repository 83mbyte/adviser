'use client'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import AuthContextProvider from './AuthContextProvider';

const theme = extendTheme({

})
export function NecessaryProviders({
    children
}) {


    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                <AuthContextProvider>

                    {children}

                </AuthContextProvider>
            </ChakraProvider>
        </CacheProvider>
    )
}