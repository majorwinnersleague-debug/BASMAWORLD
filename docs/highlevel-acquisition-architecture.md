# BASMA 90-Day Client Acquisition + HighLevel Architecture

## Decision

Keep BasmaWorld.com as the primary public website and SEO property.

Use HighLevel as the acquisition CRM and marketing-automation layer once the HighLevel account/webhook/API access is connected.

Keep the existing operational systems in place:
- Neon: active students and lesson requests.
- Stripe: payment processing.
- Airtable: existing marketing/history workflows.
- PostHog: product/website analytics already present.

Do not migrate the whole website or operational database into HighLevel just for consolidation.

## Current website findings

The production site currently positions BASMA as a broader music academy and exposes private lessons alongside academy/group programming. The home page currently shows four private-lesson purchase options and routes prospects to /private-lessons.

The private-lessons flow currently:
1. Collects parent/contact and student details.
2. Lets the visitor select an individual or monthly package.
3. Creates a Stripe Checkout session.
4. Writes a lesson request to Neon when DATABASE_URL is available.
5. Writes a private-lesson request to Airtable when Airtable is configured.
6. Uses the Stripe webhook to mark paid requests and create/update an active student in Neon.

This is a strong payment/operations foundation, but it is not yet a full acquisition funnel because there is no dedicated pre-purchase marketing lead stage connected to a marketing CRM.

## Recommended funnel

Traffic
-> BASMAWorld private-lesson page or campaign landing page
-> lead capture
-> HighLevel CRM
-> immediate email/SMS response
-> booking/consultation
-> payment
-> Neon active student
-> retention/reactivation

For high-intent Google traffic, send prospects directly to a private-lesson conversion page.

For colder Meta traffic, use a lower-friction lead capture offer when appropriate and let HighLevel nurture the prospect before asking for payment.

## HighLevel responsibilities

HighLevel should own:
- Marketing lead records.
- Lead source/UTM attribution.
- Pipeline stages.
- Lead follow-up.
- SMS/email nurture.
- Booking/appointment workflow.
- Retargeting audiences where appropriate.
- Lead-to-client reporting.

Suggested pipeline:
1. New Lead
2. Contacted
3. Qualified
4. Booking Offered
5. Booked
6. Attended
7. Paid / New Student
8. Active Student
9. Nurture / Did Not Book

## Neon responsibilities

Neon should remain the operational system for:
- lesson_requests
- active_students

Do not make HighLevel the source of truth for active-student operational records.

## Stripe responsibilities

Stripe remains the payment processor.

A successful Stripe payment should continue to trigger the existing operational workflow that updates Neon and reconciles Airtable.

## Measurement

Track the full path:

source -> landing page visit -> lead -> qualified lead -> booking -> attendance -> payment -> customer acquisition cost -> revenue

Required attribution fields:
- source
- medium
- campaign
- content
- term
- landing page
- first-touch timestamp
- lead timestamp
- booking timestamp
- payment timestamp
- package
- revenue

## First 90-day test

### Month 1
- Finalize private-lesson offer/pricing.
- Remove outdated public group-program CTAs if the business is not currently selling them.
- Establish one primary private-lesson conversion path.
- Connect HighLevel.
- Add lead capture and automated response.
- Verify Stripe/Neon payment flow.
- Verify analytics and conversion events.
- Launch only high-intent Google Search testing initially.

### Month 2
- Review search terms and qualified-lead quality.
- Improve landing-page conversion.
- Test offer/messaging.
- Add simple Meta prospecting and retargeting if sufficient creative/data exists.
- Improve lead-to-booking follow-up.

### Month 3
- Scale only campaigns producing acceptable customer economics.
- Pause traffic sources producing poor-quality leads.
- Expand winning search themes/creative.
- Establish repeatable CAC and revenue reporting.

## Budget principle

Do not divide a small budget equally across Google, Meta, SEO, and retargeting.

Prioritize:
1. Conversion foundation.
2. High-intent Google Search.
3. Retargeting once there is enough traffic.
4. Meta prospecting after the conversion path has baseline data.
5. SEO as the compounding channel.

## Current implementation blocker

HighLevel access is not currently available through the connected development tools. The website can be prepared for HighLevel, but the actual HighLevel account connection, forms, pipeline, workflows, phone/SMS configuration, and attribution cannot be completed until the HighLevel account is connected or its approved integration credentials/webhook are supplied.

No production HighLevel dependency should be introduced until that connection is available.
