/*the hook 'useContext' is used to extract the data 
from a context object. It returns an object of the shape:
{ data, setVariables } in which 'data' represents the current 
value of the data and setVariables a function to update the current
value of 'data'.
*/
import React, { useContext } from 'react'
// 'useLocalStorage' is a custom hook that gets data stored locally

import useLocalStorage from '../hooks/useLocalStorage'
// createContext() is a react library method used to create
// a context object. A context object enables to share data between
// components. If the context object is placed higher in the DOM then
// component below the context object can access its value.
const ContactsContext = React.createContext()

export function useContacts() {
  // 'useContext' extracts the value from the context object
  return useContext(ContactsContext)
}


export function ContactsProvider({children}) {
  // the returned value of 'useLocalStorage' can be decomposed
  // in a variable and in a function. 
  const [contacts, setContacts] = useLocalStorage('contacts', []) 
  // in the 'createContact' function, a new contact is added to the 
  // existing array of conctacts. Each contact in this array is represented
  // by an object. Each object in this array has the structure: 
  // { id: value, name: value }. 'setContacts' which comes from 
  // 'useLocalStorage', changes the value of 'contacts' to a new array
  // with the new contact added to it. 
  function createContact(id, name) {
    setContacts(prevContacts => {
      return [...prevContacts, {id, name}]
    })
  }

  return (
    // since ContactsContext was created using the method React.createContext()
    // the context object has two components: the provider and the consumer. The 
    // provider is in charge of passing the context values to its children, while 
    // the consumer is responsible for accessing the context values. In this case, 
    // the component '.Provider' is used and it uses a 'value' prop to pass down
    // values to the children. 
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  )
}
