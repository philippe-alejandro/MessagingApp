import React, { useRef } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { v4 as uuidV4 } from  'uuid'

export default function Login({ onIdSubmit }) {
  // 'idRef' is used to refer to the input element in which the client's id is 
  // introduced when logging in. 
  const idRef = useRef();
  // this function is executed when the Login button is pressed. 
  function handleSubmit (e) {
    // avoids default behavior of form when submitted
    e.preventDefault();
    // updates the value of the 'id' state variable defined in the 
    // App.js file. 
    onIdSubmit(idRef.current.value);
  }
  // this function is executed when the create button is pressed. 
  function createNewId () {
    // the method named as 'uuidV4' creates a random uuid and stores that value
    // in the 'id' state variable. 
    onIdSubmit(uuidV4())
  }

  return (
    <Container className='align-items-center d-flex' style={{height:'100vh'}}>
      -- the 'handleSubmit' is executed when the form is submitted. 
      <Form onSubmit={handleSubmit} className='w-100'>      
        <Form.Group>        
          <Form.Label>Enter your Id</Form.Label>
            -- the idRef hook is used in this case to refer to this element in 
            -- particular and access the element's current value and store it in the 'id' state variable.  
            <Form.Control type='text' ref={idRef} required/>
        </Form.Group>
        <Button type='submit' style={{margin: '2px'}}>Login</Button>
        -- when the button is clicked the new random client uuid is created. 
        <Button onClick={createNewId} variant='secondary'>Create a new Id</Button>
      </Form>
    </Container>
  )
}
