"use client"
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Navbar from './Navbar';
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { Inter, Montserrat, Poppins } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700', '900'] });

const RainParticles = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: "transparent",
        },
        fpsLimit: 60,
        particles: {
          number: { value: 120, density: { enable: true, area: 800 } },
          color: { value: "#fff" },
          shape: { type: "circle" },
          opacity: { value: 0.7 },
          size: { value: { min: 1, max: 2 } },
          move: {
            enable: true,
            direction: "bottom",
            speed: 3,
            straight: true,
            outModes: { default: "out" }
          }
        },
        detectRetina: true,
        interactivity: {
          events: {
            onHover: { enable: false },
            onClick: { enable: false }
          }
        }
      }}
      className="absolute inset-0 z-5 pointer-events-none"
    />
  );
};

const Hero = () => {
  return (
    <>
      <section className={`pt-28 md:pt-14  relative text-white min-h-screen flex items-center overflow-hidden ${inter.className}`} style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c4a6e] via-[#0369a1] to-[#0284c7] opacity-90"></div>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <RainParticles />
        
        {/* Floating Water Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-blue-300 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute top-60 left-1/4 w-3 h-3 bg-blue-100 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
          <div className="absolute top-80 right-1/3 w-5 h-5 bg-blue-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
        </div>

        {/* Main Content Container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[80vh]">
            
            {/* Left Column - Main Text Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Conference Title Section */}
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-sm font-medium text-blue-100">International Conference</span>
                </div>
                
                <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight ${montserrat.className} tracking-tight`}>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200">
                    WET-WAR 2025
                  </span>
                  <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-100 mt-2">
                    International Conference On
                  </span>
                </h1>
              </div>

              {/* Conference Theme Section */}
              <div className="space-y-3">
                <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-blue-50 ${poppins.className}`}>
                  Wetland and Water Resource
                </h2>
                <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-blue-100 ${poppins.className}`}>
                  For Sustainable Development
                </h3>
              </div>

              {/* Date Section */}
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl border border-white/20">
                <div className={`text-lg sm:text-xl font-bold text-white ${inter.className}`}>
                  29–31 December 2025
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <a 
                  href="/register"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/25 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-lg">🎫</span>
                    <span>Register Now</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
                
                <a 
                  href="/author"
                  className="group relative px-8 py-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm hover:from-white/30 hover:to-white/20 text-white font-bold rounded-xl border border-white/30 shadow-xl transform transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span className="text-lg">📄</span>
                    <span>Submit Paper</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>

            {/* Right Column - Logos and Collaborations */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-right mt-8 lg:mt-0">
              {/* NIT Patna Section */}
              <div className="space-y-4">
                <div className="flex flex-col items-center lg:items-end space-y-3">
                  <div className="relative group">
                    <img
                      src="https://www.nitp.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.00e5159e.png&w=256&q=75"
                      alt="NIT Patna Logo"
                      className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-2xl shadow-2xl p-3 bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/25"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="px-6 py-3">
                    <span className={`font-bold text-lg sm:text-xl lg:text-2xl text-white ${inter.className}`}>
                      National Institute of Technology, Patna
                    </span>
                  </div>
                </div>
              </div>

              {/* Collaboration Section */}
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className={`text-sm font-medium text-blue-100 ${inter.className}`}>
                    In Technical Collaboration with
                  </span>
                </div>
                
                <div className="space-y-4">
                  {/* BIT Mesra */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
                    <div className="relative group">
                      <img
                        src="/bitmlogo.png"
                        alt="BIT Mesra Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-xl p-2 bg-white backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/25"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <span className={`font-bold text-base sm:text-lg text-white ${inter.className} max-w-[200px]`}>
                      Birla Institute of Technology, Mesra
                    </span>
                  </div>

                  {/* BSWA */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-4">
                    <div className="relative group">
                      <img
                        src="/BSWA.png"
                        alt="Bihar State Wetland Authority Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl shadow-xl p-2 bg-white/30 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/25"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <span className={`font-bold text-base sm:text-lg text-white ${inter.className} max-w-[200px]`}>
                      Bihar State Wetland Authority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>
      
      {/* Enhanced Registration Section */}
      <section className="w-full bg-gradient-to-br from-blue-900/20 via-blue-800/30 to-cyan-800/40 py-12 sm:py-16 px-4 relative overflow-hidden backdrop-blur-sm">
        {/* Background Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230ea5e9' fill-opacity='0.05'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20s-20-8.954-20-20 8.954-20 20-20 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 ${montserrat.className}`}>
              Ready to Join WET-WAR 2025?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto px-4">
              Submit your research paper or register now to be part of this international conference on wetland and water resource management.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
            {/* Paper Submission Button */}
            <div className="group relative flex-shrink-0 w-full sm:w-auto">
              <a 
                href="/author"
                className={`inline-block w-full sm:w-auto bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold py-4 sm:py-5 px-6 sm:px-10 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-orange-500/25 ${montserrat.className} tracking-wide cursor-pointer overflow-hidden relative text-center`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">📄</span>
                  <div className="text-left">
                    <div className="text-base sm:text-lg md:text-xl">SUBMIT PAPER</div>
                    <div className="text-xs sm:text-sm opacity-90 font-normal">
                      Deadline: 30th August 2025
                    </div>
                  </div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
            
            {/* Registration Button */}
            <div className="group relative flex-shrink-0 w-full sm:w-auto">
              <a 
                href="/register"
                className={`inline-block w-full sm:w-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 sm:py-5 px-6 sm:px-10 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/25 ${montserrat.className} tracking-wide cursor-pointer overflow-hidden relative text-center`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl">🎫</span>
                  <div className="text-left">
                    <div className="text-base sm:text-lg md:text-xl">REGISTER NOW</div>
                    <div className="text-xs sm:text-sm opacity-90 font-normal">
                      Join the Conference Today!
                    </div>
                  </div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default Hero;