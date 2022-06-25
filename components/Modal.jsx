import React from 'react'

const Modal = ({isOpen,onClose}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <VStack gap="2">
        <FormControl>
      <FormLabel htmlFor='email'>TODO Name</FormLabel>
        <Input value={todoName} onChange={e=>setTodoName(e.target.value)} type='text'  />
        <FormHelperText>Please enter todoname.</FormHelperText>
      </FormControl>
      <FormControl>
      <FormLabel htmlFor='email'>TODO Description</FormLabel>
          <Textarea
            value={todoDesc}
            onChange={e=>setTodoDesc(e.target.value)}
          ></Textarea>
        <FormHelperText>Please enter description.</FormHelperText>
      </FormControl>

        </VStack>

      </ModalBody>

      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Save
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
}

export default Modal