// Single source of truth for the tools suite: nav dropdown, homepage grid,
// and related-tools sections all render from this registry.
export interface ToolEntry {
  name: string;
  href: string;
  description: string;
  group: 'Compress' | 'Resize & Crop' | 'Convert' | 'Remove Background' | 'Generate';
  icon: 'compress' | 'resize' | 'crop' | 'convert' | 'bg' | 'passport' | 'signature' | 'favicon' | 'base64' | 'pdf';
  /** Roughly ordered relevance for "related tools" sections. */
  related: string[];
}

export const tools: ToolEntry[] = [
  {
    name: 'Compress images',
    href: '/#compress',
    description: 'Reduce JPG, PNG, and WebP files to an exact size',
    group: 'Compress',
    icon: 'compress',
    related: ['/compress-pdf', '/image-to-pdf', '/resize-image'],
  },
  {
    name: 'Compress PDF',
    href: '/compress-pdf',
    description: 'Shrink PDF files in your browser, no quality loss',
    group: 'Compress',
    icon: 'pdf',
    related: ['/image-to-pdf', '/#compress', '/convert/png-to-jpg'],
  },
  {
    name: 'Image to PDF',
    href: '/image-to-pdf',
    description: 'Combine images into a single PDF, original quality',
    group: 'Convert',
    icon: 'pdf',
    related: ['/compress-pdf', '/#compress', '/favicon-generator'],
  },
  {
    name: 'Resize image',
    href: '/resize-image',
    description: 'Resize by pixels or percent with aspect-ratio lock',
    group: 'Resize & Crop',
    icon: 'resize',
    related: ['/crop-image', '/passport-photo-resizer', '/convert/png-to-jpg'],
  },
  {
    name: 'Crop image',
    href: '/crop-image',
    description: 'Crop with aspect presets and 90° rotation',
    group: 'Resize & Crop',
    icon: 'crop',
    related: ['/resize-image', '/passport-photo-resizer', '/#compress'],
  },
  {
    name: 'Passport photo resizer',
    href: '/passport-photo-resizer',
    description: 'Crop to US, UK, Indian, Schengen, PAN, and Aadhaar sizes',
    group: 'Resize & Crop',
    icon: 'passport',
    related: ['/crop-image', '/resize-image', '/#compress'],
  },
  {
    name: 'Convert format',
    href: '/convert/png-to-jpg',
    description: 'PNG, JPG, WebP, and HEIC conversions, client-side',
    group: 'Convert',
    icon: 'convert',
    related: ['/image-to-pdf', '/resize-image', '/image-to-base64'],
  },
  {
    name: 'Remove background',
    href: '/remove-background',
    description: 'Transparent PNG cut-outs powered by remove.bg',
    group: 'Remove Background',
    icon: 'bg',
    related: ['/remove-signature-background', '/crop-image', '/favicon-generator'],
  },
  {
    name: 'Remove signature background',
    href: '/remove-signature-background',
    description: 'Turn signature scans into clean transparent PNGs',
    group: 'Remove Background',
    icon: 'signature',
    related: ['/remove-background', '/passport-photo-resizer', '/image-to-base64'],
  },
  {
    name: 'Favicon generator',
    href: '/favicon-generator',
    description: 'All favicon sizes in one ZIP with HTML snippet',
    group: 'Generate',
    icon: 'favicon',
    related: ['/resize-image', '/convert/png-to-jpg', '/image-to-base64'],
  },
  {
    name: 'Image to Base64',
    href: '/image-to-base64',
    description: 'Instant data-URI encoding with one-click copy',
    group: 'Generate',
    icon: 'base64',
    related: ['/favicon-generator', '/convert/png-to-jpg', '/#compress'],
  },
];

export const toolByHref = (href: string) => tools.find((t) => t.href === href);

export const navGroups: ToolEntry['group'][] = ['Compress', 'Resize & Crop', 'Convert', 'Remove Background', 'Generate'];

/** Icon SVG path data, 24x24 viewBox, stroke style. */
export const toolIconPaths: Record<ToolEntry['icon'], string> = {
  compress: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
  pdf: 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776',
  resize: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15',
  crop: 'M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2',
  convert: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  bg: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
  passport: 'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z',
  signature: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
  favicon: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0-3a6 6 0 100-12 6 6 0 000 12zm0-4.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  base64: 'M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
};
