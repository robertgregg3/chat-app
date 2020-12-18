// for storing all of our conversations
import React, { useContext, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
 
const ConversationsContext = React.createContext();

// function to be used in the modal
export function useConversations() {
    return useContext(ConversationsContext);
}

export function ConversationsProvider({ id, children }) {
    // get the list of conversations
    const [conversations, setConversations ] = useLocalStorage('conversations', []);
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);
    const { contacts } = useContacts();

    // creating a new conversation
    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages: [] }]
        });
    }

    function addMessageToConversation({ recipients, text, sender }) {
        setConversations(prevConversations => {
            let madeChange = false;
            const newMessage = { sender, text };

            const newConversations = prevConversations.map(conversation => {
                // we need to check if the recipients array matches the recipients array of each conversation
                if (arrayEquality(conversation.recipients, recipients)){
                    madeChange = true;
                    return {
                        ...conversation, 
                        messages: [...conversation.messages, newMessage]
                    } // if the arrays are equal, then return the conversation and add the new message to the end of the copied message object
                }

                return conversation;
            })

            if(madeChange) {
                return newConversations;
            } else {  // if we didn't make any changes then we take our previous conversations, make a new one and add the new message
                return [...prevConversations, 
                    { recipients, messages: [newMessage] }
                ] // take the previous conversatons, create a new one that has those recipients, the messages instead of being empty will now hold the new messages
            }
        })
    }

    function sendMessage(recipients, text){
        addMessageToConversation({ recipients, text, sender: id });
    }

    const formattedConversations = conversations.map((conversation, index) => {
         const recipients = conversation.recipients.map(recipient => {
             const contact = contacts.find(contact => {
                 return contact.id === recipient; // recipient returns an id
            });
            const name = (contact && contact.name) || recipient; // contact && cont... returns the name of the contact
            return { id: recipient, name } // if no contact, the name defaults back to the recipient
         });

         const messages = conversation.messages.map(message => {
            const contact = contacts.find(contact => {
            return contact.id === message.sender; 
            })
            const name = (contact && contact.name) || message.sender; 
            const fromMe = id === message.sender;
            return { ...message, senderName: name, fromMe }
         })

         const selected = index === selectedConversationIndex;
         return { ...conversation, recipients, selected } // returns all of the conversations and the newly formatted recipients with a name and ID instead of a list of ids. 
    });

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex], // this is to be able to display the conversation in the right panel (used later on)
        sendMessage,
        selectConversationIndex: setSelectedConversationIndex,
        createConversation
    }

    return (
        <ConversationsContext.Provider value={ value }>
            {children}
        </ConversationsContext.Provider> 
    )
}


function arrayEquality(a,b){
    if(a.length !== b.length) return false;

    a.sort()
    b.sort()

    // is every element in A equal to every element in B at the exat same index position. 
    return a.every((element, index) => {
        return element === b[index]
    })
}