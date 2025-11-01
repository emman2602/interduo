

import { Loader2 } from "lucide-react";



export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <img src="/loopyPensando.png" alt="imagen de loopy pensando" className="w-80"/>
      
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" /> 
      
      <h1 className="text-3xl font-bold text-gray-800 mt-6">
        Estamos evaluando tu entrevista...
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        Nuestra IA está analizando tus respuestas. ¡Esto puede tardar un momento!
      </p>
    </div>
  );
}