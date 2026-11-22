# AgrosChain Africa: live tracking setup

Pages: index.html (landing), track.html (wholesaler map), driver.html (driver's phone).

## Try it now (demo mode)
Open track.html and tap "Run demo route" for a simulated Kano to Lagos trip.

## Real phone-to-laptop tracking (about 5 minutes)
1. Go to console.firebase.google.com, create a project, then Build > Realtime Database > Create database (start in test mode).
2. Copy the database URL (looks like https://xxxx-default-rtdb.firebaseio.com) into FIREBASE_DB_URL in config.js.
3. Host the folder over HTTPS (Netlify, Vercel, GitHub Pages, or your agroschainafrica.ng host). Phone GPS only works on HTTPS.
4. On the phone open driver.html?trip=AF-2041 and tap Start trip. On a laptop open track.html?trip=AF-2041.

## Security note
Test-mode Firebase rules are open to anyone. Fine for a demo; before real use, add rules/authentication and unguessable trip IDs.
