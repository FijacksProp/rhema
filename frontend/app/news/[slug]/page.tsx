import { CmsDetail, detailMetadata } from "../../components/cms-detail";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return detailMetadata("news", (await params).slug); }
export default async function NewsStoryPage({ params }: { params: Promise<{ slug: string }> }) { return <CmsDetail kind="news" slug={(await params).slug} />; }
