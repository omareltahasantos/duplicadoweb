import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';

const CancelDialog = ({ isOpen, cancelRef, onClose, onSubmit, header, body, type }) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered>
      <AlertDialogOverlay>
        {type === 'delete' && (
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={onSubmit} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
        {type === 'valide' && (
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="brand" onClick={onSubmit} ml={3}>
                Validar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
        {type === 'invalide' && (
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {header}
            </AlertDialogHeader>
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={onSubmit} ml={3}>
                Denegar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        )}
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default CancelDialog;
