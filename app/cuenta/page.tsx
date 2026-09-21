import type { Metadata } from "next";
import { AccountOverview } from "@/components/account/account-overview";

export const metadata: Metadata = {
  title: "Tu cuenta",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <div className="page pt-28 pb-24 lg:pt-32">
      <AccountOverview />
    </div>
  );
}
