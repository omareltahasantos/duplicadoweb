import React from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  SimpleGrid,
  Box,
  FormHelperText,
  NumberInput,
  NumberInputField,
  Select,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { database } from '../../firebase';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import 'moment/locale/es';

import * as ROUTES from '../../constants/Routes';

const LoginFormSchema = yup
  .object({
    name: yup.string().required('Por favor escribe el nombre del usuario.'),
    hours: yup
      .number('Por favor escriba un numero.')
      .required('Por favor escribe las horas contratadas.')
      .positive('Por favor no entres numeros negativos.'),
    createDate: yup.date().required('Por favor escribe la fecha de inicio.'),
    role: yup.string().required('Por favor selecciona un rol para el usuario.'),
  })
  .required();

const UpdateForm = ({ initialValues }) => {
  const toast = useToast();
  const history = useHistory();

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={LoginFormSchema}
        onSubmit={(values, { setSubmitting }) => {
          database.users
            .doc(initialValues.id)
            .update({
              name: values.name,
              hours: values.hours,
              createDate: moment(values.createDate).toDate(),
              role: values.role,
            })
            .then(function (docRef) {
              toast({
                position: 'top',
                title: 'Usuario modificado.',
                description: 'Usuario modificado correctamente!',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              history.push(ROUTES.USERS_LIST);
            })
            .catch(function (error) {
              toast({
                position: 'top',
                title: 'Ocurrió un error.',
                description: 'No se ha podido modificadar el usuario.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              setSubmitting(false);
            });
        }}>
        {(props) => (
          <Form>
            <Field name="name">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel htmlFor="name">NOMBRE</FormLabel>
                  <Input {...field} variant="flushed" placeholder="John Wick" id="name" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <SimpleGrid
              columns={3}
              minChildWidth={250}
              spacingX="40px"
              spacingY="20px"
              mt="20px">
              <Box>
                <Field name="hours">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.hours && form.touched.hours}>
                      <FormLabel htmlFor="hours">HORAS CONTRATADAS</FormLabel>
                      <NumberInput variant="flushed" defaultValue={initialValues.hours}>
                        <NumberInputField {...field} type="number" id="hours" />
                      </NumberInput>
                      <FormErrorMessage>{form.errors.hours}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
              <Box>
                <Field name="createDate">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.createDate && form.touched.createDate}>
                      <FormLabel htmlFor="createDate">FECHA DE INICIO</FormLabel>
                      <Input {...field} variant="flushed" type="date" id="createDate" />
                      <FormErrorMessage>{form.errors.createDate}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
              <Box>
                <Field name="role">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.role && form.touched.role}>
                      <FormLabel htmlFor="type">ROL</FormLabel>
                      <Select
                        {...field}
                        variant="flushed"
                        id="role"
                        placeholder="Selecciona un rol">
                        <option value="tecnico">Tecnico</option>
                        <option value="admin">Administrador</option>
                      </Select>
                      {form.errors.role ? (
                        <FormErrorMessage>{form.errors.role}</FormErrorMessage>
                      ) : (
                        <FormHelperText>Elija el tipo de rol del usuario.</FormHelperText>
                      )}
                    </FormControl>
                  )}
                </Field>
              </Box>
            </SimpleGrid>
            <Button
              borderRadius="xl"
              boxShadow="xl"
              colorScheme="brand"
              size="lg"
              mt="35px"
              isFullWidth
              isLoading={props.isSubmitting}
              loadingText="Guardando"
              type="submit">
              Guardar
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UpdateForm;
