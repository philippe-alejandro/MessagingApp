import React from 'react'
// functions from other files are imported such as OpenConversation
// and Sidebar in order to look for a specific conversation and open it.
import OpenConversation from './OpenConversation'
import Sidebar from './Sidebar'
// 'useConversations' is the custom hook created in the file 'ConversationsProvider.js'.
// This custom hook will extract the value of the context object. 
import { useConversations } from '../contexts/ConversationsProvider'

export default function Dashboard({ id }) {
  // The custom hook 'useConversations()' contains the value extracted from the 
  // context object. This value is an object, that contains several properties and one of those
  // properties is 'selectedConversation'. 
  const { selectedConversation } = useConversations()

  return (
    <div className='d-flex' style={{ height: '100vh' }}>
      -- the 'Sidebar' component inherits the 'id' value from a parent element
      -- and this is possible by using the provided component of a context object.  
      <Sidebar id={id}/>
      -- if the 'selectedConversation' value exists, then the component 'OpenConversation' is displayed. 
      {selectedConversation && <OpenConversation/>}
    </div>
  )
}
