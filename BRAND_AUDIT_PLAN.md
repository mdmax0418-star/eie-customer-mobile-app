# EIE AUTO REGISTRATION Brand Audit Plan

Audit date: June 13, 2026  
Assets reviewed:

- `BRAND_IDENTITY.md` from the workspace
- Live website: `https://eie-customer-app.onrender.com`
- Mobile app source in this repository, focused on `src/screens/LoginScreen.tsx`, `src/screens/NewRequestScreen.tsx`, and related customer-facing flow in `App.tsx`

## Brand identity summary

EIE should feel like the antidote to the DMV: fast, simple, expert-led, and reassuring. The brand sells **time and peace of mind**, not just a submitted form. Every customer-facing touchpoint should speak to busy professionals and small business owners who want a do-it-for-me vehicle registration partner that is professional, efficient, clear, proactive, and calm.

Core messaging to reinforce:

- Primary tagline: **EIE AUTO REGISTRATION: Your Time Back.**
- Secondary tagline: **The DMV, Without the DMV.**
- Professionals: **Professional Vehicle Services for Busy Professionals.**
- Businesses: **Focus on your business. We'll handle the fleet.**

## Overall findings

The current experience is functional but under-branded. Both the website and app ask customers to submit a request, but they do not yet explain the customer benefit, reduce anxiety, or set expectations for what happens next. The website is the biggest alignment gap: it looks like a basic intake form instead of a premium, trusted service for high-value customers. The mobile app is visually more polished, but several copy choices are generic or internally oriented, and one authenticated customer state currently displays an admin-access warning before the customer form.

## Prioritized brand alignment changes

| Priority | Asset | Issue | Recommended solution |
| --- | --- | --- | --- |
| P0 | Website homepage headline/subheadline | `EIE Auto Registration` + `Submit Your Service Request` is accurate but transactional. It does not communicate EIE's promise of saving time or avoiding the DMV. | Change hero messaging to: **The DMV, Without the DMV.** Subcopy: **Upload your documents in minutes. EIE handles the registration process and keeps you updated from start to finish.** Keep `EIE AUTO REGISTRATION: Your Time Back.` as a supporting brand line near the logo or header. |
| P0 | Website form flow | The page jumps directly into fields with no reassurance, no process explanation, and no expectation-setting. This makes the service feel like an unassisted government form. | Add a short three-step section above the form: **1. Tell us what you need. 2. Upload your documents. 3. We handle the DMV and keep you updated.** Add a trust line: **Not sure which documents you need? Send what you have. We'll follow up if anything is missing.** |
| P0 | Mobile `App.tsx` authenticated non-admin state | Customers can see **Admin access required** before the request form. This is confusing, internally focused, and not reassuring. | Remove the admin warning from the customer flow. Route non-admin customers directly to `NewRequestScreen`. If admin gating is needed, keep it only inside the admin dashboard path. |
| P0 | Mobile `NewRequestScreen.tsx` success alert | Current success message exposes implementation details: `Documents uploaded: 0`. It confirms receipt but does not reassure the customer about next steps. | Replace with: **Request received** / **Your submission ID is #{id}. Our team will review your request and contact you if anything else is needed.** This is clear, proactive, and calm. |
| P0 | Website submission confirmation in `script.js` | Confirmation says only `Thank you` and an ID. It does not tell the customer what happens next. Error state is generic and only uses browser alerts. | Update success message to: **Request received. Your submission ID is #{id}. EIE will review your documents and contact you if we need anything else.** Add inline success/error UI on the page instead of alert-only feedback. |
| P1 | Website visual design | The site uses generic Arial, simple grey backgrounds, square controls, and a single form card. It looks functional but not premium or confidence-building for busy professionals and fleet owners. | Introduce a lightweight brand design system: professional blue, white card surfaces, soft neutral background, larger spacing, rounded controls, clear hierarchy, and a system font stack or Inter-style font. Add a concise header area with logo/brand line, hero copy, and form card. |
| P1 | Website CTA button | `Submit Request` is clear but bureaucratic and generic. | Change to **Send My Request** or **Start My DMV-Free Request**. Recommendation: use **Send My Request** for the form button because it is clear and low-friction; use **Start My DMV-Free Request** as a hero CTA if a landing section is added. |
| P1 | Mobile `LoginScreen.tsx` title/subtitle | `Welcome back` and `Sign in to the EIE Customer Portal to submit service requests.` are generic and do not reinforce the brand promise. | Change title to **Your time back starts here** or **Welcome back to EIE**. Change subtitle to: **Sign in to manage your vehicle service requests without the DMV runaround.** |
| P1 | Mobile `NewRequestScreen.tsx` title/description | `New Service Request` and the description are clear, but they do not emphasize speed, simplicity, or reassurance. | Change title to **Start a DMV-Free Request**. Change description to: **Tell us what you need, upload what you have, and we'll guide the registration process from here.** |
| P1 | Website and mobile service list | Current services cover standard individual needs but do not directly address the business/fleet persona from the brand identity. | Add a clearly labeled option for **Fleet or Commercial Registration Help** if supported operationally. If not yet supported, add website copy for businesses: **Managing multiple vehicles? Contact EIE for fleet registration support.** |
| P1 | Website document upload field | Native `Choose Files` control has no context, accepted file guidance, or reassurance. | Add upload help text: **Upload registration documents, ID, title paperwork, or supporting photos. PDF, JPG, and PNG are accepted.** Add: **You can still submit if you are unsure which files are required.** |
| P1 | Mobile upload guidance | The app says documents are optional and lists file types, but it does not explain what customers should upload or reassure uncertain customers. | Change upload help to: **Upload registration documents, ID, title paperwork, or supporting photos. Not sure? Send what you have — we'll follow up if anything is missing.** |
| P2 | Website form labels | Labels include trailing colons and have a utilitarian government-form feel. Required fields are not clearly marked except browser validation. | Use clean labels without colons: **Service needed**, **Documents**, **Full name**, **Phone number**. Mark required fields and add short helper text where useful. |
| P2 | Mobile form labels and placeholders | Labels are clear but generic. Placeholders repeat labels and do not add guidance. | Use labels like **Service needed** and placeholders like **Choose the vehicle service you need**. For phone: **Best phone number for updates** to reinforce proactive communication. |
| P2 | Website validation/error behavior | The website validates service selection with an alert and relies on browser required fields for name/phone. This feels abrupt and less polished. | Add inline validation messages under each field and disable the submit button while submitting. Use reassuring language: **Please choose the service you need so we can route your request correctly.** |
| P2 | Mobile error handling | Error text displays raw error messages when available. These may be technical or not brand-safe. | Wrap technical errors in customer-friendly language. Example: **We couldn't submit your request just now. Please try again, or contact EIE if the issue continues.** Keep raw error details available only in logs. |
| P2 | Website trust/proof content | The website does not mention speed, expertise, proactive updates, or complex-case confidence. | Add a compact trust strip below the hero or form: **Fast processing**, **Expert document review**, **Clear updates**, **No DMV line**. |
| P2 | Mobile loading states | Loading states are present, but copy is generic (`Loading submissions…`) and mostly admin-oriented. | For customer-facing loads, use reassuring text such as **Getting your request ready…** or **Securely submitting your request…** |
| P3 | Website footer/contact | The website has no visible contact, business hours, privacy reassurance, or support path. | Add footer content: **Questions? EIE can help confirm the right service before you submit.** Include approved contact method, privacy note, and business/fleet support line if available. |
| P3 | Mobile/admin status names | Status labels such as `Awaiting Documents` are understandable but could be more proactive for customers if exposed later. | If statuses become customer-facing, use friendlier status language: **Received**, **In Review**, **Need Documents**, **Processing**, **Complete**. |
| P3 | README/onboarding documentation | Repository README is the default React Native template and does not document brand principles for contributors. | Add a short brand implementation note or link to `BRAND_IDENTITY.md` and this audit plan so future UI work preserves voice and messaging. |

