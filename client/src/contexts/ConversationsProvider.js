import React, { useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

// creates a context object for conversations
const ConversationsContext = React.createContext()

// custom hook used for extracting the value of a 
// context object 
export function useConversations() {
  return useContext(ConversationsContext)
}

export function ConversationsProvider({ id, children }) {
  // takes the 'value' and  'setValue' results from 'useLocalStorage' 
  const [conversations, setConversations] = useLocalStorage('conversations', [])
  // useState hook to select a specific conversation
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
  // extracts the function from the context object returned by 'useContacts'
  const { contacts } = useContacts()
  // takes the multiple properties from the context object. 
  // this is useful when all properties inside the context object
  // need to be passed down to the child components. 
  const socket = useSocket()
  // this function updates the array stored in the 'conversations' variable.
  // Each element of this array is an object of the shape: {recipients: array, messagges: array}.
  // The 'messages' array has all messages ever sent in that specific conversation. The recipients
  // property contains all members of the conversation. 
  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations, { recipients, messages: [] }]
    })
  }
  // useCallback is a hook that returns the memoized version of a function. 
  // The purpose of using 'useCallback' is to improve performance so that the 
  // function is only executed if the properties in the second argument have changed. 
  const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
    setConversations(prevConversations => {
      // 'madeChange' variable is used to determine if the conversation the message
      // is being added to already exists or not. To determine this the receipients 
      // are compared one by one. 
      let madeChange = false
      // the new message to be added to the conversation. 
      const newMessage = { sender, text }
      // all of the conversations are iterated over to see if their 
      // recipients match those passed in as argument. 
      const newConversations = prevConversations.map(conversation => {
        // arrayEquality is defined below and is in charge of comparing 
        // if all the recipients match. 
        if (arrayEquality(conversation.recipients, recipients)) {
          // this variable is changed to 'true' to indicate that all the 
          // recipients match and therefore, a new message will be added to the 
          // conversation. 
          madeChange = true
          return {
            ...conversation,
            messages: [...conversation.messages, newMessage]
          }
        }
        // if the equality returns false, then the conversation will be returned as is. 
        return conversation
      })
      // if changes end up being made, then all conversations are returned including the one
      // to which the message was added. 
      if (madeChange) {
        return newConversations
      } else {
        // if the equality returns false or no change was made, then an array is returned with 
        // all conversations plus the latest conversation including its first message. 
        return [
          ...prevConversations,
          { recipients, messages: [newMessage] }
        ]
      }
    })
    // whenever the property 'setConversations' changes, 'addMessageToConversation' will be re-executed
  }, [setConversations])

  useEffect(() => {
    // checks if the context object value is not null. 'socket' was created as a custom hook. 
    // if there's no socket, then 'addMessageToConversation' won't be executed.
    if (socket == null) return
    // if there is a socket and a message is received, execute the 'addMessageToConversation' 
    socket.on('receive-message', addMessageToConversation)
    // removes the 'receive-message' event listener
    return () => socket.off('receive-message')
    // the callback inside this useEffect hook is executed if any of the two properties below changes
  }, [socket, addMessageToConversation])

  function sendMessage(recipients, text) {
    // it emits a 'send-message' event to the socket object with an object containing the recipients 
    // and text properties. This event will send the message to the server and from there it can be 
    // broadcast to other connected clients who are listening for the 'send-message' event.
    socket.emit('send-message', { recipients, text })
    // The addMessageToConversation function is also called with an object that contains the recipients, 
    // text, and sender properties. This function will add the message to the appropriate conversation or 
    // create a new conversation if one does not exist for the given recipients.
    addMessageToConversation({ recipients, text, sender: id })
  }
  // The 'formattedConversations' function transform each conversation in the original array into a new object 
  // with a different structure. 
  // the 'conversation' array is iterated the conversation itself and its index in the array. 
  const formattedConversations = conversations.map((conversation, index) => {
    // each recipient in every conversation is then iterated using only the value itself. 
    const recipients = conversation.recipients.map(recipient => {
      // each recipient in the 'recipients' sub-array is matched with the 'id' value for a specific object in the 
      // contacts array 
      const contact = contacts.find(contact => {
        return contact.id === recipient
      })
      // if a contact is found, its name is used in the object returned. If not, the id is the value used. 
      const name = (contact && contact.name) || recipient
      return { id: recipient, name }
    })
    // for each conversation, each message is iterated. 
    const messages = conversation.messages.map(message => {
      // for each message, the contacts are filtered to find the id value that equal the sender value. 
      const contact = contacts.find(contact => {
        return contact.id === message.sender
      })
      // if a contact is found, then use 'contact.name'. If not, use 'message.sender'
      const name = (contact && contact.name) || message.sender
      // the id of the current user is compared to that of the sender. This necessary to know what name to place
      // below the message box and what margin to add to the message box as well. 
      const fromMe = id === message.sender
      // using the spread syntax '...message' takes all properties from the message object and puts them into the 
      // new object. 
      return { ...message, senderName: name, fromMe }
    })
    
    const selected = index === selectedConversationIndex
    return { ...conversation, messages, recipients, selected }
  })
  // this is the value of the context object that will be passed to the children components
  const value = {
    conversations: formattedConversations,
    selectedConversation: formattedConversations[selectedConversationIndex],
    sendMessage,
    selectConversationIndex: setSelectedConversationIndex,
    createConversation
  }

  return (
    // this is the context object's provider component being returned. 
    // by returning the provider component all children components will have access to the
    // values of porperties in the 'value' object.  
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}

function arrayEquality(a, b) {
  if (a.length !== b.length) return false

  a.sort()
  b.sort()
  // the .every() method checks if all corresponding elements
  // in the first array are equal to those in the second. If all elements
  // are the same then the final result is 'true'. 
  return a.every((element, index) => {
    return element === b[index]
  })
}