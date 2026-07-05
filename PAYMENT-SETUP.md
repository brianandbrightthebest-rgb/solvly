# Solvly — How Orders & Payments Work

## How it works right now (already live, $0 cost)
1. Customer adds products to cart and fills out the checkout page.
2. The order (items, total, shipping address) lands in **brianandbrightthebest@gmail.com** via FormSubmit.
3. You reply to the customer with a way to pay (PayPal request, Stripe invoice, etc.).
4. Once paid, you order the item from your supplier and ship to their address.

> ⚠️ **One-time activation:** the FIRST order ever submitted will trigger an email from
> formsubmit.co asking you to activate the form. Click the confirmation link once and
> every future order will arrive normally. Do a test order yourself to trigger this!

## Upgrading to instant card checkout (when you're ready)
1. Create a free account at https://stripe.com (needs an adult's ID + bank account —
   ask a parent/guardian if you're under 18).
2. In Stripe: **Payment Links → New** — create one link per product (set the product
   name, price, and enable "Let customers adjust quantity").
3. Open `js/data.js` and paste each link into that product's `payLink` field:
   ```js
   payLink: "https://buy.stripe.com/xxxxx",
   ```
4. Push the change (or ask Claude to). A "Buy Now — Secure Card Checkout" button
   appears automatically on that product's page.

Stripe has no monthly fee — they take ~2.9% + 30¢ per sale.

## Other notes
- Product photos are from Unsplash (free license). When you lock in suppliers,
  replace `assets/img/p-*.jpg` with the supplier's real photos so customers see
  exactly what ships.
- The reviews in `js/data.js` are EXAMPLES. Replace them with real customer
  feedback before running ads — fake reviews can get a store blacklisted.
