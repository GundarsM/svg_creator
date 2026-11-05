/**
 * HillSpring Crafts - quote request BACKUP receiver
 * ==================================================
 * Google Apps Script web app, deployed from the hillspringcrafts@gmail.com account.
 *
 * The design tools (editor.js / builder.js) send quote requests to FormSubmit first.
 * Only when FormSubmit fails do they post the same request here, and this script
 * e-mails it to the shop inbox with the design files attached. Subjects are prefixed
 * with "[backup]" so a FormSubmit outage is visible from the inbox.
 *
 * Setup guide: docs/quote-backup-setup.md in the svg_editor repository.
 *
 * Deployment (Deploy > New deployment > Web app):
 *   Execute as:     Me (hillspringcrafts@gmail.com)
 *   Who has access: Anyone
 * After editing this file: Deploy > Manage deployments > pencil > Version: New version.
 */

// ---- Settings ---------------------------------------------------------------
var TO_EMAIL        = 'hillspringcrafts@gmail.com';
var SENDER_NAME     = 'HillSpring Quote Backup';
var SUBJECT_PREFIX  = '[backup] ';
var DEFAULT_SUBJECT = 'New Design Quote Request - HillSpring Crafts';
var MAX_PER_HOUR    = 20;                 // whole-endpoint cap (Gmail allows ~100 script e-mails/day)
var MAX_FILES       = 3;                  // attachments per request (the tools send 1 or 2)
var MAX_FILE_BYTES  = 5 * 1024 * 1024;    // per attachment
var ALLOWED_TYPES   = ['image/svg+xml', 'application/json', 'text/plain', 'image/png', 'image/jpeg'];
var EXT_TYPES       = { svg: 'image/svg+xml', json: 'application/json', txt: 'text/plain', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
var REQUIRED_FIELDS = ['first_name', 'email'];

// ---- Entry points -----------------------------------------------------------

/** Health check: open the web-app URL in a browser. */
function doGet() {
  return json_({
    ok: true,
    service: 'hillspring-quote-backup',
    emailsLeftToday: MailApp.getRemainingDailyQuota()
  });
}

/** Receives a quote request as a text/plain JSON body and e-mails it. */
function doPost(e) {
  try {
    var data = parseBody_(e);

    // Honeypot: real people never see this field; bots tend to fill it.
    // Pretend success so the bot learns nothing.
    if (data._honey) return json_({ ok: true, dropped: 'honeypot' });

    var missing = REQUIRED_FIELDS.filter(function (k) {
      return !String(data[k] == null ? '' : data[k]).trim();
    });
    if (missing.length) return json_({ ok: false, error: 'Missing required field(s): ' + missing.join(', ') });

    if (!rateLimitOk_()) return json_({ ok: false, error: 'Too many requests this hour' });

    var skipped = [];
    var attachments = [];
    (Array.isArray(data.files) ? data.files : []).slice(0, MAX_FILES).forEach(function (f) {
      var blob = fileToBlob_(f, skipped);
      if (blob) attachments.push(blob);
    });

    var message = {
      to: TO_EMAIL,
      name: SENDER_NAME,
      subject: SUBJECT_PREFIX + (String(data.subject || '').trim() || DEFAULT_SUBJECT),
      htmlBody: buildHtml_(data, attachments, skipped),
      attachments: attachments
    };
    if (isEmail_(data.email)) message.replyTo = String(data.email).trim();

    MailApp.sendEmail(message);
    return json_({ ok: true, attachments: attachments.length, skipped: skipped.length });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

/**
 * Run this once from the Apps Script editor (choose "sendTestEmail", click Run)
 * to authorise the script and confirm it can deliver to the shop inbox.
 */
function sendTestEmail() {
  MailApp.sendEmail({
    to: TO_EMAIL,
    name: SENDER_NAME,
    subject: SUBJECT_PREFIX + 'Test from the quote backup script',
    htmlBody: '<p>If you can read this, the backup script can send e-mail from this account.</p>' +
              '<p>E-mails left today: ' + MailApp.getRemainingDailyQuota() + '</p>'
  });
}

// ---- Helpers ----------------------------------------------------------------

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Empty request body');
  var data;
  try { data = JSON.parse(e.postData.contents); }
  catch (err) { throw new Error('Body is not valid JSON'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Body is not a JSON object');
  return data;
}

/**
 * Per-hour counter in the script cache. Not perfectly atomic, but good enough
 * to stop a runaway bot from burning the daily Gmail quota.
 */
function rateLimitOk_() {
  var cache = CacheService.getScriptCache();
  var key = 'quote_backup_' + Math.floor(Date.now() / 3600000);
  var count = Number(cache.get(key) || 0) + 1;
  cache.put(key, String(count), 3600);
  return count <= MAX_PER_HOUR;
}

function fileToBlob_(f, skipped) {
  var name = sanitizeName_(f && f.name);
  var type = String((f && f.type) || '').toLowerCase();
  if (!f || typeof f.content !== 'string') { skipped.push(name + ' (no content)'); return null; }
  if (ALLOWED_TYPES.indexOf(type) === -1) {
    // Browsers sometimes report no type for uploaded files; fall back to the extension.
    var ext = (name.match(/\.([a-z0-9]+)$/i) || [])[1];
    var byExt = ext ? EXT_TYPES[ext.toLowerCase()] : '';
    if (!byExt) { skipped.push(name + ' (type ' + (type || 'unknown') + ' not allowed)'); return null; }
    type = byExt;
  }
  var bytes;
  try { bytes = Utilities.base64Decode(f.content); }
  catch (err) { skipped.push(name + ' (could not decode)'); return null; }
  if (bytes.length > MAX_FILE_BYTES) {
    skipped.push(name + ' (larger than ' + Math.round(MAX_FILE_BYTES / 1048576) + ' MB)');
    return null;
  }
  return Utilities.newBlob(bytes, type, name);
}

function sanitizeName_(name) {
  var clean = String(name || '')
    .replace(/[\\\/:*?"<>|\x00-\x1f]/g, '_')
    .replace(/^\.+/, '')
    .slice(0, 100);
  return clean || 'attachment';
}

function isEmail_(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
}

function esc_(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function buildHtml_(data, attachments, skipped) {
  var rows = [
    ['Design name',        data.project_name],
    ['First name',         data.first_name],
    ['Last name',          data.last_name],
    ['Email',              data.email],
    ['Preferred material', data.preferred_material],
    ['Notes',              data.notes]
  ];
  var html = '<p style="color:#a33300"><b>Delivered by the backup script</b> because FormSubmit did not accept this request.</p>';
  html += '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">';
  rows.forEach(function (r) {
    html += '<tr><td style="border:1px solid #ccc;background:#f5f5f5;vertical-align:top"><b>' + esc_(r[0]) + '</b></td>' +
            '<td style="border:1px solid #ccc">' + esc_(r[1]).replace(/\r?\n/g, '<br>') + '</td></tr>';
  });
  html += '</table>';
  html += '<p><b>Attachments:</b> ' + (attachments.length
            ? attachments.map(function (b) { return esc_(b.getName()); }).join(', ')
            : 'none') + '</p>';
  if (skipped.length) html += '<p><b>Skipped files:</b> ' + esc_(skipped.join(', ')) + '</p>';
  html += '<p style="color:#888;font-size:12px">Received ' + new Date().toISOString() + '</p>';
  return html;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
