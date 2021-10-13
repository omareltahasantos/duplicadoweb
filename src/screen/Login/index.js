import { useEffect } from 'react';
import { Heading, Box, Text, Flex, Container, Image } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

import Logo from '../../assets/logo/logo-sm-login.png';
import Logo2 from '../../assets/logo/Logo-TMB.png';
import LoginForm from './LoginForm';
import { useHistory } from 'react-router-dom';

const Login = () => {
    const { isLoggedIn } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (isLoggedIn) {
            history.push('/');
        }
    }, [history, isLoggedIn]);

    return ( <
        Container maxW = "full"
        p = "0" >
        <
        Flex flexDirection = "row"
        padding = "1rem"
        paddingTop = "2rem"
        justifyContent = "center" >
        <
        Image src = { Logo }
        alt = "Picture of the author"
        boxSize = "130px"
        objectFit = "contain" / >
        <
        Image src = { Logo2 }
        alt = "Picture of the author"
        boxSize = "130px"
        objectFit = "contain" / >
        <
        /Flex> <
        Flex minH = "100vh"
        padding = "0rem 0.5rem"
        flexDirection = "column"
        alignItems = "center" >
        <
        Box maxW = "500px"
        w = "full"
        p = "45px 1.5rem 20px 1.5rem" >
        <
        Heading as = "h2"
        fontSize = "24px"
        textAlign = "center" > ¡Bienvenido de vuelta!
        <
        /Heading> <
        Text as = "h5"
        textAlign = "center"
        p = "25px"
        mb = "15px" >
        Iniciar sesión <
        /Text> <
        LoginForm / >
        <
        /Box> < /
        Flex > <
        /Container>
    );
};

export default Login;