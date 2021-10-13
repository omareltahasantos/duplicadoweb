import React, { useEffect, useState } from 'react';
import { database } from '../../firebase';
import { Heading, Box } from '@chakra-ui/react';

import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import AddForm from './AddForm';

const breadcrumbs = [
  {
    href: '/home',
    title: 'Home',
    isCurrentPage: false,
  },
  {
    href: '/projectlist',
    title: 'Campañas',
    isCurrentPage: false,
  },
  {
    href: '#',
    title: 'Añadir',
    isCurrentPage: true,
  },
];

const AddProject = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    database.users
      .where('isActive', '==', true)
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setUsers(data);
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }, []);

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Añadir campaña
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <AddForm users={users} />
      </Box>
    </Layout>
  );
};

export default AddProject;
