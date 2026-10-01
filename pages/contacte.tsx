import Layout from "@/components/_shared/Layout";
import { NextSeo } from "next-seo";
import { siteTitle } from "@/next-seo.config";
import HeroSection from "@/components/_shared/HeroSection";

export default function ContactePage() {
  return (
    <Layout>
      <NextSeo title={`Contacta amb nosaltres | ${siteTitle}`} />
      <HeroSection title="Contacta amb" titleAccent="nosaltres" />
      <main className="custom-container py-8">
        <div className="flex justify-center">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSeAmkb6p6ikMKEExSD8J1z0VdrrF2RxIaRldk0q3mUdeUpfdg/viewform?embedded=true"
            title="Formulari de contacte"
            width="100%"
            height="1644"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="w-full h-[1644px] border-0"
          >
            S&apos;està carregant…
          </iframe>
        </div>
      </main>
    </Layout>
  );
}
