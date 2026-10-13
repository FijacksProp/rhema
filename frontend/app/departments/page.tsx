import Link from "next/link";
import { departments } from "../../lib/departments";
import { DepartmentsDirectory } from "../components/departments-directory";
import { PageIntro, SectionLabel, TextLink, FAQ, VisitBand } from "../components/page-elements";

export const metadata = { title: "Departments & ministries", description: "Explore the departments and ministries of Rhema Chapel Stadium Church, their activities, teams, and leadership." };

export default function DepartmentsPage() {
  return <>
    <PageIntro label="Departments" title="Many gifts." accent="One community."><p>Find your place in the life of the church. Explore each department to learn what it does, meet its leadership, and discover ways to get involved.</p><TextLink href="/get-involved">Explore your next step</TextLink></PageIntro>
    <section className="wrap editorial-section"><SectionLabel number="01">THE DEPARTMENT DIRECTORY</SectionLabel><div className="directory-heading"><h2>Find your<br /><em>place.</em></h2><p>Every department has its own page for its purpose, activities, photos, HOD, and assistant HODs.</p></div><DepartmentsDirectory departments={departments} /><div className="directory-update"><strong>More of our church family is coming.</strong><p>These are the departments shared so far. Further departments, leadership profiles, and photos will be added as they become available.</p></div></section>
    <section className="paper-section" data-reveal><div className="wrap editorial-grid"><h2>A little more<br /><em>before you join.</em></h2><FAQ items={[{question:"What will I find on each department page?",answer:<p>An introduction to the department, what it does, photos, its HOD and assistant HODs, and confirmed meeting or joining information.</p>},{question:"How do I get involved?",answer:<p>Explore a department’s page for its joining information. You can also check our <Link href="/contact">contact page</Link> for available ways to connect with the church.</p>},{question:"Is there a Children’s Church?",answer:<p>Yes. Rhema Chapel Stadium Church has a <Link href="/children">Children’s Church</Link>. Visit its page for the latest information for parents and families.</p>}]} /></div></section>
    <VisitBand />
  </>;
}
