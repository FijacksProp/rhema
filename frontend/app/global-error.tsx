"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return <html lang="en"><body style={{ margin: 0, background: "#faf8f4", color: "#152744", fontFamily: "system-ui, sans-serif" }}><main style={{ maxWidth: 600, margin: "15vh auto", padding: 32 }}><p>RHEMA CHAPEL · STADIUM CHURCH</p><h1>We’ll be back shortly.</h1><p>We couldn’t load the website. Please try again in a moment.</p><button type="button" onClick={reset} style={{ padding: "14px 24px", border: 0, borderRadius: 8, background: "#152744", color: "white", cursor: "pointer", marginTop: 20 }}>Try again</button></main></body></html>;
}
