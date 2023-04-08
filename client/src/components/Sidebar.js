import React, { useState } from 'react'
import { Tab, Nav, Button, Modal } from 'react-bootstrap' 
import Conversations from './Conversations'
import Contacts from './Contacts'
import NewContactModal from './NewContactModal'
import NewConversationModal from './NewConversationModal'

const CONVERSATIONS_KEY = 'conversations'
const CONTACTS_KEY = 'contacts'

export default function Sidebar({ id }) {
  // the 'activeKey' state variable is used to determine which tab is currently selected.
  // 'setActiveKey' will change the value of 'activeKey' whenever a new tab is selectd. 
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
  // is 'true' if the tab selected is the one for conversations.
  // is 'false' if the tab selected is the one for contacts.
  const conversationsOpen = activeKey === CONVERSATIONS_KEY
  // the 'modalOpen' state variable is used to determine if the component for 
  // creating a new contact or conversation is opened or not. 
  const [modalOpen, setModalOpen] = useState(false)
  // when executed, closeModal() changes the value of 'modalOpen' from 'true' to 'false'. 
  function closeModal() {
    setModalOpen(false)
  }

  return (
    <div style={{width:'250px'}} className="d-flex flex-column">      
      -- 'Tab.Container' is a react-bootstrap component that allows for multiple tabs to be created inside of it.
      -- the 'activeKey' specifies which tab is selected. When another tab is selected the function 'setActiveKey' 
      -- is executed to change the value of 'activeKey'.
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        -- 'justify-content-center' in the className attribute helps center the tabs inside the container.
        <Nav variant="tabs" className="justify-content-center">
          -- the onSelect attribute is called alongside the eventKey. This allows the parent component to know which tab 
          -- is currently active and change its state accordingly. The value inside 'activeKey' will be used as the argument
          -- for the function inside onSelect.  
          <Nav.Item> 
            <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
          </Nav.Item>
          <Nav.Item> 
            <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className= "border-right overflow-auto flex-grow-1" style={{borderRight:'1px solid #ccc'}}>        
          -- same as with the Nav.Item components, the eventKey in used to determine what tab selected and based on that, what pane, 
          -- should be displayed. 
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            -- the conversations component shows all available conversations.         
            <Conversations/>
          </Tab.Pane>
          <Tab.Pane eventKey={CONTACTS_KEY}>  
            -- the contacts component shows all contacts that have been created and who a conversation
            -- can be started with.         
            <Contacts/>
          </Tab.Pane>
        </Tab.Content>
        -- This div element shows the user's id using the application. The 'id' is inherited from a parent component. 
        <div className="p-2 border-top small" style={{borderRight:'1px solid #ccc'}}>
          Your Id: <span className='text-muted'>{id}</span>
        </div>
        -- when the button is clicked the 'modalOpen' variable is updated using 'setModalOpen(true)'
        <Button onClick={() => {setModalOpen(true)}} className="rounded-0">      
          New {conversationsOpen ? 'Conversation' : 'Contact'}
        </Button>
      </Tab.Container>
      -- the 'show' attribute in the 'Modal' component determines if the component should be rendered or not.  
      <Modal show={modalOpen} onHide={closeModal}>      
        {
          // if conversationsOpen is set to 'true', then the modal for creating a conversation is displayed after clicking the button, 
          // otherwise, the modal for creating a contact is shown. 
          conversationsOpen ? 
          // closeModal is an argument used in the creation of the 'NewConversationModal' and 'NewContactModal' components. 
          // when it is called the 'modalOpen' state variable is updated from 'true' to 'false'.
          // Within these two components, the function is executed when the data is submitted for creating a contact or a conversation. 
          <NewConversationModal closeModal={closeModal}/> :
          <NewContactModal closeModal={closeModal}/>
        }
      </Modal>
    </div>
  )
}
