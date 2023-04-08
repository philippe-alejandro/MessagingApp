import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'

export default function NewConversationModal({ closeModal }) {
  // starts an empty array where all selected contacts are stored. 
  // the contacts selected will be the ones that appear in the conversation created. 
  const [selectedContactIds, setSelectedContactIds] = useState([]) 
  // useContacts is a custom hook imported from ContactsProvider.js. 
  // it returns the context object value.
  const { contacts } = useContacts()
  // useConversations is a custom hook imported from ConversationsProvider.js. 
  // it returns the context object function.
  const { createConversation } = useConversations()
  // this function is executted after submitting the data for creating a new conversation.
  function handleSubmit(e) {
    e.preventDefault()
    // using the function 'createConversation()' from the context object updates the context object value to 
    // whatever value is stored in selectedContactIds. 
    createConversation(selectedContactIds)
    closeModal()
  }
  // this function updates the state of the selectedContactIds array.
  function handleCheckBoxChange(contactId) {
    // if 'contactId' is included in 'prevSelectedContactIds', it will be filtered out. 
    setSelectedContactIds(prevSelectedContactIds => {
      if (prevSelectedContactIds.includes(contactId)) {
        return prevSelectedContactIds.filter(prevId => {
          return contactId !== prevId
        })
      } else {
        // if 'contactId' is not in 'prevSelectedContactIds', then add it
        return [...prevSelectedContactIds, contactId]
      }
    })
  }

  return (
    <>
      -- the 'closebutton' attribute create a button with an 'x' inside of it to close the modal. 
      <Modal.Header closeButton>Create Conversation</Modal.Header>
      <Modal.Body>  
      -- when the inputs all filled up and the button 'Create' is clicked, 
      -- the function 'handleSubmit' is executed. 
      <Form onSubmit={handleSubmit}>
        -- this is used to list all of the existing contacts and select any of them to take part 
        -- in a specific conversation. The result of this will be a check box with the contact's name 
        -- after it. 
        {contacts.map(contact=>(
          <Form.Group controlId={contact.id} key={contact.id}>
            <Form.Check
              type="checkBox"
              value={selectedContactIds.includes(contact.id)}
              // the 'label' attribute is used to select the name property from the 'contact' object. 
              label={contact.name}
              // after the check box is clicked, the array of contacts added to the conversation will be modified. 
              onChange={()=>{handleCheckBoxChange(contact.id)}}
            />
          </Form.Group>
        ))}
        <Button type="submit">Create</Button>
      </Form>
      </Modal.Body>
  </>
  )
}
