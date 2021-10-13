import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Button,
  Select,
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
    dateEnd: yup.date().default(function () {
      return moment().format('yyyy-MM-DD');
    }),
    hours: yup
      .number('Por favor escriba un numero.')
      .required('Por favor escribe las horas realizadas.')
      .positive('Por favor no entres numeros negativos.')
      .min(0, 'Por favor escribe un numero superior a 0.')
      .max(24, 'Por favor no escribas más de 24h en una jornada laboral.'),
    type: yup.string().required('Por favor selecciona una de las opciones.'),
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
          dateEnd: moment().format('yyyy-MM-DD'),
          hours: 0,
          type: '',
        }}
        validationSchema={LoginFormSchema}
        onSubmit={(values, { setSubmitting }) => {
          database.hours
            .doc(id)
            .update({
              state: 'sin validar',
              hours: values.hours,
              type: values.type,
              dateEnd: moment().toDate(),
              locationEnd: {
                latitude: latitude,
                longitude: longitude,
              },
            })
            .then(function (docRef) {
              toast({
                position: 'top',
                title: 'Imputación creada.',
                description: 'Imputación de horas correcta!',
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
                    placeholder="Lebron James"
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
                    placeholder="EMT campaña"
                    id="projectName"
                  />
                  <FormErrorMessage>{form.errors.projectName}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="dateEnd">
              {({ field, form }) => (
                <FormControl
                  mt="20px"
                  isInvalid={form.errors.dateEnd && form.touched.dateEnd}>
                  <FormLabel htmlFor="dateEnd">FECHA</FormLabel>
                  <Input
                    type="date"
                    {...field}
                    isReadOnly
                    variant="flushed"
                    id="dateEnd"
                  />
                  <FormErrorMessage>{form.errors.dateEnd}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="hours">
              {({ field, form }) => (
                <FormControl
                  mt="20px"
                  isInvalid={form.errors.hours && form.touched.hours}>
                  <FormLabel htmlFor="hours">HORAS REALIZADAS</FormLabel>
                  <Input
                    {...field}
                    type="number"
                    inputMode="decimal"
                    variant="flushed"
                    step="0.01"
                    pattern="[0-9]+([\.,][0-9]+)?"
                    id="hours"
                  />
                  <FormErrorMessage>{form.errors.hours}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Field name="type">
              {({ field, form }) => (
                <FormControl mt="20px" isInvalid={form.errors.type && form.touched.type}>
                  <FormLabel htmlFor="type">TIPO</FormLabel>
                  <Select
                    {...field}
                    variant="flushed"
                    id="type"
                    placeholder="Selecciona un tipo">
                    <option value="Normal (L-D)">Normal (L-D)</option>
                    <option value="Nocturna">Nocturna</option>
                    <option value="Festiva">Festiva</option>
                  </Select>
                  {form.errors.type ? (
                    <FormErrorMessage>{form.errors.type}</FormErrorMessage>
                  ) : null}
                  <FormHelperText>Elija el tipo de hora que ha realizado.</FormHelperText>
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
