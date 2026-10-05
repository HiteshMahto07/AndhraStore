import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer } from '@/lib/motion';

const Arrow = () => (
  <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f0e3]" aria-labelledby="home-hero-heading">
      <div className="pointer-events-none absolute -left-24 top-4 h-64 w-64 rounded-full border border-brand-200/50" aria-hidden="true" />
      <div className="container-main grid items-center gap-8 py-10 sm:py-14 lg:min-h-[620px] lg:grid-cols-[45fr_55fr] lg:gap-12 lg:py-16">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 max-w-xl">
          <motion.p variants={fadeUp} className="mb-5 text-[11px] font-bold uppercase tracking-[0.23em] text-olive-700">
            Authentic <span className="px-1 text-brand-500">/</span> Homemade <span className="px-1 text-brand-500">/</span> Andhra
          </motion.p>
          <motion.h1 id="home-hero-heading" variants={fadeUp} className="text-[2.65rem] leading-[1.02] text-[#18251d] sm:text-5xl lg:text-[3.65rem]">
            Authentic Andhra<br /><span className="italic text-brand-500">Pickles,</span> Made Like Home.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
            Traditional East Godavari recipes, handmade in small batches with cold-pressed oils and no artificial preservatives.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="#best-sellers" className="group btn-primary min-h-12 rounded-full px-7">Shop Best Sellers <Arrow /></Link>
            <Link href="/pickles" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-olive-700 px-7 text-sm font-semibold text-olive-800 transition-colors hover:bg-olive-700 hover:text-white">Explore All Pickles <Arrow /></Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-gray-600">
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" /> Small-batch made</span>
            <span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" /> Pan-India delivery</span>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97, x: 24 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative mx-auto w-full max-w-3xl">
          <div className="relative aspect-[4/4.1] overflow-hidden rounded-[2rem] sm:aspect-[5/4] lg:aspect-[1.14/1] lg:rounded-[3rem_1.25rem_3rem_1.25rem]">
            <Image src="/images/pickles/andhra-mango-pickle-serving.webp" alt="Andhra mango pickle served with rice on a banana leaf" fill priority sizes="(max-width: 1023px) 100vw, 55vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true" />
          </div>
          <div className="absolute -bottom-4 left-4 rounded-2xl border border-white/70 bg-[#fffaf0] px-4 py-3 shadow-xl shadow-black/10 sm:left-8 sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Andhra classic</p>
            <p className="mt-0.5 font-heading text-base font-semibold text-gray-900">Mango Avakaya</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
