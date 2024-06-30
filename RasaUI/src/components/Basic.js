import './chatBot.css';
import React, { useEffect, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';
import DOMPurify from 'dompurify';

function Basic() {
    const [chat, setChat] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [botTyping, setBotTyping] = useState(false);

    useEffect(() => {
        const objDiv = document.getElementById('messageArea');
        if (objDiv) {
            objDiv.scrollTop = objDiv.scrollHeight;
        }
    }, [chat]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        const name = "Akanksha";
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage };

        if (inputMessage !== "") {
            setChat(chat => [...chat, request_temp]);
            setBotTyping(true);
            setInputMessage('');
            rasaAPI(name, inputMessage);
        } else {
            window.alert("Please enter a valid message");
        }
    };

    const rasaAPI = async function handleClick(name, msg) {
        await fetch('http://localhost:5005/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'charset': 'UTF-8',
            },
            credentials: "same-origin",
            body: JSON.stringify({ "sender": name, "message": msg }),
        })
        .then(response => response.json())
        .then((response) => {
            if (response) {
                console.log(response); // Log the response to see the content
                const temp = response[0];
                const recipient_id = temp["recipient_id"];
                const recipient_msg = temp["text"];
                const processed_msg = recipient_msg.replace();

                const response_temp = { sender: "bot", recipient_id: recipient_id, msg: processed_msg };
                setBotTyping(false);
                setChat(chat => [...chat, response_temp]);
            }
        });
    };

    const stylecard = {
        maxWidth: '28rem',
        border: '1px solid black',
        paddingLeft: '0px',
        paddingRight: '0px',
        borderRadius: '30px',
        boxShadow: '0 16px 20px 0 rgba(0,0,0,0.4)'
    };
    const styleHeader = {
        height: '4.5rem',
        borderBottom: '1px solid black',
        borderRadius: '30px 30px 0px 0px',
        backgroundColor: '#0047b3',
    };
    const styleFooter = {
        borderTop: '1px solid black',
        borderRadius: '0px 0px 30px 30px',
        backgroundColor: '#0047b3',
    };
    const styleBody = {
        paddingTop: '10px',
        height: '23rem',
        overflowY: 'auto',
        overflowX: 'hidden',
    };

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="card" style={stylecard}>
                        <div className="cardHeader text-white" style={styleHeader}>
                            <h1 style={{ marginBottom: '0px' }}>BVBot</h1>
                            {botTyping ? <h6>Bot Typing....</h6> : null}
                        </div>
                        <div className="cardBody" id="messageArea" style={styleBody}>
                            <div className="row msgarea">
                                {chat.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ? (
                                            <div className='msgalignstart'>
                                                <BiBot className="botIcon" />
                                                <h5
                                                    className="botmsg"
                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(user.msg) }}
                                                ></h5>
                                            </div>
                                        ) : (
                                            <div className='msgalignend'>
                                                <h5 className="usermsg">{user.msg}</h5>
                                                <BiUser className="userIcon" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="cardFooter text-white" style={styleFooter}>
                            <div className="row">
                                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                                    <div className="col-10" style={{ paddingRight: '0px' }}>
                                        <input
                                            onChange={e => setInputMessage(e.target.value)}
                                            value={inputMessage}
                                            type="text"
                                            className="msginp"
                                        ></input>
                                    </div>
                                    <div className="col-2 cola">
                                        <button type="submit" className="circleBtn">
                                            <IoMdSend className="sendBtn" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Basic;
