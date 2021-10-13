import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { database } from '../../firebase';
import { useParams } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

const LoginFormSchema = yup
  .object({
    userName: yup.string().required('Por favor escribe tu nombre.'),
    projectName: yup
      .string()
      .required('Por favor escribe la campaña en la que participas.'),
    date: yup.date().default(function () {
      return moment().format('yyyy-MM-DD');
    }),
  })
  .required();

const AddForm = ({ latitude, longitude }) => {
  const toast = useToast();
  const history = useHistory();
  const { currentUser } = useAuth();
  let { id, name } = useParams();

  return (
    <>
      <Formik
        initialValues={{
          userName: currentUser.name,
          projectName: name,
          date: moment().format('yyyy-MM-DD'),
        }}
        validationSchema={LoginFormSchema}
        onSubmit={(values, { setSubmitting }) => {
          database.hours
            .add({
              userId: currentUser.uid,
              userName: values.userName,
              projectId: id,
              projectName: values.projectName,
              state: 'inicio jornada',
              date: moment().toDate(),
              contractHours: currentUser.hours,
              locationStart: {
                latitude: latitude,
                longitude: longitude,
              },
            })
            .then(function (docRef) {
              toast({
                position: 'top',
                title: 'Jornada iniciada.',
                description: 'Jornada iniciada correctamente!',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              history.goBack();
            })
            .catch(function (error) {
              toast({
                position: 'top',
                title: 'Ocurrió un error.',
                description: 'No se ha podido realizar la operación.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              setSubmitting(false);
            });
        }}>
        {(props) => (
          <Form>
            <Field name="userName">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.userName && form.touched.userName}>
                  <FormLabel htmlFor="userName">NOMBRE</FormLabel>
                  <Input
                    {...field}
                    value={form.initialValues.userName}
                    isReadOnly
                    variant="flushed"
                    placeholder="Nombre técnico/a"
                    id="userName"
                  />
                  <FormErrorMessage>{form.errors.userName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="projectName">
              {({ field, form }) => (
                <FormControl
                  mt="20px"
                  isInvalid={form.errors.projectName && form.touched.projectName}>
                  <FormLabel htmlFor="projectName">CAMPAÑA</FormLabel>
                  <Input
                    {...field}
                    value={form.initialValues.projectName}
                    isReadOnly
                    variant="flushed"
                    placeholder="Campaña X"
                    id="projectName"
                  />
                  <FormErrorMessage>{form.errors.projectName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="date">
              {({ field, form }) => (
                <FormControl mt="20px" isInvalid={form.errors.date && form.touched.date}>
                  <FormLabel htmlFor="date">FECHA</FormLabel>
                  <Input type="date" {...field} isReadOnly variant="flushed" id="date" />
                  <FormErrorMessage>{form.errors.date}</FormErrorMessage>
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
              Iniciar jornada
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddForm;
