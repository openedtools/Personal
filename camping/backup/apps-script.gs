/**
 * Desert Turkey 2026 — Google Sheets backup mirror.
 *
 * Receives every trip-data write from the website and writes it
 * into the bound Sheet. Five tabs are kept as a live mirror
 * (Campers, Reservations, Potluck, T-Shirts, Itinerary); the
 * Snapshots tab gets one append-only row per write with the
 * full JSON payload so you can restore from any point.
 *
 * Setup is documented in camping/backup/README.md.
 */

// Must match BACKUP_SECRET in camping/js/firebase-config.js
const SECRET = 'desert-turkey-2026';

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return _json({ error: 'bad json' });
  }
  if (body.secret !== SECRET) {
    return _json({ error: 'unauthorized' });
  }

  const ss = SpreadsheetApp.getActive();
  const p  = body.payload || {};
  const ts = body.ts || new Date().toISOString();

  _writeTable(ss, 'Campers',
    ['name','adults','kids','setup','arrival','departure','note'],
    p.campers);

  _writeTable(ss, 'Reservations',
    ['reservedBy','sites_csv','arrival','departure','note','sites_json'],
    (p.siteReservations || []).map(function (r) {
      return {
        reservedBy: r.reservedBy,
        sites_csv:  (r.sites || [])
          .map(function (s) { return s.siteNum + (s.usedBy ? ' (' + s.usedBy + ')' : ''); })
          .join(', '),
        arrival:    r.arrival,
        departure:  r.departure,
        note:       r.note,
        sites_json: JSON.stringify(r.sites || []),
      };
    }));

  _writeTable(ss, 'Potluck',
    ['name','dish','category','note'],
    p.potluck);

  _writeTable(ss, 'T-Shirts',
    ['name','size','qty','note'],
    p.tshirts);

  _writeTable(ss, 'Itinerary',
    ['day','date','title','activities'],
    (p.itinerary || []).map(function (d) {
      return {
        day:        d.day,
        date:       d.date,
        title:      d.title,
        activities: (d.activities || []).join(' • '),
      };
    }));

  // Append-only history — one row per write, full JSON.
  let hist = ss.getSheetByName('Snapshots');
  if (!hist) hist = ss.insertSheet('Snapshots');
  if (hist.getLastRow() === 0) hist.appendRow(['Timestamp', 'Payload JSON']);
  hist.appendRow([ts, JSON.stringify(p)]);

  return _json({ ok: true });
}

// GET handler so you can ping the URL in a browser to confirm it's live.
function doGet() {
  return _json({ status: 'Desert Turkey 2026 backup mirror is live.' });
}

function _writeTable(ss, name, cols, arr) {
  arr = arr || [];
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  sh.clear();
  sh.appendRow(cols);
  if (arr.length === 0) return;
  const rows = arr.map(function (o) {
    return cols.map(function (c) { return o && o[c] != null ? o[c] : ''; });
  });
  sh.getRange(2, 1, rows.length, cols.length).setValues(rows);
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