## Website-specific recommended target copy

Suggested revised top-of-page content:

```text
EIE AUTO REGISTRATION: Your Time Back.

The DMV, Without the DMV.
Upload your documents in minutes. EIE handles the registration process and keeps you updated from start to finish.

How it works
1. Tell us what you need.
2. Upload your documents.
3. We handle the DMV and keep you updated.
```

Suggested revised form labels and CTA:

```text
Service needed
Documents
Full name
Best phone number for updates

Button: Send My Request
```

Suggested upload help text:

```text
Upload registration documents, ID, title paperwork, or supporting photos. Not sure what to include? Send what you have — we'll follow up if anything is missing.
```

Suggested success message:

```text
Request received. Your submission ID is #{id}. Our team will review your request and contact you if anything else is needed.
```

## Mobile app-specific recommended copy changes

### `src/screens/LoginScreen.tsx`

Current:

```text
Welcome back
Sign in to the EIE Customer Portal to submit service requests.
```

Recommended:

```text
Your time back starts here
Sign in to manage your vehicle service requests without the DMV runaround.
```

### `src/screens/NewRequestScreen.tsx`

Current:

```text
New Service Request
Submit your request and attach any registration documents, IDs, or supporting files.
```

Recommended:

```text
Start a DMV-Free Request
Tell us what you need, upload what you have, and we'll guide the registration process from here.
```

Current upload help:

```text
Optional · Up to 5 files · PDF, JPEG, PNG, WEBP, HEIC/HEIF
```

Recommended:

```text
Upload registration documents, ID, title paperwork, or supporting photos. Not sure? Send what you have — we'll follow up if anything is missing.
```

Current success alert:

```text
Request submitted
Your submission ID is {id}. Documents uploaded: {count}
```

Recommended:

```text
Request received
Your submission ID is #{id}. Our team will review your request and contact you if anything else is needed.
```

### `App.tsx`

Current customer-authenticated behavior includes:

```text
Admin access required
This dashboard is only available to authenticated admin users.
```

Recommended: remove this message from the customer path and show `NewRequestScreen` directly for authenticated non-admin users.

## Visual direction

The current mobile UI is closer to the intended brand than the website: it uses cards, strong hierarchy, modern blue CTAs, and generous spacing. The website should be brought up to that same level of polish. Both assets should converge on a shared set of visual rules:

- Primary blue for CTAs and brand marks.
- Dark neutral text for confidence and readability.
- Soft neutral backgrounds with white cards.
- Rounded, touch-friendly controls.
- Short, benefit-driven headlines.
- Reassuring helper text near high-friction inputs like document upload.
- Inline feedback instead of abrupt browser alerts where practical.

## Recommended implementation order

1. Fix the mobile authenticated customer path so customers do not see admin-only language.
2. Replace website and mobile top-level copy with brand-promise messaging.
3. Update success/error states to include next steps and reassuring language.
4. Improve document upload guidance across website and mobile.
5. Add process/trust content to the website landing area.
6. Add business/fleet messaging if the service is currently offered.
7. Align labels, placeholders, CTA copy, and validation language.
8. Refresh website styling to match the more professional mobile app direction.
9. Document brand rules in the repository so future screens keep the same voice.
