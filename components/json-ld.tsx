interface JsonLdProps {
  data: object | object[];
}

/**
 * Inyecta JSON-LD (Schema.org) en el head de la página.
 * Se renderiza server-side para que Google pueda leerlo sin JS.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
