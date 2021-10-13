import React, { useEffect, useState } from 'react';
import { Heading, Box, Text, SkeletonText, Flex, Link } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { database } from '../../firebase';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';

import Layout from '../../components/Layout';
import AddButton from '../../components/AddButton';
import HourInfo from '../../components/HourInfo';
import CancelDialog from '../../components/CancelDialog';

import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const WorkHours = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  let { id, name } = useParams();
  const { currentUser } = useAuth();
  const cancelRef = React.useRef();
  const toast = useToast();

  useEffect(() => {
    return database.hours
      .where('projectId', '==', id)
      .where('userId', '==', currentUser.uid)
      .orderBy('date', 'desc')
      .limit(30)
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
          date: doc.data().date ? moment(doc.data().date.toDate()).format('L') : '',
          dateEnd: doc.data().dateEnd
            ? moment(doc.data().dateEnd.toDate()).format('L')
            : '',
        }));
        setHours(data);
        setLoading(false);
      });
  }, [id, currentUser]);

  const onOpenDialog = (id) => {
    setCurrentId(id);
    setIsOpen(true);
  };

  const onCloseDialog = () => {
    setIsOpen(false);
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

  return (
    <Layout justifyContent="normal" isHeader={true}>
      <Box w="full" p="0px 35px 0px 35px">
        <Link as={RouteLink} to="/projects" style={{ textDecoration: 'none' }}>
          <Flex flexDirection="row" alignItems="center">
            <ArrowBackIcon aria-label="Back button" mr="8px" bg="white" fontSize="20px" />
            <Heading as="h1" size="lg" textAlign="left">
              Horas
            </Heading>
          </Flex>
        </Link>
        <Text as="h5" textAlign="left" mt="10px" mb="30px">
          Organiza las horas trabajadas
        </Text>
        <AddButton route={`/workStart/${id}/${name}`} text="Iniciar jornada" />
        {!loading ? (
          hours.map((hour, index) => (
            <HourInfo
              state={hour.state}
              projectName={hour.projectName}
              type={hour.type}
              hours={hour.hours}
              date={hour.date}
              id={hour.id}
              key={index}
              onHandlerOpen={onOpenDialog}
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
      <CancelDialog
        isOpen={isOpen}
        cancelRef={cancelRef}
        onClose={() => onCloseDialog()}
        onSubmit={handlerDelete}
        header="Eliminar horas"
        body="¿Estás seguro? No puede deshacer esta acción después."
        type="delete"
      />
    </Layout>
  );
};

export default WorkHours;
