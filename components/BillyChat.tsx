'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type PageProp = 'academy' | 'basmateachme' | 'hopes' | 'general';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface BillyChatProps {
  page?: PageProp;
}

// ─── Lead capture state ───────────────────────────────────────────────────────

type LeadStep = 'idle' | 'asked' | 'awaitingInput' | 'done';

// Simple regex helpers
const EMAIL_RE = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
const NAME_RE  = /^[a-zA-ZÀ-ÿ' \-]{2,40}$/;

/** Try to pull a name + email out of a single free-form string, e.g. "Sarah sarah@gmail.com" */
function parseNameEmail(text: string): { name: string; email: string } | null {
  const emailMatch = text.match(EMAIL_RE);
  if (!emailMatch) return null;
  const email = emailMatch[0];
  const rest = text.replace(email, '').trim().replace(/[,;]+/g, '').trim();
  if (NAME_RE.test(rest)) return { name: rest, email };
  return null;
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      {/* Billy avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black border border-[#39FF14] flex items-center justify-center text-base">
        🪆
      </div>
      <div className="bg-[#111111] border border-[#39FF14]/30 rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          <span
            className="w-2 h-2 rounded-full bg-[#39FF14] inline-block animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '900ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#39FF14] inline-block animate-bounce"
            style={{ animationDelay: '200ms', animationDuration: '900ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-[#39FF14] inline-block animate-bounce"
            style={{ animationDelay: '400ms', animationDuration: '900ms' }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isAssistant = message.role === 'assistant';

  if (isAssistant) {
    return (
      <div className="flex items-end gap-2 mb-4">
        {/* Billy avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black border border-[#39FF14] flex items-center justify-center text-base">
          🪆
        </div>
        <div
          className="max-w-[75%] bg-[#111111] border border-[#39FF14]/30 rounded-2xl rounded-bl-none px-4 py-3
                     text-white text-sm leading-relaxed shadow-sm shadow-[#39FF14]/10"
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4">
      <div
        className="max-w-[75%] bg-[#BF5FFF] rounded-2xl rounded-br-none px-4 py-3
                   text-white text-sm leading-relaxed shadow-sm shadow-[#BF5FFF]/30"
      >
        {message.content}
      </div>
    </div>
  );
}

// ─── Success Banner ───────────────────────────────────────────────────────────

function SuccessBanner() {
  return (
    <div
      className="mx-3 mb-3 px-4 py-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]
                 text-[#39FF14] text-sm font-semibold text-center animate-pulse"
    >
      🎉 Basma will be in touch soon!
    </div>
  );
}

// ─── Lead Input Form ──────────────────────────────────────────────────────────

interface LeadFormProps {
  onSubmit: (name: string, email: string) => void;
}

function LeadForm({ onSubmit }: LeadFormProps) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && EMAIL_RE.test(email.trim())) {
      onSubmit(name.trim(), email.trim());
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-3 mb-3 p-3 rounded-xl bg-[#111111] border border-[#BF5FFF]/40 flex flex-col gap-2"
    >
      <input
        ref={nameRef}
        type="text"
        placeholder="Your name 🎭"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="bg-black border border-[#39FF14]/30 rounded-lg px-3 py-2 text-sm text-white
                   placeholder-gray-500 focus:outline-none focus:border-[#39FF14] focus:ring-1
                   focus:ring-[#39FF14]/50 transition-colors"
      />
      <input
        type="email"
        placeholder="Email address 📧"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-black border border-[#39FF14]/30 rounded-lg px-3 py-2 text-sm text-white
                   placeholder-gray-500 focus:outline-none focus:border-[#39FF14] focus:ring-1
                   focus:ring-[#39FF14]/50 transition-colors"
      />
      <button
        type="submit"
        disabled={!name.trim() || !EMAIL_RE.test(email.trim())}
        className="bg-[#39FF14] text-black font-bold text-sm rounded-lg py-2
                   hover:brightness-110 active:scale-95 transition-all
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Send it! 🎸
      </button>
    </form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BillyChat({ page = 'general' }: BillyChatProps) {
  const [isOpen, setIsOpen]               = useState(false);
  const [isMinimized, setIsMinimized]     = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [inputValue, setInputValue]       = useState('');
  const [isTyping, setIsTyping]           = useState(false);
  const [showSuccess, setShowSuccess]     = useState(false);
  const [isVisible, setIsVisible]         = useState(false);

  // ── Lead capture state ───────────────────────────────────────────────────
  const [leadStep, setLeadStep]           = useState<LeadStep>('idle');
  const leadAskedRef                      = useRef(false);   // prevents double-fire
  const leadCapturedRef                   = useRef(false);   // prevents double-post

  const messagesEndRef   = useRef<HTMLDivElement>(null);
  const inputRef         = useRef<HTMLInputElement>(null);
  const hasFetchedGreeting = useRef(false);

  // ── Scroll to bottom whenever messages change ────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, leadStep, scrollToBottom]);

  // ── Auto-send greeting on mount ──────────────────────────────────────────
  useEffect(() => {
    if (hasFetchedGreeting.current) return;
    hasFetchedGreeting.current = true;

    const fetchGreeting = async () => {
      setIsTyping(true);
      try {
        const res = await fetch('/api/billy-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [], page }),
        });
        const data = await res.json();
        const content: string =
          data?.message ?? data?.content ?? data?.reply ?? 'Hey there! 👋 I\'m Billy! How can I help you today?';
        setMessages([{ role: 'assistant', content }]);
      } catch {
        setMessages([
          {
            role: 'assistant',
            content:
              "Hey there! 👋 I'm Billy! I'm here to help you learn more about BasmaTeach Me Music Academy. What's your name?",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchGreeting();
  }, [page]);

  // ── Focus input when chat opens ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // ── Open / close animation ───────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // ── Open chat ────────────────────────────────────────────────────────────
  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (!hasBeenOpened) setHasBeenOpened(true);
  };

  // ── Close chat ───────────────────────────────────────────────────────────
  const closeChat = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 280);
  };

  // ── Detect name+email capture in Billy's AI response (legacy Airtable path)
  const detectSuccess = useCallback((text: string) => {
    const lower = text.toLowerCase();
    const hasNameCapture =
      lower.includes('great to meet you') ||
      lower.includes('nice to meet you') ||
      lower.includes('lovely to meet you') ||
      lower.includes('wonderful to meet you');
    const hasEmailCapture =
      lower.includes('basma will be in touch') ||
      lower.includes("i'll pass your details") ||
      lower.includes("i've got your details") ||
      lower.includes('got your email') ||
      lower.includes('received your email');
    return hasNameCapture && hasEmailCapture;
  }, []);

  // ── Post lead to /api/billy-lead ─────────────────────────────────────────
  const submitLead = useCallback(
    async (name: string, email: string) => {
      if (leadCapturedRef.current) return;
      leadCapturedRef.current = true;

      // Immediately show confirmation in chat
      const confirmMsg = `Awesome ${name}! I'll send you some cool stuff 🎸`;
      setMessages((prev) => [...prev, { role: 'assistant', content: confirmMsg }]);
      setLeadStep('done');
      setShowSuccess(true);

      try {
        await fetch('/api/billy-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, source: page }),
        });
      } catch (err) {
        console.error('Lead submission failed:', err);
      }
    },
    [page],
  );

  // ── Handle lead form submission (dedicated form) ─────────────────────────
  const handleLeadFormSubmit = useCallback(
    (name: string, email: string) => {
      submitLead(name, email);
    },
    [submitLead],
  );

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: Message = { role: 'user', content: text.trim() };
      const updatedMessages = [...messages, userMessage];

      setMessages(updatedMessages);
      setInputValue('');
      setIsTyping(true);

      try {
        const res = await fetch('/api/billy-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages, page }),
        });
        const data = await res.json();
        const content: string =
          data?.message ?? data?.content ?? data?.reply ?? "I'm having a little trouble right now. Please try again!";

        const assistantMessage: Message = { role: 'assistant', content };
        const nextMessages = [...updatedMessages, assistantMessage];
        setMessages(nextMessages);

        // ── Lead capture trigger: after 2 full exchanges (4 messages), prompt once
        const userTurns = nextMessages.filter((m) => m.role === 'user').length;
        if (userTurns >= 2 && leadStep === 'idle' && !leadAskedRef.current) {
          leadAskedRef.current = true;
          // Small delay so Billy's reply lands first, then the prompt appears
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: "Hey, want me to send you some fun resources? Drop your name and email! 🎭",
              },
            ]);
            setLeadStep('awaitingInput');
          }, 800);
        }

        // Legacy Airtable success detection
        if (!showSuccess && detectSuccess(content)) {
          setShowSuccess(true);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "Oops! Something went wrong on my end. Let's try that again! 🪆",
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, isTyping, page, showSuccess, detectSuccess, leadStep],
  );

  // ── Handle Enter key ─────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Chat Window ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          aria-label="Billy Chat"
          role="dialog"
          aria-modal="true"
          className={`
            fixed z-50
            bottom-24 right-6
            w-[calc(100vw-3rem)] sm:w-[400px]
            bg-black border border-[#39FF14] rounded-2xl
            shadow-2xl shadow-[#39FF14]/20
            flex flex-col overflow-hidden
            transition-all duration-300 ease-out
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            ${isMinimized ? 'h-[60px]' : 'h-[500px]'}
          `}
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-[#39FF14]/30
                       bg-black flex-shrink-0 cursor-pointer select-none"
            onClick={() => setIsMinimized((prev) => !prev)}
          >
            <div>
              <h2 className="text-[#39FF14] font-bold text-lg leading-tight">
                Billy 🪆
              </h2>
              <p className="text-[#BF5FFF] text-xs font-medium tracking-wide">
                BasmaTeach Me • Music Academy
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Minimize button */}
              <button
                aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized((prev) => !prev);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full
                           text-[#FFD700] hover:bg-[#FFD700]/10 transition-colors duration-150
                           text-lg font-bold leading-none"
              >
                {isMinimized ? '▲' : '▼'}
              </button>
              {/* Close button */}
              <button
                aria-label="Close chat"
                onClick={(e) => {
                  e.stopPropagation();
                  closeChat();
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full
                           text-[#39FF14] hover:bg-[#39FF14]/10 transition-colors duration-150
                           text-lg font-bold leading-none"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── Body (hidden when minimized) ─────────────────────────────────── */}
          {!isMinimized && (
            <>
              {/* ── Messages area ─────────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto px-3 pt-4 pb-2 space-y-0 scrollbar-thin">
                {messages.map((msg, idx) => (
                  <MessageBubble key={idx} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Lead capture form (shown after Billy's prompt) ─────────── */}
              {leadStep === 'awaitingInput' && (
                <LeadForm onSubmit={handleLeadFormSubmit} />
              )}

              {/* ── Success Banner ─────────────────────────────────────────── */}
              {showSuccess && <SuccessBanner />}

              {/* ── Input area ────────────────────────────────────────────── */}
              <div className="flex-shrink-0 border-t border-[#39FF14]/30 p-3">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message…"
                    disabled={isTyping}
                    aria-label="Chat message input"
                    className="
                      flex-1 bg-[#111111] border border-[#39FF14]/40 rounded-full
                      px-4 py-2 text-sm text-white placeholder-gray-500
                      focus:outline-none focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/50
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-150
                    "
                  />
                  <button
                    onClick={() => sendMessage(inputValue)}
                    disabled={isTyping || !inputValue.trim()}
                    aria-label="Send message"
                    className="
                      flex-shrink-0 w-10 h-10 rounded-full
                      bg-[#39FF14] text-black font-bold text-lg
                      flex items-center justify-center
                      shadow-md shadow-[#39FF14]/30
                      hover:brightness-110 active:scale-95
                      disabled:opacity-40 disabled:cursor-not-allowed
                      transition-all duration-150
                    "
                  >
                    ➤
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating Button ──────────────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <button
          onClick={openChat}
          aria-label="Open Billy Chat"
          className="
            relative flex items-center gap-2
            bg-[#39FF14] text-black font-bold
            rounded-full px-5 py-3
            shadow-lg shadow-[#39FF14]/30
            hover:brightness-110 hover:scale-105
            active:scale-95
            transition-all duration-200
            animate-pulse
          "
          style={{
            /* Override pulse to be subtle — scale + opacity */
            animationDuration: '2.5s',
          }}
        >
          {/* Unread dot */}
          {!hasBeenOpened && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#BF5FFF] border-2 border-black"
              aria-label="Unread message"
            />
          )}
          <span className="text-xl leading-none">🪆</span>
          <span className="text-sm whitespace-nowrap">Chat with Billy!</span>
        </button>
      </div>
    </>
  );
}
