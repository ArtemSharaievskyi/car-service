import { CartPageShell } from "@/features/cart/components/cart-page-shell";

export const metadata = {
  title: "Parts Cart",
};

export default async function CartPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const checkoutValue = Array.isArray(resolvedSearchParams.checkout)
    ? resolvedSearchParams.checkout[0]
    : resolvedSearchParams.checkout;
  const checkoutStatus =
    checkoutValue === "success" || checkoutValue === "cancelled" ? checkoutValue : undefined;

  return <CartPageShell checkoutStatus={checkoutStatus} />;
}
