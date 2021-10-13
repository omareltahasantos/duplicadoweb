import React, { useEffect, useState } from 'react';
import {
  Heading,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  IconButton,
  Link,
} from '@chakra-ui/react';
import sumBy from 'lodash/sumBy';
import filter from 'lodash/filter';
import { database } from '../../firebase';
import { useToast } from '@chakra-ui/react';
import {
  CheckIcon,
  DeleteIcon,
  SmallCloseIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';

import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
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
    title: 'Horas',
    isCurrentPage: true,
  },
];

const HourList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenValide, setIsOpenValide] = useState(false);
  const [isOpenInValide, setIsOpenInValide] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [user, setUser] = useState();
  const [data, setData] = useState([]);
  const cancelRef = React.useRef();
  const valideRef = React.useRef();
  const invalideRef = React.useRef();
  const toast = useToast();
  const horasValidadas = data ? filter(data, { state: 'validado' }) : [];

  useEffect(() => {
    return database.hours
      .where('date', '>=', moment().startOf('month').toDate())
      .where('date', '<=', moment().endOf('month').toDate())
      .orderBy('date', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          userId: doc.data().userId,
          userName: doc.data().userName,
          projectId: doc.data().projectId,
          projectName: doc.data().projectName,
          state: doc.data().state,
          hours: doc.data().hours ? doc.data().hours : '',
          type: doc.data().type ? doc.data().type : '',
          date: moment(doc.data().date.toDate()).format('L H:mm:ss'),
          dateEnd: doc.data().dateEnd
            ? moment(doc.data().dateEnd.toDate()).format('L H:mm:ss')
            : '',
          contractHours: doc.data().contractHours,
          latitude: doc.data().locationStart ? doc.data().locationStart.latitude : '',
          longitude: doc.data().locationStart ? doc.data().locationStart.longitude : '',
          latitudeEnd: doc.data().locationEnd ? doc.data().locationEnd.latitude : '',
          longitudeEnd: doc.data().locationEnd ? doc.data().locationEnd.longitude : '',
        }));
        setData(data);
      });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Tecnico',
        accessor: 'userName',
      },
      {
        Header: 'Campaña',
        accessor: 'projectName',
      },
      {
        Header: 'Reg.Inicio',
        accessor: 'date',
      },
      {
        Header: 'Ubi.Inicio',
        accessor: 'map',
        Cell: ({ cell }) => (
          <>
            <Link
              href={`https://www.google.com/maps/place/${cell.row.original.latitude},${cell.row.original.longitude}`}
              isExternal>
              <ExternalLinkIcon mx="2px" />
            </Link>
          </>
        ),
      },
      {
        Header: 'Reg.Final',
        accessor: 'dateEnd',
      },
      {
        Header: 'Ubi.Final',
        accessor: 'mapFinal',
        Cell: ({ cell }) => (
          <>
            {cell.row.original.latitudeEnd !== '' ? (
              <Link
                href={`https://www.google.com/maps/place/${cell.row.original.latitudeEnd},${cell.row.original.longitudeEnd}`}
                isExternal>
                <ExternalLinkIcon mx="2px" />
              </Link>
            ) : null}
          </>
        ),
      },
      {
        Header: 'Horas',
        accessor: 'hours',
        isNumeric: true,
      },
      {
        Header: 'Tipo',
        accessor: 'type',
      },
      {
        Header: 'Validaciones',
        accessor: 'state',
        Cell: ({ value }) => <>{value === 'validado' ? 'Sí' : 'No'}</>,
      },
      {
        Header: 'Acciones',
        accessor: 'acciones',
        Cell: ({ cell }) => (
          <>
            {cell.row.original.state === 'sin validar' && (
              <>
                <IconButton
                  colorScheme="brand"
                  aria-label="Search database"
                  size="sm"
                  mr="4px"
                  icon={<CheckIcon />}
                  onClick={() => onOpenDialog(cell.row.original, 'validade')}
                />
                <IconButton
                  colorScheme="red"
                  aria-label="Search database"
                  size="sm"
                  mr="16px"
                  icon={<SmallCloseIcon />}
                  onClick={() => onOpenDialog(cell.row.original, 'invalidade')}
                />
              </>
            )}
            {cell.row.original.state === 'validado' && (
              <>
                <IconButton
                  colorScheme="brand"
                  aria-label="Search database"
                  size="sm"
                  mr="4px"
                  icon={<CheckIcon />}
                  onClick={() => onOpenDialog(cell.row.original, 'validade')}
                  isDisabled
                />
                <IconButton
                  colorScheme="red"
                  aria-label="Search database"
                  size="sm"
                  mr="16px"
                  icon={<SmallCloseIcon />}
                  onClick={() => onOpenDialog(cell.row.original, 'invalidade')}
                />
              </>
            )}
            {cell.row.original.state === 'denegado' && (
              <>
                <IconButton
                  colorScheme="brand"
                  aria-label="Search database"
                  size="sm"
                  mr="4px"
                  icon={<CheckIcon />}
                  onClick={() => onOpenDialog(cell.row.original, 'validade')}
                />
                <IconButton
                  colorScheme="red"
                  aria-label="Search database"
                  size="sm"
                  mr="16px"
                  icon={<SmallCloseIcon />}
                  onClick={() => onOpenDialog(cell.row.original, 'invalidade')}
                  isDisabled
                />
              </>
            )}
            <IconButton
              colorScheme="red"
              aria-label="Search database"
              size="sm"
              icon={<DeleteIcon />}
              onClick={() => onOpenDialog(cell.row.original, 'delete')}
            />
          </>
        ),
        style: {
          whiteSpace: 'nowrap',
        },
      },
    ],
    []
  );

  const checkIsHighHours = (user) => {
    const hoursUser = filter(data, { userId: user.userId, state: 'validado' });
    const sumUser = sumBy(hoursUser, 'hours');
    const sumTotal = sumUser + user.hours;
    const highHours = user.contractHours * 1.2;
    const isNotice = sumTotal > highHours ? true : false;
    if (isNotice) {
      database.notices
        .add({
          userId: user.userId,
          userName: user.userName,
          hours: sumTotal,
          date: moment().toDate(),
          contractHours: user.contractHours,
        })
        .then(function (docRef) {
          toast({
            position: 'top',
            title: 'Exceso de horas.',
            description: 'Se ha notificado un exceso de horas!',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onOpenDialog = (user, type) => {
    setCurrentId(user.id);
    if (type === 'delete') {
      setIsOpen(true);
    } else if (type === 'validade') {
      setUser(user);
      setIsOpenValide(true);
    } else {
      setIsOpenInValide(true);
    }
  };

  const onCloseDialog = (type) => {
    if (type === 'delete') {
      setIsOpen(false);
    } else if (type === 'validade') {
      setIsOpenValide(false);
    } else {
      setIsOpenInValide(false);
    }
  };

  const handlerDelete = () => {
    if (currentId) {
      database.hours
        .doc(currentId)
        .delete()
        .then(function () {
          toast({
            position: 'top',
            title: 'Horas eliminadas.',
            description: 'Horas eliminadas correctamente!',
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
            description: 'No se ha podido eliminar las horas.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsOpen(false);
        });
    }
  };

  const handlerValid = () => {
    if (currentId) {
      database.hours
        .doc(currentId)
        .update({
          state: 'validado',
        })
        .then(function () {
          toast({
            position: 'top',
            title: 'Horas validadas.',
            description: 'Las horas han sido validadas correctamente!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setIsOpenValide(false);
          checkIsHighHours(user);
        })
        .catch(function (error) {
          toast({
            position: 'top',
            title: 'Ocurrió un error.',
            description: 'No se ha podido validar las horas.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsOpenValide(false);
        });
    }
  };

  const handlerInValid = () => {
    if (currentId) {
      database.hours
        .doc(currentId)
        .update({
          state: 'denegado',
        })
        .then(function () {
          toast({
            position: 'top',
            title: 'Horas denegadas.',
            description: 'Las horas han sido denegadas correctamente!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setIsOpenInValide(false);
        })
        .catch(function (error) {
          toast({
            position: 'top',
            title: 'Ocurrió un error.',
            description: 'No se ha podido denegar las horas.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsOpenInValide(false);
        });
    }
  };

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Heading as="h1" size="lg" textAlign="left">
          Horas
        </Heading>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <SimpleGrid minChildWidth="220px" spacing="15px" mb="30px">
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Total horas validadas</StatLabel>
              <StatNumber>{`${
                data ? sumBy(horasValidadas, 'hours') : null
              }h`}</StatNumber>
              <StatHelpText>Último mes</StatHelpText>
            </Stat>
          </Box>
          <Box borderRadius="xl" mb={4} p={4} borderWidth="1px">
            <Stat>
              <StatLabel>Total imputaciones</StatLabel>
              <StatNumber>{data ? data.length : null}</StatNumber>
              <StatHelpText>Último mes</StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>
        <TableSearch data={data} columns={columns} overflow={true} />
        <CancelDialog
          isOpen={isOpen}
          cancelRef={cancelRef}
          onClose={() => onCloseDialog('delete')}
          onSubmit={handlerDelete}
          header="Eliminar horas"
          body="¿Estás seguro? No puede deshacer esta acción después."
          type="delete"
        />
        <CancelDialog
          isOpen={isOpenValide}
          cancelRef={valideRef}
          onClose={() => onCloseDialog('validade')}
          onSubmit={handlerValid}
          header="Validar horas"
          body="¿Estás seguro que quieres validar las horas realizas?"
          type="valide"
        />
        <CancelDialog
          isOpen={isOpenInValide}
          cancelRef={invalideRef}
          onClose={() => onCloseDialog('invalidade')}
          onSubmit={handlerInValid}
          header="Denegar horas"
          body="¿Estás seguro que quieres denegar las horas realizas?"
          type="invalide"
        />
      </Box>
    </Layout>
  );
};

export default HourList;
