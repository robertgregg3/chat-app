import React from 'react';
import Sidebar from './Sidebar';
import OpenConversation from './OpenConversation';
import { useConversations } from '../contexts/ConversationsProvider';

export default function Dashboard({ id }) {
    const { selectedConversation } = useConversations();

    return (
        <div className="d-flex" style={{ height: '100vh'}}>
            <Sidebar id={id} />
            { selectedConversation && <OpenConversation /> }  
        </div>
    )
    /* short had for if we have a selected conversation then display it. */
}
