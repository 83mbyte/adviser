'use client'

import {
    Button, Box, Card, CardBody, CardFooter, HStack, Icon, Spinner, Text
} from '@chakra-ui/react';


import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";
import MicRecorder from '@jmd01/mic-recorder-to-mp3';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import styles from './ModalStyles.module.css'
import { useEffect, useState } from 'react';
import { transcribeToText } from '@/src/lib/fetchingData';

import { useAuthContext } from '@/src/context/AuthContextProvider';
import { useSettingsContext } from '@/src/context/SettingsContext/SettingsContextProvider';

const storage = getStorage();
const recorder = new MicRecorder({ bitRate: 96 });

const VoiceRecordingModal = ({ handleClose }) => {

    const [transcribedStatus, setTranscribedStatus] = useState(null);

    const user = useAuthContext();

    const settingsContext = useSettingsContext();
    const themeColor = settingsContext.settings.UI.themeColor;

    const [isRecording, setIsRecording] = useState(false);
    const uploadFile = async (file) => {


        try {

            const storageRef = ref(storage, `${process.env.NEXT_PUBLIC_STORAGE_TRANSCRIBE_PATH}/${user.uid}/${file.name}`);

            let result = await uploadBytes(storageRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');

                return getDownloadURL(storageRef)
                    .then(async (url) => {
                        return await transcribeToText(url);
                    })
            });
            if (result) {
                if (result.text && result.text.length > 0) {

                    setTranscribedStatus({ status: 'ok', text: result.text })

                } else if (result.error) {
                    console.error(result.error);
                    setTranscribedStatus({ status: 'error', text: result.error })
                }
            }
        } catch (error) {
            setTranscribedStatus({ status: 'error', text: error })
        } finally {
            setIsRecording(false);
        }


    };

    const startRecording = () => {
        setTranscribedStatus(null);
        setIsRecording(true);

        recorder.start().then(() => {
            console.log('recording in progress..')
        }).catch((e) => {
            setIsRecording(false);
            console.error(e);
        });
    }

    const stopRecording = () => {
        setTranscribedStatus({ status: 'pending', text: null });
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                // setIsRecording(false);
                const file = new File(buffer, `${process.env.NEXT_PUBLIC_TRANSCRIBE_FILENAME}.mp3`, {
                    type: blob.type,
                    lastModified: Date.now(),
                });

                if (file) {
                    uploadFile(file);
                }
            })
            .catch((e) => {
                console.error(e);
                setTranscribedStatus({ status: 'error' });
                setIsRecording(false);
            });
    }


    useEffect(() => {
        if (transcribedStatus && transcribedStatus.status == 'ok') {

            settingsContext.updateSettings('transcribedText', 'text', transcribedStatus.text);
            const timer = setTimeout(() => {
                handleClose();
            }, 800)
            return () => clearTimeout(timer);
        }

    }, [transcribedStatus])


    return (
        <Box w='100%' maxW={['full', 'xl', '2xl']} p={['4', '4']} h='100%' m={'0 auto'}>
            <Card h='100%' w='100%' >
                <CardBody p={[1, 2]} h='auto' >

                    <Box bg={'#FAFAFA'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'} w='100%' h="100%" p={1}>

                        {
                            (transcribedStatus == null) &&
                            <Box className={isRecording ? `${styles.micContainer} ${styles.btnPulse}` : `${styles.micContainer}`} bg={'teal'}>
                                <Icon as={FaMicrophone} boxSize={12} ></Icon>
                            </Box>
                        }

                        {
                            transcribedStatus &&
                            <Box className={`${styles.micContainer}`}>
                                {
                                    transcribedStatus.status === 'pending' &&
                                    <Spinner color={themeColor} thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        size='xl' />
                                }
                                {
                                    transcribedStatus.status === 'ok' &&
                                    <Icon as={MdOutlineDone} boxSize={12} color='green'></Icon>
                                }
                                {
                                    transcribedStatus.status == 'error' &&
                                    <Text color='red' w='100%' >Something wrong. Please try again.</Text>
                                }
                            </Box>
                        }

                    </Box>
                </CardBody>
                <CardFooter pt={0} pb={2}>
                    <HStack w='full' justifyContent={'center'}>

                        {
                            isRecording
                                ?
                                <Button leftIcon={<FaMicrophoneSlash />} colorScheme={'red'} size={['xs', 'sm']}
                                    isDisabled={transcribedStatus && transcribedStatus.status == 'pending'}
                                    variant='solid' onClick={stopRecording} >Stop</Button>
                                : <Button leftIcon={<FaMicrophone />} colorScheme={'green'} size={['xs', 'sm']} variant='solid' onClick={startRecording} isDisabled={transcribedStatus && transcribedStatus.status === 'pending'}>Start</Button>
                        }

                        {
                            (!isRecording) &&
                            <Button colorScheme={themeColor} size={['xs', 'sm']}
                                variant='outline' onClick={handleClose}>Close</Button>
                        }
                    </HStack>
                </CardFooter>
            </Card>
        </Box>
    );
};

export default VoiceRecordingModal;