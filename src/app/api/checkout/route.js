import { z } from "zod";
import { parsePrice } from "@/features/cart/lib/cart-utils";
import { shopProducts } from "@/features/shop/data/parts-catalog";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        sku: z.string().min(1),
        quantity: z.coerce.number().int().positive().max(99),
      })
    )
    .min(1)
    .max(50),
});

const productsBySku = new Map(shopProducts.map((product) => [product.sku, product]));

export async function POST(request) {
  try {
    const payload = checkoutRequestSchema.safeParse(await request.json());

    if (!payload.success) {
      return Response.json({ error: "Your cart data is invalid." }, { status: 400 });
    }

    // Rebuild Stripe line items from the trusted server-side catalog instead of client prices.
    const lineItems = payload.data.items.map((item) => {
      const product = productsBySku.get(item.sku);

      if (!product) {
        throw new Error(`Unknown cart item: ${item.sku}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `${product.category} for ${product.compatibleBrand} ${product.compatibleModel}`,
            metadata: {
              sku: product.sku,
              compatibleBrand: product.compatibleBrand,
              compatibleModel: product.compatibleModel,
            },
          },
          unit_amount: Math.round(parsePrice(product.price) * 100),
        },
        quantity: item.quantity,
      };
    });

    const origin = request.nextUrl.origin;
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/cart?checkout=success`,
      cancel_url: `${origin}/cart?checkout=cancelled`,
      line_items: lineItems,
      billing_address_collection: "auto",
      metadata: {
        cartType: "parts",
        itemCount: String(payload.data.items.length),
      },
    });

    if (!session.url) {
      return Response.json({ error: "Stripe did not return a checkout URL." }, { status: 500 });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Unknown cart item:")) {
      return Response.json({ error: "One of the cart items is no longer available." }, { status: 400 });
    }

    console.error("Failed to create Stripe Checkout session.", error);

    return Response.json(
      { error: "Stripe Checkout is unavailable right now. Please try again in a moment." },
      { status: 500 }
    );
  }
}
