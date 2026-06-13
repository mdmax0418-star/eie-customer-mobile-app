# EIE AUTO REGISTRATION Brand Audit Plan

Audit date: 2026-06-13  
Audited assets: live website at `https://eie-customer-app.onrender.com` and React Native mobile app source in this repository.

## Brand standard used for this audit

EIE should consistently sell **time and peace of mind**: "the DMV, without the DMV." The experience should feel professional, efficient, clear, proactive, and reassuring for busy professionals and small business owners who need vehicle registration handled quickly and correctly.

## Executive summary

The current website and mobile app are functional, clean, and visually simple, but they read like generic request forms instead of a premium, expert-led DMV alternative. The biggest alignment gaps are:

1. The website's hero message is transactional (`Submit Your Service Request`) and does not communicate the core promise: saving time and avoiding the DMV.
2. The customer app currently shows non-admin users an `Admin access required` warning before the request form, which directly undermines trust.
3. Both channels lack reassuring process guidance: what to upload, what happens next, when EIE will respond, and how clients stay informed.
4. Neither channel speaks directly to the two priority personas: busy professionals and small business/fleet owners.
5. The visual system is acceptable but incomplete: blue/white is professional, yet there is no premium trust layer, brand tagline, benefits, proof points, or consistent message hierarchy.

## Priority brand alignment changes

