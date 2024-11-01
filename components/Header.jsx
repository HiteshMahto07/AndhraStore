import Link from 'next/link';
import { useState } from 'react';
import { Button } from './ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isPicklesOpen, setIsPicklesOpen] = useState(false);

  const togglePicklesMenu = () => {
    setIsPicklesOpen(!isPicklesOpen);
  };

  return (
    <header className="bg-black text-[#fffdac] px-4 py-3">
      <nav className="flex items-center justify-between">
        <button className="block md:hidden" onClick={toggleMenu}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/home">
          <div className="flex items-center w-[75px] h-[75px] gap-4">
            <img src="/logo.jpeg" alt="Andhra Store Logo" />
          </div>
        </Link>

        <div className={`fixed top-0 left-0 h-screen w-56 md:hidden bg-black text-[#fffdac] z-50 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? '-translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col items-start justify-start h-full px-8 py-4">
            <button className="absolute top-2 right-2 p-2 text-[#fffdac]" onClick={toggleMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <ul className="mt-12 w-full text-lg sm:mt-4 sm:space-y-2">
              <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                <Link href="/home">Home</Link>
              </li>
              <li className="p-2 space-x-4">
              <button onClick={togglePicklesMenu} className="flex items-center gap-2">Pickles
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg></button>
                {isPicklesOpen && (
                  <ul className="text-sm ml-4 mt-2 space-y-2">
                    <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                    {/* <Link href={{ pathname: pickle.link, query: { type: pickle.type } }}>View</Link> */}
                      <Link href={{ pathname: "/pickle", query: { type: "veg" } }}>Veg Pickle</Link>
                    </li>
                    <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                      <Link href={{ pathname: "/pickle", query: { type: "non-veg" } }}>Non-Veg Pickle</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                <Link href="/sweets">Sweets</Link>
              </li>
              <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                <Link href="/about">About Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="hidden md:block">
          <ul className="w-full flex text-lg gap-8">
            <li className="p-2  hover:bg-[#fffdac] hover:text-black rounded-md">
              <Link href="/home">Home</Link>
            </li>
            <li className="p-2 space-x-4">
              <button onClick={togglePicklesMenu} className="flex items-center gap-2">Pickles
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg></button>
                {isPicklesOpen && (
                  <ul className="text-sm absolute bg-black text-[#fffdac] p-2 shadow-lg mt-4 border-[#fffdac] rounded-md">
                    <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                      <Link href={{ pathname: "/pickle", query: { type: "veg" } }}>Veg Pickle</Link>
                    </li>
                    <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                      <Link href={{ pathname: "/pickle", query: { type: "non-veg" } }}>Non-Veg Pickle</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                <Link href="/sweets">Sweets</Link>
              </li>
              <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                <Link href="/about">About Us</Link>
              </li>
              <li className="p-2 hover:bg-[#fffdac] hover:text-black rounded-md">
                <Link href="/cart">Shop</Link>
              </li>
          </ul>
        </div>

        <Link className="md:hidden" href="/cart">
          <div className="w-8 h-8 ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
        </Link>
      </nav>
    </header>
  );
}