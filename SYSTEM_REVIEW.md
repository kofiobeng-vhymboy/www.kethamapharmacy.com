# Kethama Pharmacy system review

Reviewed: 13 October 2026

Application source was reviewed without implementing fixes. The review generated production build output and used temporary browser interactions with dummy data. No messages were sent to the pharmacy, and nothing was uploaded to GitHub or Vercel.

## Checks and limits

- TypeScript check (`npm run lint`): passed. This script runs TypeScript; it is not an ESLint or accessibility audit.
- Production build (`npm run build`): passed outside the filesystem sandbox. The sandbox's directory-access errors were environmental, not a failing application build.
- Browser inspection covered the main routes and representative layouts at 320, 375, 768, 1024, and 1440px widths. Short-height assistant testing used 375×568; consultation/calendar testing used 375×667.
- Browser checks confirmed product dialog rendering, calendar clipping, assistant clipping, product overlay hit-testing, article colors, and bookmark reset behavior.
- Dependency audit: five reported vulnerabilities, with fixes available. See the dependency finding below.
- Real iOS/Android devices, mobile keyboards, WhatsApp message delivery, and a deployed Vercel installation were not tested. This review cannot certify every device/browser combination.

## Fix before sharing the preview

### 1. Service images are missing from the production build — high priority

Evidence: [data.ts](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/data.ts:467>) uses literal `/src/assets/images/...` URLs for all three services. The generated `dist` contains the two imported homepage JPEGs, JavaScript, CSS, and HTML; none of the service PNGs are included.

Impact: service-page images and the service-dialog photos will fail when the production output is deployed, despite working in development.

Suggested fix: import the image assets so Vite packages them, or move them to the public asset directory and reference public URLs. Compress the service images: each current PNG is approximately 2.1–2.2 MB. Verify the production preview after changing the asset references.

### 2. Service enquiries do not reach the pharmacy — high priority

Evidence: [ServiceModal.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/components/ui/ServiceModal.tsx:106>) calls `createServiceRequest`. [mockApi.ts](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/lib/mockApi.ts:69>) only adds the request to a module-level array. The dialog nevertheless says “Inquiry Sent!” and promises that the team will contact the user.

Impact: the pharmacy receives no enquiry; refreshing discards the request. This affects the Services page even though product enquiries and consultation requests use WhatsApp.

Suggested fix: connect service enquiries to the shared WhatsApp handoff and describe the handoff accurately. This supports the current showcase model without requiring the backend first.

Additional observation: the browser review used a local network HTTP URL, where `crypto.randomUUID` was unavailable and the form showed a raw technical error. HTTPS deployment avoids that particular secure-context limitation, but the memory-only delivery problem remains.

### 3. Product image-overlay controls do not receive taps — high priority

Evidence: [Vitamins.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/pages/Vitamins.tsx:323>) gives the product image `z-[1]`, while the overlay containing Quick View and WhatsApp controls has no higher stacking order. Browser hit-testing at the Quick View button's center returned the Wellman product `IMG`, not the button. Home uses the same pattern.

Impact: the image intercepts interactions intended for the overlay controls. The separate Details and enquiry buttons beneath the image still provide another route to those actions.

Suggested fix: place the interaction overlay above the image and provide visible, accessible controls for touch and keyboard users.

### 4. WhatsApp assistant is clipped on small phones — high priority, mobile

Evidence: [WhatsappAssistant.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/components/ui/WhatsappAssistant.tsx:41>) anchors a fixed 320px panel 24px from the right, without a viewport-based width or height limit. At 320px screen width, its form extended approximately 39px past the left edge. At 375×568, the panel started approximately 108px above the viewport.

Impact: text, the header, and the close button can be clipped or inaccessible. The on-screen keyboard could reduce available height further.

Suggested fix: constrain width to the available viewport, cap height using dynamic viewport units, and make the panel body scroll independently. Check dropdown visibility and keyboard-open behavior on real phones.

### 5. Consultation calendar header is clipped — high priority, mobile

Evidence: [index.css](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/index.css:504>) positions the calendar above its trigger inside an overflowing scroll container. At 375×667, the calendar began at approximately y=197 while the scroll viewport began at y=229. The month label and navigation controls were visibly clipped under the fixed dialog header.

Impact: changing the calendar month is difficult in that layout. The topic/time dropdowns use the same upward-positioning pattern and should be checked during the fix.

Suggested fix: position overlays outside the clipping scroll container and choose their direction based on available space, or use an inline calendar layout on small screens.

### 6. Health Hub headings and actions have poor contrast — medium priority

Evidence: [HealthHub.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/pages/HealthHub.tsx:120>) applies the earlier color-tile text palette even though every card now has a photo and dark overlay. Browser inspection found coral text (`rgb(220,117,106)`) on the sleep card and dark teal text (`rgb(8,104,107)`) on the balanced-plate card. Titles, author text, and More info actions inherit those colors.

Impact: some cards are substantially harder to read than others.

Suggested fix: use consistent high-contrast foreground colors across image-backed tiles and verify each image/overlay combination.

### 7. Desktop navigation switches on too early — medium priority, tablet

