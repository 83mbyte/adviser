'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'

export function NecessaryProviders({
    children
}) {
    return (
        <CacheProvider>
            <ChakraProvider>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}