| Priority | Asset | Current issue | Recommended solution |
|---|---|---|---|
| P0 | Mobile app `App.tsx` non-admin authenticated state | Customers who are not admins see `Admin access required` and `This dashboard is only available to authenticated admin users.` directly above the request form. This is confusing, non-reassuring, and suggests the customer is in the wrong product. | Remove the admin warning from the customer path. Route admins to `AdminDashboardScreen` and customers directly to `NewRequestScreen`. If role-specific messaging is needed, use `Welcome to EIE` / `Your vehicle service request starts here.` |
| P0 | Website homepage headline/subheadline | `EIE Auto Registration` + `Submit Your Service Request` is functional but does not express the brand promise or the anti-DMV positioning. | Change hero hierarchy to: **The DMV, Without the DMV.** Subheadline: `Professional vehicle registration services that save you time and keep the process clear from start to finish.` Keep `EIE AUTO REGISTRATION: Your Time Back.` as a supporting brand line. |
| P0 | Website request form intro | The form begins immediately with service selection. There is no reassurance, expected timeline, or explanation of what EIE will do. | Add a short reassurance panel above the form: `Tell us what you need. Upload your documents. EIE reviews everything and keeps you updated.` Add a microcopy line: `Not sure what to upload? Send what you have — we will follow up if anything is missing.` |
| P0 | Mobile app `NewRequestScreen` title and description | `New Service Request` and `Submit your request and attach any registration documents, IDs, or supporting files.` are clear but generic and do not sell time, confidence, or expert handling. | Update copy to: title `Your DMV task, handled.` Description: `Choose your service and upload the documents you have. EIE will review your request and keep you updated.` |
| P1 | Website submit button | `Submit Request` is serviceable but generic. It does not reinforce peace of mind or next action. | Change CTA to `Send My Request to EIE` or `Start My Registration Request`. Add disabled/loading text after submit: `Sending securely…` |
| P1 | Mobile app submit button | `Submit Request` is generic and does not align with the more concierge-like brand promise. | Change CTA to `Send Request to EIE`. During loading, use supporting text or accessibility label: `Sending your request securely.` |
| P1 | Website document upload | Native `Choose Files / No file chosen` looks unfinished and creates uncertainty about supported file types. | Replace with a styled upload area: `Upload documents` / `PDFs or photos are accepted. Registration card, ID, title, or notices are helpful.` Show selected file names and a `Remove` action. |
| P1 | Mobile app document upload | Upload copy says `Optional · Up to 5 files · PDF, JPEG, PNG, WEBP, HEIC/HEIF`, which is clear but technical. It does not explain useful document examples. | Keep supported formats but add practical guidance: `Helpful documents: registration card, title, ID, DMV notice, or plate/sticker photo.` |
| P1 | Website success and error states | The live page does not visibly communicate a reassuring post-submit process in the initial UX. If success/error states exist, they are not represented in the first-screen customer experience. | Add success state copy: `Request received. EIE will review your documents and contact you with next steps.` Include submission ID and expected response window. Error copy should be calm and actionable: `We could not send this yet. Please check your connection or call/text EIE for help.` |
| P1 | Mobile app submission success alert | `Your submission ID is ... Documents uploaded: ...` confirms the transaction but does not tell the customer what happens next. | Change alert to: title `Request received` body `EIE will review your request and contact you with next steps. Your submission ID is #...` Include `Documents received: ...` as secondary info. |
| P1 | Login screen `LoginScreen.tsx` headline and subtitle | `Welcome back` and `Sign in to the EIE Customer Portal to submit service requests.` are clean, but they miss the key promise and sound like a generic portal. | Use `Your Time Back.` as headline or supporting line. Suggested copy: title `Welcome back` subtitle `Sign in to manage your vehicle service request without the DMV visit.` |
| P1 | Login screen credential labels | `Username` may not match customer expectations if customers think in terms of phone/email. | If backend supports it, change label to `Email or username`. If not, add helper text: `Use the username provided by EIE.` This reduces uncertainty. |
| P1 | Website service options | Services are listed but not framed around outcomes. There is no business/fleet pathway for Carlos. | Add service option or separate card for `Fleet or Commercial Vehicle Support`. Add microcopy near service dropdown: `For multiple vehicles or commercial registrations, choose Fleet/Commercial Support or contact EIE.` |
| P1 | Mobile `SERVICES` list | Services mirror the website but omit fleet/commercial support and complex commercial needs from the brand identity. | Add `Fleet / Commercial Vehicle Support` if supported by the backend. If not yet supported, add a visible note: `Managing multiple vehicles? Contact EIE for fleet support.` |
| P2 | Website brand proof/benefits | The page has no trust-building claims or benefits for speed, convenience, expertise, and proactive communication. | Add three concise benefit cards below the hero or form: `Save the DMV trip`, `Handled by registration experts`, `Clear updates from start to finish.` |
| P2 | Mobile request screen process visibility | The mobile form has no step model or expectation-setting. | Add a 3-step strip near the top: `1. Send request` `2. EIE reviews` `3. We update you`. This reinforces proactive communication. |
| P2 | Website layout | The white card and blue CTA are clean, but the page feels like an internal form rather than a premium service landing page. | Use a stronger landing-page hierarchy: hero promise, two persona-specific value props, form card, reassurance/process footer. Preserve the simple form but wrap it in a more premium context. |
| P2 | Website typography | Browser-default form controls and simple styling feel less polished than the professional/premium audience expects. | Define a consistent type scale and font stack, e.g. `Inter`, `system-ui`, `-apple-system`, `Segoe UI`, with clear h1/h2/body/label sizes. Increase whitespace around sections and use consistent field heights. |
| P2 | Website colors | Blue and white feel professional, but the palette lacks formal semantic tokens and trust accents. | Establish brand tokens: primary blue, navy text, neutral background, success green, warning amber, error red. Use them consistently across website and app. |
| P2 | Mobile visual system | The app uses professional cards, shadows, and blue CTAs, but token values are duplicated across files. | Centralize brand colors, spacing, border radii, and typography in a shared theme file so website/app implementation stays consistent. |
| P2 | Mobile error messages | Errors often use raw exception messages when available. Raw errors can sound technical or alarming. | Wrap user-facing errors in calm, actionable copy: `We could not submit this yet. Please try again, or contact EIE if it continues.` Log technical details separately. |
| P2 | Mobile upload limit alert | `Document limit` / `You can upload up to 5 documents.` is clear but abrupt. | Use reassuring copy: `You can upload up to 5 files here. If you have more, EIE will request them after review.` |
| P2 | Website phone field | Only `Phone Number` is requested. The page does not explain why or what communication to expect. | Add helper text: `We will use this to confirm details and send updates about your request.` This supports the proactive/reassuring brand voice. |
| P2 | Mobile phone field | Same issue as website: phone is required without context. | Add helper text under phone input: `EIE uses this number for quick updates about your request.` |
| P3 | Website page title / metadata | Current browser title is `EIE Auto Registration - Service Request`, which is descriptive but not brand-led. | Update title to `EIE Auto Registration | The DMV, Without the DMV` and add meta description aligned to `Your Time Back.` |
| P3 | README / repository docs | README is the default React Native template and does not describe the EIE customer app or brand implementation expectations. | Replace or supplement with project-specific docs: app purpose, environments, brand tokens, core screens, and copy principles. |
| P3 | Mobile placeholder request list | `Request list screen placeholder` exists in `RequestListScreen.tsx`. If reachable later, it will feel unfinished. | Replace placeholder with either a finished customer status screen or remove it from customer navigation until ready. Use status language like `We are reviewing your request` / `Waiting on documents` / `Complete`. |

