import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
// import { ChatBot } from "./ChatBot";

export function Layout() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      {/* Chat Bot disabled per request. Keep component import/render commented for easy restore. */}
      {/* <ChatBot /> */}
    </div>
  );
}
