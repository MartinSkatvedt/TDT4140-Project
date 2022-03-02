import React, {useEffect, useState} from 'react';
import {Link as RouteLink} from 'react-router-dom';
import {
  Image,
  Modal,
  Box,
  Text,
  Flex,
  Spacer,
  Circle,
  useDisclosure,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Link,
} from '@chakra-ui/react';
import {AddIcon} from '@chakra-ui/icons';
import CreateGroupForm from './CreateGroupForm';
import {CreateGroupObject} from './types';
import {fetchWithToken} from '../api/api';
import {GroupObject} from '../api/types';
import {Interest} from '../types/api';

type GroupListItemProps = {
  id: number;
  name: string;
  members: string[];
  interests: Interest[];
};

type InterestItemProps = {
  interest: Interest;
};

const useToggle = (
  initialValue = false
): [value: boolean, toggle: () => void] => {
  const [value, setValue] = React.useState(initialValue);
  const toggle = () => {
    setValue(v => !v);
  };
  return [value, toggle];
};

export const InterestItem: React.FC<InterestItemProps> = ({interest}) => {
  return (
    <Box
      marginLeft="10px"
      padding="2px"
      paddingLeft="4px"
      paddingRight="4px"
      border="1px"
      borderColor={'groupGreen'}
      borderRadius={'md'}
      boxShadow={'md'}
    >
      {interest.name}
    </Box>
  );
};

const GroupListItem: React.FC<GroupListItemProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
  name,
  members,
  interests,
}: GroupListItemProps) => {
  return (
    <Link
      as={RouteLink}
      to={`/groups/${id}`}
      position={'relative'}
      top={5}
      left={5}
    >
      {/*TODO:Change from link to box? We may want items within each GroupListItems to be individually clickable */}
      <Box //TODO: Change border colors?
        border="1px"
        borderColor={'groupGreen'}
        borderRadius={'md'}
        bgColor="groupWhite.200"
        w={'370px'}
        h={'90px'}
        boxShadow={'lg'}
        marginTop={'10px'}
      >
        <Flex>
          <Box
            w={'40px'}
            h={'40px'}
            margin="5px"
            boxShadow={'md'}
            borderRadius={20}
          >
            <Image
              src={`${process.env.PUBLIC_URL}/images/groupImage.png`}
              w={'40px'}
            />
          </Box>
          <Box w={'200px'} top={'5px'} left={'45px'} margin="5px">
            <Text fontWeight={'bold'}>{name}</Text>
          </Box>
          <Spacer />
          <Box
            margin="5px"
            w={'50px'}
            h={'30px'}
            boxShadow={'md'}
            border="1px"
            borderColor={'groupGreen'}
            borderRadius={'md'}
          >
            <Flex>
              <Box marginLeft={'8px'}>
                <Text>{members.length}</Text>
              </Box>
              <Spacer />
              <Box>
                <Image
                  src={`${process.env.PUBLIC_URL}/images/ProfileIcon.svg`}
                  w={'20px'}
                  position={'relative'}
                  right={'0px'}
                  top={'2px'}
                />
              </Box>
              <Spacer />
            </Flex>
          </Box>
        </Flex>
        <Flex>
          {interests.map((interest, index) => {
            return <InterestItem key={index.toString()} interest={interest} />;
            //TODO: Add max length to interest fields to avoid overflow
            //TODO: In case of overflow, show as many as will fit, then [+N] as the last field to show they have N more interests
          })}
        </Flex>
      </Box>
    </Link>
  );
};

export const Groups: React.FC = () => {
  //TODO: Replace mockgroups array with actual group data from API
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [groups, setGroups] = useState<GroupObject[]>([]);
  const [refresh, toggleRefresh] = useToggle();
  useEffect(() => {
    fetchWithToken<GroupObject[]>('/api/groups/getMyGroups', 'GET').then(
      res => {
        console.log(res);
        if (!res.missingToken && res.body !== null) setGroups(res.body);
      }
    );
  }, [refresh]);
  // const mockGroups = [
  //   {
  //     id: 0,
  //     name: 'De kule kidsa',
  //     members: ['test', 'test2', 'test3', 'test4'],
  //     interests: ['Skape trøbbel', 'Røyke ostepop'],
  //   },
  //   {
  //     id: 1,
  //     name: 'Bowlerne',
  //     members: ['test', 'test2'],
  //     interests: ['Wii Sports', 'Wii Sports Resort'],
  //   },
  //   {
  //     id: 2,
  //     name: 'Gutta Krutt',
  //     members: ['Bob', 'Kåre', 'Ole'],
  //     interests: ['Fisking', 'Pils', 'Rosenborg'],
  //   },
  // ];

  const onSubmit = (values: CreateGroupObject) => {
    onClose();
    const interestArr = values.interests.split(',').map(interest => ({
      name: interest,
      description: 'beskrivelse',
    }));
    const body = {
      name: values.name,
      quote: values.quote,
      description: values.description,
      interests: interestArr,
      location: values.location,
      date: values.date,
    };
    fetchWithToken('/api/groups/', 'POST', body).then(response => {
      toggleRefresh();
      console.log(response);
    });
  };

  return (
    <>
      {groups.map((group, index) => {
        return (
          <GroupListItem
            key={index.toString()}
            id={group.id}
            name={group.name}
            members={group.members}
            interests={group.interests}
          />
        );
      })}
      <Circle
        bgColor="groupGreen"
        size="80px"
        onClick={onOpen}
        justifyContent={'center'}
        alignContent={'center'}
        position={'fixed'}
        bottom={'100px'}
        right={'20px'}
      >
        <AddIcon color={'white'} w={'60px'} h={'60px'} />
      </Circle>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CreateGroupForm onSubmit={onSubmit} />{' '}
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box pos={'absolute'}></Box>
    </>
  );
};
