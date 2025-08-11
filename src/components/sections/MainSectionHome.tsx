import Typewriter from 'typewriter-effect';


export const MainSectionHome = () => {



  return (
    <main>

      <section className="flex">
        <img src="./bg.webp" alt="" />
        <div className="mr-11 roboto-mono">
          <h1 className="text-[#9d5da0] mt-36 text-3xl font-bold mb-4">¡Bienvenido a mi diario de inglés!</h1>
          <div className="text-lg whitespace-pre-line">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    `Acá registro todo lo que aprendo mientras peleo (con dignidad) contra los phrasal verbs, los tiempos verbales y esas palabras raras que aparecen de la nada.\n\n`
                  )
                  .typeString(
                    `Guardo vocabulario nuevo, anoto mis errores más épicos, escribo recomendaciones para mi yo del futuro y me organizo por categorías como grammar, listening, y más.\n\n`
                  )
                  .typeString(
                    `No es Hogwarts, pero mi inglés mejora todos los días. 💪`
                  )
                  .start();
              }}
              options={{
                loop: false,
                delay: 40,
                cursor: '|',
              }}
            />
          </div>

        </div>
      </section>
    </main>
  )
}
