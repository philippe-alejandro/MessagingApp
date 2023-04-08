import React, { useState, useCallback } from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useConversations } from '../contexts/ConversationsProvider';

export default function OpenConversation() {
  // a state variable is initiated with an empty string. 
  // this represents the text of the message located in the text box. 
  const [text, setText] = useState('')
  // the callback inside the hook 'useCallback' will be only executed on the first render. 
  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, [])

  // the value of this context object is being deconstructed. It has five different properties
  // and two of them are selected here. 
  const { sendMessage, selectedConversation } = useConversations()

  // this function is submitted when a message is sent in a specific conversation.
  function handleSubmit(e) {
    // prevents default behavior of a form element, like re-rendering a page. 
    e.preventDefault()
    // executes the 'sendMessage' function destructured from the context object value
    // provided by 'ConversationsContext.Provider' located in the ConversationsProvider.js file.
    sendMessage(
      selectedConversation.recipients.map(r => r.id),
      text
    )
    // after the 'Send' button is clicked, the text box is cleared and any text inside of it
    // is removed. 
    setText('')

  }

  return (
    <div className='d-flex flex-column flex-grow-1'>
    {/*'flex-grow-1' makes the messages take as much space as possible
        'overflow-auto' makes the messages 'div' to have a scroll bar which is 
        indipendent of the dashboard's scroll bar.*/}
      <div className='flex-grow-1 overflow-auto'>
        <div className='d-flex flex-column align-items-start justify-content-end px-3'>        
          -- each message in the selected conversation is iterated
          {selectedConversation.messages.map((message, index) => {
            // each message's index is compared to the length of the messages array of the selected conversation
            // to see if the current message being iterated is the last message in the array.
            const lastMessage = selectedConversation.messages.length - 1 === index
            return (
              <div 
                // if the current message is the last message in the array, then the results of the 'useCallback'
                // hook will be used. 
                ref={lastMessage ? setRef : null}
                key={index}
                // this accomodates the two divs inside of this div. These divs show who sent the message and the message's content.
                className={`my-1 d-flex flex-column 
                ${message.fromMe ? 'align-self-end align-items-end': 'align-items-start'}`}
              >
                -- this div contains the message text.
                <div
                  // if the message was sent by me then, the background of the message box is white.
                  className={`rounded px-2 py-1 ${message.fromMe
                  ? 'bg-primary text-white' : 'border' }`}>                
                  -- this takes the 'text' value from the message object. 
                  {message.text}
                </div>
                -- this div contains who sent the message. If the message was sent by me, then the value is located
                -- at the right of the message box. 
                <div className={`text-muted small ${message.fromMe ? 'text-right': ''}`}>
                  {message.fromMe ? 'You' : message.senderName}
                </div>
                
              </div>
            )
            })
          }
        </div>
      </div>
      -- this code contains the textbox and button structure. 
      <Form onSubmit={handleSubmit}>      
        <Form.Group className='m-2'>        
          <InputGroup>          
            <Form.Control
              as="textarea" 
              required
              value={text}
              onChange={e=>setText(e.target.value)}
              style={{ height: '75px', resize: 'none' }}            
            />
            <div className="input-group-append">
              <Button type='submit' style={{height: '75px'}}>Send</Button>
            </div>
          </InputGroup>
        </Form.Group>
      </Form>
    </div> 
  )
}
