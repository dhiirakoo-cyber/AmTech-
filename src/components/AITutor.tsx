/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, RefreshCw, X, MessageSquare, HelpCircle } from 'lucide-react';
import { ChatMessage, Lesson } from '../types';
import BilingualText from './BilingualText';

interface AITutorProps {
  currentLesson?: Lesson | null;
  onClose?: () => void;
}

export default function AITutor({ currentLesson, onClose }: AITutorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    const greetingText = currentLesson 
      ? `Akkam! I see you are learning "${currentLesson.title_or}" ("${currentLesson.title_en}"). How can I help you understand this lesson better today? Ask me any questions in English or Afaan Oromo!`
      : "Akkam! Welcome to Amoo AI Academy Tutor. I can explain any lessons, help you translate terms, or practice quiz questions in both English and Afaan Oromo! What would you like to study today?";
    
    setMessages([
      {
        id: 'greet-1',
        role: 'model',
        content: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [currentLesson]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    if (!textToSend) setInput('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          chatHistory: messages,
          lessonContext: currentLesson
        })
      });

      const data = await response.json();
      
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'model',
        content: data.reply || "I am currently updating my logic. Please try again soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'model',
          content: "Sorry, I am having trouble connecting to the Amoo Core Server. Check your internet connection or verify your GEMINI_API_KEY.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggest = (suggestion: string) => {
    handleSend(suggestion);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'greet-reset',
        role: 'model',
        content: "Chat cleared. Ask me anything about your courses / Koorsee kee irratti na gaafadhu!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const suggestions = [
    { en: "Explain this in Afaan Oromo", or: "Afaan Oromoon naaf ibsi", q: "Please explain the current topic comprehensively in Afaan Oromo with English terms." },
    { en: "Give me a practice question", or: "Gaaffii madaallii naaf kenni", q: "Give me a challenging multiple-choice practice question based on the modern web and software concepts." },
    { en: "How does 200 Birr billing work?", or: "Kaffaltiin 200 Birrii akkam?", q: "Explain how to register and approve the 200 Birr enrollment payment in Amoo Academy." }
  ];

  return (
    <div className="bg-zinc-950/70 border border-zinc-800 rounded-2xl flex flex-col h-[520px] overflow-hidden relative shadow-2xl" id="ai-tutor-container">
      {/* Decorative Blur */}
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="p-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center animate-pulse">
            <Bot className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">Amoo AI Scholar</span>
              <span className="bg-emerald-400/10 text-emerald-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-400/20 uppercase tracking-widest">Bilingual</span>
            </div>
            <p className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
              <span>Powered by Google Gemini</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            title="Reset Conversation"
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Current Lesson Badge Context */}
      {currentLesson && (
        <div className="bg-emerald-500/5 border-b border-emerald-500/15 p-2 px-4 flex items-center justify-between text-[11px] text-emerald-400">
          <span className="font-semibold flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Active Lesson: {currentLesson.title_en}</span>
          </span>
          <span className="text-[10px] text-emerald-400/70 italic">{currentLesson.duration}</span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar Icon */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {msg.role === 'user' ? 'ME' : 'AI'}
              </div>

              <div className="flex flex-col gap-1">
                <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-zinc-900/90 text-zinc-300 border border-zinc-800/80 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
                <span className={`text-[9px] text-zinc-600 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center text-xs animate-pulse">
                AI
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-2xl rounded-tl-none text-xs text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                <span className="ml-1 text-[10px] italic">Amoo AI is thinking / Yaadaa jira...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length < 3 && !loading && (
        <div className="p-3 bg-zinc-950/40 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-2 shrink-0">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggest(sug.q)}
              className="text-left p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/80 hover:border-emerald-500/30 text-[11px] transition-all flex items-start gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <BilingualText 
                en={sug.en} 
                or={sug.or} 
                layout="stacked"
                enClassName="text-[10px] font-semibold text-zinc-300"
                orClassName="text-[9px] text-emerald-400/80 font-normal italic mt-0.2"
              />
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-2 shrink-0 z-10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Tutor in English or Afaan Oromo... / AI gaafadhu..."
          className="flex-1 bg-zinc-950 border border-zinc-800 text-xs rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-emerald-500/50 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold p-3 rounded-xl transition-all shadow-md flex items-center justify-center shrink-0 disabled:opacity-50"
          disabled={!input.trim() || loading}
          id="ai-tutor-send-button"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
