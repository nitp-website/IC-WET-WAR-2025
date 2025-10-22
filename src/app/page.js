import Hero from "@/components/Hero";
import About from "@/components/About";
import Image from "next/image";
import Notices from "@/components/Notices";
import Footer from "@/components/Footer";
import Key from "../components/Key"
import Conference from "@/components/conference";
import Media from "@/components/media";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
   <Hero/>
   <About/>
   <Conference/>
   <Key/>
   <Notices/>
   <Media/>
   <Footer/>

   </>
  );
}
