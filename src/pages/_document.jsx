import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      {/* <meta
          property="og:title"
          content="AI Dashboard Reviewer"
        />
        <meta
          property="og:description"
          content="Receive an AI data powered review of your dashboard to improve readability, usage, and understandability."
        />
        <meta
          property="og:image"
          content="https://reviewmydashboard.visionlabs.com/reviewmydashboard.jpg"
        />
        <meta property="og:url" content="https://reviewmydashboard.visionlabs.com/" /> */}

        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K5LSDQD9');
            `,
          }}
        />
        <link rel="icon" href="/Vision Labs Icon2.png" />
      </Head>

      <body>
        <noscript><iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-K5LSDQD9"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        /></noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
