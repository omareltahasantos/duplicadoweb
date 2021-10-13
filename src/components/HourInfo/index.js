import { Box, Text, Badge, Heading, Flex, IconButton, Link } from '@chakra-ui/react';
import { CalendarIcon, DeleteIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { Link as RouteLink } from 'react-router-dom';

const HourInfo = ({ state, projectName, type, hours, date, id, onHandlerOpen }) => {
  const onTrigger = (id) => {
    onHandlerOpen(id);
  };
  return (
    <Box borderRadius="xl" mb={4} p={4} cursor="pointer" borderWidth="1px">
      <Box float="right">
        <IconButton
          colorScheme="red"
          aria-label="Search database"
          size="xs"
          icon={<DeleteIcon />}
          onClick={() => onTrigger(id)}
        />
      </Box>
      {state === 'validado' && (
        <>
          <Text as="span" color="brand.700">
            <Badge variant="solid" colorScheme="brand">
              VALIDADO
            </Badge>
          </Text>
          <Box borderLeftWidth={3} borderLeftColor="brand.500" mt={4} mb={4} pl={2}>
            <Heading as="h4" size="sm">
              {hours} horas
            </Heading>
            <Text fontSize="sm">{projectName}</Text>
          </Box>
        </>
      )}
      {state === 'sin validar' && (
        <>
          <Text as="span" color="brand.700">
            <Badge variant="solid" colorScheme="purple">
              SIN VALIDAR
            </Badge>
          </Text>
          <Box borderLeftWidth={3} borderLeftColor="purple.500" mt={4} mb={4} pl={2}>
            <Heading as="h4" size="sm">
              {hours} horas
            </Heading>
            <Text fontSize="sm">{projectName}</Text>
          </Box>
        </>
      )}
      {state === 'denegado' && (
        <>
          <Text as="span" color="brand.700">
            <Badge variant="solid" colorScheme="red">
              DENEGADO
            </Badge>
          </Text>
          <Box borderLeftWidth={3} borderLeftColor="red.500" mt={4} mb={4} pl={2}>
            <Heading as="h4" size="sm">
              {hours} horas
            </Heading>
            <Text fontSize="sm">{projectName}</Text>
          </Box>
        </>
      )}
      {state === 'inicio jornada' && (
        <Link
          as={RouteLink}
          to={`/addHours/${id}/${projectName}`}
          style={{ textDecoration: 'none' }}>
          <Text as="span" color="brand.700">
            <Badge variant="solid" colorScheme="cyan">
              INICIO JORNADA
            </Badge>
          </Text>
          <Box borderLeftWidth={3} borderLeftColor="cyan.500" mt={4} mb={4} pl={2}>
            <Heading as="h4" size="sm">
              {date}
            </Heading>
            <Text fontSize="sm">{projectName}</Text>
          </Box>
          <Flex flexDirection="row" justifyContent="start" alignItems="center">
            <Box>
              <InfoOutlineIcon />
              <Text as="span" fontSize="xs" ml="4px">
                Hay que imputar las horas finales en el mismo dia.
              </Text>
            </Box>
          </Flex>
        </Link>
      )}

      {state !== 'inicio jornada' ? (
        <Flex flexDirection="row" justifyContent="start" alignItems="center">
          <Box>
            <CalendarIcon />
            <Text as="span" fontSize="xs" ml="4px">
              {date} - {type}
            </Text>
          </Box>
        </Flex>
      ) : null}
    </Box>
  );
};

export default HourInfo;
