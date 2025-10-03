export default function PoliticasDePrivacidad() {
  return (
    <section
      className={`w-[80%] h-full flex flex-col justify-center items-center my-14 mx-auto md:my-18 ld:my-18`}
    >
      <span className="h-[65px] flex justify-center items-center w-full bg-[#023D71] text-center text-white font-bold text-[20px] ">
        POLITICAS DE PRIVACIDAD
      </span>
      <section className=" w-full p-5 bg-[#D9D9D9] md:p-10 lg:p-10">
        <article className="flex flex-col gap-10">
          <div className="flex flex-row items-center gap-6 mb-4">
            <span
              className={`font-bold text-center text-[20px] text-[#408FD8]`}
            >
              Última actualización:
            </span>
            <p className="text-[#408FD8]">AGOSTO 2025</p>
          </div>
          <div>
            <p>
              En{" "}
              <span
                className={`font-bold text-center text-[18px] text-[#408FD8]`}
              >
                Autocaucho{", "}
              </span>
              respetamos la privacidad de nuestros usuarios y nos comprometemos
              a proteger la información personal que compartes con nosotros.
              Esta Política de Privacidad describe cómo recopilamos, usamos y
              protegemos tus datos cuando usas nuestro sitio web.
            </p>
          </div>
          <div>
            <span
              className={`font-bold text-center text-[18px] text-[#408FD8]`}
            >
              Información que Recopilamos
            </span>
            <p>
              Recopilamos los siguientes tipos de datos personales para procesar
              tus pedidos y mejorar la experiencia de compra:
            </p>
            <ul className="list-disc ml-10 mt-6 text-gray-800">
              {" "}
              <li className="font-bold">
                Datos personales:
                <p className="font-normal">
                  Nombre, dirección de envío, correo electrónico, teléfono.
                </p>
              </li>
              <li className="font-bold">
                Métodos de pago:
                <p className="font-normal">
                  Datos relacionados con el pago, como Bancolombia PSE,
                  Mastercard.
                </p>
              </li>
              <li className="font-bold">
                Cookies:
                <p className="font-normal">
                  Usamos cookies para analizar el tráfico web y personalizar la
                  experiencia de usuario en nuestro sitio.
                </p>
              </li>
            </ul>
          </div>
          <div>
            <span
              className={`font-bold text-center text-[18px] text-[#408FD8] `}
            >
              Uso de los Datos Personales
            </span>
            <p>
              Usamos la información personal recopilada para los siguientes
              fines:
            </p>
            <ul className="list-disc ml-10 mt-6">
              {" "}
              <li className="font-normal">
                Procesar tus pedidos de repuestos y accesorios automotrices.
              </li>
              <li className="font-normal">
                Enviarte confirmaciones de pedidos, notificaciones y
                actualizaciones de envío.
              </li>
              <li className="font-normal">
                Mejorar el rendimiento de nuestro sitio web y servicios.
              </li>
            </ul>
          </div>
          <div>
            <span
              className={`font-bold text-center text-[18px] text-[#408FD8]`}
            >
              Compartir Datos con Terceros
            </span>
            <p>
              Tu información personal puede ser compartida con los siguientes
              terceros para facilitar el proceso de compra y envío:
            </p>
            <ul className="list-disc ml-10 mt-6">
              {" "}
              <li className="font-bold text-gray-800">
                Servicios de envío:
                <p className="font-normal">
                  Para el despacho y entrega de los productos.
                </p>
              </li>
              <li className="font-bold text-gray-800">
                Procesadores de pago:
                <p className="font-normal">
                  Como Bancolombia y Mastercard, para procesar los pagos de
                  manera segura.
                </p>
              </li>
            </ul>
            <p>
              Nos aseguramos de que estos terceros mantengan la privacidad y
              seguridad de tus datos personales.
            </p>
          </div>
          <div>
            <span
              className={`font-bold text-center text-[18px] text-[#408FD8]`}
            >
              Seguridad de los Datos
            </span>
            <p>
              Nos comprometemos a proteger tus datos personales mediante las
              siguientes medidas:
            </p>
            <ul className="list-disc ml-10 mt-6">
              {" "}
              <li className="font-bold text-gray-800">
                Cifrado de datos:
                <p className="font-normal">
                  Usamos tecnologías de cifrado para garantizar que la
                  transmisión de tus datos esté protegida.
                </p>
              </li>
              <li className="font-bold text-gray-800">
                Base de datos segura:
                <p className="font-normal">
                  Almacenamos tus datos en una base de datos segura, accesible
                  solo por personal autorizado.
                </p>
              </li>
            </ul>
            <p>
              Nos aseguramos de que estos terceros mantengan la privacidad y
              seguridad de tus datos personales.
            </p>
          </div>
          <div>
            <span
              className={`font-bold text-center text-[18px] text-[#408FD8]`}
            >
              Derechos del Usuario
            </span>
            <p>Tienes derecho a:</p>
            <ul className="list-disc ml-10 mt-6">
              {" "}
              <li className="font-bold text-gray-800">
                Acceder a tus datos personales:
                <p className="font-normal">
                  Puedes solicitar información sobre los datos que tenemos sobre
                  ti.
                </p>
              </li>
              <li className="font-bold text-gray-800">
                Corregir tus datos:
                <p className="font-normal">
                  Si tus datos son incorrectos, puedes actualizarlos.
                </p>
              </li>
              <li className="font-bold text-gray-800">
                Eliminar tus datos:
                <p className="font-normal">
                  Puedes solicitar la eliminación de tus datos personales en
                  cualquier momento.
                </p>
              </li>
            </ul>
          </div>
          <div>
            <span
              className={`font-bold text-center text-[18px] text-gray-800`}
            >
              Modificación de la Política de Privacidad
            </span>
            <p>
              Nos reservamos el derecho de actualizar esta Política de
              Privacidad en cualquier momento. Los cambios serán publicados en
              esta página y te informaremos por correo electrónico si se
              realizan modificaciones significativas.
            </p>
          </div>
        </article>
      </section>
    </section>
  );
}
