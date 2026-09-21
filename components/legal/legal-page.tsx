export function LegalPage({ title, lede }: { title: string; lede: string }) {
  return (
    <div className="page max-w-3xl pt-28 pb-28 lg:pt-32">
      <h1 className="display-lg">{title}</h1>
      <p className="lede mt-4">{lede}</p>
      <div className="mt-10 rounded-lg border border-dashed border-line p-7">
        <h2 className="text-[1.0625rem] font-medium">Texto pendiente de redacción legal</h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">
          Este apartado es un marcador de posición del prototipo. El contenido definitivo debe
          redactarlo un profesional con la información real del operador: identidad de la empresa,
          base jurídica del tratamiento, plazos de conservación, encargados de tratamiento y vías de
          ejercicio de derechos. AUTORA no proporciona asesoramiento jurídico.
        </p>
      </div>
    </div>
  );
}
