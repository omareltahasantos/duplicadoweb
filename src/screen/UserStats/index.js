import React, { useEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import filter from 'lodash/filter';
import {
  Heading,
  Box,
  StatHelpText,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { database } from '../../firebase';

import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';

import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const breadcrumbs = [
  {
    href: '/home',
    title: 'Home',
    isCurrentPage: false,
  },
  {
    href: '/users',
    title: 'Usuarios',
    isCurrentPage: false,
  },
  {
    href: '#',
    title: 'Estadísticas',
    isCurrentPage: true,
  },
];

const InfoStats = () => {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  let { id } = useParams();

  useEffect(() => {
    database.hours
      .where('userId', '==', id)
      .where('state', '==', 'validado')
      .where('date', '>=', moment().startOf('month').toDate())
      .where('date', '<=', moment().endOf('month').toDate())
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHours(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }, [id]);

  const hoursToday = filter(hours, function (o) {
    const dateDB = moment(o.date.toDate());
    const dateToday = moment();
    return dateDB.month() === dateToday.month() && dateDB.date() === dateToday.date();
  });

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Estadísticas
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <SimpleGrid minChildWidth="220px" spacing="15px" mb="30px">
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Total horas</StatLabel>
              <StatNumber>{hours ? `${sumBy(hours, 'hours')}h` : '0h'}</StatNumber>
              <StatHelpText>Horas validadas este mes</StatHelpText>
            </Stat>
          </Box>
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Hoy</StatLabel>
              <StatNumber>
                {hoursToday ? `${sumBy(hoursToday, 'hours')}h` : '0h'}
              </StatNumber>
              <StatHelpText>Horas validadas</StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>
        <Heading as="h5" size="md" textAlign="left" mt="35px">
          Campañas
        </Heading>
        <Box mt="35px">
          {!loading ? (
            Object.entries(groupBy(hours, 'projectName')).map(([key, value], index) => (
              <SimpleGrid
                minChildWidth="120px"
                spacingY="20px"
                borderRadius="xl"
                mb={4}
                p={4}
                borderWidth="1px"
                key={index}>
                <Box mr="35px">
                  <Stat>
                    <StatLabel>Nombre campaña</StatLabel>
                    <StatNumber>{key}</StatNumber>
                  </Stat>
                </Box>
                <Box mr="35px">
                  <Stat>
                    <StatLabel>Horas validadas</StatLabel>
                    <StatNumber>{`${sumBy(value, 'hours')}h`}</StatNumber>
                  </Stat>
                </Box>
                <Flex flexDirection="row" alignItems="center">
                  {Object.entries(groupBy(value, 'type')).map(([key, value], index) => (
                    <Box mr="35px" key={index}>
                      <Stat>
                        <StatLabel>{key}</StatLabel>
                        <StatNumber>{`${sumBy(value, 'hours')}h`}</StatNumber>
                      </Stat>
                    </Box>
                  ))}
                </Flex>
              </SimpleGrid>
            ))
          ) : (
            <Center bg="white" h="200px" color="white">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="brand.500"
                size="xl"
              />
            </Center>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default InfoStats;
