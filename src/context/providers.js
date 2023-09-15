'use client'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'


const theme = extendTheme({

})
export function NecessaryProviders({
    children
}) {


    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>


                {children}

            </ChakraProvider>
        </CacheProvider>
    )
}