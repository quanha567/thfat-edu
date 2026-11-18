type TJsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: TJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
