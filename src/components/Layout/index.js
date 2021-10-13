import { useMediaQuery } from '@chakra-ui/react';
import {
  Container,
  Box,
  Flex,
  Spacer,
  Button,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
  Menu,
  Image,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import LogoMinimize from '../../assets/logo/sm-logo-h-responsive.png';
import LogoExpanse from '../../assets/logo/sm-logo-h.png';
import LogoTMB from '../../assets/logo/Logo-TMB.png';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const Layout = ({ children, isHeader, justifyContent }) => {
  const [isLargerThanHD] = useMediaQuery([
    '(min-width: 48em)',
    '(display-mode: browser)',
  ]);
  const { logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    try {
      await logout();
      history.push('/login');
    } catch {
      console.log('failed logout.');
    }
  }
  return (
    <>
      <Container maxW="full" p="0">
        <Flex
          minH="100vh"
          p="0"
          flexDirection="column"
          justifyContent="center"
          alignItems="center">
          {isHeader && (
            <Flex
              justifyContent="center"
              alignItems="center"
              w="full"
              h="64px"
              borderTopWidth={6}
              borderBottomWidth={1}
              borderBottomColor="border.100"
              borderTopColor="brand.500">
              <Flex as="nav" alignItems="center" w="full" maxW={1280} p="0px 35px">
                <Flex alignItems="center" flexDirection= "row">
                  {isLargerThanHD ? (
                    <Image
                      src={LogoExpanse}
                      alt="SM logo"
                      boxSize="64px"
                      w={200}
                      objectFit="contain"
                    />
                  ) : (
                    <Image
                      src={LogoMinimize}
                      alt="SM logo"
                      boxSize="64px"
                      objectFit="contain"
                    />
                  )}
		<Image
                      src={LogoTMB }
                      alt="SM logo"
                      boxSize="64px"
                      w={200}
                      objectFit="contain"
                    />
                </Flex>
                <Spacer />
                {isLargerThanHD ? (
                  <Button
                    borderRadius="xl"
                    boxShadow="md"
                    colorScheme="red"
                    size="md"
                    onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                ) : (
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      size="md"
                      variant="outline"
                    />
                    <MenuList>
                      <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                    </MenuList>
                  </Menu>
                )}
              </Flex>
            </Flex>
          )}

          <Flex
            as="main"
            flex={1}
            flexDirection="column"
            justifyContent={justifyContent}
            alignItems="center"
            padding="3rem 0"
            maxW={1280}
            w="full">
            {children}
          </Flex>

          <Flex
            as="footer"
            justifyContent="center"
            alignItems="center"
            w="full"
            h="100px"
            borderTopWidth={1}
            borderColor="border.100">
            <Flex
              as="a"
	      flexDirection = "row"
              justifyContent="center"
              alignItems="center"
              href="https://www.sistemasmedioambientales.com/"
              target="_blank"
              rel="noopener noreferrer">
              Copyright © 2021
              <Box ml="4px">
                <Image
                  src={LogoMinimize}
                  alt="SM logo"
                  boxSize="70px"
                  objectFit="contain"
                />
              </Box>
            </Flex>
	   <Flex
              as="a"
	      flexDirection = "row"
              justifyContent="center"
              alignItems="center"
              href="https://www.sistemasmedioambientales.com/"
              target="_blank"
              rel="noopener noreferrer">
              <Box ml="4px">
                <Image
                  src={LogoTMB}
                  alt="SM logo"
                  boxSize="70px"
                  objectFit="contain"
                />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Container>
    </>
  );
};

export default Layout;
