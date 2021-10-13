import React, { useEffect, useState } from 'react';
import {
  Heading,
  Box,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Divider,
  SkeletonText,
} from '@chakra-ui/react';
import { database } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

import Layout from '../../components/Layout';
import ProjectInfo from '../../components/ProjectInfo';

import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    database.projects
      .where('users', 'array-contains', currentUser.uid)
      .orderBy('startDate', 'desc')
      .limit(15)
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          startDate: doc.data().startDate,
          endDate: doc.data().endDate,
          description: doc.data().description,
          name: doc.data().name,
          users: doc.data().users,
        }));
        setProjects(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }, [currentUser.uid]);

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Campañas
        </Heading>
        <Text as="h5" textAlign="left" mt="10px" mb="30px">
          Selecciona la campaña a la que quieras imputar horas
        </Text>
        <SimpleGrid minChildWidth="220px" spacing="15px" mb="30px">
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Horas contratadas</StatLabel>
              <StatNumber>{`${currentUser.hours}h/mes`}</StatNumber>
            </Stat>
          </Box>
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Precio por hora</StatLabel>
              <StatNumber fontSize="md">
                <Text as="span" fontWeight="400" color="gray.900" fontSize="md" mr="8px">
                  Normal (L-D)
                </Text>
                7€ brutos/hora
              </StatNumber>
              <StatNumber fontSize="md">
                <Text as="span" fontWeight="400" color="gray.900" fontSize="md" mr="8px">
                  Festiva
                </Text>
                8€ brutos/hora
              </StatNumber>
              <StatNumber fontSize="md">
                <Text as="span" fontWeight="400" color="gray.900" fontSize="md" mr="8px">
                  Nocturna
                </Text>
                10€ brutos/hora
              </StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
        <Divider mt="30px" mb="30px" borderBottomWidth={3} borderColor="brand.500" />
        {!loading ? (
          projects.map((project, index) =>
            moment().toDate() >= moment(project.startDate.toDate()) &&
            moment().toDate() <= moment(project.endDate.toDate()) ? (
              <ProjectInfo
                state="En activo"
                name={project.name}
                description={project.description}
                startDate={moment(project.startDate.toDate()).format('L')}
                endDate={moment(project.endDate.toDate()).format('L')}
                link="/hours"
                id={project.id}
                key={index}
              />
            ) : null
          )
        ) : (
          <>
            <Box borderRadius="xl" mb={4} p={4} cursor="pointer" borderWidth="1px">
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
            </Box>
            <Box borderRadius="xl" mb={4} p={4} cursor="pointer" borderWidth="1px">
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
              <SkeletonText mt="4" noOfLines={1} spacing="4" isLoaded={!loading} />
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default Projects;
