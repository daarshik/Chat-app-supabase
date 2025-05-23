import React, { useEffect, useRef } from "react";
import useChat from "./useChat";
import { format } from "date-fns";
import { FiSearch } from "react-icons/fi";
import {
  IoPersonCircle,
  IoSend,
  IoSettingsSharp,
  IoSparklesSharp,
  IoTicket,
} from "react-icons/io5";
import { HiMiniFolderArrowDown, HiOutlineSparkles } from "react-icons/hi2";
import { BiCheckDouble } from "react-icons/bi";
import { MdGroups, MdInstallDesktop, MdOutlinePhone } from "react-icons/md";
import { FaListUl, FaMicrophone, FaWhatsapp } from "react-icons/fa";
import { AiFillHome, AiFillPicture, AiOutlineHistory } from "react-icons/ai";
import {
  PiChatTeardropDotsFill,
  PiGraphBold,
  PiNoteFill,
} from "react-icons/pi";
import { BsEmojiSmile, BsGraphUp } from "react-icons/bs";
import { HiRefresh, HiSpeakerphone } from "react-icons/hi";
import {
  RiContactsBookFill,
  RiExpandUpDownLine,
  RiFilter3Fill,
  RiListCheck2,
  RiListSettingsLine,
} from "react-icons/ri";
import {
  LuCircleHelp,
  LuPanelRightOpen,
  LuRefreshCcwDot,
} from "react-icons/lu";
import { IoMdNotificationsOff } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { RxTextAlignRight } from "react-icons/rx";
import { GrAttachment } from "react-icons/gr";
import { GoClock } from "react-icons/go";
import { TbMessageCirclePlus } from "react-icons/tb";

