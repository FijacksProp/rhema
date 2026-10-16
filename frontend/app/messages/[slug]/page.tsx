import { CmsDetail, detailMetadata } from "../../components/cms-detail";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { return detailMetadata("messages", (await params).slug); }
export default async function MessagePage({ params }: { params: Promise<{ slug: string }> }) { return <CmsDetail kind="messages" slug={(await params).slug} />; }
