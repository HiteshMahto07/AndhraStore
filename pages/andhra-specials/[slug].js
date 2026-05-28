// 301 redirect — /andhra-specials/[slug] → /snacks/[slug] or /sweets/[slug]
import SnacksData from '@/data/snacks.json';
import SweetsData from '@/data/sweets.json';

const snackSlugs = new Set(SnacksData.map(p => p.slug));
const sweetSlugs = new Set(SweetsData.map(p => p.slug));

export async function getServerSideProps({ params }) {
  const { slug } = params;
  if (snackSlugs.has(slug)) {
    return { redirect: { destination: `/snacks/${slug}`, permanent: true } };
  }
  if (sweetSlugs.has(slug)) {
    return { redirect: { destination: `/sweets/${slug}`, permanent: true } };
  }
  // Fallback — unknown slug, go to snacks listing
  return { redirect: { destination: '/snacks', permanent: true } };
}

export default function AndhraSpecialSlugRedirect() { return null; }
