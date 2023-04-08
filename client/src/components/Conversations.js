import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider' 

export default function Conversations() {
  // the custom hook from ConversationsProvider.js is imported to take two properties
  // from the context object's value. 
  const { conversations, selectConversationIndex } = useConversations()
  return (
    <ListGroup variant="flush">
      -- this lists all existing conversations 
      {conversations.map((conversation, index)=>(
      <ListGroup.Item 
      key={index}
      action
      // this determines what happens when the conversation is clicked. 'selectConversationIndex' is a property from
      // the context object value passed down to children in the ConversationsProvider.js file. The value of 'selectConversationIndex'
      // is 'setSelectedConversationIndex' which changes the value of a state variable. A useState hook is used in this case to determine 
      // the index of the currently selected conversation. 
      onClick={() => selectConversationIndex(index)}
      // used to determine which of the conversations is selected in order to style appropriately. 
      active={conversation.selected}
      >
        -- this lists the name of all recipients separated by a comma in the selected conversation. 
        {conversation.recipients.map(r => r.name).join(', ')}
      </ListGroup.Item>
    ))}
    </ListGroup>
  )
}
