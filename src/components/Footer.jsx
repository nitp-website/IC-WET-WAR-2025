import React from "react";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative  bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 text-white">
      {/* Horizontal SVG wave (straight, not U-shaped) */}
      <svg
        className="absolute top-0 left-0 w-full h-8 -mt-8 text-sky-500"
        preserveAspectRatio="none"
        viewBox="0 0 1440 40"
      >
        <rect width="1440" height="40" fill="currentColor" />
      </svg>
      <div className="relative px-4 pt-12 mx-auto max-w-7xl md:px-12 lg:px-8">
        <div className="grid gap-10 row-gap-8 mb-8 md:grid-cols-2 lg:grid-cols-6">
          {/* About */}
          <div className="flex flex-col lg:col-span-1.5 items-center lg:items-start">
            <span className="text-2xl font-bold tracking-wide text-white uppercase mb-2 w-full text-center lg:text-left block">
              WET-WAR
            </span>
            <p className="text-sm text-sky-50 w-full text-center lg:text-left">
              WET-WAR 2025 is the first international conference focused on wetland ecosystems for sustainable development. It aims to address global challenges such as habitat loss and water scarcity by fostering collaboration among researchers, experts, and communities.
            </p>
          </div>
          {/* Call for Papers */}
          <div className="flex flex-col items-center md:items-start">
            <p className="font-semibold tracking-wide text-sky-200 uppercase mb-2 text-center md:text-left">
              Call for Papers
            </p>
            <ul className="mt-2 space-y-2 flex flex-col items-center md:items-start">
              <li>
                <a
                  href="/author#themes"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Tracks & Themes
                </a>
              </li>
              <li>
                <a
                  href="/author#dates"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Important Dates
                </a>
              </li>
              <li>
                <a
                  href="/author#submission"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Submission
                </a>
              </li>
            </ul>
          </div>
          {/* Registration */}
          <div className="flex flex-col items-center md:items-start">
            <p className="font-semibold tracking-wide text-sky-200 uppercase mb-2 text-center md:text-left">
              Registration
            </p>
            <ul className="mt-2 space-y-2 flex flex-col items-center md:items-start">
              <li>
                <a
                  href="/register#fees"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Fee Details
                </a>
              </li>
              <li>
                <a
                  href="/register#submission"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Submission
                </a>
              </li>
            </ul>
          </div>
          {/* Sponsors */}
          <div className="flex flex-col items-center md:items-start">
            <p className="font-semibold tracking-wide text-sky-200 uppercase mb-2 text-center md:text-left">
              Sponsors
            </p>
            <ul className="mt-2 space-y-2 flex flex-col items-center md:items-start">
              <li>
                <a
                  href="/call-for-sponsor"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Call For Sponsorships
                </a>
              </li>
              <li>
                <a
                  href="/sponsors"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Past Sponsors
                </a>
              </li>
            </ul>
          </div>
          {/* Speakers */}
          <div className="flex flex-col items-center md:items-start">
            <p className="font-semibold tracking-wide text-sky-200 uppercase mb-2 text-center md:text-left">
              Speakers
            </p>
            <ul className="mt-2 flex flex-col space-y-2 items-center md:items-start">
              <li>
                <a
                  href="/key-note-speakers"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Keynote Speakers
                </a>
              </li>
            </ul>
          </div>
          {/* Committee */}
          <div className="flex flex-col items-center md:items-start">
            <p className="font-semibold tracking-wide text-sky-200 uppercase mb-2 text-center md:text-left">
              Committee
            </p>
            <ul className="mt-2 flex flex-col space-y-2 items-center md:items-start">
              <li>
                <a
                  href="/organizing-committee"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Organizing Committee
                </a>
              </li>
              <li>
                <a
                  href="/scientific-committee"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Scientific Committee
                </a>
              </li>
              <li>
                <a
                  href="/advisory-committee"
                  className="transition-colors duration-300 text-sky-50 hover:text-white"
                >
                  Advisory Committee
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-5 pb-10 border-t border-sky-400 sm:flex-row">
          <div className="flex-1 flex flex-col items-center sm:items-start">
            <p className="text-xs text-sky-50 text-center sm:text-left">
              © {currentYear}{" "}
              <span className="font-medium text-white">WET-WAR 2025, NIT Patna</span>
              . All rights reserved.
            </p>
            <p className="text-[11px] text-sky-100 mt-2 max-w-xl text-center sm:text-left">
              <strong>CMT Acknowledgment:</strong> The Microsoft CMT service was
              used for managing the peer-reviewing process for this conference.
              This service was provided for free by Microsoft and they bore all
              expenses, including costs for Azure cloud services as well as for
              software development and support.
            </p>
          </div>
          <div className="flex items-center mt-4 space-x-4 sm:mt-0 text-xl">
            <a
              href="#"
              className="transition-colors duration-300 text-sky-100 hover:text-white"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="transition-colors duration-300 text-sky-100 hover:text-white"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              className="transition-colors duration-300 text-sky-100 hover:text-white"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
      {/* Hide any image right after footer */}
      <style>{`
        footer + img, footer + div > img {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
