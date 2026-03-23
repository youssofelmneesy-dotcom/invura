import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "مرحباً بك في Invura! كيف يمكنني مساعدتك اليوم؟", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      const userMessage = { id: Date.now(), text: inputValue, sender: "user" };
      setMessages([...messages, userMessage]);
      setInputValue("");

      // محاكاة رد تلقائي من البوت
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: "شكراً لتواصلك! سيقوم أحد ممثلينا بالرد عليك قريباً.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  return (
    <>
      {/* زر فتح الشات */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* نافذة الشات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 left-6 w-96 max-w-[calc(100vw-3rem)] bg-white border border-gray-200 rounded-lg shadow-2xl z-50"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-bold">خدمة العملاء</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-3" dir="rtl">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-gray-200 text-black"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2" dir="rtl">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
