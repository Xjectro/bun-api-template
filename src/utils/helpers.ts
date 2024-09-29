import { readFile } from 'fs/promises';
import path from 'path';

export function createAvatarURL(firstName?: string, lastName?: string): string {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return `https://ui-avatars.com/api/?size=128&bold=true&uppercase=true&background=ffffff&color=000000&name=${encodeURIComponent(name)}`;
}

export async function createHtmlTemplate(name: string, replacements: Record<string, string>) {
  const template = await readFile(
    path.join(__dirname, '..', '..', 'templates', 'html', `${name.replaceAll('-', '/')}.html`),
    'utf-8',
  );

  const html = Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`{${key}}`, 'g'), value),
    template,
  );

  return html;
}
