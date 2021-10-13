import React, { useEffect, useState } from 'react';
import {
  Heading,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Link,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import sumBy from 'lodash/sumBy';
import { database } from '../../firebase';
import { useToast } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { AiFillPieChart } from 'react-icons/ai';
import { Link as RouteLink } from 'react-router-dom';

import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import TableSearch from '../../components/TableSearch';
import CancelDialog from '../../components/CancelDialog';
import AddButton from '../../components/AddButton';

const breadcrumbs = [
  {
    href: '/home',
    title: 'Home',
    isCurrentPage: false,
  },
  {
    href: '#',
    title: 'Usuarios',
    isCurrentPage: true,
  },
];

const UserList = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentId, setCurrentId] = useState();
  const [data, setData] = useState([]);
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    return database.users.where('isActive', '==', true).onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(data);
    });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nombre',
        accessor: 'name',
        style: {
          maxWidth: '230px',
        },
      },
      {
        Header: 'Correo electrónico',
        accessor: 'email',
        style: {
          maxWidth: '230px',
        },
      },
      {
        Header: 'Contratadas(h)',
        accessor: 'hours',
        isNumeric: true,
      },
      {
        Header: 'Rol',
        accessor: 'role',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ value }) => (
          <>
            <Link
              as={RouteLink}
              to={`/userStats/${value}`}
              style={{ textDecoration: 'none' }}>
              <IconButton
                colorScheme="purple"
                aria-label="Search database"
                size="sm"
                mr="4px"
                icon={<Icon as={AiFillPieChart} />}
              />
            </Link>
            <Link
              as={RouteLink}
              to={`/updateUser/${value}`}
              style={{ textDecoration: 'none' }}>
              <IconButton
                colorScheme="blue"
                aria-label="Search database"
                size="sm"
                mr="4px"
                icon={<EditIcon />}
              />
            </Link>
            <IconButton
              colorScheme="red"
              aria-label="Search database"
              size="sm"
              icon={<DeleteIcon />}
              onClick={() => onOpenDialog(value)}
            />
          </>
        ),
      },
    ],
    []
  );

  const onOpenDialog = (id) => {
    setCurrentId(id);
    setIsOpen(true);
  };

  const onCloseDialog = () => {
    setIsOpen(false);
  };

  const handlerDelete = () => {
    if (currentId) {
      database.users
        .doc(currentId)
        .update({
          isActive: false,
        })
        .then(function () {
          toast({
            position: 'top',
            title: 'Usuario eliminado.',
            description: 'Usuario eliminado correctamente!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setIsOpen(false);
        })
        .catch(function (error) {
          toast({
            position: 'top',
            title: 'Ocurrió un error.',
            description: 'No se ha podido eliminar el usuario.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsOpen(false);
          console.log(error);
        });
    }
  };

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Usuarios
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <AddButton route="/addUser" text="Añadir usuario" />
        <SimpleGrid minChildWidth="220px" spacing="15px" mb="30px">
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Total usuarios</StatLabel>
              <StatNumber>{data ? data.length : null}</StatNumber>
            </Stat>
          </Box>
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Total horas contratadas</StatLabel>
              <StatNumber>{`${data ? sumBy(data, 'hours') : null}h`}</StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
        <TableSearch data={data} columns={columns} />
        <CancelDialog
          isOpen={isOpen}
          cancelRef={cancelRef}
          onClose={onCloseDialog}
          onSubmit={handlerDelete}
          header="Eliminar usuario"
          body="¿Estás seguro? No puede deshacer esta acción después."
          type="delete"
        />
      </Box>
    </Layout>
  );
};

export default UserList;
