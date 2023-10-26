import { Box, Text, IconButton, Tooltip, Skeleton, Image, Stack, Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react";
import { useRef, useEffect } from 'react';

import { MdZoomOutMap, MdSaveAlt } from "react-icons/md";
import { useUISettingsContext } from "@/src/context/UISettingsContext";
const ImageResult = ({ currentChat, themeColor, isLoadingBtn, }) => {

    const chatHistoryRef = useRef(null);
    const showModalSettings = useUISettingsContext().showModalWindow;

    const saveImageCreateBlob = async (url) => {
        if (url) {
            const fetchRes = await fetch(url, { method: 'GET', mode: 'cors', headers: {} });
            const blob = await fetchRes.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    resolve({ img: base64data, type: blob.type });
                }
            })
        }
    }

    const createSaveLink = (img, ext) => {
        const FILE_NAME = `generated_image.${ext}`;

        const savelink = document.createElement("a");
        savelink.style.opacity = '0';
        savelink.style.height = '0';

        savelink.href = img;
        savelink.download = FILE_NAME;

        document.body.appendChild(savelink);
        savelink.click();
        document.body.removeChild(savelink);
    }

    const saveImage = (url) => {

        saveImageCreateBlob(url).then((data) => {
            createSaveLink(data.img, data.type.split('/')[1])
        });
    }

    useEffect(() => {
        if (isLoadingBtn || (!isLoadingBtn && currentChat && currentChat.length > 0)) {
            let lastChild = chatHistoryRef?.current?.lastElementChild;
            console.log('last item? --> ', lastChild)
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [isLoadingBtn]);

    return (
        <Box bg='' display={'block'} overflow='auto' p={0} pb={1}>


            {/* // dev mode */}
            {/* <Card w={{ base: 'full', sm: '48%' }} key={'index'} m={'0 auto'}>
                <CardHeader my={0} pt={1} pb={2} bg=''  >
                    <Text w='100%' textAlign={'center'} >{`chatItem['user'].content`}</Text>
                </CardHeader>
                <CardBody bg='' display={'flex'} alignItems={'center'} justifyContent={'center'} my={0} pt={0} pb={0} overflow={'hidden'}>
                    <Image src={'https://lh3.googleusercontent.com/p/AF1QipNmYgl7ZpzblRTs6arXzEQSQTiUkQBEfPLLDSAm=s1360-w1360-h1020'} w='256px' h={'256px'} borderRadius={'md'} />
                </CardBody>
                <CardFooter bg='' my={0} pt={0} pb={2}>
                    <Stack direction={'row'} bg='' w='full' justifyContent={'space-around'}>
                        <Tooltip label='Expand' hasArrow bg={`${themeColor}.500`}>
                            <IconButton
                                colorScheme={themeColor}
                                variant={'ghost'}
                                fontSize='18px'
                                icon={<MdZoomOutMap />}
                                onClick={() => showModalSettings.setShowModal({ isShow: true, type: 'ZoomImgModal', body: 'https://lh3.googleusercontent.com/p/AF1QipPtHnqAZEbYLsGVpVP3CCY8K32CktQa7D3bmW2R=s1360-w1360-h1020' })}
                            />
                        </Tooltip>
                        <Tooltip label='Download' hasArrow bg={`${themeColor}.500`}>
                            <IconButton
                                colorScheme={themeColor}
                                variant={'ghost'}
                                fontSize='20px'
                                icon={<MdSaveAlt />}
                                onClick={() => saveImage(chatItem['assistant'].content)}
                            />
                        </Tooltip>
                    </Stack>
                </CardFooter>
            </Card> */}

            {/* ------- prod----- */}
            <Stack ref={chatHistoryRef} direction={['column', 'row']} wrap={'wrap'}>
                {
                    currentChat && currentChat.length > 0 &&
                    currentChat.map((chatItem, index) => {
                        return (

                            <Card w={{ base: 'full', sm: '48%' }} key={index}>
                                <CardHeader my={0} pt={1} pb={2} bg=''  >
                                    <Text w='100%' textAlign={'center'} >{`chatItem['user'].content`}</Text>
                                </CardHeader>
                                <CardBody bg='' display={'flex'} alignItems={'center'} justifyContent={'center'} my={0} pt={0} pb={0} overflow={'hidden'}>
                                    {/* <Box w='100%' minH={'256px'} maxH='260px' backgroundRepeat={'no-repeat'} backgroundPosition={'center'} backgroundSize={'cover'} backgroundImage={'url(https://lh3.googleusercontent.com/p/AF1QipNmYgl7ZpzblRTs6arXzEQSQTiUkQBEfPLLDSAm=s1360-w1360-h1020)'}></Box> */}
                                    <Image src={chatItem['assistant'].content} w='256px' h={'256px'} borderRadius={'md'} />
                                </CardBody>
                                <CardFooter bg='' my={0} pt={0} pb={2}>
                                    <Stack direction={'row'} bg='' w='full' justifyContent={'space-around'}>
                                        <Tooltip label='Expand' hasArrow bg={`${themeColor}.500`}>
                                            <IconButton
                                                colorScheme={themeColor}
                                                variant={'ghost'}
                                                fontSize='18px'
                                                icon={<MdZoomOutMap />}
                                                onClick={() => showModalSettings.setShowModal({ isShow: true, type: 'ZoomImgModal', body: chatItem['assistant'].content })}
                                            />
                                        </Tooltip>
                                        <Tooltip label='Download' hasArrow bg={`${themeColor}.500`}>
                                            <IconButton
                                                colorScheme={themeColor}
                                                variant={'ghost'}
                                                fontSize='20px'
                                                icon={<MdSaveAlt />}
                                                onClick={() => saveImage(chatItem['assistant'].content)}
                                            />
                                        </Tooltip>
                                    </Stack>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
                {
                    isLoadingBtn &&
                    <Box w={{ base: 'full', sm: '48%' }} minH='260px' h={{ base: '260px', sm: 'auto' }}  >
                        <Skeleton h={'100%'} w='full' />
                    </Box>
                }
            </Stack>
        </Box>
    );
};

export default ImageResult;


