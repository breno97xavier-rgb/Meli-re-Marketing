import { readFile, writeFile, rm } from 'node:fs/promises';
import { build } from 'esbuild';
await build({ entryPoints: ['src/prerender.tsx'], outfile: '.seo-build/render.cjs', bundle: true, platform: 'node', format: 'cjs', packages: 'bundle', external: ['react', 'react-dom/server', 'react/jsx-runtime'], define: { 'import.meta.env': '{}', 'import.meta': '{}' } });
try {
  const { render, seoPages, hubSeo, pageSchema, agencyOrigin, hubOrigin } = await import('../.seo-build/render.cjs');
  const template = await readFile('dist/index.html', 'utf8');
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  async function emit(file, path, meta, canonical, schema) {
    let html = template.replace(/<title>.*?<\/title>/s, `<title>${escape(meta.title)}</title>`)
      .replace(/<meta name="description"[^>]*\/>/, `<meta name="description" content="${escape(meta.description)}" />`)
      .replace(/<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${escape(meta.title)}" />`)
      .replace(/<meta property="og:description"[^>]*\/>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
      .replace('</head>', `<link rel="canonical" href="${canonical}" /><meta property="og:url" content="${canonical}" /><meta name="robots" content="index,follow" /><script id="seo-schema" type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script></head>`)
      .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`);
    await writeFile(`dist/${file}`, html);
  }
  for (const [path, meta] of Object.entries(seoPages)) await emit(path === '/' ? 'agency.html' : `${path.slice(1)}.html`, path, meta, `${agencyOrigin}${path}`, pageSchema(path));
  await emit('index.html', 'hub', hubSeo, `${hubOrigin}/`, { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Melière Marketing', url: `${hubOrigin}/` });
  const notFound = template.replace(/<title>.*?<\/title>/s, '<title>Página não encontrada | Melière Marketing</title>').replace('</head>', '<meta name="robots" content="noindex,follow" /></head>').replace('<div id="root"></div>', '<div id="root"><main><h1>Página não encontrada</h1><a href="https://agencia.melieremarketing.com.br/">Voltar ao site</a></main></div>');
  await writeFile('dist/404.html', notFound);
  console.log('SEO: HTML gerado para Home, links, serviços, briefing e privacidade.');
} finally { await rm('.seo-build', { recursive: true, force: true }); }
