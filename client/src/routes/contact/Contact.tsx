"use client";
import { cn } from "../../lib/utils";

export function Contact() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-950">
      <div className="max-w-lg w-full group/card">
        <div
          className={cn(
            "cursor-pointer overflow-hidden relative card h-[26rem] rounded-xl shadow-2xl max-w-md mx-auto backgroundImage flex flex-col justify-between p-6",
            "bg-[url(https://images.unsplash.com/photo-1544077960-604201fe74bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1651&q=80)] bg-cover bg-center"
          )}
        >
          {/* Overlay */}
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>

          {/* Brand Info */}
          <div className="flex flex-row items-center space-x-4 z-10">
            <img
              height="100"
              width="100"
              alt="CrestKeys Logo"
              src="/logo.svg"
              className="h-14 w-14 rounded-full border-2 object-cover"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-lg text-gray-50 relative z-10">
                CrestKeys
              </p>
              <p className="text-sm text-gray-300">Innovating Since 2025</p>
            </div>
          </div>

          {/* Contact Content */}
          <div className="relative z-10 mt-6">
            <h1 className="font-bold text-2xl md:text-3xl text-gray-50">
              Get in Touch
            </h1>
            <p className="font-normal text-sm text-gray-100 mt-3 leading-relaxed">
              We’d love to hear from you! Reach out for collaborations, 
              partnerships, or support. Our team is here to help you connect 
              with innovation that matters.
            </p>

            <div className="mt-5 space-y-2 text-gray-100">
              <p className="font-bold">
                  contact@crestkeys.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
