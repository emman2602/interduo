import Image from "next/image";

export default function BenefitsSection() {
  return (
    <section className="w-full py-20 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Beneficios</h2>

      {/* Tarjetas de beneficios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mb-10 px-4">
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Práctica realista</h3>
          <p className="text-gray-600">Entrevistas simuladas como si estuvieras frente a un reclutador.</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Feedback profesional</h3>
          <p className="text-gray-600">Retroalimentación clara para mejorar en cada intento.</p>
        </div>
        <div className="bg-white shadow-md rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Confianza en ti mismo</h3>
          <p className="text-gray-600">Reduce nervios y aumenta seguridad.</p>
        </div>
      </div>

      {/* Imágenes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl px-4">
        <Image
          src="/imagenEntrevistaProfesional.png"
          alt="Entrevista profesional"
          width={400}
          height={250}
          className="rounded-xl object-cover"
        />
        <Image
          src="/imagenFeedbackProfesional.png"
          alt="Retroalimentación"
          width={400}
          height={250}
          className="rounded-xl object-cover"
        />
        <Image
          src="/imagenConfianzaPersonal.png"
          alt="Confianza personal"
          width={400}
          height={250}
          className="rounded-xl object-cover"
        />
      </div>
    </section>
  );
}