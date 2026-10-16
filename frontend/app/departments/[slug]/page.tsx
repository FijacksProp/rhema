import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getDepartments } from "../../../lib/cms";
import { RichText } from "../../components/cms-content";
import { DepartmentGallery, DepartmentTeam } from "../../components/department-elements";
import { PageIntro, SectionLabel, TextLink } from "../../components/page-elements";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return (await getDepartments()).map(department => ({ slug: department.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const department = (await getDepartments()).find(department => department.slug === slug);
  return department ? { title: department.name, description: department.summary } : { title: "Department not found" };
}

export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;
  const department = (await getDepartments()).find(department => department.slug === slug);
  if (!department) notFound();
  if (department.dedicatedPage) redirect(department.dedicatedPage);
  return <>
    <PageIntro label={department.name} title={department.name} accent="A place to serve." photo={department.photos[0]}><p>{department.summary}</p><TextLink href="/departments">All departments</TextLink></PageIntro>
    <section className="wrap editorial-section" data-reveal><SectionLabel number="01">ABOUT THE DEPARTMENT</SectionLabel><div className="editorial-grid"><h2>Our purpose.<br /><em>Our people.</em></h2><div className="prose">{department.descriptionHtml ? <RichText html={department.descriptionHtml} /> : department.description.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div></div></section>
    <section className="paper-section" data-reveal><div className="wrap"><SectionLabel number="02">WHAT WE DO</SectionLabel>{department.activities.length ? <div className="department-activities">{department.activities.map(activity => <article key={activity.title}><h3>{activity.title}</h3><p>{activity.description}</p></article>)}</div> : <div className="content-note"><h3>Activities coming soon</h3><p>The department’s activities will be shared here when confirmed.</p></div>}</div></section>
    <section className="wrap editorial-section" data-reveal><SectionLabel number="03">MEET THE TEAM</SectionLabel><DepartmentTeam department={department} /></section>
    <section className="paper-section" data-reveal><div className="wrap"><DepartmentGallery department={department} /></div></section>
    <section className="wrap editorial-section" data-reveal><div className="editorial-grid"><h2>Your next<br /><em>step.</em></h2><div><h3>Gathering & serving</h3><p>{department.meetingDetails ?? "Meeting details will be shared here once confirmed."}</p><p>{department.joiningInformation ?? "Joining information will be published with the department’s contact details."}</p><TextLink href="/contact">Contact information</TextLink><div className="link-stack"><Link href="/departments" className="text-link">Back to all departments</Link></div></div></div></section>
  </>;
}
