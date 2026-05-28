// 301 redirect — /andhra-specials → /snacks (canonical category page)
export async function getServerSideProps() {
  return { redirect: { destination: '/snacks', permanent: true } };
}
export default function AndhraSpecialsRedirect() { return null; }
