import React from 'react';
import Login from './Login'
import useLocalStorage from '../hooks/useLocalStorage';
import Dashboard from './Dashboard'
import { ContactsProvider } from '../contexts/ContactsProvider'
import { ConversationsProvider } from '../contexts/ConversationsProvider'
import { SocketProvider } from '../contexts/SocketProvider'

function App() {
  const [id, setId] = useLocalStorage('id'); 
  // in this variable a single container is created containing child components.
  // all of the child components have the context object provider component, which allows them
  // to pass context object values to children components. In this case the value being passed from 
  // one component to a child component id the ID of the user or client. 
  const dashboard = (
    <SocketProvider id={id}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Dashboard id={id}/>
        </ConversationsProvider>
      </ContactsProvider>
    </SocketProvider>
  )
  // this is a ternary operator that shows the 'dashboard' container if 
  // the 'id' exists. If it doesn't, then the 'Login' component is shown and 
  // the 'setId' function is passed as its argument in order to update the value 
  // of the client's 'id'. 
  return (
    id ? dashboard : <Login onIdSubmit={setId}/>
  );
}

export default App; 