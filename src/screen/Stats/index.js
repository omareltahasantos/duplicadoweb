import React, { useEffect, useState } from 'react';
import { Heading, Box, SkeletonText } from '@chakra-ui/react';
import { database } from '../../firebase';

import Layout from '../../components/Layout';
import ProjectInfo from '../../components/ProjectInfo';
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
    href: '#',
    title: 'Campañas',
    isCurrentPage: true,
  },
];

const Stats = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    database.projects
      .orderBy('startDate', 'desc')
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
  }, []);

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Campañas
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        {!loading ? (
          projects.map((project, index) => (
            <ProjectInfo
              state={
                moment().toDate() >= moment(project.startDate.toDate()) &&
                moment().toDate() <= moment(project.endDate.toDate())
                  ? 'En activo'
                  : 'Finalizado'
              }
              name={project.name}
              description={project.description}
              startDate={moment(project.startDate.toDate()).format('L')}
              endDate={moment(project.endDate.toDate()).format('L')}
              link="/infoStats"
              id={project.id}
              key={index}
            />
          ))
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

export default Stats;
