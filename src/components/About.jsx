"use client"
import React, { useRef, useEffect } from 'react';

const About = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="min-h-[80vh] flex flex-col bg-gradient-to-br from-[#e3f2fd] to-[#b3e0fc] py-10 px-4 font-sans">
      <h1
        className="text-3xl sm:text-4xl font-extrabold text-black mb-8 tracking-wider uppercase text-center z-2 font-['Oswald',_Montserrat,_Bebas_Neue,_cursive]"
        style={{ textShadow: "0 2px 8px #fff" }}
      >
        About Us
      </h1>
      <div className="flex flex-col lg:flex-row gap-10 items-center justify-center mx-auto">
        {/* Left: About Text */}
        <div className="flex-1 min-w-[220px] max-w-xl text-justify z-2">
          <p className="text-base sm:text-lg text-black mb-6 leading-relaxed font-serif text-justify">
           National Institute of Technology Patna was formerly known as Bihar College of Engineering Patna, a constituent engineering College under Patna University. It was rechristened NIT Patna on 28<sup>th</sup> January 2004 as an Autonomous Institute under the Ministry of Education, Government of India. The Institute imparts high-level education, training, research, and development in Science, Engineering, Architecture and Planning, Humanities & Social Sciences and Technology.
          </p>
          <p className="text-base text-black mb-6 leading-relaxed font-serif text-justify">
            The conference will feature keynote speeches, technical sessions, and networking opportunities, fostering collaboration and knowledge sharing in the field of environmental science and engineering.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8 font-mono">
            <div className="flex flex-col items-center w-56">
              <h3 className="ml-0 text-black font-semibold text-base sm:text-lg font-sans text-center">Location</h3>
              <p
                className="bg-white text-lg sm:text-xl font-bold font-['Poppins',_Montserrat,_Bebas_Neue,_cursive] rounded-lg px-4 py-2 mt-1 shadow tracking-wider uppercase text-center w-full"
                style={{
                  color: "#ff9100",
                  textShadow: "0 2px 8px #fff, 0 1px 0 #38bdf8",
                  WebkitTextStroke: "1.2px #ff9100",
                  textStroke: "1.2px #ff9100",
                  fontFamily: "'Poppins', 'Montserrat', 'Bebas Neue', cursive"
                }}
              >
                NIT PATNA,
                <br></br> INDIA
              </p>
            </div>
            <div className="flex flex-col items-center w-56">
              <h3 className="ml-0 text-black font-semibold text-base sm:text-lg font-sans text-center">Dates</h3>
              <p
                className="bg-white text-xl sm:text-xl font-bold font-['Poppins',_Montserrat,_Bebas_Neue,_cursive] rounded-lg px-4 py-2 mt-1 shadow tracking-wider uppercase text-center w-full"
                style={{
                  color: "#ff9100",
                  textShadow: "0 2px 8px #fff, 0 1px 0 #38bdf8",
                  WebkitTextStroke: "1.2px #ff9100",
                  textStroke: "1.2px #ff9100",
                  fontFamily: "'Poppins', 'Montserrat', 'Bebas Neue', cursive"
                }}
              >
                29-31 DECEMBER 2025
              </p>
            </div>
          </div>
        </div>
        {/* Right: Single Video */}
        <div className="flex-1 min-w-[220px] max-w-xl flex items-center justify-center">
          <div className="relative w-full max-w-2xl aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border-2 border-white/30 bg-white/10 flex items-center justify-center h-auto md:h-[400px]">
            <video
              ref={videoRef}
              src="WETWAR_vid.mp4"
              controls
              className="w-full h-auto md:h-[400px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
