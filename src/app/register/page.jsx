"use client";
import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/author', label: 'Author Section' },
  { href: '/people', label: 'Key People' },
  { href: '/register', label: 'Registration' },
  { href: '/sponsors', label: 'Sponsors' },
  { href: '/contact-us', label: 'Contact Us' },
];

const registrationFees = [
  { label: "Students", value: "Rs. 5000 / USD 100" },
  { label: "Faculties/Officers", value: "Rs. 9000 / USD 200" },
  { label: "Accompanying person", value: "Rs. 5000 / USD 100" }
];

const sponsors = [
  { label: "Bronze", value: "₹25,000" },
  { label: "Silver", value: "₹50,000" },
  { label: "Gold", value: "₹1,00,000" },
  { label: "Diamond", value: "₹2,00,000 " }
];

const accountDetails = [
  { label: "Account Name", value: "NIT Patna CF Account" },
  { label: "Account Number", value: "50433562364" },
  { label: "Bank Name", value: "Indian Bank" },
  { label: "IFSC Code", value: "IDIB000B810" }
];

const paperInfoPoints = [
  {
    color: "bg-blue-500",
    text: "The conference proceedings as well as selected high quality research papers would be published in SCOPUS/SCIE Journal."
  },
  {
    color: "bg-blue-400",
    text: "The Best paper prize and certificate would be given in each session of the conference."
  },
  {
    color: "bg-blue-300",
    text: "The overall best presentation would be considered for award."
  },
  {
    color: "bg-blue-400",
    text: "The conference breakfast, lunch, dinner, tea and GST (18%) is included in the registration fee of the students, faculties, officers and sponsor."
  },
  {
    color: "bg-blue-300",
    text: "A cultural program with international competition among participants (Students/Officers) is arranged every day prior to the dinner. Therefore, the participants /experts’/ invitees/ sponsors can show their talent in cultural programs and win the attractive prizes."
  },
  {
    color: "bg-blue-200",
    text: "We have limited seats in boys and girl hostels. Therefore, first come first serve basis would be considered. However, there are many budget hotels near NIT Patna."
  },
  {
    color: "bg-blue-400",
    text: "About 500+ participation is expected. It is going to be one of the biggest Water Expert assemblies at NIT Patna. This is an opportunity of interaction and knowledge sharing."
  },
  {
    color: "bg-blue-200",
    text: "About 100 participants are expected from different parts of the globe. All international students/officers/faculties are requested to take prior approval before coming to India."
  },
  {
    color: "bg-blue-500",
    text: "All the selected Papers will be published in Conference proceedings (Springer/Elsevier/other Indexed in SCOPUS/SCI/SCIE/ESCI)."
  },
  {
    color: "bg-blue-400",
    text: "High quality papers presented in the conference would be published in Indexed Journals (SCOPUS/SCI/SCIE/ESCI) after review."
  },
  {
    color: "bg-blue-300",
    text: "Awards would be provided for Best papers in different Themes for Oral and Poster presentation."
  }
];

export default function RegisterPage() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <Navbar/>
      {/* Main Content */}
      <div
        style={{
          background: "linear-gradient(135deg, #e3f2fd 0%, #b3e0fc 100%)",
          color: "#111",
        }}
        className="relative min-h-screen w-full py-20 px-4"
      >
        <div
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1.5px solid #38bdf8",
            color: "#111",
          }}
          className="w-full mx-auto backdrop-blur-2xl rounded-3xl p-10 border border-black/20"
        >
          {/* Header Section */}
          <section className="text-center mb-12 space-y-6">
            <h1
              style={{
                color: "#111",
                textShadow: "0 2px 8px #fff"
              }}
              className="inline-block text-5xl font-extrabold tracking-wider font-['Montserrat',_Bebas_Neue,_cursive] drop-shadow-[0_2px_12px_#38bdf8]"
            >
              WET-WAR 2025
            </h1>
            <p className="text-sm font-medium text-black/90 text-center">
              Join us at <span style={{ color: "#38bdf8", fontWeight: 600 }}>NIT Patna</span>
              <span className="mx-1"></span>
              <span className="italic" style={{ color: "#1976d2" }}>delicious food on the Bank of River Ganga</span>
            </p>
          </section>
          {/* Registration Fee Section */}
          <section className="mb-10">
            <h2
              style={{ color: "#111" }}
              className="text-2xl font-semibold mb-6 flex items-center gap-2"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#38bdf8" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 0V4m0 16v-4" />
              </svg>
              Registration Fee <span className="text-xs font-normal" style={{ color: "#111" }}>(Free fooding [Breakfast, lunch and dinner] + Inclusive GST (18%))</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {registrationFees.map((fee, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(56,189,248,0.18)",
                    border: "1.5px solid #38bdf8",
                    color: "#111",
                  }}
                  className="rounded-xl shadow-lg p-5 flex flex-col items-center justify-center transition-transform hover:scale-105"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ color: "#38bdf8" }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" />
                    </svg>
                    <span className="font-semibold text-lg text-[#38bdf8]">{fee.label}</span>
                  </div>
                  <div className="text-xl font-bold text-black">{fee.value}</div>
                </div>
              ))}
            </div>
          </section>
          {/* Account and QR Section */}
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#111" }}>Scan & Submit Paper</h3>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="space-y-2" style={{ color: "#111" }}>
                {accountDetails.map((detail, idx) => (
                  <p key={idx}>
                    <span className="font-semibold" style={{ color: "#38bdf8" }}>{detail.label}:</span> {detail.value}
                  </p>
                ))}
              </div>
              <img
                src="https://i.postimg.cc/jdxKPKGW/image.png"
                alt="QR Code"
                className="w-36 h-36 rounded-lg border"
                style={{ borderColor: "#38bdf8", boxShadow: "0 2px 12px #38bdf8" }}
              />
              {/* SCAN & REGISTER Note on right side */}
              <div className="mt-0 md:mt-0 md:ml-4 bg-[#38bdf8]/10 border border-[#38bdf8] rounded-xl p-4 shadow text-black min-w-[220px] max-w-xs">
                <h4 className="text-lg font-bold mb-2 tracking-wide" style={{ color: "#C2185B" /* magenta/deep red */ }}>
                  SCAN & REGISTER
                </h4>
                <p className="text-sm font-medium">
                  <span className="font-semibold">Note:</span> Registration Fee payment transaction Number required and Upload payment PDF
                </p>
              </div>
            </div>
          </section>
          {/* Conference Highlights */}
          <section className="mt-16">
            <h2
              className="text-3xl font-extrabold mb-8 text-center tracking-wide"
              style={{
                color: "#111",
                textShadow: "0 2px 2px #38bdf8, 0 1px 0 #38bdf8, 0 0px 2px #38bdf8"
              }}
            >
              Conference Highlights
            </h2>
            <ul className="space-y-4">
              {paperInfoPoints.map((point, idx) => (
                <li className="flex" key={idx}>
                  <div className={`w-1 bg-[#38bdf8] rounded-l-full`} />
                  <div
                    className="shadow-md px-4 py-2 rounded-r-xl flex-1"
                    style={{
                      background: "#e3f2fd",
                    }}
                  >
                    <p className="text-sm md:text-base text-black">
                      {point.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
