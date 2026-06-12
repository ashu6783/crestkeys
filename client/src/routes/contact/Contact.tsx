"use client";
import { cn } from "../../lib/utils";
import { SITE_IMAGES } from "../../lib/siteImages";

export function Contact() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-950 px-4">
      <div className="w-full max-w-md sm:max-w-lg group/card">
        <div
          className={cn(
            "relative overflow-hidden cursor-pointer rounded-xl shadow-2xl backgroundImage flex flex-col justify-between p-6 sm:p-8",
            "h-auto sm:h-[26rem] bg-cover bg-center"
          )}
          style={{ backgroundImage: `url(${SITE_IMAGES.contactHero})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 group-hover/card:bg-black/70 transition duration-300"></div>

          {/* Brand Info */}
          <div className="relative z-10 flex flex-row items-center space-x-4">
            <img
              height="100"
              width="100"
              alt="CrestKreys Logo"
              src="/logo.svg"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-lg sm:text-xl text-gray-50">
                CrestKreys
              </p>
              <p className="text-sm text-gray-300">Innovating Since 2025</p>
            </div>
          </div>

          {/* Contact Content */}
          <div className="relative z-10 mt-6 sm:mt-8">
            <h1 className="font-bold text-2xl sm:text-3xl text-gray-50 leading-snug">
              Get in Touch
            </h1>
            <p className="font-normal text-sm sm:text-base text-gray-100 mt-3 leading-relaxed">
              We’d love to hear from you! Reach out for collaborations,
              partnerships, or support. Our team is here to help you connect
              with innovation that matters.
            </p>

            <div className="mt-5 space-y-1 sm:space-y-2 text-gray-100">
              <p className="font-bold text-sm sm:text-base">
                contact@crestkreys.com
              </p>
              <p className="text-sm sm:text-base">+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
