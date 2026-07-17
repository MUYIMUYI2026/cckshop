import { Link } from "wouter";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/logo.png"
              alt="CCKShop"
              className="h-9 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Your trusted global marketplace for premium beauty, skincare, electronics, and daily essentials. Serving retail and wholesale customers worldwide.
            </p>
            <div className="flex gap-3">
              {["facebook", "instagram", "twitter", "linkedin"].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors text-xs font-bold uppercase"
                >
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Shop All", href: "/shop" },
                { label: "Wholesale", href: "/wholesale" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Beauty", href: "/shop?category=beauty" },
                { label: "Skincare", href: "/shop?category=skincare" },
                { label: "Electronics", href: "/shop?category=electronics" },
                { label: "Daily Essentials", href: "/shop?category=daily" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">6 Tower Ave, Egg Harbor Township, NJ 08234, United States</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:services@cckshop.com" className="text-gray-400 hover:text-primary transition-colors">
                  services@cckshop.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} CCKShop. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
