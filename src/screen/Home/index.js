import React, { useEffect, useState } from 'react';
import {
  Heading,
  Wrap,
  WrapItem,
  Text,
  Link as LinkChakra,
  Box,
  List,
} from '@chakra-ui/react';
import { database } from '../../firebase';

import Layout from '../../components/Layout';
import CardLink from '../../components/CardLink';
import Notice from '../../components/Notice';

import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    return database.notices
      .where('date', '>=', moment().startOf('month').toDate())
      .where('date', '<=', moment().endOf('month').toDate())
      .orderBy('date', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          contractHours: doc.data().contractHours,
          date: moment(doc.data().date.toDate()).format('L'),
          hours: doc.data().hours,
          userName: doc.data().userName,
        }));
        setData(data);
      });
  }, []);

  return (
    <Layout justifyContent="center" isHeader={true}>
      <Heading as="h1" size="3xl" textAlign="center" mb={10}>
        ¡Bienvenido a
        <LinkChakra
          pl="20px"
          color="brand.500"
          cursor="pointer"
          href="https://www.sistemasmedioambientales.com/"
          isExternal>
          SM!
        </LinkChakra>
      </Heading>
      <Text fontSize="2xl" mb={10} color="gray.500" textAlign="center">
        Elige una de las opciones:
      </Text>
      <Wrap justify="center">
        <WrapItem>
          <CardLink
            title="Campañas"
            description="Añade las campañas necesarias para tus proyectos."
            to="/projectlist"
          />
        </WrapItem>
        <WrapItem>
          <CardLink
            title="Horas"
            description="Añade las campañas necesarias para tus proyectos."
            to="/hourList"
          />
        </WrapItem>
        <WrapItem>
          <CardLink
            title="Usuarios"
            description="Añade las campañas necesarias para tus proyectos."
            to="/users"
          />
        </WrapItem>
        <WrapItem>
          <CardLink
            title="Estadisticas"
            description="Añade las campañas necesarias para tus proyectos."
            to="/stats"
          />
        </WrapItem>
      </Wrap>
    </Layout>
  );
};

export default Home;
