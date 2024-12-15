'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { supportApi } from '@/lib/api/support';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Message {
    content: string;
    isBot: boolean;
    timestamp: string;
}

const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default function ResourceChatbot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([{
        content: "Hello! I'm your mental health support assistant. I can help you manage your workload and stress levels. How can I assist you today?",
        isBot: true,
        timestamp: new Date().toISOString()
    }]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        
        // Add user message to chat
        setMessages(prev => [...prev, {
            content: userMessage,
            isBot: false,
            timestamp: new Date().toISOString()
        }]);

        setIsLoading(true);
        try {
            const response = await supportApi.sendMessage(userMessage);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            // Add bot response to chat
            setMessages(prev => [...prev, {
                content: response.response,
                isBot: true,
                timestamp: new Date().toISOString()
            }]);
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Extract error message
            let errorMessage = "I apologize, but I'm having trouble responding right now. Please try again later.";
            if (error instanceof Error) {
                if (error.message.includes('OpenAI API key is not configured')) {
                    errorMessage = "The AI service is not properly configured. Please contact support.";
                } else if (error.message.includes('Error communicating with OpenAI')) {
                    errorMessage = "There was an issue connecting to the AI service. Please try again in a moment.";
                }
            }
            
            // Add error message to chat
            setMessages(prev => [...prev, {
                content: errorMessage,
                isBot: true,
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full h-[600px] flex flex-col">
            <CardHeader className="bg-orange-50 border-b border-orange-100">
                <CardTitle className="text-gray-900">Mental Health Support Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`flex items-start space-x-2 max-w-[80%] ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <Avatar className={`w-8 h-8 text-center ${message.isBot ? 'bg-orange-500' : 'bg-gray-500'}`}>
                                        <span className="text-xs text-white">
                                            {message.isBot ? 'AI' : 'You'}
                                        </span>
                                    </Avatar>
                                    <div
                                        className={`rounded-lg p-3 ${
                                            message.isBot
                                                ? 'bg-orange-50 text-gray-900'
                                                : 'bg-orange-500 text-white'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        <p className="text-xs mt-1 opacity-70">
                                            {formatTimestamp(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="p-4 border-t border-gray-200 flex space-x-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                        <PaperAirplaneIcon className="h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 