import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, SendHorizonal } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Chatbot.css';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("VITE_GEMINI_API_KEY is missing from .env!");
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const BASE_SYSTEM_PROMPT = `You are QuickShow Assistant, a friendly and helpful AI chatbot embedded in the QuickShow movie booking website. Your job is to help users navigate and use the website.

Here is what the QuickShow website offers:
- **Home Page**: Features a hero section, featured movies, and movie trailers.
- **Movies Page** (/movies): Browse all available movies with posters and details.
- **Movie Details** (/movies/:id): View detailed info about a movie (synopsis, runtime, cast) and choose a date/showtime.
- **Seat Selection** (/movies/:id/:date): Interactive seat layout to pick seats and proceed to payment.
- **My Bookings** (/my-bookings): View all your bookings, payment status, and ticket details.
- **Favorites** (/favorite): Your saved favorite movies.
- **Authentication**: Powered by Clerk. Users can sign in/sign up to book tickets.
- **Payment**: Powered by Stripe. Users pay securely for their bookings.

Guidelines:
- Be concise, warm, and helpful.
- If a user asks how to do something, guide them step by step.
- If a user asks about something unrelated to QuickShow, politely redirect them.
- Use emojis sparingly to keep it friendly 🎬
- When referencing pages, mention the navigation bar links (Home, Movies, Theaters, Releases, Favorites).
- Keep responses short (2-4 sentences max) unless more detail is requested.`;

const WELCOME_MSG = "Hey there! 👋 I'm your QuickShow Assistant. I can help you browse movies, book tickets, manage your bookings, and more. What can I help you with?";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: WELCOME_MSG }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { shows, detailedShows, userBookings } = useAppContext();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: 'user', text: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build dynamic context string
      const currentDateString = new Date().toLocaleString();
      
      let moviesContext = "Currently Available Movies, Showtimes, and Prices:\n";
      if (detailedShows && detailedShows.length > 0) {
        detailedShows.forEach(show => {
            moviesContext += `- Movie: ${show.movie?.title} | Date/Time: ${new Date(show.showDateTime).toLocaleString()} | Price: ₹${show.showPrice}\n`;
        });
      } else if (shows && shows.length > 0) {
         shows.forEach(movie => {
            moviesContext += `- Movie: ${movie.title}\n`;
        });
      } else {
        moviesContext += "No shows are currently loaded in context.";
      }

      let bookingsContext = "Current User's Bookings:\n";
      if (userBookings && userBookings.length > 0) {
        userBookings.forEach(booking => {
            const seatList = (booking.seats || []).join(', ');
            bookingsContext += `- Booking ID: ${booking._id} | Movie: ${booking.show?.movie?.title || 'Unknown'} | Time: ${booking.show?.showDateTime ? new Date(booking.show.showDateTime).toLocaleString() : 'Unknown'} | Seats: ${seatList || 'Unknown'} | Status: ${booking.isPaid ? 'Paid' : 'Unpaid'}\n`;
        });
      } else {
        bookingsContext += "User currently has no bookings.";
      }

      const activeSystemPrompt = `${BASE_SYSTEM_PROMPT}\n\n=== LIVE APPLICATION CONTEXT ===\nCurrent User Local Time: ${currentDateString}\n\n${moviesContext}\n\n${bookingsContext}`;
      // Filter out only user/model roles and map to Gemini format
      // Skip the welcome message if it's the first one
      const history = updatedMessages
        .filter(msg => msg.text !== WELCOME_MSG)
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      const body = {
        system_instruction: {
          parts: [{ text: activeSystemPrompt }]
        },
        contents: history
      };

      console.log('Sending to Gemini:', body);

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      console.log('Gemini Response:', data);

      if (data.error) {
        throw new Error(data.error.message || "API Error");
      }

      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || "Sorry, I couldn't process that. Please try again! 🙁";

      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (err) {
      console.error('Gemini API error:', err);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `Error: ${err.message}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <div className={`chatbot-panel ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-dot" />
          <h3>QuickShow Assistant</h3>
          <span>AI Powered</span>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbot-msg ${msg.role === 'user' ? 'user' : 'bot'}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className="chatbot-typing">
              <span /><span /><span />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask me anything about QuickShow..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className="chatbot-send-btn"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            id="chatbot-send"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
        className={`chatbot-btn ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(prev => !prev)}
        id="chatbot-toggle"
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
      </button>
    </>
  );
};

export default Chatbot;
