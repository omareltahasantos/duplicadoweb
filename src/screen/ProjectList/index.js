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
import filter from 'lodash/filter';
import { database } from '../../firebase';
import { useToast } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Link as RouteLink } from 'react-router-dom';
import { AiFillPieChart } from 'react-icons/ai';

import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import AddButton from '../../components/AddButton';
import CancelDialog from '../../components/CancelDialog';
import TableSearch from '../../components/TableSearch';

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

const ProjectList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [data, setData] = useState([]);
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    return database.projects.orderBy('startDate', 'desc').onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        startDate: doc.data().startDate,
        endDate: doc.data().endDate,
        description: doc.data().description,
        name: doc.data().name,
        users: doc.data().users,
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
        Header: 'Descripción',
        accessor: 'description',
        style: {
          maxWidth: '230px',
        },
      },
      {
        Header: 'Fecha inicio',
        accessor: (row) => moment(row.startDate.toDate()).format('L'),
      },
      {
        Header: 'Fecha final',
        accessor: (row) => moment(row.endDate.toDate()).format('L'),
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ value }) => (
          <>
            <Link
              as={RouteLink}
              to={`/infoStats/${value}`}
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
              to={`/updateProject/${value}`}
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
      database.projects
        .doc(currentId)
        .delete()
        .then(function () {
          toast({
            position: 'top',
            title: 'Campaña eliminada.',
            description: 'Campaña eliminada correctamente!',
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
            description: 'No se ha podido eliminar la campaña.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsOpen(false);
        });
    }
  };

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Campañas
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <AddButton route="/addProject" text="Añadir campaña" />
        <SimpleGrid minChildWidth="220px" spacing="15px" mb="30px">
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Total campañas</StatLabel>
              <StatNumber>{data ? data.length : null}</StatNumber>
            </Stat>
          </Box>
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>En activo</StatLabel>
              <StatNumber>
                {data
                  ? filter(data, function (d) {
                      return (
                        moment().toDate() >= moment(d.startDate.toDate()) &&
                        moment().toDate() <= moment(d.endDate.toDate())
                      );
                    }).length
                  : null}
              </StatNumber>
            </Stat>
          </Box>
        </SimpleGrid>
        <TableSearch data={data} columns={columns} />
        <CancelDialog
          isOpen={isOpen}
          cancelRef={cancelRef}
          onClose={onCloseDialog}
          onSubmit={handlerDelete}
          header="Eliminar campaña"
          body="¿Estás seguro? No puede deshacer esta acción después."
          type="delete"
        />
      </Box>
    </Layout>
  );
};

export default ProjectList;
