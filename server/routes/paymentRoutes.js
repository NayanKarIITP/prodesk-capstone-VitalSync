import express from "express";
import Stripe from "stripe";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET);

router.post("/checkout", protect, async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "VitalSync Pro Upgrade"
            },
            unit_amount: 5000 // $50
          },
          quantity: 1
        }
      ],

      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel"
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ msg: "Stripe error" });
  }
});

export default router;