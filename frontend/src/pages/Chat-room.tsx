import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { socket } from "../socket";
type Message = {
  message : string,
  type:boolean,
  username : string,
  timestamp: string,
  headsup:string
}
function Chatroom({ username }: { username: string }) {
  const [listMessage, setListMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    socket.on("reciveMessage",reciveMessage);
    return () => {
      socket.off("reciveMessage",reciveMessage)
    }
  }, []);
  const reciveMessage = (message : Message) => {
    setListMessage(prev => [...prev,message])
  }
  const handleSendMessage = () => {
    if(message !== ""){
      const messageList = {
        message: message,
        username: username,
        timestamp: new Date().toDateString(),
        type:false,
        headsup:""
      };
      socket.emit("sendMessage",messageList);
      setMessage("");
      reciveMessage(messageList)
    }
  };
  return (
    <div className="max-w-xl mx-auto">
      <nav className="flex gap-2 bg-purple-500 p-3 rounded-t-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
          />
        </svg>
        <Link to="/" className="text-left text-white font-bold text-2xl">
          Chat Road!
        </Link>
      </nav>
      <main className="h-[75vh] flex flex-col gap-4 p-10 bg-white overflow-y-scroll">
        {listMessage && listMessage.map((item,index) => (
          <div
            key={index + 1}
            className="flex flex-col bg-[#dedede] rounded-xl rounded-bl-none p-2"
          >
            <div className="flex justify-start gap-2 items-center">
              <p className="text-sm text-purple-700 font-semibold">
                {item.username}
              </p>
              <p className="text-xs text-purple-500">{item.timestamp}</p>
            </div>
            <p className="text-left">{item.type == false ? item.message : item.headsup}</p>
          </div>
        ))}
      </main>
      <div className="flex gap-1 p-3 rounded-b-md bg-purple-500">
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          autoFocus
          className=" w-full bg-white p-1 rounded-l-sm outline-none"
          placeholder="Type a message.."
        />
        <button
          onClick={handleSendMessage}
          className="flex items-center gap-1 bg-[#dedede] text-purple-900 rounded-r-sm px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatroom;
