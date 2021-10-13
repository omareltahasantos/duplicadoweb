import { Heading, Box, Text, Link } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

const CardLink = ({ title, description, to }) => {
  return (
    <Link as={RouterLink} to={to} style={{ textDecoration: 'none' }}>
      <Box
        p="6"
        cursor="pointer"
        m="4"
        borderWidth="1px"
        borderRadius="xl"
        _hover={{ color: 'brand.600', borderColor: 'brand.600' }}>
        <Heading as="h3" size="lg" mb="2">
          {title}
          <ArrowForwardIcon w={6} h={6} textAlign="right" ml={1} />
        </Heading>
        <Text fontSize="md">{description}</Text>
      </Box>
    </Link>
  );
};

export default CardLink;
