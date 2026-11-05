import React from "react";
import type { Metadata, Viewport } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./nextra-theme-vars.css";
import "./style.css";

/**
 * Nextra 4 has no `theme.config.tsx`. Everything the old config held is now
 * passed as props to `<Layout>` / `<Navbar>` below, and the page title suffix —
 * which Nextra 3 supplied itself — comes from Next.js' metadata API.
 *
 * Note there is no `<Head>` from `nextra/components` here, and so no <head>
 * element of our own: rendering one breaks hydration under the App Router. See
 * `app/nextra-theme-vars.css`, which carries what that component would emit.
 */
export const metadata: Metadata = {
    title: {
        default: "Doenet Documentation",
        template: "%s – Doenet Documentation",
    },
};

/** The `<meta name="theme-color">` tags `<Head>` from `nextra/components` emits. */
export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "rgb(250,250,250)" },
        { media: "(prefers-color-scheme: dark)", color: "rgb(17,17,17)" },
    ],
};

const navbar = (
    <Navbar
        logo={<span>Doenet Documentation</span>}
        projectLink="https://github.com/Doenet/DoenetML"
    />
);

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            dir="ltr"
            // Required by `next-themes`, which sets the theme class on <html>
            // after hydration.
            suppressHydrationWarning
        >
            <body>
                <Layout
                    navbar={navbar}
                    footer={<Footer />}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/Doenet/DoenetML/tree/main/packages/docs-nextra"
                    sidebar={{ defaultMenuCollapseLevel: 1 }}
                    feedback={{
                        content: "Questions? Discuss in our community forum.",
                        link: "https://community.doenet.org",
                    }}
                >
                    {children}
                </Layout>
            </body>
        </html>
    );
}
