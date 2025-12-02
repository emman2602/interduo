import Image from "next/image";

export default function ExpertsSection() {
  return (
    <section className="py-16 ">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
        ¿Quieres ser parte de la comunidad de expertos?
      </h2>

      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-4">
        <div className="flex justify-center">
          <Image
            src="/imagenComunidadExpertos.png"
            alt="Expertos colaborando"
            width={500}
            height={350}
            className="rounded-xl shadow-md object-cover"
          />
        </div>

        <div>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Únete como asesor verificado y comparte tu experiencia con la próxima generación de desarrolladores.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Retroalimenta entrevistas, ayuda a otros a crecer y fortalece tu propio perfil profesional dentro de la comunidad.
          </p>
        </div>
      </div>
    </section>
  );
}