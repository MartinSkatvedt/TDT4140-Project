import {
  Flex,
  VStack,
  HStack,
  Spacer,
  Box,
  Heading,
  Text,
  Image,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import {GroupObject} from '../../types/api';
import {
  generateAgeGapText,
  addMemberToGroup,
  deleteGroup,
  updateGroup,
} from './api';
import InterestItem from './InterestItem';
import MembersNumber from './MembersNumber';
import {GroupAdminOnlyButton} from './GroupAdminOnlyButton';
import AddUser, {AddUserObject} from './AddUser';
import {useSetRecoilState} from 'recoil';
import {alertState, AlertType, nState, rbState} from '../../state';
import {useNavigate} from 'react-router-dom';
import {CreateGroupObject} from '../types';
import CreateGroupForm from '../CreateGroupForm';

const GroupProfileDetail: React.FC<{
  group: GroupObject;
  birthdays?: string[];
  hideAdminControls?: boolean;
  refresh?: () => void;
}> = ({birthdays, hideAdminControls = false, refresh, group}) => {
  const ageGapText = birthdays ? generateAgeGapText(birthdays) : '...';

  const {
    isOpen: editIsOpen,
    onOpen: editOnOpen,
    onClose: editOnClose,
  } = useDisclosure();
  const {
    isOpen: addIsOpen,
    onOpen: addOnOpen,
    onClose: addOnClose,
  } = useDisclosure();
  const {
    isOpen: delIsOpen,
    onOpen: delOnOpen,
    onClose: delOnClose,
  } = useDisclosure();

  const setAlertState = useSetRecoilState(alertState);
  const navigate = useNavigate();
  const setRbState = useSetRecoilState(rbState);
  const setNState = useSetRecoilState(nState);

  const onSubmit = async (values: AddUserObject) => {
    addOnClose();
    const {success} = await addMemberToGroup({
      groupId: group.id,
      email: values.email,
    });
    if (success) {
      setAlertState({
        type: AlertType.NOTIFY,
        message: 'Succesfully added member to group',
        active: true,
      });
      if (refresh) refresh();
    } else {
      setAlertState({
        type: AlertType.ERROR,
        message:
          'An error occured. This could be a server error, or the person does not exist.',
        active: true,
      });
    }
  };

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const onDeleteClick = async () => {
    try {
      delOnClose();
      const {success} = await deleteGroup(group.id);
      if (success) {
        setAlertState({
          type: AlertType.NOTIFY,
          message: `Group ${group.name} was successfully deleted.`,
          active: true,
        });
        setNState(true);
        setRbState([
          false,
          () => {
            return;
          },
        ]);
        navigate('/groups');
      } else {
        setAlertState({
          type: AlertType.ERROR,
          message: `Group ${group.name} could not be deleted.`,
          active: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitEdit = async (values: CreateGroupObject) => {
    editOnClose();
    const {success} = await updateGroup(group.id, values);
    if (success) {
      setAlertState({
        type: AlertType.NOTIFY,
        message: 'Succesfully edited group',
        active: true,
      });
      if (refresh) refresh();
    } else {
      setAlertState({
        type: AlertType.ERROR,
        message: 'An error occured. Please try again later.',
        active: true,
      });
    }
  };

  return (
    <Flex
      flexDir="column"
      flex={1}
      height="fit-content"
      minH="100%"
      width="100%"
      bg="groupWhite.200"
      py={10}
    >
      <VStack w="full">
        <HStack w="full">
          <Spacer />
          <VStack spacing="10px">
            <Box>
              <Image
                borderRadius="full"
                boxShadow="xl"
                w="150px"
                src={
                  process.env.PUBLIC_URL + '/images/groupImageTransparent.png'
                }
              />
            </Box>
            <Heading w={'300px'} size="lg" color="black" textAlign={'center'}>
              {group.name}
            </Heading>
          </VStack>
          <Spacer />
        </HStack>

        {/* MEMBER COUNT, AGE RANGE AND LOCATION */}
        <Flex w="full" mb="15px">
          <Flex flex={1} justify="center">
            <MembersNumber members={group.members} />
            <Text
              fontSize={'20px'}
              ml="5px"
              pt="2px"
              textAlign={'center'}
              alignItems={'flex-end'}
              display="flex"
            >
              {ageGapText}
            </Text>
          </Flex>
          <Flex flex={1} justify="center" color="black">
            <HStack>
              <Image
                w="24px"
                src={process.env.PUBLIC_URL + '/images/LocationIcon.svg'}
              />
              <Text fontSize="20px">{group.location}</Text>
            </HStack>
          </Flex>
        </Flex>
        <Flex pt="5" wrap={'wrap'} gap="4px" justify="center">
          {group.interests.map(interest => {
            return <InterestItem key={interest.name} interest={interest} />;
          })}
        </Flex>

        {/* QUOTE AND DESCRIPTION */}
        <VStack flex={2} p="0 10%">
          <Box pt="30px">
            <Text
              fontStyle={'italic'}
              fontSize="20px"
              color="black"
              textAlign={'center'}
            >
              {group.quote}
            </Text>
          </Box>
          <Box pt="30px">
            <Text fontSize="20px" color="black" textAlign={'center'}>
              {group.description}
            </Text>
          </Box>
          {!hideAdminControls && (
            <>
              <Box pt="85">
                <GroupAdminOnlyButton
                  bg="groupGreen"
                  groupAdmin={group.groupAdmin}
                  buttonText="Add member"
                  onClick={addOnOpen}
                />
                <Modal isOpen={addIsOpen} onClose={addOnClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add member</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <AddUser onSubmit={onSubmit} />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </Box>
              <Box pt="0">
                <GroupAdminOnlyButton
                  bg="groupGreen"
                  groupAdmin={group.groupAdmin}
                  buttonText="Edit group"
                  onClick={editOnOpen}
                />
                <Modal isOpen={editIsOpen} onClose={editOnClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Edit group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <CreateGroupForm
                        onSubmit={onSubmitEdit}
                        initialValues={group}
                      />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </Box>

              {/* TODO: Check if groupadmin and hide if not. */}
              <Box pt="0">
                <GroupAdminOnlyButton
                  bg="groupRed"
                  groupAdmin={group.groupAdmin}
                  buttonText={'Delete group'}
                  onClick={delOnOpen}
                />
                <AlertDialog
                  isOpen={delIsOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={delOnClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete group
                      </AlertDialogHeader>
                      <AlertDialogBody>
                        <Box>
                          <Text fontSize="sm">
                            Do you want to delete this group?
                          </Text>
                        </Box>
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Box p="8">
                          <Button
                            ref={cancelRef}
                            mt={4}
                            bg="groupGreen"
                            textColor="groupWhite.200"
                            onClick={delOnClose}
                            data-testid="cancelButton"
                          >
                            Cancel
                          </Button>
                        </Box>
                        <Box p="12">
                          <Button
                            mt={4}
                            bg="groupRed"
                            textColor="groupWhite.200"
                            onClick={onDeleteClick}
                            data-testid="deleteButton"
                          >
                            Delete
                          </Button>
                        </Box>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Box>
            </>
          )}
        </VStack>
      </VStack>
    </Flex>
  );
};

export default GroupProfileDetail;
