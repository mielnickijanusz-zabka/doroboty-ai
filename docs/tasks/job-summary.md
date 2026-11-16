# Employer listing effect summary (IDEA7)

## Intent

Opportunity OPP4 from discovery: after a listing ends the employer cannot tell whether the purchase paid off and judges it by whether anyone worth an interview came. Simple first version: one page per listing showing what it produced up to the first conversation, with a clear next action ("Opublikuj kolejną rolę"). Prepared test (EXP7, concierge) is outside this prototype.

## Acceptance criteria

- `Moje oferty` shows a "Podsumowanie" action per listing; the route is employer-only and limited to the employer's own listings.
- The page shows applications, invitations, conversations, continuations with shares, time to the first conversation, and the statement that the portal has no hiring decision data.
- Numbers come from local application events and change after stage changes made through the existing employer flow.
- A prepared closed listing with 47 fictional applications (9 conversations, 5 continuations, 11 days) is available; its candidates do not appear in the person picker.
- Existing candidate/employer flows (apply, stage change, withdrawal) keep working.

## Simulation

The 47 applications and their dates are prepared fictional training data. No AI is involved; the page does not rate whether the purchase paid off.
