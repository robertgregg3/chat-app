// for storing all of our conversations
import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
 
const ConversationsContext = React.createContext();

// function to be used in the modal
export function useConversations() {
    return useContext(ConversationsContext);
}

export function ConversationsProvider({ children }) {
    // get the list of conversations
    const [conversations, setConversations ] = useLocalStorage('conversations', []);
    const { contacts } = useContacts();

    // creating a new conversation
    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages: [] }]
        });
    }

    const formattedConversations = conversations.map(conversation => {
         const recipients = conversation.recipients.map(recipient => {
             const contact = contacts.find(contact => {
                 return contact.id === recipient; // recipient returns an id
            });
            const name = (contact && contact.name) || recipient // contact && cont... returns the name of the contact
            return { id: recipient, name } // if no contact, the name defaults back to the recipient
         });

         return { ...conversations, recipients } // returns all of the conversations and the newly formatted recipients with a name and ID instead of a list of ids. 
    });

    const value = {
        conversations: formattedConversations,
        createConversation
    }

    return (
        <ConversationsContext.Provider value={ value }>
            {children}
        </ConversationsContext.Provider> 
    )
}
