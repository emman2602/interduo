import Image from "next/image";
import Logo from "../Logo";

export default function HeroSection() {
  return (
    <section className="pt-8 pb-16 flex flex-col items-center"> 
      {/* LOGO */}
      <div className="flex justify-center mb-4 pt-16">
        <Logo className="w-80 h-28"/>
      </div>

      {/* TEXTO CENTRAL */}
      <div className="bg-white p-5 rounded-2xl shadow-md max-w-2xl text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Sé parte de esta nueva experiencia en entrevistas laborales
        </h1>
      </div>

      {/* BLOQUE LOOPY */}
      <div className="flex flex-col md:flex-row items-center max-w-6xl">
        <div className="p-6 bg-white rounded-2xl shadow-md text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
            ¡Hola! Soy Loopy,
          </h2>
          <p className="text-base md:text-lg text-gray-700 font-medium leading-relaxed">
            tu compañero en este simulador de entrevistas laborales. Estoy aquí
            para guiarte, motivarte y ayudarte a practicar para que brilles en
            cada entrevista.
          </p>
        </div>

        <div className="flex-shrink-0">
          <Image
            src="/loopySaludando.png"
            alt="Personaje loopy"
            width={300}
            height={300}
            className="w-48 h-48 md:w-64 md:h-64"
          />
        </div>
      </div>
    </section>
  );
}
