import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main */}
      <div className="container-main py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/home" className="flex items-center gap-2 mb-3">
              <img src="/logo.jpeg" alt="Andhra Store" className="h-9 w-9 rounded-full" />
              <div>
                <span className="text-base font-bold text-white">Andhra</span>
                <span className="text-base font-bold text-brand-400">Store</span>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              Authentic Andhra pickles made with traditional recipes from East Godavari. Hand-pounded spices, cold-pressed oils.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { href: 'https://www.instagram.com/andhrastore.india', icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /> },
                { href: '#', icon: <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /> },
              ].map((s, i) => (
                <Link key={i} href={s.href} target="_blank" className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-brand-500 transition-colors">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">{s.icon}</svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-sm font-bold mb-3 font-sans">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: 'Veg Pickles', href: '/pickle?type=veg' },
                { label: 'Non-Veg Pickles', href: '/pickle?type=non-veg' },
                { label: 'Sweets', href: '/sweets' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-gray-400 hover:text-brand-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-bold mb-3 font-sans">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-xs text-gray-400 hover:text-brand-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-bold mb-3 font-sans">Get in Touch</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <p>📞 8758302568, 8799114169</p>
              <p>📧 Andhrastore.india@gmail.com</p>
              <p>📍 Nani Daman, Daman & Diu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Andhra Store. All rights reserved.</p>
          <p>Made with ❤️ in Andhra Pradesh</p>
        </div>
      </div>
    </footer>
  );
}