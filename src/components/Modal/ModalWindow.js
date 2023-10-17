import { useUISettingsContext } from '@/src/context/UISettingsContext';
import { Button, Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, ModalOverlay, HStack } from '@chakra-ui/react';

const ModalWindow = ({ showModal, setShowModal, headerText = null, bodyText = null, confirmAction = null }) => {
    const UISettingsContext = useUISettingsContext();
    const { themeColor } = UISettingsContext.userThemeColor;
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <ModalOverlay />
            <ModalContent>
                {headerText &&
                    <ModalHeader>
                        {headerText}
                    </ModalHeader>}
                {/* <ModalCloseButton colorScheme={themeColor} /> */}
                {
                    bodyText &&
                    <ModalBody>
                        {bodyText}
                    </ModalBody>
                }
                <ModalFooter>
                    <HStack>
                        {
                            confirmAction &&
                            <Button variant={'outline'} colorScheme='red' onClick={confirmAction}>Sign out now!</Button>
                        }
                        <Button variant='ghost' onClick={() => setShowModal(false)} colorScheme={themeColor} >Cancel</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalWindow;