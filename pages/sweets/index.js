import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function Sweets() {
  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center h-screen text-center bg-gray-100">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Sweets</h1>
        <p className="text-2xl font-semibold text-red-600">This page will be updated soon.</p>
      </div>
      <Footer />
    </div>
  );
}

export default Sweets;