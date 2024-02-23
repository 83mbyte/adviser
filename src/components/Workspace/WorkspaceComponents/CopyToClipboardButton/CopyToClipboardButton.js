const { Box, Menu, MenuButton, MenuList, MenuItem, Tooltip, IconButton, Button, useToast } = require("@chakra-ui/react");

import { RiFileCopy2Line } from "react-icons/ri";

const CopyToClipboardButton = ({ data, format, themeColor }) => {
    const toast = useToast();

    const stripTags = (stringWithHTML) => {
        const parseHTML = new DOMParser().parseFromString(stringWithHTML, 'text/html');
        return parseHTML.body.textContent || '';
    }
    const copyToClipboard = (type) => {
        let dataToCopy = null;

        switch (type) {
            case 'HTML':
                const htmlStart = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body>';
                const htmlEnd = '</body></html>';
                dataToCopy = `${htmlStart}${data}${htmlEnd}`;
                break;

            case 'Plain text':
                dataToCopy = stripTags(data);
                break
            default:
                dataToCopy = stripTags(data);
        }


        if (dataToCopy) {
            navigator.clipboard.writeText(dataToCopy).then(
                () => {
                    /* clipboard successfully set */
                    console.log('Copied');
                    toast({
                        position: 'top-right',
                        title: 'Copied.',
                        status: 'success',
                        duration: 2000,
                        containerStyle: {
                            maxWidth: '100%',
                            marginTop: '100px'
                        },
                    });
                },
                () => {
                    /* clipboard write failed */
                    console.error('Failed copy to clipboard.');
                    toast({
                        position: 'top',
                        title: 'Failed copy to clipboard.',
                        status: 'error',
                        duration: 1000,
                        containerStyle: {
                            maxWidth: '100%',
                            marginTop: '100px'
                        },
                    })
                },
            );
        }
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
            {
                format == 'HTML'
                    ? <Menu gutter={6} autoSelect={false}>
                        <MenuButton as={Button} size={'xs'} colorScheme={themeColor} variant={'ghost'} aria-label={'Copy to Clipboard'}>
                            Copy as..
                        </MenuButton>
                        <MenuList fontSize={['xs', 'sm']}  >
                            <MenuItem _hover={{ backgroundColor: `${themeColor}.50` }} onClick={(e) => copyToClipboard(e.target.innerText)}>HTML</MenuItem>
                            <MenuItem _hover={{ backgroundColor: `${themeColor}.50` }} onClick={(e) => copyToClipboard(e.target.innerText)}>Plain text</MenuItem>
                        </MenuList>
                    </Menu>
                    : <Tooltip label='Copy' hasArrow bg={`${themeColor}.500`}>

                        <IconButton
                            size={'xs'}
                            onClick={copyToClipboard}
                            icon={<RiFileCopy2Line size={'18px'} />}
                            color={'inherit'}
                            _hover={{ color: `${themeColor}.500` }}
                            variant={'link'}
                            aria-label={'Copy to Clipboard'}
                        />
                    </Tooltip>
            }
        </Box >
    )
}


export default CopyToClipboardButton;