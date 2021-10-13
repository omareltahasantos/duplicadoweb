import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Box,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const LoginFormSchema = yup
  .object({
    email: yup
      .string()
      .email('El email no es válido')
      .required('Por favor escribe tu email'),
    password: yup.string().required('Por favor escribe la contraseña'),
  })
  .required();

const LoginForm = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const handleClick = () => setShow(!show);
  const { login } = useAuth();
  const history = useHistory();

  async function handlerSubmit(values) {
    try {
      await login(values.email, values.password);
      history.push('/');
    } catch {
      console.log('Failed login.');
      setError(true);
    }
  }

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={LoginFormSchema}
        onSubmit={(values, { setSubmitting }) => {
          handlerSubmit(values);
          setSubmitting(false);
        }}>
        {(props) => (
          <Form>
            <Field name="email">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.email && form.touched.email}>
                  <FormLabel htmlFor="email">EMAIL</FormLabel>
                  <Input
                    {...field}
                    variant="flushed"
                    placeholder="someone@example.com"
                    type="email"
                    id="email"
                  />
                  <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
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
            <Button
              borderRadius="xl"
              boxShadow="xl"
              colorScheme="brand"
              size="lg"
              mt="35px"
              isFullWidth
              isLoading={props.isSubmitting}
              loadingText="Entrando"
              type="submit">
              Iniciar sesión
            </Button>
          </Form>
        )}
      </Formik>
      {error && (
        <Alert status="error" mt="30px">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription display="block">
              No se ha podido acceder. Revise sus permisos para iniciar sesión.
            </AlertDescription>
          </Box>
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setError(false)}
          />
        </Alert>
      )}
    </>
  );
};

export default LoginForm;
