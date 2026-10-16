import { CmsDetail, detailMetadata } from "../../components/cms-detail";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return detailMetadata("events", (await params).slug); }
export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) { return <CmsDetail kind="events" slug={(await params).slug} />; }
