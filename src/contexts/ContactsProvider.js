import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext();

// function to be used in the modal
export function useContacts() {
    return useContext(ContactsContext);
}

export function ContactsProvider({ children}) {
    // get the list of contacts
    const [contacts, setContacts ] = useLocalStorage('contacts', []);

    // creating a new contact
    function createContact(id, name) {
        setContacts(prevContacts => {
            return [...prevContacts, {id, name }]
        });
    }

    return (
        <ContactsContext.Provider value={{ contacts, createContact }}>
            {children}
        </ContactsContext.Provider> 
    )
}
