import React, { useState } from 'react';
import "../styles/inbox.css";
const initialMessages = [
  { id:1, sender:'Robert Brown', subject:'Consultation Note', preview:`Patient seen for tachycardia. Recommend dosage adjustment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`, time:'10:30 AM', read:false },
  { id:2, sender:'Robert Brown', subject:'Consultation Note', preview:`Patient seen for tachycardia. Recommend dosage adjustment.`, time:'10:30 AM', read:false },
  { id:3, sender:'Robert Brown', subject:'Consultation Note', preview:`Patient seen for tachycardia. Recommend dosage adjustment.`, time:'10:30 AM', read:true },
  { id:4, sender:'Robert Brown', subject:'Consultation Note', preview:`Patient seen for tachycardia. Recommend dosage adjustment.`, time:'10:30 AM', read:true },
];

export default function InboxScreen(){
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState(null);

  function openMessage(id){
    setMessages(prev => prev.map(m => m.id===id ? {...m, read:true} : m));
    setSelectedId(id);
  }
  function markAllRead(){
    setMessages(prev => prev.map(m => ({...m, read:true})));
    setSelectedId(null);
  }

  return (
    <div className="inbox-app">
      <div className="top-rail">
        <div className="title">Inbox</div>
        <button className="mark-read" onClick={markAllRead}>Mark all read</button>
      </div>

      <div className="list-wrap">
        {messages.map(msg => (
          <article
            key={msg.id}
            className={`message-card ${msg.read ? 'read' : 'unread'} ${selectedId===msg.id ? 'selected':''}`}
            onClick={()=>openMessage(msg.id)}
          >
            <div style={{width:8}}/>
            <div className="message-main">
              <div className="row">
                <div style={{minWidth:0}}>
                  <h3 className="sender">{msg.sender}</h3>
                </div>
                <div className="time">{msg.time}</div>
              </div>
              <div className="subject">{msg.subject}</div>
              <div className="preview">{msg.preview}</div>
            </div>
          </article>
        ))}
      </div>

      <div className="bottom-nav" aria-hidden="true">
        <div className="nav-item"><div className="icon" style={{borderColor:'#00000022'}}/></div>
        <div className="nav-item"><div className="icon" style={{borderColor:'#00000022'}}/></div>
        <div className="nav-item"><div className="icon" style={{borderColor:'#00000022'}}/></div>
        <div className="nav-item inbox"><div className="icon" style={{borderColor:'#0963c6'}}/></div>
      </div>
    </div>
  );
}