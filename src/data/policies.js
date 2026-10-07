// Sample policy copy for the demo build. Replace with reviewed text before launch.
export const POLICY_ORDER = ['shipping', 'returns', 'privacy', 'terms'];

export const policies = {
  shipping: {
    nav: 'Shipping',
    lines: ['Shipping &', 'delivery.'],
    note: 'When your box leaves us and when it reaches you.',
    sections: [
      {
        title: 'Dispatch',
        body: ['Orders are packed and dispatched within 24–48 hours of being placed, Monday to Saturday.'],
      },
      {
        title: 'Delivery time',
        body: ['Most metro addresses receive their order within 3–5 business days of dispatch. Other locations can take a little longer.'],
      },
      {
        title: 'Shipping charges',
        body: ['Shipping is free on orders above ₹500. Below that, the charge is shown at checkout before you place the order.'],
      },
      {
        title: 'Tracking',
        body: ['Once your order ships you can follow it on the Track Order page using your order number.'],
        link: { to: '/track', label: 'Track an order' },
      },
      {
        title: 'Address changes',
        body: ['Need to correct an address? Write to us before the order is dispatched and we will update it.'],
      },
    ],
  },
  returns: {
    nav: 'Returns',
    lines: ['Returns &', 'refunds.'],
    note: 'What happens if something arrives wrong.',
    sections: [
      {
        title: 'Food items',
        body: ['Our snacks are perishable food items, so we cannot accept returns once an order has been delivered.'],
      },
      {
        title: 'Damaged or incorrect orders',
        body: [
          'If your order arrives damaged, or is not what you ordered, contact us within 24 hours of delivery with your order number and a photo.',
          'We will send a replacement or refund the affected items.',
        ],
      },
      {
        title: 'Cancellations',
        body: ['You can cancel an order any time before it is dispatched. Once it has shipped it can no longer be cancelled.'],
      },
      {
        title: 'Refunds',
        body: ['Approved refunds go back to the original payment method.'],
      },
    ],
  },
  privacy: {
    nav: 'Privacy',
    lines: ['Privacy', 'policy.'],
    note: 'What we collect, and what we do with it.',
    sections: [
      {
        title: 'What we collect',
        body: ['The details you give us when you order or write to us: your name, phone number, email address and delivery address.'],
      },
      {
        title: 'How we use it',
        body: ['To pack and deliver your order, to keep you updated about it, and to answer your questions. We do not sell your details.'],
      },
      {
        title: 'Your cart',
        body: ['Your cart is saved in your browser’s local storage so it is still there when you come back. Clearing your browser data removes it.'],
      },
      {
        title: 'Your choices',
        body: ['You can ask us for a copy of the details we hold about you, or ask us to delete them, at any time.'],
      },
    ],
  },
  terms: {
    nav: 'Terms',
    lines: ['Terms of', 'service.'],
    note: 'The ground rules for using this site.',
    sections: [
      {
        title: 'Using this site',
        body: ['By browsing or ordering here you agree to these terms. Please do not misuse the site or interfere with how it works.'],
      },
      {
        title: 'Products and prices',
        body: ['Prices are in Indian Rupees and include applicable taxes. Product details, prices and offers can change without notice.'],
      },
      {
        title: 'Orders',
        body: ['An order is confirmed once you receive an order number. We may cancel an order if an item is unavailable, and will refund it in full.'],
      },
      {
        title: 'Content',
        body: ['The Naastha name, logo, pack artwork, photography and text on this site belong to Naastha and may not be reused without permission.'],
      },
    ],
  },
};
