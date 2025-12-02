import Image from "next/image";
import Logo from "../Logo";

export default function HeroSection() {
  return (
    <section className="pt-20 pb-24 flex flex-col items-center space-y-12">

      {/* LOGO */}
      <div className="flex justify-center">
        <Logo className="w-72 md:w-80 h-auto" />
      </div>

      {/* TEXTO PRINCIPAL */}
      <div className="bg-white px-8 py-6 rounded-2xl shadow-md max-w-3xl w-full text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-snug">
          Sé parte de esta nueva experiencia en entrevistas laborales
        </h1>
      </div>

      {/* BLOQUE TEXTO + LOOPY */}
      <div className="w-full max-w-5xl flex items-center justify-center gap-6">

        {/* CUADRO DE TEXTO – se hace MÁS CORTO */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex-1 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            ¡Hola! Soy Loopy,
          </h2>
          <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">
            tu compañero en este simulador de entrevistas laborales. Estoy aquí
            para guiarte, motivarte y ayudarte a practicar para que brilles en
            cada entrevista.
          </p>
        </div>

        {/* LOOPY – completamente afuera del cuadro */}
        <div className="hidden md:flex items-center justify-center">
          <Image
            src="/loopySaludando.png"
            alt="Loopy"
            width={200}
            height={200}
            className="drop-shadow-lg"
          />
        </div>

      </div>

    </section>
  );
}