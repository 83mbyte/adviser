import { Box, Text, IconButton, Tooltip, Skeleton, Stack, Card, Image, CardBody, CardFooter, CardHeader, useToast } from "@chakra-ui/react";
import { useRef, useEffect } from 'react';

import { BsArrowRepeat } from "react-icons/bs";
import { MdSaveAlt, MdZoomIn } from "react-icons/md";

import { useSettingsContext } from "@/src/context/SettingsContext";

const ResultContentImages = ({ themeColor, currentImages, isLoading, setPromptToRepeat }) => {
    const toast = useToast();
    const chatHistoryRef = useRef(null);
    const showModalSettings = useSettingsContext().showModalWindow;

    const save64toFile = async (base64String, fileNameSuffix) => {
        try {

            const response = await fetch(`data:image/png;base64,${base64String}`); //png result
            // const response = await fetch(`data:image/webp;base64,${base64String}`); //webp result
            if (response.ok) {
                const blob = await response.blob();
                createSaveLink(blob, blob.type.split('/')[1], fileNameSuffix)
            }
        } catch (error) {
            console.error('Error while download: ', error);
            toast({
                position: 'top-right',
                title: `Unable to download`,
                status: 'error',
                duration: 5000,
                containerStyle: {
                    maxWidth: '100%',
                    marginTop: '100px'
                },
            });

        }
    }

    const createSaveLink = (imgBlob, ext, fileNameSuffix) => {

        const FILE_NAME = `IMG_${fileNameSuffix}.${ext}`;

        const savelink = document.createElement("a");
        savelink.style.opacity = '0';
        savelink.style.height = '0';

        savelink.href = URL.createObjectURL(imgBlob);
        savelink.download = FILE_NAME;

        document.body.appendChild(savelink);
        savelink.click();
        document.body.removeChild(savelink);
    }


    useEffect(() => {
        if (isLoading || (!isLoading && currentImages && currentImages.length > 0)) {
            let lastChild = chatHistoryRef?.current?.lastElementChild;
            lastChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [isLoading]);

    return (
        <Box bg='' display={'block'} overflow='auto' p={0} pb={1}>

            <Stack ref={chatHistoryRef} direction={['column', 'row']} wrap={'wrap'}>

                {
                    currentImages && currentImages.length > 0 &&
                    currentImages.map((chatItem, index) => {

                        let fileNameSuffix = Date.now().toString().substring(5);
                        return (

                            <Card w={{ base: 'full', sm: '48%' }} key={index}>
                                <CardHeader my={0} pt={1} pb={2} bg=''  >
                                    <Box display={'flex'} justifyContent={'space-between'}>
                                        <Text w='100%' textAlign={'center'} fontSize={['sm', 'md']}>{`${(chatItem['user'].content).substring(0, 35)}..`}</Text>
                                        <RepeatPrompt data={chatItem['user'].content} themeColor={themeColor} setPromptToRepeat={setPromptToRepeat} />
                                    </Box>
                                </CardHeader>
                                <CardBody bg='' display={'flex'} alignItems={'center'} justifyContent={'center'} my={0} pt={0} pb={0} overflow={'hidden'}>
                                    {/* render b64 */}
                                    {/* <Image src={`data:image/webp;base64, ${chatItem['assistant'].content}`} w='256px' h={'256px'} borderRadius={'md'} alt={`img_${index}`} /> */}
                                    <Image src={`data: image/png;base64, ${chatItem['assistant'].content}`} w='256px' h={'256px'} borderRadius={'md'} alt={`img_${index}`} />
                                    <div id='imgContainer'>
                                    </div>
                                </CardBody>
                                <CardFooter bg='' my={0} pt={0} pb={2}>
                                    <Stack direction={'row'} bg='' w='full' justifyContent={'space-around'}>
                                        <Tooltip label='Expand' hasArrow bg={`${themeColor}.500`}>
                                            <IconButton
                                                colorScheme={themeColor}
                                                variant={'ghost'}
                                                fontSize='18px'
                                                icon={<MdZoomIn />}
                                                onClick={() => showModalSettings.setShowModal({ isShow: true, type: 'ZoomImgModal', body: chatItem['assistant'].content })}
                                            />
                                        </Tooltip>
                                        <Tooltip label='Download' hasArrow bg={`${themeColor}.500`}>
                                            <IconButton
                                                colorScheme={themeColor}
                                                variant={'ghost'}
                                                fontSize='20px'
                                                icon={<MdSaveAlt />}
                                                onClick={() => save64toFile(chatItem['assistant'].content, (fileNameSuffix + '_' + index))}
                                            />
                                        </Tooltip>
                                    </Stack>
                                </CardFooter>
                            </Card>
                        )
                    })
                }
                {
                    isLoading &&
                    <Box w={{ base: 'full', sm: '48%' }} minH='260px' h={{ base: '260px', sm: 'auto' }}  >
                        <Skeleton h={'100%'} w='full' />
                    </Box>
                }
            </Stack>
        </Box>
    );
};

export default ResultContentImages;


const RepeatPrompt = ({ data, themeColor, setPromptToRepeat }) => {
    const repeatPrompt = () => {
        setPromptToRepeat(data);
    }
    return (
        <Box bg=''
            position={'relative'}
            color={`${themeColor}.600`}
            // color={'gray.400'}
            alignItems={'center'}
            display={'flex'}
            p={0}
            pl={'1'}
        >

            <Tooltip label='Repeat it' hasArrow bg={`${themeColor}.500`}>
                <IconButton
                    size={'xs'}
                    onClick={repeatPrompt}
                    icon={<BsArrowRepeat size={'18px'} />}
                    color={'inherit'}
                    _hover={{ color: `${themeColor}.500` }}
                    variant={'link'}
                    aria-label={'Copy to Clipboard'}
                />
            </Tooltip>
        </Box>
    )
}