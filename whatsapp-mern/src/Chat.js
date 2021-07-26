import { Avatar, IconButton } from '@material-ui/core'
import { AttachFile, InsertEmoticon, Mic, SearchOutlined } from '@material-ui/icons'
import MoreVert from '@material-ui/icons/MoreVert'
import React, { useState } from 'react'
import './Chat.css'
import axios from './axios'

function Chat({ messages }) {

    const[input, setInput] = useState("")

    const sendMessage = (e) => {
        e.preventDefault();

        axios.post('/api/v1/messages/new', {
            message: input,
            name:"Gaurav Konde ",
            timestamp: new Date().toUTCString(),
            received: true
        })

        setInput("")
    }

    return (
        <div className='chat'>
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>Room Name</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map((message) => (
                <p className={`chat__message ${message.received && 'chat__reciever'}`}>
                    <span className="chat__name">
                        {message.name}
                    </span>
                    {message.message}

                    <span className="chat__timestamp">
                        {message.timestamp}
                    </span>
                </p>

                ))}
            </div>

            <div className="chat__footer">
                <InsertEmoticon />
                <AttachFile className='attach' />
                <form>
                    <input
                    value={input}
                    onChange={e=> setInput(e.target.value)}
                    placeholder='Type a message'
                    type="text" />
                    <button onClick={sendMessage} type='submit'>Send a message</button>
                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat
