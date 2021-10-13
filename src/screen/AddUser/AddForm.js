import { useState } from 'react';
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
  InputRightElement,
  InputGroup,
  Select,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { database, authCreateUser } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import 'moment/locale/es';

import * as ROUTES from '../../constants/Routes';

const LoginFormSchema = yup
  .object({
    name: yup.string().required('Por favor escribe el nombre del usuario.'),
    email: yup
      .string()
      .email('El email no es válido.')
      .required('Por favor escribe un email valido.'),
    hours: yup
      .number('Por favor escriba un numero.')
      .required('Por favor escribe las horas contratadas.')
      .positive('Por favor no entres numeros negativos.'),
    createDate: yup.date().required('Por favor escribe la fecha de inicio.'),
    password: yup.string().required('Por favor escribe la contraseña.'),
    role: yup.string().required('Por favor selecciona un rol para el usuario.'),
  })
  .required();

const AddForm = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();
  const { signup } = useAuth();

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          email: '',
          hours: 0,
          createDate: moment().format('yyyy-MM-DD'),
          role: '',
          password: '',
        }}
        validationSchema={LoginFormSchema}
        onSubmit={(values, { setSubmitting }) => {
          signup(values.email, values.password)
            .then(function (data) {
              if (data) {
                database.users
                  .doc(data.user.uid)
                  .set({
                    name: values.name,
                    email: values.email,
                    hours: values.hours,
                    createDate: moment(values.createDate).toDate(),
                    isActive: true,
                    role: values.role,
                  })
                  .then(function (docRef) {
                    toast({
                      position: 'top',
                      title: 'Usuario creado.',
                      description: 'Usuario creado correctamente!',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    });
                    authCreateUser
                      .signOut()
                      .then(function (docRef) {
                        console.log('signOut - 2');
                      })
                      .catch(function (error) {
                        console.log(error);
                        setSubmitting(false);
                      });
                    history.push(ROUTES.USERS_LIST);
                  })
                  .catch(function (error) {
                    toast({
                      position: 'top',
                      title: 'Ocurrió un error.',
                      description: 'No se ha podido crear el usuario.',
                      status: 'error',
                      duration: 3000,
                      isClosable: true,
                    });
                    setSubmitting(false);
                  });
              }
            })
            .catch(function (error) {
              toast({
                position: 'top',
                title: 'Ocurrió un error.',
                description: 'No se ha podido crear el usuario.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              console.log(error);
              setSubmitting(false);
            });
          /* */
        }}>
        {(props) => (
          <Form>
            <SimpleGrid minChildWidth="320px" spacingX="40px" spacingY="20px">
              <Box>
                <Field name="name">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.name && form.touched.name}>
                      <FormLabel htmlFor="name">NOMBRE</FormLabel>
                      <Input
                        {...field}
                        variant="flushed"
                        placeholder="Técnico/a"
                        id="name"
                      />
                      <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
              <Box>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.email && form.touched.email}>
                      <FormLabel htmlFor="email">EMAIL</FormLabel>
                      <Input
                        {...field}
                        variant="flushed"
                        placeholder="someone@example.com"
                        id="email"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </SimpleGrid>
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
                      <NumberInput variant="flushed">
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
            <Box>
              <Field name="password">
                {({ field, form }) => (
                  <FormControl
                    mt="20px"
                    isInvalid={form.errors.password && form.touched.password}>
                    <FormLabel htmlFor="password">CONTRASEÑA</FormLabel>
                    <InputGroup size="md">
                      <Input
                        {...field}
                        variant="flushed"
                        placeholder="contraseñasegura1234"
                        type={show ? 'text' : 'password'}
                        id="password"
                        autoComplete="off"
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? <ViewOffIcon /> : <ViewIcon />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {form.errors.password ? (
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    ) : (
                      <FormHelperText>Nunca comparta su contraseña.</FormHelperText>
                    )}
                  </FormControl>
                )}
              </Field>
            </Box>
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

export default AddForm;
