import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 sm:mt-16 border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 text-xs sm:text-sm text-zinc-600 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center scale-75 sm:scale-100">
            <Logo width={150} height={112} />
          </div>
          <p className="text-center">© {year} Vue Sur Vert. Tous droits réservés.</p>
          <Link href="/admin" className="hover:text-emerald-600 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
    );
}


