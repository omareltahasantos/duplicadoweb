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
    href: '/projectlist',
    title: 'Campañas',
    isCurrentPage: false,
  },
  {
    href: '#',
    title: 'Actualizar',
    isCurrentPage: true,
  },
];

const UpdateProject = () => {
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    database.projects
      .doc(id)
      .get()
      .then((doc) => {
        const data = {
          id: doc.id,
          users: doc.data().users ? doc.data().users : [],
          name: doc.data().name,
          description: doc.data().description,
          startDate: moment(doc.data().startDate.toDate()).format('yyyy-MM-DD'),
          endDate: moment(doc.data().endDate.toDate()).format('yyyy-MM-DD'),
        };
        setProject(data);
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });
  }, [id]);

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
          Actualizar campaña
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        {project && users.length > 0 && (
          <UpdateForm initialValues={project} users={users} />
        )}
      </Box>
    </Layout>
  );
};

export default UpdateProject;
