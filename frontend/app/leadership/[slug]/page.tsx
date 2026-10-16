import { CmsDetail, detailMetadata } from "../../components/cms-detail";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return detailMetadata("people", (await params).slug); }
export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) { return <CmsDetail kind="people" slug={(await params).slug} />; }
