import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
// creates a context object model to share data between components. 
const SocketContext = React.createContext()

// custom hook to get the value of the context object. 
export function useSocket() {
  return useContext(SocketContext)
}

// the id and children arguments are passed from parent components
// when SocketProvider is used inside them. 
export function SocketProvider({ id, children }) {
  // variable created to store a socket at a specific point in time. 
  // setSocket will update the current value stored in 'socket'.
  const [socket, setSocket] = useState()

  // the callback in this 'useEffect' hook will be executed if the 'id'
  // changes value. The 'id' dependency value is passed down to the SocketProvider
  // from a parent component. Is the value of 'id' changes, then the callback is executed.
  useEffect(() => {
    // a new socket is created.
    const newSocket = io(
      'http://localhost:4000',
      { query: { id } }
    )
    // the previous value of 'socket' is changed using 'newSocket'.
    setSocket(newSocket)
    //  this line closes the socket connection when the component unmounts. 
    return () => newSocket.close()
  }, [id])

  return (
    // the socket value is passed down to children components located inside
    // the SocketContext component. The .Provider component from the context object
    // is used to pass the value of the context object to the children components. 
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
