import Image from "next/image";
import { ArrowUpRight, Instagram } from "lucide-react";
import { churchInstagram, imagery } from "../../lib/imagery";

export function PhotoStories() {
  return <section className="photo-stories" data-reveal>
    <div className="wrap">
      <div className="stories-heading"><div><span className="eyebrow">FAITH, EXPRESSED TOGETHER</span><h2>More than a moment.<br /><em>A life of worship.</em></h2></div><a className="text-link" href={churchInstagram} target="_blank" rel="noreferrer"><Instagram size={18} /> Follow the church <ArrowUpRight size={18} /></a></div>
      <div className="photo-mosaic">
        <figure className="mosaic-tall"><Image {...imagery.prayer} fill sizes="(max-width: 760px) 60vw, 40vw" /><figcaption><span>01 / PRAISE</span><strong>Hearts lifted.</strong></figcaption></figure>
        <figure className="mosaic-wide"><Image {...imagery.choir} fill sizes="(max-width: 760px) 100vw, 45vw" /><figcaption><span>02 / TOGETHER</span><strong>Room for another voice.</strong></figcaption></figure>
        <div className="mosaic-quote"><span aria-hidden="true">“</span><p>Let every thing that hath breath praise the LORD.</p><small>PSALM 150:6 · KJV</small></div>
        <figure className="mosaic-small"><Image {...imagery.community} fill sizes="(max-width: 760px) 50vw, 25vw" /><figcaption><span>03 / BELONG</span><strong>A shared faith.</strong></figcaption></figure>
      </div>
      <div className="photo-story-pair">
        <figure><Image {...imagery.praise} fill sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>Praise with every voice.</figcaption></figure>
        <figure><Image {...imagery.reflection} fill sizes="(max-width: 760px) 100vw, 50vw" /><figcaption>Faith shared together.</figcaption></figure>
      </div>
      <p className="image-credit-note">Moments from church life. See more on our Instagram.</p>
    </div>
  </section>;
}
