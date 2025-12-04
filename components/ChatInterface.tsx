import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';
import { paperSummary } from '../data';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am an expert on the "Order Matters!" research paper. Ask me anything about how input order affects LLMs in software fault localization.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const model = 'gemini-2.5-flash';
      
      const systemContext = `
        You are a helpful research assistant expert on the paper "Order Matters! An Empirical Study on Large Language Models’ Input Order Bias in Software Fault Localization" (ICSE '26).
        
        Key Facts from the paper:
        ${paperSummary}
        
        Additional Details:
        - Authors: Md Nakhla Rafi, Dong Jae Kim, Tse-Hsun (Peter) Chen, Shaowei Wang.
        - Benchmarks used: Defects4J (Java) and BugsInPy (Python).
        - Models tested: GPT-4o-mini and DeepSeek-Chat.
        - The paper proposes that LLMs have a "primacy effect" or order bias.
        - Perfect Ordering (bug first) yields ~57% accuracy. Worst Ordering (bug last) yields ~20%.
        - Segmentation (splitting input into chunks of size 10) fixes this bias.
        - Renaming methods (obfuscation) proved that this is NOT due to data leakage.
        
        Answer questions concisely and accurately based ONLY on this information. If you don't know, say so.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [
            { role: 'user', parts: [{ text: systemContext }] }, 
            ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
            { role: 'user', parts: [{ text: userMessage }] }
        ]
      });

      const responseText = response.text || "I apologize, I couldn't generate a response.";
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to the API.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800">Q&A with Gemini 2.5 Flash</h3>
        <p className="text-xs text-slate-500">Ask specific questions about the experimental setup or results.</p>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : msg.isError 
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-bl-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl p-4 rounded-bl-none flex gap-2 items-center">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'What is the Kendall Tau distance?' or 'Does segmentation help?'"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
