type SiteBrandingStyleProps = {
  brandPrimaryHex: string | null;
  brandSecondaryHex: string | null;
};

/**
 * Injects :root CSS variables for public pages when branding is set in Settings.
 */
export default function SiteBrandingStyle({
  brandPrimaryHex,
  brandSecondaryHex,
}: SiteBrandingStyleProps) {
  if (!brandPrimaryHex && !brandSecondaryHex) {
    return null;
  }

  const parts: string[] = [];
  if (brandPrimaryHex) {
    parts.push(`--primary: ${brandPrimaryHex};`);
    parts.push(`--primary-hover: color-mix(in srgb, ${brandPrimaryHex} 85%, #000);`);
    parts.push(`--ytop-red: ${brandPrimaryHex};`);
    parts.push(`--ytop-red-hover: color-mix(in srgb, ${brandPrimaryHex} 85%, #000);`);
  }
  if (brandSecondaryHex) {
    parts.push(`--secondary: ${brandSecondaryHex};`);
    parts.push(`--secondary-hover: color-mix(in srgb, ${brandSecondaryHex} 85%, #000);`);
    parts.push(`--ytop-blue: ${brandSecondaryHex};`);
    parts.push(`--ytop-blue-hover: color-mix(in srgb, ${brandSecondaryHex} 85%, #000);`);
    parts.push(`--ytop-blue-dark: ${brandSecondaryHex};`);
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root { ${parts.join(' ')} }`,
      }}
    />
  );
}
