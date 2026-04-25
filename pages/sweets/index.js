import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SweetsPage() {
  return (
    <>
      <Header />
      <section className="section-pad bg-white">
        <div className="container-main max-w-md mx-auto text-center">
          <span className="text-4xl">🍬</span>
          <h1 className="text-2xl font-heading text-gray-900 mt-3 mb-2">Sweets</h1>
          <p className="text-sm text-gray-500 mb-1">Our sweets collection is coming soon!</p>
          <p className="text-xs text-gray-400 mb-6">Traditional recipes, premium ingredients.</p>
          <Link href="/home" className="btn-primary">Explore Pickles →</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}