const Chat = () => {
  const {
    handleInputChange,
    handleUsernameSubmit,
    username,
    setUsername,
    currentUser,
    handleSendMessage,
    users,
    selectedUser,
    setSelectedUser,
    messages,
    newMessage,
    conversationId,
    otherUserTyping,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-contain bg-center">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-center text-2xl font-bold">
            Welcome to Chat App
          </h1>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="w-full rounded border border-gray-300 p-2"
              required
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full rounded border border-gray-300 p-2"
              required
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Your phone number"
              className="w-full rounded border border-gray-300 p-2"
              required
            />
            <button
              type="submit"
              className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600 mt-12"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-24 overflow-y-hidden">
      <div
        className={`col-span-1 flex flex-col justify-start items-center border-r border-gray-300 cursor-pointer ${
          selectedUser && conversationId ? "mt-12" : ""
        }`}
      >
        <FaWhatsapp size={50} />
        <div className="mt-5">
          <AiFillHome size={25} color="gray" />
        </div>
        <div className="border border-gray-200 w-full my-3.5"></div>
        <div className="flex flex-col gap-4">
          <PiChatTeardropDotsFill size={25} color="green" />
          <IoTicket size={25} color="gray" />
          <BsGraphUp size={25} color="gray" fontWeight={900} />
        </div>
        <div className="border border-gray-200 w-full my-3.5"></div>
        <div className="flex flex-col gap-4">
          <FaListUl size={25} color="gray" />
          <HiSpeakerphone size={25} color="gray" />
          <PiGraphBold size={25} color="gray" fontWeight={900} />
        </div>
        <div className="border border-gray-200 w-full my-3.5"></div>
        <div className="flex flex-col gap-4">
          <RiContactsBookFill size={25} color="gray" />
          <AiFillPicture size={25} color="gray" />
        </div>
        <div className="border border-gray-200 w-full my-3.5"></div>
        <div className="flex flex-col gap-4">
          <IoSettingsSharp size={25} color="gray" />
        </div>
      </div>
      <div className="col-[2_/_span_23] h-screen">
        <div className="h-12 sticky top-0 bg-white z-10 border-b border-gray-300 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <PiChatTeardropDotsFill size={20} color="gray" />{" "}
            <span className="font-semibold text-gray-500 text-sm">chats</span>
          </div>
          <div className="flex items-center gap-4 justify-between">
            <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
              <LuRefreshCcwDot size={20} />
              <span className="font-semibold text-gray-500 text-sm">
                Refresh
              </span>
            </button>
            <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
              <LuCircleHelp size={20} />
              <span className="font-semibold text-gray-500 text-sm">Help</span>
            </button>
            <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFA500] relative before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-[#FFA500] before:blur-sm before:opacity-50 before:-z-10"></div>
              <span className="font-semibold text-gray-500 text-sm">
                5 / 6 phones
              </span>
              <RiExpandUpDownLine size={20} />
            </button>

            <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
              <MdInstallDesktop size={20} />
            </button>
            <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
              <IoMdNotificationsOff size={20} />
            </button>
            <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
              <IoSparklesSharp color="orange" />
              <FaListUl size={20} color="gray" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-24">
          <div className="col-[1_/_span_23] flex h-screen">
            <div className="flex bg-gray-100">
              <div className="w-[400px] bg-white border-r border-gray-900 h-full overflow-y-auto relative">
                <div
                  className={`bg-white p-3.5 border-b border-gray-200 z-10 flex items-center justify-between gap-4 ${
                    selectedUser && conversationId ? "sticky top-12" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <HiMiniFolderArrowDown size={18} color="green" />
                      <p className="font-bold text-sm text-green-700 text-nowrap">
                        Custom filter
                      </p>
                    </div>
                    <button className="text-gray-800  text-sm rounded-lg p-1 flex items-center justify-center border border-gray-200">
                      Save
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
                      <FiSearch size={20} />
                      <span className="text-gray-800">Search</span>
                    </button>
                    <button className="text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
                      <RiFilter3Fill size={20} color="green" />
                      <span className="font-semibold text-green-700">
                        Filtered
                      </span>
                    </button>
                  </div>
                </div>
                <div
                  className={`${selectedUser && conversationId ? "mt-12" : ""}`}
                >
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`p-1.5 rounded cursor-pointer ${
                        selectedUser?.id === user.id
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="">
                          <IoPersonCircle size={50} />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex items-center gap-1 justify-between">
                            <span className="text-sm font-bold text-black">
                              {user.username}
                            </span>
                            <span className="text-xs font-semibold text-amber-800 bg-amber-50 p-1 rounded">
                              Demo
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1">
                              <BiCheckDouble size={15} color="gray" />
                              Lorem ipsum dolor sit amet...
                            </span>
                            <span>
                              <IoPersonCircle size={15} />
                            </span>
                          </div>
                          <div className="flex items-center gap-1 justify-between">
                            <span className="text-xs text-gray-400 bg-gray-100 p-0.5 flex items-center">
                              <MdOutlinePhone />
                              +91-1234567890
                            </span>
                            <span className="text-xs text-gray-400">
                              25-Feb-25
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-green-700 rounded-full cursor-pointer flex justify-center items-center h-12 w-12 fixed bottom-4 left-[380px] z-10 shadow-lg hover:bg-green-800 transition duration-300 ease-in-out">
                  <TbMessageCirclePlus size={30} color="white" />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col h-full bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-contain bg-center">
              {selectedUser && conversationId ? (
                <>
                  {/* Header */}
                  <div className="bg-white p-2.5 border-b border-gray-200 sticky top-12 z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <IoPersonCircle size={35} />
                      </div>
                      <h2 className="font-semibold">{selectedUser.username}</h2>
                    </div>
                    <div className="pr-6">
                      <FiSearch />
                    </div>
                  </div>

                  {/* Scrollable Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-12">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.user_id === currentUser.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-lg max-w-xs sm:max-w-sm md:max-w-md break-words ${
                            message.user_id === currentUser.id
                              ? "bg-[#D9FDD3]"
                              : "bg-white"
                          }`}
                        >
                          {/* <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold ">Daarshik</p>
                            <p className="text-xs text-gray-400">
                              +91-1234567890
                            </p>
                          </div> */}
                          <p className="text-black text-sm">
                            {message.content}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-400 gap-4 pt-3">
                            <p>
                              {message.user_id === currentUser.id
                                ? currentUser.email
                                : selectedUser.email}
                            </p>
                            <p className="flex items-center gap-1 justify-center">
                              {format(new Date(message.created_at), "hh:mm a")}
                              <BiCheckDouble size={15} color="blue" />
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {otherUserTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-400 p-3 rounded-lg max-w-xs">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-400">
                              {selectedUser?.username} is typing
                            </span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Footer */}
                  <div className="bg-white sticky bottom-0 flex flex-col">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex space-x-2"
                    >
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Message..."
                        className="flex-1 p-2 border-none focus:outline-none placeholder:text-md"
                      />
                      <button
                        type="submit"
                        className="cursor-pointer px-6 py-2"
                      >
                        <IoSend color="green" size={25} />
                      </button>
                    </form>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1 flex items-center gap-10">
                        <GrAttachment size={15} color="gray" />
                        <BsEmojiSmile size={15} color="gray" />
                        <GoClock size={15} color="gray" />
                        <AiOutlineHistory size={15} color="gray" />
                        <HiOutlineSparkles size={15} color="gray" />
                        <PiNoteFill size={15} color="gray" />
                        <FaMicrophone size={15} />
                      </div>
                      <div className="flex-1 flex justify-end">
                        <button className=" text-gray-800  text-sm rounded-lg px-2 py-1 flex items-center justify-center border border-gray-200 gap-2">
                          {/* eslint-disable @next/next/no-img-element  */}
                          <img
                            src="https://framerusercontent.com/images/ywGyuWgLKzqyB4QJ1sw5Nk1mckU.svg?scale-down-to=512"
                            alt="logo"
                            width={100}
                            height={100}
                          />
                          <span className="font-semibold text-gray-500 text-sm mr-5">
                            Periskope
                          </span>
                          <RiExpandUpDownLine size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Select a user to start chatting
                </div>
              )}
            </div>
          </div>
          <div
            className={`col-span-1 border-l border-gray-300 cursor-pointer ${
              selectedUser && conversationId ? "mt-12" : ""
            }`}
          >
            <div className="flex flex-col justify-start items-center mt-10 gap-8">
              <LuPanelRightOpen size={25} color="gray" />
              <HiRefresh size={25} color="gray" />
              <CiEdit size={25} color="gray" />
              <RxTextAlignRight size={25} color="gray" />
              <RiListCheck2 size={25} color="gray" />
              <MdGroups size={25} color="gray" />
              <AiFillPicture size={25} color="gray" />
              <RiListSettingsLine size={25} color="gray" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
