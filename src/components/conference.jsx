"use client"
import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";

function TemplateDownload() {
  const [show, setShow] = useState(false);

  // Close the list when clicking outside
  React.useEffect(() => {
    if (!show) return;
    const handle = (e) => {
      if (!e.target.closest('.template-download-dropdown')) setShow(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [show]);

  return (
    <div className="relative template-download-dropdown">
      <button
        className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition"
        onClick={() => setShow((v) => !v)}
        type="button"
      >
        <FiUpload className="text-xl" />
        Template Download
      </button>
      {show && (
        <ul className="absolute left-1/2 -translate-x-1/2 mt-4 flex flex-col gap-2 z-50 min-w-[220px] bg-white border border-sky-400 rounded-lg shadow-lg py-2 px-0">
          <li>
            <a
              href="/WETWAR 2025_abstract_template.docx"
              download
              className="flex items-center gap-3 px-6 py-3 hover:bg-sky-50 transition text-sky-700 font-semibold"
            >
              <FiUpload className="text-xl" />
              Abstract Template
            </a>
          </li>
          <li>
            <a
              href="/WET-WAR 2025 -Full Paper Template File.docx"
              download
              className="flex items-center gap-3 px-6 py-3 hover:bg-sky-50 transition text-sky-700 font-semibold"
            >
              <FiUpload className="text-xl" />
              Full Paper Template
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

const Conference = () => (
  <section className="relative z-10 min-h-[70vh] flex flex-col bg-gradient-to-br from-[#e3f2fd] to-[#b3e0fc] py-12 px-4 font-sans">
    <h2 className="w-full text-3xl sm:text-4xl font-bold text-black mb-10 tracking-wider uppercase text-center z-30 drop-shadow-[0_2px_12px_#38bdf8]">
      About Conference
    </h2>
    <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full">
      {/* Left: Video */}
      <div className="flex-1 max-w-xl w-full flex flex-col items-center justify-center mb-10 lg:mb-0 z-20">
        <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-xl border-2 border-white bg-white/20 flex items-center justify-center">
          <video
            src="/wetwar.mp4"
            controls
            className="w-full h-full object-cover rounded-2xl bg-black"
            poster="/hero1.jpg"
          />
        </div>
        <div className="flex flex-row flex-wrap gap-4 mt-6 justify-center items-center w-full">
          <a
            href="https://drive.google.com/file/d/1QRjOTFPcrxPsI0V5VX2viTHvXiJc0zQJ/view?usp=sharing"
            download
            className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out flex items-center justify-center h-[52px] min-h-[52px]"
            style={{ lineHeight: "1.2" }}
          >
            📥&nbsp;Download Brochure
          </a>
          <TemplateDownload />
        </div>
      </div>
      {/* Right: Map */}
      <div className="flex-1 max-w-xl w-full flex items-center justify-center z-20">
        <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden shadow-xl border-2 border-white bg-white/20 flex items-center justify-center h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.5246824353003!2d85.17206600000002!3d25.620706199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed58dce6732867%3A0x4059f39a1ac82f06!2sNational%20Institute%20of%20Technology%2C%20Patna!5e0!3m2!1sen!2sin!4v1747894009342!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="NIT Patna Location"
            className="w-full h-full rounded-2xl"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
);

export default Conference;
