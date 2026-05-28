import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/seo';
import { BLOG_POSTS } from '@/data/blog';

const pageTitle = "Andhra Food Blog — Pickles, Podi, Sweets and More | Andhra Store";
const pageDesc  = "Learn about Andhra cuisine — what avakaya is, how podi is eaten, why pootharekulu has a GI tag. Honest food writing from the people who make it.";
const pageUrl   = `${SITE_URL}/blog`;

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",     item: `${SITE_URL}/home` },
    { "@type": "ListItem", position: 2, name: "Blog",     item: pageUrl },
  ],
};

const CATEGORY_COLORS = {
  Pickles: "bg-red-100 text-red-700",
  Podi:    "bg-yellow-100 text-yellow-700",
  Sweets:  "bg-orange-100 text-orange-700",
};

export default function BlogIndex() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description"          content={pageDesc} />
        <link rel="canonical"             href={pageUrl} />
        <meta property="og:title"         content={pageTitle} />
        <meta property="og:description"   content={pageDesc} />
        <meta property="og:url"           content={pageUrl} />
        <meta property="og:type"          content="website" />
        <meta property="og:image"         content={`${SITE_URL}/images/blog/avakaya-hero.jpg`} />
        <meta property="og:image:alt"     content="Andhra Store Blog — food writing about Andhra pickles, podi and sweets" />
        <meta property="og:image:width"   content="1200" />
        <meta property="og:image:height"  content="630" />
        <meta name="twitter:card"         content="summary_large_image" />
        <meta name="twitter:title"        content={pageTitle} />
        <meta name="twitter:description"  content={pageDesc} />
        <meta name="twitter:image"        content={`${SITE_URL}/images/blog/avakaya-hero.jpg`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </Head>

      <Header />

      {/* ── Hero ── */}
      <section className="bg-[#fdf6ee] border-b border-amber-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-3">Andhra Store Blog</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Food writing about Andhra cuisine
          </h1>
          <p className="text-gray-600 text-base leading-relaxed max-w-xl mx-auto">
            What avakaya is, how podi is eaten, why pootharekulu has a GI tag, and what makes Andhra pickle different from North Indian achaar.
          </p>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
              {/* Thumbnail */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={post.heroImage}
                  alt={post.heroAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-400">{post.readMinutes} min read</span>
                </div>
                <h2 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-amber-700 transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed flex-1">
                  {post.intro}
                </p>
                <span className="mt-4 text-xs font-semibold text-amber-600 group-hover:underline">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
