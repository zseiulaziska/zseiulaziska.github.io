import { getCollection } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';

var rootDir = process.cwd();

function extractText(content) {
  return content
    .replace(/^---[\s\S]*?---\n*/m, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]*\}/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[#*`~\[\]()>|_\\]/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(text) {
  return text
    .replace(/^---[\s\S]*?---\n*/m, '')
    .replace(/[#*`~\[\]()>|_-]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/https?:\/\/\S+/g, '')
    .trim();
}

const pageFiles = {
  '/': 'src/pages/index.astro',
  '/informacje': 'src/pages/informacje.astro',
  '/historia': 'src/pages/historia.astro',
  '/dyrekcja': 'src/pages/dyrekcja.astro',
  '/grono-pedagogiczne': 'src/pages/grono-pedagogiczne.astro',
  '/nasza-spolecznosc': 'src/pages/nasza-spolecznosc.astro',
  '/aktywna-przerwa': 'src/pages/aktywna-przerwa.astro',
  '/kierunki': 'src/pages/kierunki.astro',
  '/kierunki-ksztalcenia': 'src/pages/kierunki-ksztalcenia.astro',
  '/klasy-mundurowe': 'src/pages/klasy-mundurowe.astro',
  '/klasa-policyjna': 'src/pages/klasa-policyjna.astro',
  '/podreczniki': 'src/pages/podreczniki.astro',
  '/projekty': 'src/pages/projekty.astro',
  '/erasmus': 'src/pages/erasmus.astro',
  '/dokumenty-szkolne': 'src/pages/dokumenty-szkolne.astro',
  '/dokumenty': 'src/pages/dokumenty.astro',
  '/dostepnosc': 'src/pages/dostepnosc.astro',
  '/dla-uczniow': 'src/pages/dla-uczniow.astro',
  '/dla-rodzicow': 'src/pages/dla-rodzicow.astro',
  '/rekrutacja': 'src/pages/rekrutacja.astro',
  '/kalendarz': 'src/pages/kalendarz.astro',
  '/egzaminy-zawodowe': 'src/pages/egzaminy-zawodowe.astro',
  '/blog': 'src/pages/blog/index.astro',
  '/booking': 'src/pages/booking.astro',
  '/covid19': 'src/pages/covid19.astro',
  '/about': 'src/pages/about.astro',
  '/klienci-i-partnerzy': 'src/pages/klienci-i-partnerzy.astro',
};

export const prerender = true;

const staticPages = [
  { title: 'Strona główna', url: '/', description: 'Zespół Szkół Ekonomiczno-Usługowych w Łaziskach Górnych' },
  { title: 'Informacje o szkole', url: '/informacje', description: 'Podstawowe informacje o ZSEiU' },
  { title: 'Historia', url: '/historia', description: 'Historia Zespołu Szkół Ekonomiczno-Usługowych' },
  { title: 'Dyrekcja i kierownictwo', url: '/dyrekcja', description: 'Dyrekcja i kierownictwo szkoły' },
  { title: 'Grono pedagogiczne', url: '/grono-pedagogiczne', description: 'Nauczyciele i pracownicy ZSEiU' },
  { title: 'Nasza społeczność', url: '/nasza-spolecznosc', description: 'Społeczność szkolna ZSEiU' },
  { title: 'Aktywna przerwa', url: '/aktywna-przerwa', description: 'Program Aktywna przerwa w ZSEiU' },
  { title: 'Kierunki kształcenia', url: '/kierunki', description: 'Kierunki kształcenia w ZSEiU' },
  { title: 'Oferta 2025/2026', url: '/kierunki-ksztalcenia', description: 'Oferta edukacyjna na rok 2025/2026' },
  { title: 'Klasy mundurowe', url: '/klasy-mundurowe', description: 'Klasy mundurowe w ZSEiU' },
  { title: 'Klasa policyjna', url: '/klasa-policyjna', description: 'Klasa policyjna w ZSEiU' },
  { title: 'Podręczniki', url: '/podreczniki', description: 'Szkolny zestaw podręczników' },
  { title: 'Projekty i Erasmus+', url: '/projekty', description: 'Projekty realizowane w ZSEiU' },
  { title: 'Erasmus+', url: '/erasmus', description: 'Program Erasmus+ w ZSEiU' },
  { title: 'Dokumenty szkolne', url: '/dokumenty-szkolne', description: 'Dokumenty szkolne ZSEiU' },
  { title: 'Dokumenty i polityki', url: '/dokumenty', description: 'Dokumenty i polityki szkolne' },
  { title: 'Dostępność', url: '/dostepnosc', description: 'Deklaracja dostępności ZSEiU' },
  { title: 'Dla uczniów', url: '/dla-uczniow', description: 'Informacje dla uczniów ZSEiU' },
  { title: 'Dla rodziców', url: '/dla-rodzicow', description: 'Informacje dla rodziców' },
  { title: 'Rekrutacja', url: '/rekrutacja', description: 'Rekrutacja do ZSEiU' },
  { title: 'Kalendarz', url: '/kalendarz', description: 'Kalendarz roku szkolnego' },
  { title: 'Egzaminy zawodowe', url: '/egzaminy-zawodowe', description: 'Egzaminy zawodowe w ZSEiU' },
  { title: 'Blog - aktualności', url: '/blog', description: 'Aktualności z życia szkoły' },
  { title: 'Booking', url: '/booking', description: 'Booking - rezerwacje' },
  { title: 'COVID-19', url: '/covid19', description: 'Informacje dotyczące COVID-19' },
  { title: 'O nas', url: '/about', description: 'O Zespole Szkół Ekonomiczno-Usługowych' },
  { title: 'Klienci i partnerzy', url: '/klienci-i-partnerzy', description: 'Klienci i partnerzy ZSEiU' },
];

export async function GET() {
  const pages = staticPages.map(function (page) {
    var file = pageFiles[page.url.replace(/\/$/, '') || '/'];
    var body = '';
    if (file) {
      try {
        var src = fs.readFileSync(path.join(rootDir, file), 'utf-8');
        body = extractText(src);
      } catch (_) {}
    }
    return { ...page, body: body || undefined };
  });

  try {
    const blogPosts = await getCollection('blog');
    for (const post of blogPosts) {
      if (post.data.draft) continue;
      pages.push({
        title: post.data.title,
        url: `/blog/${post.id}/`,
        description: post.data.description,
        body: stripMarkdown(post.body || ''),
      });
    }
  } catch (e) {
    // blog collection unavailable
  }

  return new Response(JSON.stringify(pages), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=31536000' },
  });
}
