// for storing all of our conversations
import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ConversationsContext = React.createContext();

// function to be used in the modal
export function useConversations() {
    return useContext(ConversationsContext);
}

export function ConversationsProvider({ children }) {
    // get the list of conversations
    const [conversations, setConversations ] = useLocalStorage('conversations', []);

    // creating a new conversation
    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages: [] }]
        });
    }

    return (
        <ConversationsContext.Provider value={{ conversations, createConversation }}>
            {children}
        </ConversationsContext.Provider> 
    )
}
