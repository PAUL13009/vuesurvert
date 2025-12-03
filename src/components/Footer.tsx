import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-600 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>© {year} Vue Sur Vert. Tous droits réservés.</p>
          <div className="flex items-center justify-center">
            <Logo width={150} height={112} />
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-600 transition-colors" aria-label="Instagram">Instagram</a>
            <a href="#" className="hover:text-emerald-600 transition-colors" aria-label="LinkedIn">LinkedIn</a>
            <a href="#" className="hover:text-emerald-600 transition-colors" aria-label="Facebook">Facebook</a>
            <Link href="/admin" className="hover:text-emerald-600 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
    );
}


