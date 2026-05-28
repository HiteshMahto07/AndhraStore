import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/seo';
import { BLOG_POSTS, getBlogPost } from '@/data/blog';

const CATEGORY_COLORS = {
  Pickles: "bg-red-100 text-red-700",
  Podi:    "bg-yellow-100 text-yellow-700",
  Sweets:  "bg-orange-100 text-orange-700",
};

export async function getStaticPaths() {
  return {
    paths: BLOG_POSTS.map(p => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getBlogPost(params.slug);
  if (!post) return { notFound: true };
  return { props: { post } };
}

export default function BlogPost({ post }) {
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = {
    "@context":       "https://schema.org",
    "@type":          "Article",
    headline:          post.title,
    description:       post.metaDesc,
    image:            `${SITE_URL}${post.heroImage}`,
    datePublished:     post.publishDate,
    dateModified:      post.publishDate,
    author:           { "@type": "Organization", name: "Andhra Store" },
    publisher:        { "@type": "Organization", name: "Andhra Store", url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: `${SITE_URL}/home` },
      { "@type": "ListItem", position: 2, name: "Blog",  item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
    ],
  };

  const faqSchema = post.faq?.length ? {
    "@context": "https://schema.org",
    "@type":    "FAQPage",
    mainEntity: post.faq.map(({ q, a }) => ({
      "@type":          "Question",
      name:              q,
      acceptedAnswer:   { "@type": "Answer", text: a },
    })),
  } : null;

  // Split blocks — insert content image after contentImageAfterBlock index
  const beforeBlocks = post.blocks.slice(0, post.contentImageAfterBlock);
  const afterBlocks  = post.blocks.slice(post.contentImageAfterBlock);

  return (
    <>
      <Head>
        <title>{post.metaTitle}</title>
        <meta name="description"          content={post.metaDesc} />
        <link rel="canonical"             href={pageUrl} />
        <meta property="og:title"         content={post.metaTitle} />
        <meta property="og:description"   content={post.metaDesc} />
        <meta property="og:url"           content={pageUrl} />
        <meta property="og:type"          content="article" />
        <meta property="og:image"         content={`${SITE_URL}${post.heroImage}`} />
        <meta property="og:image:alt"     content={post.heroAlt} />
        <meta property="og:image:width"   content="1200" />
        <meta property="og:image:height"  content="630" />
        <meta property="article:published_time" content={post.publishDate} />
        <meta name="twitter:card"         content="summary_large_image" />
        <meta name="twitter:title"        content={post.metaTitle} />
        <meta name="twitter:description"  content={post.metaDesc} />
        <meta name="twitter:image"        content={`${SITE_URL}${post.heroImage}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema)    }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {faqSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        )}
      </Head>

      <Header />

      <article className="max-w-2xl mx-auto px-4 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5" aria-label="Breadcrumb">
          <Link href="/home" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-amber-600">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </nav>

        {/* ── Meta ── */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-600'}`}>
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readMinutes} min read</span>
          <span className="text-xs text-gray-400">
            {new Date(post.publishDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>

        {/* ── Title ── */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* ── Hero Image ── */}
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-8">
          <Image
            src={post.heroImage}
            alt={post.heroAlt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </div>

        {/* ── Intro ── */}
        <p className="text-base text-gray-700 leading-relaxed mb-8 font-medium border-l-4 border-amber-400 pl-4">
          {post.intro}
        </p>

        {/* ── Content blocks (before image) ── */}
        <div className="prose prose-gray max-w-none">
          {beforeBlocks.map((block, i) => <BlockRenderer key={i} block={block} />)}
        </div>

        {/* ── In-content Image ── */}
        <div className="relative w-full aspect-[8/5] rounded-xl overflow-hidden my-8">
          <Image
            src={post.contentImage}
            alt={post.contentImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 672px) 100vw, 672px"
          />
          <p className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-3 py-1.5 text-center">
            {post.contentImageAlt}
          </p>
        </div>

        {/* ── Content blocks (after image) ── */}
        <div className="prose prose-gray max-w-none">
          {afterBlocks.map((block, i) => <BlockRenderer key={i} block={block} />)}
        </div>

        {/* ── FAQ ── */}
        {post.faq?.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-5">
              {post.faq.map(({ q, a }, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{q}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Related Products ── */}
        {post.relatedProducts?.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">Shop Related Products</h2>
            <div className="flex flex-wrap gap-2">
              {post.relatedProducts.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-block text-sm font-medium px-4 py-2 rounded-full border border-amber-400 text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Related Cities ── */}
        {post.relatedCities?.length > 0 && (
          <section className="mt-6">
            <p className="text-xs text-gray-500 mb-2">Delivery available in:</p>
            <div className="flex flex-wrap gap-2">
              {post.relatedCities.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs text-gray-500 hover:text-amber-600 hover:underline"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Back to Blog ── */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <Link href="/blog" className="text-sm font-semibold text-amber-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>

      </article>

      <Footer />
    </>
  );
}

// ── Block renderer ──────────────────────────────────────────────────────────
function BlockRenderer({ block }) {
  if (block.type === "h2") {
    return (
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">{block.text}</h2>
    );
  }
  if (block.type === "p") {
    return (
      <p className="text-base text-gray-700 leading-relaxed mb-4">{block.text}</p>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 text-base">
        {block.items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  }
  return null;
}
