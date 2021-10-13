import { Link, Box, Text, Divider, Heading, Flex } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import { Link as RouteLink } from 'react-router-dom';

const ProjectInfo = ({ state, name, description, startDate, endDate, link, id }) => {
  return (
    <Link as={RouteLink} to={`${link}/${id}/${name}`} style={{ textDecoration: 'none' }}>
      <Box borderRadius="xl" mb={4} p={4} cursor="pointer" borderWidth="1px">
        <Text as="span" color={state === 'En activo' ? 'brand.700' : 'red.500'}>
          {state.toUpperCase()}
        </Text>
        <Divider />
        <Box
          borderLeftWidth={3}
          borderLeftColor={state === 'En activo' ? 'brand.700' : 'red.500'}
          mt={4}
          mb={4}
          pl={2}>
          <Heading as="h4" size="sm">
            {name}
          </Heading>
          <Text fontSize="sm">{description}</Text>
        </Box>
        <Flex flexDirection="row" justifyContent="start" alignItems="center">
          <Box>
            <CalendarIcon />
            <Text as="span" fontSize="xs" ml="4px">
              {startDate} - {endDate}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default ProjectInfo;
