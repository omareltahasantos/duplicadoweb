import {
  Breadcrumb as BreadcrumbChakra,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouteLink } from 'react-router-dom';

const Breadcrumb = ({ breadcrumbs }) => {
  return (
    <BreadcrumbChakra
      spacing="8px"
      separator={<ChevronRightIcon color="gray.500" />}
      mt="15px"
      mb="30px">
      {breadcrumbs.map((breadcrumb, index) => (
        <BreadcrumbItem isCurrentPage={breadcrumb.isCurrentPage} key={index}>
          <BreadcrumbLink as={RouteLink} to={breadcrumb.href}>
            {breadcrumb.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </BreadcrumbChakra>
  );
};

export default Breadcrumb;
