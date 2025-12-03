"use client";

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-zinc-100">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-medium tracking-tight text-zinc-900">Contact</h2>
        <p className="mt-2 text-lg text-zinc-600">N'hésitez pas à nous contacter pour toute question.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Icônes de contact à gauche - ligne verticale */}
        <div className="flex flex-col justify-center gap-6">
          {/* Email */}
          <div className="flex flex-col items-start p-8 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors bg-white" style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)' }}>
            <div className="mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">Email</h3>
            <a href="mailto:contact@vuesurvert.fr" className="text-zinc-900 hover:text-zinc-700 transition-colors text-base">
              contact@vuesurvert.fr
            </a>
          </div>

          {/* Téléphone */}
          <div className="flex flex-col items-start p-8 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors bg-white" style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)' }}>
            <div className="mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">Téléphone</h3>
            <a href="tel:+33123456789" className="text-zinc-900 hover:text-zinc-700 transition-colors text-base">
              +33 1 23 45 67 89
            </a>
          </div>

          {/* Adresse */}
          <div className="flex flex-col items-start p-8 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors bg-white" style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)' }}>
            <div className="mb-4">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wide mb-3">Adresse</h3>
            <p className="text-zinc-900 text-base leading-relaxed">
              123 Rue de l'Immobilier<br />
              13000 Marseille, France
            </p>
          </div>
        </div>

        {/* Formulaire de contact à droite */}
        <div className="p-8 border border-zinc-200 rounded-lg bg-white" style={{ boxShadow: '0 10px 20px rgba(0, 0, 0, 0.06)' }}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 mb-2">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Sujet de votre message"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-zinc-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Votre message..."
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="rounded-md px-8 py-3 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: "#00E09E" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#00C08A"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#00E09E"}
              >
                Envoyer le message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

