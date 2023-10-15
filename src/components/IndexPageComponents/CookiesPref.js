'use client'

import React from 'react'
import { Stack, Text, Button, Slide, IconButton } from '@chakra-ui/react'
import { FcLock } from 'react-icons/fc'
import { RiCloseFill } from "react-icons/ri";
export default function CookiePref({ isOpen, setIsOpen }) {
    const clickOK = () => {
        localStorage.setItem('cookiesReported', 'true')
        setIsOpen(false)
    }
    return (
        <Slide direction={'bottom'} in={isOpen} style={{ zIndex: 10 }}  >
            <Stack p="4" boxShadow="lg" m="4" borderRadius="sm" bg='white' >
                <Stack direction="row" alignItems="center" justifyContent={'space-between'}>
                    <Stack direction="row" alignItems="center">
                        <Text fontWeight="semibold">Your Privacy</Text>
                        <FcLock />
                    </Stack>
                    <IconButton
                        icon={<RiCloseFill />}
                        variant={'link'}
                        onClick={() => setIsOpen(false)}
                    />

                </Stack>

                <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-between">
                    <Text fontSize={{ base: 'sm' }} textAlign={'left'} maxW={'full'}>
                        We use cookies and similar technologies to help personalise content, tailor and
                        measure ads, and provide a better experience. By clicking OK or turning an
                        option on in Cookie Preferences, you agree to this, as outlined in our Cookie
                        Policy. To change preferences or withdraw consent, please update your Cookie
                        Preferences.
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }}>
                        <Button variant="outline" colorScheme="green" isDisabled>
                            Cookie Preferences
                        </Button>
                        <Button colorScheme="green" onClick={clickOK}>OK</Button>
                    </Stack>
                </Stack>
            </Stack>
        </Slide>
    )
}