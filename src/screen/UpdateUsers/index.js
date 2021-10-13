import React, { useEffect, useState } from 'react';
import { Heading, Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { database } from '../../firebase';

import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import UpdateForm from './UpdateForm';
import moment from 'moment';
import 'moment/locale/es';

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
    title: 'Añadir',
    isCurrentPage: true,
  },
];

const UpdateUsers = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  let { id } = useParams();

  useEffect(() => {
    database.users
      .doc(id)
      .get()
      .then((doc) => {
        const data = {
          id: doc.id,
          createDate: moment(doc.data().createDate.toDate()).format('yyyy-MM-DD'),
          name: doc.data().name,
          hours: doc.data().hours,
          role: doc.data().role,
        };
        setUser(data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }, [id]);

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Actualizar usuario
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <Box w="full">{!loading && <UpdateForm initialValues={user} />}</Box>
      </Box>
    </Layout>
  );
};

export default UpdateUsers;
