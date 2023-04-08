import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'

export default function Contacts() {
  // takes the 'contacts' array from the 'useContacts' custom hook.
  // the 'contacts' array is passed down as a value from the ContactsContext.Provider
  // in order to be used in other components.  
  const { contacts } = useContacts()

  return (
    // all of the contacts are displayed using the 'contact.name' value. 
    // this component will be imported into the 'Sidebar' component located in the 
    // Sidebar.js file. 
    <ListGroup variant='flush'>    
      {contacts.map(contact => (
        <ListGroup.Item key={contact.id}>
          {contact.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
