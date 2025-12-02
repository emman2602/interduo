import Image from "next/image";

export default function HowItWorksSection() {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* TÍTULO */}
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center mb-12">
          ¿Cómo funciona?
        </h2>

        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* PASOS */}
          <div className="space-y-6 text-gray-700">
            <div>
              <p className="font-semibold text-lg mb-1">Paso 1:</p>
              <p>Regístrate gratis en InterDuo.</p>
            </div>

            <div>
              <p className="font-semibold text-lg mb-1">Paso 2:</p>
              <p>Elige el área de entrevista que más te interese.</p>
            </div>

            <div>
              <p className="font-semibold text-lg mb-1">Paso 3:</p>
              <p>Responde las preguntas en video o texto.</p>
            </div>

            <div>
              <p className="font-semibold text-lg mb-1">Paso 4:</p>
              <p>Recibe retroalimentación personalizada.</p>
            </div>

            <div>
              <p className="font-semibold text-lg mb-1">Paso 5:</p>
              <p>Repite y mejora en cada intento.</p>
            </div>
          </div>

          {/* IMAGEN */}
          <div className="flex justify-center">
            <Image
              src="/imagenComoFunciona.png" 
              alt="Pantalla de ejemplo de InterDuo"
              width={500}
              height={350}
              className="rounded-2xl shadow-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}