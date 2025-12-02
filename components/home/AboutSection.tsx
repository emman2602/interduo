import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* BLOQUE DE TEXTO PRINCIPAL */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            Sobre InterDuo
          </h2>
          <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">
            InterDuo nace con la misión de ayudarte a brillar en tus entrevistas laborales. 
            Creemos que la práctica es la clave para alcanzar tus metas profesionales, 
            por eso te ofrecemos una plataforma intuitiva donde puedes entrenar, 
            mejorar y ganar confianza.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {/* CARD 1 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src="/imagenPersonaEstrechandoManos.png"   
              alt="Persona estrechando manos"
              width={400}
              height={300}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                Gana confianza
              </h3>
              <p className="text-gray-700">
                Convierte tus nervios en seguridad con la práctica constante.
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src="/imagenParejaPracticandoEnLaptop.png"
              alt="Pareja practicando en laptop"
              width={400}
              height={300}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                Practica hoy
              </h3>
              <p className="text-gray-700">
                Da el primer paso hacia la entrevista de tus sueños.
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Image
              src="/imagenPersonasTrabajandoEnLaptop.png"
              alt="Personas trabajando con laptops"
              width={400}
              height={300}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                Tu futuro empieza aquí
              </h3>
              <p className="text-gray-700">
                Cada entrevista simulada es un paso más cerca de tu primer gran empleo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
