"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/author", label: "Author Section" },
	{
		label: "Committee",
		dropdown: [
			{ href: "/organizing-committee", label: "Organizing Committee" },
			{ href: "/advisory-committee", label: "Advisory Committee" },
			{ href: "/scientific-committee", label: "Scientific Committee" },
			{ href: "/Resource-person-list", label: "Resource Person List" },
		],
	},
	{ href: "/register", label: "Registration" },
	{ href: "/publications", label: "Publications" },
	{
		label: "Sponsors",
		dropdown: [
			{ href: "/call-for-sponsor", label: "Call for Sponsor" },
			{ href: "/sponsors", label: "Sponsors & Partners" },
		],
	},
	{ href: "/key-note-speakers", label: "Keynote Speakers" },
	{
		label: "Reach Us",
		dropdown: [
			{ href: "/contact-us", label: "Contact Us" },
			{ href: "/Venue", label: "Venue" },
			{ href: "/Accomodation", label: "Accomodation" },
			{ href: "/FAQ", label: "FAQ" },
		],
	},
];

const Navbar = () => {
	const [navOpen, setNavOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(null);

	return (
		<>
			<nav className="fixed top-0 left-0 w-full z-25 backdrop-blur-xl bg-gradient-to-r from-[rgba(255,255,255,0.95)] via-[rgba(240,248,255,0.9)] to-[rgba(230,245,255,0.95)] border-b border-[rgba(59,130,246,0.2)] shadow-[0_8px_32px_rgba(31,41,55,0.1)] px-4 py-4 flex items-center md:justify-between">
				<div className="flex items-center group">
					<div className="relative">
						<Image
							src="/logo.png"
							alt="Logo"
							width={40}
							height={40}
							className="rounded-xl mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
						/>
						<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
					</div>
					<span
						className="text-lg sm:text-2xl font-bold tracking-widest uppercase font-sans bg-gradient-to-r from-[#1e40af] via-[#3b82f6] to-[#06b6d4] bg-clip-text text-transparent drop-shadow-lg"
						style={{
							WebkitTextStroke: "0.5px rgba(59,130,246,0.3)",
							textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
						}}
					>
						WET-WAR 2025
					</span>
				</div>

				<ul className="hidden md:flex space-x-3 sm:space-x-5 font-medium items-stretch h-[42px]">
					{navLinks.map((link) =>
						link.dropdown ? (
							<li key={link.label} className="relative flex items-stretch">
								<button
									type="button"
									className=" relative flex items-center h-full px-4 py-2 rounded-xl bg-gradient-to-br from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] text-white font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.6)] hover:from-[#1e40af] hover:via-[#1d4ed8] hover:to-[#3b82f6] transition-all duration-300 cursor-pointer text-sm transform hover:-translate-y-0.5 border border-[rgba(147,197,253,0.3)]"
									onClick={() =>
										setOpenDropdown(openDropdown === link.label ? null : link.label)
									}
									onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
								>
									{link.label}
									<svg
										className={`ml-2 w-4 h-4 transition-transform duration-300 ${
											openDropdown === link.label ? "rotate-180" : ""
										}`}
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								{openDropdown === link.label && (
									<ul
										className="absolute left-0 mt-2 w-48 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-[rgba(147,197,253,0.2)] z-50 overflow-hidden animate-fade-in-down"
										style={{ 
											top: "100%", 
											background: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
											backdropFilter: "blur(20px)"
										}}
									>
										{link.dropdown.map((item, index) => (
											<li key={item.href}>
												<Link
													href={item.href}
													className="block px-4 py-3 text-[#1e40af] hover:bg-gradient-to-r hover:from-[#dbeafe] hover:to-[#bfdbfe] hover:text-[#1e3a8a] transition-all duration-200 cursor-pointer text-sm border-l-4 border-transparent hover:border-[#3b82f6] transform hover:translate-x-1"
													onMouseDown={(e) => e.preventDefault()}
													onClick={() => setOpenDropdown(null)}
													style={{ animationDelay: `${index * 50}ms` }}
												>
													{item.label}
												</Link>
											</li>
										))}
									</ul>
								)}
							</li>
						) : (
							<li key={link.href} className="flex items-stretch">
								<Link
									href={link.href}
									className="relative flex items-center h-full px-4 py-2 rounded-xl bg-gradient-to-br from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] text-white font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.6)] hover:from-[#1e40af] hover:via-[#1d4ed8] hover:to-[#3b82f6] transition-all duration-300 transform hover:-translate-y-0.5 border border-[rgba(147,197,253,0.3)] cursor-pointer text-sm overflow-hidden group"
								>
									<span className="relative z-10">{link.label}</span>
									<div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
								</Link>
							</li>
						)
					)}
				</ul>

				<button
					onClick={() => setNavOpen(!navOpen)}
					aria-label="Toggle navigation"
					className={`left-[70px] p-3 rounded-xl transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-[rgba(59,130,246,0.3)] z-50 relative min-w-[48px] min-h-[48px] flex items-center justify-center sm:hidden md:hidden ${
						navOpen 
							? "bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white shadow-[0_8px_25px_rgba(59,130,246,0.6)]" 
							: "bg-gradient-to-br from-white to-[#f0f9ff] text-[#1e40af] shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
					}`}
					style={{ display: 'flex', position: 'relative', zIndex: 50 }}
				>
					<svg
						className={`w-6 h-6 transition-all duration-300 ${
							navOpen ? "rotate-90 scale-110" : "hover:scale-110"
						}`}
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
					>
						{navOpen ? (
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						) : (
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
						)}
					</svg>
				</button>
			</nav>

			{/* Enhanced decorative lines below navbar */}
			<div className="w-full h-[3px] bg-gradient-to-r from-[#06b6d4] via-[#3b82f6] to-[#1e40af] fixed left-0 top-[68px] z-20 shadow-[0_2px_8px_rgba(6,182,212,0.5)]"></div>
			<div className="w-full h-[2px] bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#1d4ed8] fixed left-0 top-[71px] z-20 opacity-80"></div>
			<div className="w-full h-[1px] bg-gradient-to-r from-[#0284c7] via-[#1d4ed8] to-[#1e3a8a] fixed left-0 top-[73px] z-20 opacity-60"></div>

			{/* Enhanced Mobile Nav Menu */}
			{navOpen && (
				<div className="fixed top-16 left-0 w-[80%] z-40 backdrop-blur-xl bg-gradient-to-b from-[rgba(147,197,253,0.95)] via-[rgba(191,219,254,0.9)] to-[rgba(219,234,254,0.95)] border-b border-[rgba(59,130,246,0.2)] shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex flex-col items-center py-4 md:hidden animate-fade-in-down">
					<ul className="w-full flex flex-col items-center space-y-3 font-medium px-4 max-w-full">
						{navLinks.map((link) =>
							link.dropdown ? (
								<li key={link.label} className="w-full text-center">
									<button
										type="button"
										className="block py-2 px-4 w-full rounded-lg bg-gradient-to-br from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] text-white font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.6)] hover:from-[#1e40af] hover:via-[#1d4ed8] hover:to-[#3b82f6] transition-all duration-300 relative cursor-pointer border border-[rgba(147,197,253,0.3)] transform hover:-translate-y-0.5 flex items-center justify-center"
										onClick={() =>
											setOpenDropdown(openDropdown === link.label ? null : link.label)
										}
									>
										<span className="flex-1 text-center">{link.label}</span>
										<svg
											className={`ml-2 w-4 h-4 transition-transform duration-300 flex-shrink-0 ${
												openDropdown === link.label ? "rotate-180" : ""
											}`}
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>
									{openDropdown === link.label && (
										<ul className="mt-2 w-full bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-[rgba(147,197,253,0.2)] overflow-hidden">
											{link.dropdown.map((item, index) => (
												<li key={item.href}>
													<Link
														href={item.href}
														className="block px-4 py-2 text-[#1e40af] hover:bg-gradient-to-r hover:from-[#dbeafe] hover:to-[#bfdbfe] hover:text-[#1e3a8a] transition-all duration-200 cursor-pointer border-l-4 border-transparent hover:border-[#3b82f6] transform hover:translate-x-2"
														onMouseDown={(e) => e.preventDefault()}
														onClick={() => {
															setNavOpen(false);
															setOpenDropdown(null);
														}}
													>
														{item.label}
													</Link>
												</li>
											))}
										</ul>
									)}
								</li>
							) : (
								<li key={link.href} className="w-full text-center">
									<Link
										href={link.href}
										className="block py-2 px-4 w-full rounded-lg bg-gradient-to-br from-[#3b82f6] via-[#1d4ed8] to-[#1e40af] text-white font-semibold shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.6)] hover:from-[#1e40af] hover:via-[#1d4ed8] hover:to-[#3b82f6] transition-all duration-300 relative cursor-pointer border border-[rgba(147,197,253,0.3)] transform hover:-translate-y-0.5 overflow-hidden group"
										onClick={() => setNavOpen(false)}
									>
										<span className="relative z-10">{link.label}</span>
										<div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
										<div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
									</Link>
								</li>
							)
						)}
					</ul>
				</div>
			)}
		</>
	);
};

export default Navbar;