## Website audit details

### Customer-facing text reviewed

Current visible text on the live website:

- `EIE Auto Registration`
- `Submit Your Service Request`
- `Choose a Service:`
- `Select your service`
- `Registration Renewal`
- `Title Transfer`
- `Replacement Plates/Stickers`
- `VIN Verification`
- `Out-of-State Transfer`
- `Upload Documents:`
- `Choose Files`
- `No file chosen`
- `Full Name:`
- `Phone Number:`
- `Submit Request`

### Website alignment assessment

- **Professional:** Partially aligned. The page is simple and uncluttered, but the native file input and sparse layout feel utilitarian rather than premium.
- **Efficient:** Aligned. The form is short and fast.
- **Clear:** Partially aligned. Labels are understandable, but there is not enough guidance about document types, next steps, or expected response.
- **Proactive:** Not yet aligned. The page does not anticipate common questions or explain what happens after submission.
- **Reassuring:** Not yet aligned. There are no trust cues, process expectations, success promises, or expert positioning.

## Mobile app audit details

### Login screen text reviewed

- `EIE`
- `Welcome back`
- `Sign in to the EIE Customer Portal to submit service requests.`
- `Username`
- `Enter username`
- `Password`
- `Enter password`
- `Unable to sign in.`
- `Sign in`

### Submission screen text reviewed

- `EIE Auto Registration`
- `New Service Request`
- `Log out`
- `Submit your request and attach any registration documents, IDs, or supporting files.`
- `Choose a Service`
- `Select your service`
- `Upload Documents`
- `Select PDF or image files`
- `Optional · Up to 5 files · PDF, JPEG, PNG, WEBP, HEIC/HEIF`
- `Selected document`
- `Remove`
- `Size unavailable`
- `Full Name`
- `Enter your full name`
- `Phone Number`
- `Enter your phone number`
- `Submit Request`
- `Request submitted`
- `Your submission ID is ... Documents uploaded: ...`
- `Document limit`
- `You can upload up to 5 documents.`
- `Unable to select documents.`
- `Unable to submit request.`

### Mobile alignment assessment

- **Professional:** Mostly aligned visually; cards, spacing, and calm colors are good. Copy still needs more brand-specific confidence.
- **Efficient:** Aligned. The core request path is short.
- **Clear:** Partially aligned. The form is understandable, but document guidance and next steps should be clearer.
- **Proactive:** Partially aligned in admin status tooling, but the customer request flow does not yet show proactive update expectations.
- **Reassuring:** Needs improvement. Success, error, and upload guidance should be warmer and more confidence-building.

## Recommended implementation sequence

1. Fix customer routing copy in `App.tsx` so non-admin customers never see `Admin access required`.
2. Update website hero copy, metadata, CTA, upload component, and success/error states.
3. Update mobile login and request submission copy to use `Your Time Back`, `The DMV, Without the DMV`, and clear next-step reassurance.
4. Add upload helper text and phone-use helper text on both website and app.
5. Add fleet/commercial support entry point or guidance for small business owners.
6. Centralize visual design tokens for website/app consistency.
7. Add website benefit cards and mobile process indicators to communicate speed, expertise, and proactive communication.
8. Replace default repository README content with EIE-specific product and brand implementation documentation.

## Suggested copy bank

Use these phrases consistently where space allows:

- `The DMV, Without the DMV.`
- `EIE AUTO REGISTRATION: Your Time Back.`
- `Your DMV task, handled.`
- `Send your request. EIE handles the next steps.`
- `Upload what you have. We will follow up if anything is missing.`
- `EIE will review your request and keep you updated.`
- `Professional vehicle services for busy professionals.`
- `Focus on your business. We will handle the fleet.`
