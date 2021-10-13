import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  SimpleGrid,
  Box,
  FormHelperText,
  CheckboxGroup,
  Checkbox,
} from '@chakra-ui/react';
import sortBy from 'lodash/sortBy';
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
    name: yup.string().required('Por favor escribe el nombre de la campaña.'),
    description: yup.string().required('Por favor escribe una breve descripción.'),
    startDate: yup
      .date()
      .default(function () {
        return moment().format('yyyy-MM-DD');
      })
      .required('Por favor escribe la fecha de inicio.'),
    endDate: yup
      .date()
      .default(function () {
        return moment().format('yyyy-MM-DD');
      })
      .required('Por favor escribe la fecha de finalización.'),
    users: yup.array(),
  })
  .required();

const AddForm = ({ users }) => {
  const toast = useToast();
  const history = useHistory();

  return (
    <>
      <Formik
        initialValues={{
          name: '',
          description: '',
          startDate: moment().format('yyyy-MM-DD'),
          endDate: moment().format('yyyy-MM-DD'),
          users: users,
        }}
        validationSchema={LoginFormSchema}
        onSubmit={(values, { setSubmitting }) => {
          database.projects
            .add({
              name: values.name,
              description: values.description,
              startDate: moment(values.startDate).toDate(),
              endDate: moment(values.endDate).toDate(),
              users: values.users,
            })
            .then(function (docRef) {
              toast({
                position: 'top',
                title: 'Campaña creada.',
                description: 'Campaña creada correctamente!',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              history.push(ROUTES.PROJECT_LIST);
            })
            .catch(function (error) {
              toast({
                position: 'top',
                title: 'Ocurrió un error.',
                description: 'No se ha podido crear la campaña.',
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
                  <Input
                    {...field}
                    variant="flushed"
                    placeholder="Campaña x"
                    type="text"
                    id="name"
                  />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="description">
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.description && form.touched.description}
                  mt="20px">
                  <FormLabel htmlFor="description">DESCRIPCION</FormLabel>
                  <Input
                    {...field}
                    variant="flushed"
                    placeholder="Descripción corta..."
                    type="text"
                    id="description"
                  />
                  {form.errors.password ? (
                    <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                  ) : (
                    <FormHelperText>Descripción corta de la campaña.</FormHelperText>
                  )}
                </FormControl>
              )}
            </Field>
            <SimpleGrid
              columns={2}
              minChildWidth={250}
              spacingX="40px"
              spacingY="20px"
              mt="20px">
              <Box>
                <Field name="startDate">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.startDate && form.touched.startDate}>
                      <FormLabel htmlFor="startDate">FECHA DE INICIO</FormLabel>
                      <Input
                        {...field}
                        variant="flushed"
                        placeholder="EMT campaña"
                        type="date"
                        id="startDate"
                      />
                      <FormErrorMessage>{form.errors.startDate}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
              <Box>
                <Field name="endDate">
                  {({ field, form }) => (
                    <FormControl isInvalid={form.errors.endDate && form.touched.endDate}>
                      <FormLabel htmlFor="endDate">FECHA DE FINALIZACIÓN</FormLabel>
                      <Input
                        {...field}
                        variant="flushed"
                        placeholder="EMT campaña"
                        type="date"
                        id="endDate"
                      />
                      <FormErrorMessage>{form.errors.endDate}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Box>
            </SimpleGrid>
            <Field name="users">
              {({ field, form }) => (
                <FormControl
                  mt="20px"
                  isInvalid={form.errors.users && form.touched.users}>
                  <FormLabel htmlFor="users">USUARIOS</FormLabel>
                  <CheckboxGroup colorScheme="brand">
                    <SimpleGrid minChildWidth="200px" spacingY="20px" spacingX="10px">
                      {users
                        ? sortBy(users, ['name']).map((user, index) => (
                            <Box key={index}>
                              <Checkbox {...field} value={user.id} key={user.id}>
                                {user.name}
                              </Checkbox>
                            </Box>
                          ))
                        : null}
                    </SimpleGrid>
                  </CheckboxGroup>
                  <FormErrorMessage>{form.errors.users}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
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
