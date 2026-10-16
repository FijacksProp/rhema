"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="wrap editorial-section"><span className="eyebrow">RHEMA CHAPEL</span><h1>Let’s try<br /><em>that again.</em></h1><p>We couldn’t load this page. Please try again in a moment.</p><button className="button button-ink" type="button" onClick={reset}>Try again</button></section>;
}
