import { Text, Flex, ListItem, ListIcon } from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';

const Notice = ({ name, date, hours }) => {
  return (
    <ListItem>
      <Flex flexDirection="row" alignItems="center">
        <ListIcon as={WarningTwoIcon} color="red.500" />
        <Text mr="6px" fontWeight={700} color="gray.500">
          {`${date} -`}
        </Text>
        <Text mr="6px" fontWeight={700}>
          {name}
        </Text>
        <Text mr="6px">Superadas h. contratadas:</Text>
        <Text fontWeight={700}>{hours}h</Text>
      </Flex>
    </ListItem>
  );
};

export default Notice;
