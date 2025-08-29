import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { cart } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map(item => ({
        price: item.id,   // Use Stripe Price IDs (not Product IDs)
        quantity: item.qty
      })),
      mode: "payment",
      success_url: "https://forgebunker.com/success",
      cancel_url: "https://forgebunker.com/cancel"
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
}
