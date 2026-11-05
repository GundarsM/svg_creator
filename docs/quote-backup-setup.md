# Quote form backup: Google Apps Script setup

The quote form in `editor.js` and `builder.js` sends requests to FormSubmit.co first.
If FormSubmit fails (outage, CORS error, timeout), the same request is resent to a small
Google Apps Script running in the **hillspringcrafts@gmail.com** account, which e-mails
it to that inbox with the design files attached. Those e-mails have **[backup]** in the
subject, so you can tell when FormSubmit was down.

Until the script URL is pasted into the tools, the backup is simply skipped and the
tools behave exactly as before.

The script is [`apps-script/quote-backup/Code.gs`](../apps-script/quote-backup/Code.gs).

## One-time setup (about 15 minutes)

### 1. Create the script

1. In a browser, sign in to Google as **hillspringcrafts@gmail.com**. If you are signed in to several Google accounts, use a private/incognito window to be sure the right one is used.
2. Open <https://script.google.com> and click **New project**.
3. Click the project name "Untitled project" (top left) and rename it to **HillSpring Quote Backup**.
4. In the code editor, select everything in `Code.gs` and delete it. Paste the full contents of `apps-script/quote-backup/Code.gs` from this repository.
5. Press **Ctrl+S** to save.

### 2. Authorise it and send a test e-mail

1. In the toolbar, open the function dropdown (it shows `doGet` or `doPost`) and choose **sendTestEmail**.
2. Click **Run**.
3. A dialog says **Authorization required**. Click **Review permissions** and choose the hillspringcrafts account.
4. Google shows **"Google hasn't verified this app"**. This is expected: it is your own private script, not a published app. Click **Advanced**, then **Go to HillSpring Quote Backup (unsafe)**.
5. Click **Allow** on the "Send email as you" permission.
6. Check the hillspringcrafts inbox. An e-mail with subject **[backup] Test from the quote backup script** should arrive within a minute. If it landed in Spam, mark it "Not spam" so future ones go to the inbox.

### 3. Deploy it as a web app

1. Click **Deploy** (top right) → **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - Description: `v1`
   - Execute as: **Me (hillspringcrafts@gmail.com)**
   - Who has access: **Anyone** (not "Anyone with Google account")
4. Click **Deploy**, then **Copy** the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfycb.../exec`.

### 4. Check the deployment

Open the copied URL in a private/incognito window (so you are not signed in). You should see something like:

```
{"ok":true,"service":"hillspring-quote-backup","emailsLeftToday":99}
```

If you see a Google sign-in page instead, the deployment's access is not "Anyone". Go back to step 3.

### 5. Put the URL into the tools

In both `editor.js` and `builder.js`, search for `PASTE_APPS_SCRIPT_URL_HERE` (one place in each file, in the `QUOTE_DELIVERY` block) and replace it with the Web app URL. Keep the quotes:

```js
backupUrl: 'https://script.google.com/macros/s/AKfycb.../exec',
```

Then paste each file into its Squarespace page as usual (Page Settings → Advanced → Page Header Code Injection).

### 6. Test the fallback on the live page

Easiest: pretend FormSubmit is down by blocking it in the browser.

1. Open the live editor page in Chrome. Press **F12** and open the **Network** tab.
2. Submit a quote once normally. Find the `formsubmit.co` request in the list, right-click it and choose **Block request domain**.
3. Submit another quote. The button shows "Still sending..." for a moment, then the normal success message.
4. Check the inbox: this one has **[backup]** in the subject and the design files attached. Pressing Reply answers the customer's address.
5. Right-click the blocked entry and choose **Unblock**, or just close DevTools.

Without a browser you can also post straight to the script. In PowerShell use `curl.exe`, not `curl`:

```
curl.exe -L -X POST -H "Content-Type: text/plain" --data "{\"first_name\":\"Test\",\"last_name\":\"Person\",\"email\":\"you@example.com\",\"project_name\":\"Curl test\",\"notes\":\"hello\",\"files\":[]}" "https://script.google.com/macros/s/AKfycb.../exec"
```

Expected reply: `{"ok":true,"attachments":0,"skipped":0}` and an e-mail in the inbox.

## Day to day

- **A "[backup]" e-mail means FormSubmit failed for that customer.** One now and then is normal. Several in a row means FormSubmit is having an outage. Nothing to do, the backup has it covered.
- **Limits.** Gmail allows about 100 script-sent e-mails per day, and the script refuses more than 20 requests per hour so a bot cannot burn the daily quota. The health URL (step 4) shows how many e-mails are left today.
- **Changing the script.** After editing `Code.gs` in the Apps Script editor: **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. The URL stays the same. Saving the file alone does not update the live deployment.
- **Changing the settings** (recipient, limits, allowed file types) is done at the top of `Code.gs`. Keep the copy in this repository in sync with what is deployed.

## Troubleshooting

| Symptom (browser console) | Cause | Fix |
|---|---|---|
| `Backup returned a non-JSON response` | Deployment access is not "Anyone", so Google answered with a sign-in page | Redeploy with **Who has access: Anyone** |
| `Backup rejected the request: Too many requests this hour` | Rate limit hit | Wait an hour, or raise `MAX_PER_HOUR` in `Code.gs` and redeploy |
| `Backup rejected the request: Missing required field(s)` | First name or e-mail empty | Only possible if form validation was bypassed; safe to ignore |
| `Script function not found: doPost` | Old deployment version is live | Deploy a new version (see above) |
| E-mail arrives but an attachment is missing | File type not in the allowed list, or over 5 MB | The e-mail lists skipped files and why; adjust `ALLOWED_TYPES` or `MAX_FILE_BYTES` if needed |
| FormSubmit fails but the backup is never tried | `backupUrl` still has the placeholder or does not start with `https://script.google.com/` | Check step 5 in both files |
