import { Stack, Link, Button } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Link as RouteLink } from 'react-router-dom';

const AddButton = ({ route, text }) => {
  return (
    <Stack direction="row" spacing={4}>
      <Link as={RouteLink} to={route} style={{ textDecoration: 'none' }}>
        <Button
          leftIcon={<AddIcon w={3} h={3} />}
          colorScheme="brand"
          variant="solid"
          mb="30px">
          {text}
        </Button>
      </Link>
    </Stack>
  );
};

export default AddButton;
