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

const addUser = () => {
  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Añadir usuario
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <AddForm />
      </Box>
    </Layout>
  );
};

export default addUser;
