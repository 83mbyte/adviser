import {
    Button, Box, Card, CardBody, CardFooter, HStack, Icon, Spinner
} from '@chakra-ui/react'
import { useSettingsContext } from '@/src/context/SettingsContext';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { MdOutlineDone } from "react-icons/md";
import MicRecorder from 'mic-recorder-to-mp3';


import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import styles from './ModalStyles.module.css'
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/src/context/AuthContextProvider';
import { transcribeToText } from '@/src/lib/fetchingData';

const storage = getStorage();
const recorder = new MicRecorder({ bitRate: 96 });

const VoiceRecordingModal = ({ handleClose, }) => {

    const [transcribedStatus, setTranscribedStatus] = useState(null);

    const user = useAuthContext();

    const settingsContext = useSettingsContext();
    const { themeColor } = settingsContext.userThemeColor;
    const { transcribedText, setTranscribedText } = settingsContext.transcribedTextData;

    const uploadFile = async (file) => {
        setTranscribedStatus({ status: 'pending', text: null });

        const storageRef = ref(storage, `audio/${user.uid}/${file.name}`);

        let result = await uploadBytes(storageRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');

            return getDownloadURL(storageRef)
                .then(async (url) => {
                    console.log('URL to download: ', url);

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

    };


    const startRecording = () => {
        recorder.start().then(() => {
            console.log('recording in progress..')
        }).catch((e) => {
            console.error(e);
        });
    }

    const stopRecording = () => {
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {

                const file = new File(buffer, "transcribe.mp3", {
                    type: blob.type,
                    lastModified: Date.now(),
                });

                if (file) {
                    uploadFile(file);
                }
            })
            .catch((e) => {
                console.error(e);
            });
    }

    useEffect(() => {
        startRecording();
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (transcribedStatus && transcribedStatus.status == 'ok') {
                setTranscribedText(transcribedStatus.text);
                handleClose();
            }
        }, 800);
        return () => clearTimeout(timer);

    }, [transcribedStatus])


    return (
        <Box w='100%' maxW={['full', 'xl', '2xl']} p={['4', '4']} h='100%' m={'0 auto'}>
            <Card h='100%' w='100%' >
                <CardBody p={[1, 2]} h='auto' >

                    <Box bg={'#FAFAFA'} border={'1px dashed #DEDEDE'} borderTopRadius={'10px'} w='100%' h="100%" p={1}>

                        {
                            transcribedStatus == null &&
                            <Box className={`${styles.micContainer} ${styles.btnPulse}`} bg={'teal'}>
                                <Icon as={FaMicrophone} boxSize={12} ></Icon>
                            </Box>
                        }
                        {
                            transcribedStatus && transcribedStatus.status === 'pending' &&
                            <Box className={`${styles.micContainer}`}>
                                <Spinner color={themeColor} thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    size='xl' />
                            </Box>

                        }
                        {
                            transcribedStatus && transcribedStatus.status === 'ok' &&
                            <Box className={`${styles.micContainer}`}>
                                <Icon as={MdOutlineDone} boxSize={12} color='green'></Icon>
                            </Box>
                        }
                    </Box>
                </CardBody>
                <CardFooter pt={0} pb={2}>
                    <HStack w='full' justifyContent={'center'}>

                        <Button leftIcon={<FaMicrophoneSlash />} colorScheme={'red'} size={['xs', 'sm']} variant='outline' onClick={stopRecording}>Stop recording</Button>

                        <Button colorScheme={'red'} size={['xs', 'sm']} variant='outline' onClick={handleClose}>Close</Button>
                    </HStack>
                </CardFooter>
            </Card>
        </Box>
    );
};

export default VoiceRecordingModal;