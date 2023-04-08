/* This file builds the modal used when creating
a new contact.
*/

import React, { useRef } from 'react'
// These elements are built into react-bootstrap and help avoid
// creating specific style or CSS code.
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

export default function NewContactModal({ closeModal }) {
  // the useRef() hook is used to access DOM elements directly
  const idRef = useRef()
  const nameRef = useRef()
  // useContacts() returns a context object value
  // createContact() is a function taken from the context object
  // returned in useContacts. Is used to change the value of the context
  // object. 
  const { createContact } = useContacts();

  function handleSubmit(e) {
    // makes avoid the regular effects of submitting a form, 
    // like re rendering a page for instance.  
    e.preventDefault()
    // this is the function extracted from the context object
    // to change context values. 
    createContact(idRef.current.value, nameRef.current.value)
    closeModal()
  }

  return (
    <>
      -- the 'closeButton' attribute is an existing element in react-bootstrap
      -- which when pressed closes the modal. 
      <Modal.Header closeButton>Create Contact</Modal.Header>
      <Modal.Body>  
        -- when the 'Create' button is pressed, the 'handleSubmit' function is executed.     
        <Form onSubmit={handleSubmit}>
          <Form.Group>        
            <Form.Label>Id</Form.Label>
            -- the 'ref' attribute is used to introduce a 'useRef' hook and refer to a specific
            -- component. 
            <Form.Control type="text" ref={idRef}></Form.Control>
          </Form.Group>
          <Form.Group>        
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef}></Form.Control>
          </Form.Group>
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  )
}
