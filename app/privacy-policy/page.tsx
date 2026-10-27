import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Privacy Policy — PixelKit",
  description: "Learn how PixelKit handles privacy, browser-based image processing, advertising, and your choices.",
  alternates: { canonical: `${siteUrl}/privacy-policy` },
  openGraph: {
    type: "website", url: `${siteUrl}/privacy-policy`, title: "Privacy Policy — PixelKit",
    description: "How PixelKit handles privacy, browser-based image processing, and advertising.", siteName: "PixelKit",
  },
  twitter: {
    card: "summary", title: "Privacy Policy — PixelKit",
    description: "How PixelKit handles privacy, browser-based image processing, and advertising.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="privacy-page">
      <span className="eyebrow">YOUR PRIVACY MATTERS</span>
      <h1>Privacy policy</h1>
      <p>Last updated: October 26, 2026</p>
      <h2>Your images stay on your device</h2>
      <p>PixelKit image tools process selected files locally in your web browser using browser-native file reading and canvas features. Image contents are not uploaded to PixelKit servers for conversion or compression. Preview and converted image URLs are temporary browser resources; they are released when you remove a file, clear the queue, or leave the page. Downloads are initiated by you.</p>
      <h2>Advertising and cookies</h2>
      <p>PixelKit may display advertisements, including Google AdSense, when an eligible publisher account is configured. Advertising providers may use cookies or similar technologies to serve, measure, and personalize ads subject to your location, consent choices, provider policies, and browser settings. Advertising is independent of image processing; image contents are not used by PixelKit to select ads. An advertisement slot may remain empty when ads are unavailable or not configured.</p>
      <p>Where required, consent choices and personalized advertising are handled through the applicable consent mechanism. You can manage cookies in your browser settings and review Google&apos;s advertising and privacy information in Google&apos;s own policies.</p>
      <h2>Information and hosting</h2>
      <p>Our hosting provider may process routine technical information, such as a request&apos;s IP address, browser details, and requested URL, to deliver and protect the site. This information is handled by the relevant service providers under their policies. PixelKit does not require an account to use its tools.</p>
      <h2>Security and your choices</h2>
      <p>Local processing reduces the need to transmit image content, but no website or device can promise absolute security. Use a trusted, up-to-date browser and do not open files you do not trust. You can stop processing, remove files from the queue, or close the page at any time.</p>
      <h2>Changes and contact</h2>
      <p>This policy may be updated as the service changes. The revision date above identifies the latest version. For privacy questions, contact the site operator using the contact details provided by the service where you access PixelKit.</p>
      <p><Link href="/">Return to PixelKit image tools</Link></p>
    </main>
  );
}
