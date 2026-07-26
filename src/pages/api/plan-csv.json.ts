import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv_Lp2T972SJxeTWwAFJVcCRV0UbAoWoO5hIwtoqvBy5IhkXD8uzmR4hseYJt00A3JutWyn-NcNZ2M/pub?output=csv';

  try {
    const resp = await fetch(CSV_URL, { redirect: 'follow' });
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'HTTP ' + resp.status }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const csv = await resp.text();

    // Parse CSV to JSON
    const lines = csv.split('\n').filter(Boolean);
    const result: Record<string, Record<string, Array<{ subject: string; start: string; stop: string; nr: string }>>> = {};
    let currentClass = '';
    let dateKeys: string[] = [];

    for (let li = 0; li < lines.length; li++) {
      const row = lines[li].trim().split(',');
      if (row.length < 5) continue;

      const first = (row[0] || '').trim();
      const second = (row[1] || '').trim();

      if (second === 'NR' && (row[2] || '').trim() === 'START' && (row[3] || '').trim() === 'STOP') {
        currentClass = first;
        if (!result[currentClass]) result[currentClass] = {};
        dateKeys = [];
        for (let ci = 4; ci < row.length; ci++) {
          const dk = (row[ci] || '').trim();
          if (dk) dateKeys.push(dk);
        }
        continue;
      }

      if (!currentClass || !result[currentClass]) continue;

      const lessonNr = second;
      const start = (row[2] || '').trim();
      const stop = (row[3] || '').trim();

      for (let di = 0; di < dateKeys.length; di++) {
        const val = (row[4 + di] || '').trim();
        if (val) {
          const dateKey = dateKeys[di];
          if (!result[currentClass][dateKey]) result[currentClass][dateKey] = [];
          result[currentClass][dateKey].push({
            subject: val,
            start: start,
            stop: stop,
            nr: lessonNr
          });
        }
      }
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
