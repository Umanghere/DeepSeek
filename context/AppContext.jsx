"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = ({ children }) => {
    const { user } = useUser()
    const { getToken } = useAuth()

    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null)

    const createNewChat = async () => {
        try {
            if (!user) return null;

            const token = await getToken();

            const { data } = await axios.post('/api/chat/create', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                // Update local state with the new chat
                const newChat = data.data;
                setChats(prevChats => [newChat, ...prevChats]);
                setSelectedChat(newChat); // Optionally select the new chat
                return newChat;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            return null;
        }
    };

    const fetchUserChat = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.get('/api/chat/get', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                let chatList = data.data;

                // If the user has no chats, create one
                if (chatList.length === 0) {
                    const newChat = await createNewChat();
                    if (newChat) {
                        chatList = [newChat];
                    } else {
                        return; // prevent recursion if creation fails
                    }
                }

                chatList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setChats(chatList);
                setSelectedChat(chatList[0]);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserChat();
        }
    }, [user])

    const value = {
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUserChat,
        createNewChat
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}