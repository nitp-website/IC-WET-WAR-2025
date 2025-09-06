"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { FiUpload } from "react-icons/fi";

const registrationFees = [
  { label: 'Students/Research scholars', value: 'Rs. 5000 / USD 100' },
  { label: 'Academician/Industry Professionals', value: 'Rs. 9000 / USD 200' },
  { label: 'Accompanying person', value: 'Rs. 5000 / USD 100' }
];

const sponsors = [
  { label: 'Bronze', value: '25000' },
  { label: 'Silver', value: '50000' },
  { label: 'Gold', value: '100000' },
  { label: 'Diamond', value: '200000 and above' }
];

const majorThemes = [
  'Wetlands and Sustainable Development',
  'Water resources and sustainable development',
  'Climate change impacts on wetlands and water resources',
  'Water quality monitoring, modelling and pollution remediation techniques',
  'Integrated management plan for wetlands',
  'Modelling of wetlands and water resources using AI, ML, and other soft computing techniques.',
  'Integrated Water Resources Management (IWRM) for Sustainable Development',
  'Wetlands as Nature Based Solutions',
  'Wetlands and water resources in Architecture and Planning'
];

const importantDates = [
  { label: 'Paper submission:', value: '30th July 2025' },
  { label: 'Abstract acceptance:', value: '30th July 2025' },
  { label: 'Full length paper:', value: '30th August 2025' },
  { label: 'Acceptance/Rejection:', value: '25th September 2025' },
  { label: 'Final submission:', value: '30th September 2025' },

];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/author', label: 'Author Section' },
  { href: '/people', label: 'Key People' },
  { href: '/register', label: 'Registration' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/contact-us', label: 'Contact Us' },
];

function TemplateDownload() {
  const [show, setShow] = useState(false);

  // Close the list when clicking outside
  React.useEffect(() => {
    if (!show) return;
    const handle = (e) => {
      // Only close if click is outside the button/list
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

const Page = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <div
        className="relative w-screen min-h-screen shadow-xl overflow-x-hidden flex flex-col"
        style={{
          background: "linear-gradient(135deg, #e3f2fd 0%, #b3e0fc 100%)",
          color: "#111",
        }}
      >
        <Navbar/>
        {/* Main Content */}
        <div
          className="w-screen mx-auto p-6 pt-28 shadow-xl flex-1 flex flex-col"
          style={{
            background: "rgba(255,255,255,0.10)",
            color: "#111",
          }}
        >
          {/* Conference Introduction */}
          <section className="mb-10">
            <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-700 via-sky-600 to-sky-800 text-transparent bg-clip-text tracking-wide mt-2 mb-2">
              International Conference WET-WAR 2025
            </h1>

            <p
              className="text-base leading-7 font-serif text-black/90 text-justify"
            >
              Wetland ecosystems and water resources are among the most productive and biodiversity-rich environments on Earth. Organizing the first-ever conference on wetland ecosystems for sustainable development is a significant step in addressing both local and global environmental challenges such as habitat loss, climate change, and water scarcity. This conference will provide a unique platform for experts, policymakers, researchers, and local communities to come together and share knowledge, collaborate on conservation strategies, and develop solutions for safeguarding wetlands and water resources.
            </p>
            {/* Buttons for submissions */}
            <div className="flex flex-wrap justify-center gap-6 my-8">
              <button
                className="bg-[#ff9800] hover:bg-orange-800 font-bold px-7 py-3 rounded-lg shadow-lg transition text-lg cursor-pointer text-white drop-shadow"
                onClick={() => window.open('https://cmt3.research.microsoft.com/WETWAR2025', '_blank')}
              >
                Paper Submission
              </button>
              {/* Removed Paper Submission button */}
              {/* Template Download Button */}
              <TemplateDownload />
            </div>
          </section>

          {/* Major Themes */}
          <section>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4 text-center font-['Montserrat',_Bebas_Neue,_cursive] tracking-wider text-black drop-shadow-[0_2px_12px_#38bdf8]"
            >
              Major Themes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {majorThemes.map((theme, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-end w-full min-w-[180px] max-w-full"
                  style={{ height: 260 }}
                >
                  <div
                    className="relative rounded-t-lg shadow-sm w-full h-[150px] border border-black/20 overflow-hidden flex items-end"
                  >
                    <img
                      src={`/theme${(idx % 10) + 1}.png`}
                      alt={`Theme ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                  </div>
                  <div className="w-full bg-white/90 border-x border-b border-black/20 rounded-b-lg px-4 py-3 z-20 shadow text-black font-bold text-center text-base h-[70px] flex items-center justify-center">
                    {theme}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Important Dates */}
          <section
            className="my-12 rounded-2xl shadow-xl p-4 sm:p-8 backdrop-blur-md overflow-x-auto bg-white/10 border border-black/20"
          >
            <h2
              className="text-2xl sm:text-3xl font-extrabold inline-block mb-6 pb-2 tracking-wide font-['Montserrat',_Bebas_Neue,_cursive] text-black border-b-4 border-[#38bdf8]"
            >
              Important Dates
            </h2>
            {/* Responsive: Table on md+, stacked on small screens */}
            <div className="w-full">
              <table className="hidden sm:table w-full min-w-[340px] text-base sm:text-lg font-mono">
                <tbody>
                  {importantDates.map((item, idx) => (
                    <tr
                      key={idx}
                      className="transition-all duration-300 hover:bg-[#38bdf8]/20 rounded-lg"
                    >
                      <td
                        className={`py-3 px-2 sm:px-4 font-semibold font-sans ${
                          item.highlight ? "font-bold" : ""
                        }`}
                        style={
                          item.highlight
                            ? {
                                color: "#43a047", // green
                                fontWeight: 700,
                              }
                            : { color: "#111" }
                        }
                      >
                        {item.label}
                      </td>
                      <td
                        className={`py-3 px-2 sm:px-4 text-right font-medium font-mono ${
                          item.highlight ? "font-bold" : "text-black"
                        }`}
                        style={
                          item.highlight
                            ? {
                                color: "#43a047", // green
                                fontWeight: 700,
                              }
                            : { color: "#111" }
                        }
                      >
                        {item.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Stacked for small screens */}
              <div className="sm:hidden flex flex-col gap-4">
                {importantDates.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg px-4 py-3 flex flex-col shadow transition-all duration-300 font-mono bg-white/10"
                  >
                    <span
                      className={`font-semibold ${
                        item.highlight
                          ? "bg-gradient-to-r from-[#00e676] to-[#1976d2] bg-clip-text text-transparent"
                          : ""
                      } font-sans`}
                      style={
                        item.highlight
                          ? {
                              background:
                                "linear-gradient(to right, #00e676, #1976d2)",
                              WebkitBackgroundClip: "text",
                              color: "transparent",
                            }
                          : { color: "#111" }
                      }
                    >
                      {item.label}
                    </span>
                    <span
                      className="font-medium mt-1 font-mono text-black"
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Registration Fee Details */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-black font-['Montserrat',_Bebas_Neue,_cursive]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#38bdf8" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" />
              </svg>
              Registration Fee <span className="text-xs font-normal text-black/80">(Free fooding + Inclusive GST (18%))</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {registrationFees.map((fee, idx) => (
                <div
                  key={idx}
                  className="rounded-xl shadow-lg p-5 flex flex-col items-center justify-center transition-transform hover:scale-105 bg-white/10 border border-black/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#38bdf8" }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" />
                    </svg>
                    <span className="font-semibold text-lg text-black">{fee.label}</span>
                  </div>
                  <div className="text-xl font-bold text-black">{fee.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default Page;