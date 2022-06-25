import { Button, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, useDisclosure, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, FormHelperText, Textarea, VStack, Container, Text, HStack, Box, Checkbox, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
export default function Home({ todos }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [todoName, setTodoName] = useState('')
  const [todoDesc, setTodoDesc] = useState('')
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [deleteTodo, setDeleteTodo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [todoList, setTodoList] = useState(todos)
  const toast = useToast()


  const updateTodo = (todo) => {
    setSelectedTodo(todo)
    setTodoName(todo.todo)
    setTodoDesc(todo.desc)
    onOpen()

  }
  const saveTodo = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    let generateMutation;
    if(!selectedTodo)
    {
      generateMutation=`mutation AddTodo {
        insert_todo(objects: {completed: false, desc: "${todoDesc}", todo: "${todoName}"}) {
          returning {
            todo
            id
            desc
            created_at
            completed
          }
        }
      }`
  
    }
    else {
      generateMutation=`mutation updateTodo {
        update_todo(where: {id: {_eq: ${selectedTodo.id}}}, _set: {desc: "${todoDesc}", todo: "${todoName}"}) {
          returning {
            todo
            id
            desc
            completed
            created_at
          }
        }
      }`
    }

    const resp = await axios.post('https://strong-wallaby-78.hasura.app/v1/graphql',
    {
      query: generateMutation
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'I5JY9FPBt3TcLHlI1wTdeQq81qbw7BrCkV70oLIUDwl4Y1nKJMHL4T8jyUzmzrMZ'
      }
    }
  )
  setIsLoading(false)
  onClose()
  if(!selectedTodo){
    setTodoList([...todoList, resp.data.data.insert_todo.returning[0]])

    toast({
      title: 'TODO',
      description: "Todo Created Successfully.",
      status: 'success'
        })
  }
  else {
    setTodoList(todoList.map(todo => {
      if(todo.id === selectedTodo.id)
      {
        return resp.data.data.update_todo.returning[0]
      }
      return todo
    }))
    toast({
      title: 'TODO',
      description: "Todo Updated Successfully.",
      status: 'success'
        })

  }

  

  
  }

  const deleteTodoItem=async()=>{
    if(!setSelectedTodo) return alert("Todo not found");
    setIsLoading(true)
    const delteMutation=`mutation deleteTodo {
      delete_todo_by_pk(id: ${selectedTodo.id}) {
        id
      }
    }`    
    await axios.post('https://strong-wallaby-78.hasura.app/v1/graphql',
    {query: delteMutation},
    {headers:{ 'Content-Type': 'application/json', 'x-hasura-admin-secret': 'I5JY9FPBt3TcLHlI1wTdeQq81qbw7BrCkV70oLIUDwl4Y1nKJMHL4T8jyUzmzrMZ'}}
    )
    setIsLoading(false)
    setDeleteTodo(false)
    setTodoList(todoList.filter(todo=>todo.id!==selectedTodo.id))
    setSelectedTodo(null)
    toast({
      title: 'TODO',
      description: "Todo Deleted Successfully.",
      status: 'success'
        })
  }
  return (
    <div >
      <Flex justify={"end"} p="2">
        <Button onClick={onOpen} colorScheme="blue">Add Todo</Button>

      </Flex>


      <Box p="4"  >

        <Text fontSize='4xl'>Todo List</Text>


        <Flex mt="2" direction={"column"} gap="2">

          {todoList && todoList.map((todo, index) => (
            <Flex key={index} border="1px solid" p="4" gap={4} >
              <Box flex={1}>
                <Text >{todo.todo}</Text>
                <Text>{todo.desc}</Text>

              </Box>
              <Flex gap="2">
                <Button onClick={() => updateTodo(todo)} colorScheme={"green"}>Update</Button>
                <Button onClick={() => {
                  setDeleteTodo(true)
                  setSelectedTodo(todo)                  
                }} colorScheme={"red"}>Delete</Button>
              </Flex>

            </Flex>
          ))}
        </Flex>





      </Box>







      {/* modal section */}
      <Modal isOpen={isOpen} onClose={() => {
        setSelectedTodo(null)
        setTodoName('')
        setTodoDesc('')
        setIsCompleted(false)
        onClose()
      }}>
        <form onSubmit={saveTodo}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack gap="2">
                <FormControl>
                  <FormLabel htmlFor='email'>TODO Name</FormLabel>
                  <Input required value={todoName} onChange={e => setTodoName(e.target.value)} type='text' />
                  <FormHelperText>Please enter todoname.</FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor='email'>TODO Description</FormLabel>
                  <Textarea
                    required
                    value={todoDesc}
                    onChange={e => setTodoDesc(e.target.value)}
                  ></Textarea>
                  <FormHelperText>Please enter description.</FormHelperText>
                </FormControl>



              </VStack>

            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={isLoading}
                disabled={isLoading}
              type="submit" colorScheme='blue' mr={3}>
                {selectedTodo ? 'Update' : 'Add'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>


      {/* delete modal in chakraui*/}

      <Modal isOpen={deleteTodo}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this todo?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>{
              setSelectedTodo(null)
              setDeleteTodo(false)
            }}>
              No
            </Button>
            <Button
              isLoading={isLoading}
              disabled={isLoading}
            colorScheme='green' type="submit" onClick={() => deleteTodoItem()}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>


      </Modal>

    </div>


  )
}

export async function getServerSideProps(context) {

  const resp = await axios.post('https://strong-wallaby-78.hasura.app/v1/graphql',
    {
      query: `query fetchTodos {
      todo {
        id
        todo
        desc
        created_at
        completed
      }
    }`
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'I5JY9FPBt3TcLHlI1wTdeQq81qbw7BrCkV70oLIUDwl4Y1nKJMHL4T8jyUzmzrMZ'
      }
    }
  )


  return {
    props: { todos: resp.data.data.todo },
  }
}
