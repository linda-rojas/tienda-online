import { IoIosArrowForward } from "react-icons/io";

export default function QuienesSomos() {
  return (
    <section
      className={`flex flex-col gap-14 justify-center items-center my-18 md:gap-12 lg:gap-10`}
    >
      <div className="flex flex-col gap-4 p-6 w-[280px] h-min rounded-md bg-[#D9D9D9] md:w-[500px] lg:w-[500px]">
        <span className={`font-bold text-center text-[20px] text-gray-800`}>
          ¿Quiénes Somos?
        </span>
        <p>
          En <span className="font-bold text-gray-800">AutoCaucho</span>, somos apasionados
          por ofrecer a nuestros clientes soluciones automotrices de calidad.
          Somos una tienda online especializada en la venta de soportes,
          rodamientos, suspensión y otros componentes esenciales para el
          mantenimiento de vehículos, brindando productos de alto rendimiento a
          precios competitivos. Nos enorgullece ser tu socio de confianza para
          garantizar que tu vehículo esté en las mejores condiciones. Desde
          autos de pasajeros hasta camiones y maquinaria pesada, nuestra
          selección de repuestos está diseñada para mejorar la seguridad, el
          rendimiento y la durabilidad de tu vehículo.
        </p>
      </div>
      <div className="flex flex-col justify-center align-center gap-14 p-6 w-[295px] h-min rounded-md bg-[#D9D9D9] md:w-[700px] md:flex-row md:gap-30 lg:w-[900px] lg:flex-row lg:m-8 lg:p-10 lg:gap-30">
        <div className="flex flex-col gap-4">
          <span className={`font-bold text-center text-[20px] text-gray-800`}>MISIÓN</span>
          <p>
            Proporcionar productos de la más alta calidad, con una atención al
            cliente excepcional y un proceso de compra fácil y seguro.
            Trabajamos con las mejores marcas y fabricantes para asegurar que
            nuestros clientes siempre reciban lo mejor para sus vehículos.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <span className={`font-bold text-center text-[20px] text-gray-800`}>VISIÓN</span>
          <p>
            Convertirnos en la tienda online líder en repuestos automotrices,
            siendo la primera opción para quienes buscan productos de calidad,
            atención personalizada y un servicio rápido y confiable.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-10 p-6 w-[295px] h-min rounded-md bg-[#D9D9D9] md:p-8 md:w-[700px] lg:p-8 lg:w-[900px] text-gray-800">
        <span className={`font-bold text-center text-[20px] text-gray-800`}>
          ¿Por qué Elegirnos?
        </span>
        <article>
          <section className="flex items-center gap-1">
            <IoIosArrowForward className="h-5 w-4 font-bold" />
            <span className={`font-bold text-center text-[17px]`}>
              Calidad y Variedad:
            </span>
          </section>
          <p>
            Solo trabajamos con marcas líderes, ofreciendo repuestos de alta
            calidad para cubrir todas las necesidades de tu vehículo, desde
            soportes hasta sistemas de suspensión.
          </p>
        </article>
        <article>
          <section className="flex items-center gap-1">
            <IoIosArrowForward className="h-5 w-4 text-black font-bold" />
            <span className={`font-bold text-center text-[17px]`}>
              Envíos Rápidos:
            </span>
          </section>
          <p>
            Entregas puntuales para que tu vehículo siempre esté en movimiento,
            sin retrasos
          </p>
        </article>
        <article>
          <section className="flex items-center gap-1">
            <IoIosArrowForward className="h-5 w-4 text-black font-bold" />
            <span className={`font-bold text-center text-[17px]`}>
              Atención Personalizada
            </span>
          </section>
          <p>
            Nuestro equipo de expertos te asesora en cada paso para encontrar el
            repuesto perfecto, sin importar la marca o modelo.
          </p>
        </article>
        <article>
          <section className="flex items-center gap-1">
            <IoIosArrowForward className="h-5 w-4 text-black font-bold" />
            <span className={`font-bold text-center text-[17px]`}>
              Precios Justos:
            </span>
          </section>
          <p>
            Obtén lo mejor para tu vehículo a precios accesibles, sin sacrificar
            calidad.
          </p>
        </article>
      </div>
    </section>
  );
}
