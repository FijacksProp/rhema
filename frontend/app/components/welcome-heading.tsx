export function WelcomeHeading({ heading = "WELCOME", accent = "home." }: { heading?: string; accent?: string }) {
  return <div className="welcome-heading">
    <h1><span className="welcome-word">{heading}</span><br /><em className="home-word">{accent}</em></h1>
  </div>;
}
