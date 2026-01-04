import Link from "next/link";
import { TeacherList } from "../about/teacher-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Teachers | Engineers & Doctors School",
  description: "Meet the dedicated team of educators at Engineers & Doctors School.",
  alternates: {
      canonical: "https://edschool.pk/teachers"
  }
};

export default function TeachersPage() {
  return (
    <>
      <section className="pager-section">
        <div className="container">
          <div className="pager-content text-center">
            <h2>Our Teachers</h2>
            <ul>
              <li>
                <Link href="/" title="Home">
                  Home
                </Link>
              </li>
              <li>
                <span>Teachers</span>
              </li>
            </ul>
          </div>
          <h2 className="page-titlee">E&D</h2>
        </div>
      </section>

      <section className="teachers-section">
        <div className="container">
          <div className="teachers">
            <div className="row">
              <TeacherList />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
