import { extendTheme } from '@chakra-ui/react';
import { Global } from '@emotion/react';

export const Fonts = () => (
  <Global
    styles={`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;0,800;0,900;1,500;1,600;1,700;1,800;1,900&family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
      `}
  />
);

const fonts = {
  heading: "'Montserrat', sans-serif;",
  body: "'Work Sans', sans-serif;",
};

const styles = {
  global: {
    body: {
      bg: 'white',
      color: 'gray.700',
    },
    a: {
      color: 'gray.700',
      _hover: {
        textDecoration: 'none',
      },
    },
    h1: {
      color: 'gray.900',
    },
    h2: {
      color: 'gray.900',
    },
    h5: {
      color: 'gray.900',
    },
  },
};

// Colors
const colors = {
  brand: {
    100: '#F6FDD6',
    200: '#ECFBAE',
    300: '#DAF383',
    400: '#C5E762',
    500: '#8BB925',
    600: '#8BB925',
    700: '#6E9B19',
    800: '#547D10',
    900: '#416709',
  },
  border: {
    100: '#eaeaea',
  },
};

export const theme = extendTheme({ fonts, styles, colors });
