import React from 'react';
import { Heading, Box, Link, Flex, Text, Spinner, Center } from '@chakra-ui/react';
import { geolocated } from 'react-geolocated';
import { Link as RouteLink } from 'react-router-dom';

import Layout from '../../components/Layout';
import AddForm from './AddForm';
import { ArrowBackIcon } from '@chakra-ui/icons';

const AddHours = ({ coords, isGeolocationAvailable, isGeolocationEnabled }) => {
  return (
    <Layout justifyContent="normal" isHeader={true}>
      {!isGeolocationAvailable ? (
        <Center h="150px">
          <Text>Su navegador no admite Geolocalización</Text>
        </Center>
      ) : !isGeolocationEnabled ? (
        <Center h="150px">
          <Text>La geolocalización no está habilitada</Text>
        </Center>
      ) : coords ? (
        <Box w="full" p="0px 35px 0px 35px">
          <Link as={RouteLink} to="/projects" style={{ textDecoration: 'none' }}>
            <Flex flexDirection="row" alignItems="center">
              <ArrowBackIcon
                aria-label="Back button"
                mr="8px"
                bg="white"
                fontSize="20px"
              />
              <Heading as="h1" size="lg" textAlign="left">
                Añadir horas
              </Heading>
            </Flex>
          </Link>
          <Text as="h5" textAlign="left" mt="10px" mb="40px">
            Imputa las horas que has realizado
          </Text>
          <Box w="full">
            <AddForm latitude={coords.latitude} longitude={coords.longitude} />
          </Box>
        </Box>
      ) : (
        <Center h="150px">
          <Spinner color="brand.500" mr="15px" />
          <Text>Obteniendo los datos de ubicación...</Text>
        </Center>
      )}
    </Layout>
  );
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
})(AddHours);