Evidence: [Navbar.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/components/layout/Navbar.tsx:72>) enables the full navigation at 768px with 32px gaps. At 768px, Home touched the logo, and Products & Essentials and Health Hub wrapped to two lines. The header grew to 80px while most pages reserve 64px for it.

Suggested fix: keep the mobile menu until the complete header comfortably fits, then adjust navigation spacing and the page's header offset together.

## Other functional issues

### 8. Article bookmarks disappear immediately — medium priority

Evidence: [ArticleModal.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/components/ui/ArticleModal.tsx:85>) resets saved state whenever the selected article changes, including closing it. The browser test saved an article, closed it, reopened it, and found the Save button unselected. The success text claims it is saved for the browser session.

Suggested fix: store saved article IDs in shared session state or persistent browser storage, and make the label match the actual persistence.

### 9. Shared articles cannot open the selected article — medium priority

Evidence: [ArticleModal.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/components/ui/ArticleModal.tsx:92>) shares the current page URL, which remains `/health-hub` while an article is open. Homepage article cards similarly link to the general Health Hub.

Suggested fix: give articles stable URLs or an article-ID query parameter; restore the selected article from the URL when the recipient opens it. Make the homepage article links use the same mechanism.

### 10. Navbar search-result selection loses product context — medium priority

Evidence: [Navbar.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/components/layout/Navbar.tsx:169>) links every result to `/vitamins`, even though the result says “View product details.” The selected product ID and query are not passed along.

Suggested fix: open or identify the selected product using its ID in the destination URL. Keep search queries synchronized with the catalog URL, including when the query parameter is removed.

### 11. Saved browser data can crash app startup — medium priority

Evidence: [WishlistContext.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/context/WishlistContext.tsx:16>) and [AuthContext.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/context/AuthContext.tsx:25>) parse browser storage without error handling or shape validation. Both providers wrap the whole application, even with authentication pages removed.

Impact: malformed JSON or an unexpected stored value can break rendering; denied or exhausted storage can also throw during persistence.

Suggested fix: guard reads/writes, validate stored data, recover to safe defaults, and remove inactive demo authentication where it is no longer needed.

### 12. Navigation scroll handling has two edge cases — medium priority

Evidence: [App.tsx](<C:/Users/HP/Desktop/Kethama Pharmacy Ltd/src/App.tsx:24>) only scrolls when pathname, query, or hash changes. Tapping the active page's navigation link therefore does not return the reader to the top. It also passes the URL hash directly to `querySelector`, which throws for invalid selectors such as `#1`.

Suggested fix: explicitly handle active-link taps and resolve anchor IDs safely, including malformed or encoded hashes.

### 13. Form and assistant accessibility needs attention — medium priority

Evidence: service phone validation only checks for a nonempty string; the consultation form accepts arbitrary nonempty telephone input. The assistant's Your Message label is not associated with its textarea. Its topic menu lacks the fuller keyboard handling already implemented by the consultation dropdown.

Suggested fix: validate contact information, associate labels and errors with their controls, and implement consistent Escape/arrow-key/focus behavior. Service and consultation inputs use 14px text; check iOS focus zoom with the real mobile keyboard.

## Dependencies, performance, and deployment preparation

- **Dependency audit:** five findings with fixes available: `proxy-addr` critical, `source-map-js` high, `express` and `qs` moderate, and `esbuild` low. Several belong to unused server packages or tooling. No running Express backend was found, so this is not proof of a remotely exploitable critical flaw in the static website. Remove unused packages or update affected dependency chains, then rerun the audit and build. Do not blindly apply breaking audit fixes.
- **Bundle size:** production JavaScript is approximately 697 KB, or 211 KB gzip. Vite warns that it exceeds 500 KB. Route-level lazy loading and splitting large dependencies would reduce the initial mobile download.
- **Remote image resilience:** product and article images depend on external hosts. Some were still loading during inspection; no complete list of permanently broken remote URLs was established. Product cards hide failed images without showing a fallback. Add graceful fallbacks and evaluate lazy loading/local approved image assets.
- **Business copy:** “Online & Active” is hardcoded; no presence service is connected. The consultation sidebar also advertises a zero fee and absolute confidentiality, and About describes mobile diagnostic testing. Confirm these statements with the business before publishing; use accurate wording where availability or fees are not established.
- **Article printing:** the print CSS makes the article overlay part of the normal document without hiding the surrounding page. Printing should be checked and scoped to the selected article.
- **GitHub:** this folder is not currently a Git repository. Initialize and review the files to be tracked as part of the later upload task; `.gitignore` already excludes dependencies, build output, and local environment files.
- **Vercel:** the actual deployment has not been tested. Verify direct navigation and refresh on `/services`, `/vitamins`, `/health-hub`, and the privacy route in the deployed preview, along with production image URLs and WhatsApp handoff.

## Recommended order

1. Fix production service assets, service-enquiry delivery, and blocked product controls.
2. Fix the assistant/calendar mobile clipping, tablet navigation, and article contrast.
3. Fix article/search/navigation persistence and browser-storage handling.
4. Address dependency findings, image resilience, and initial-load size.
5. Review business copy, then run a production-preview and real-phone check before the GitHub/Vercel task.

Implementation authorized and completed in the subsequent task. See `IMPLEMENTATION_STATUS.md` for the fixes, verification results, and remaining launch checks. This document preserves the original audit findings.
