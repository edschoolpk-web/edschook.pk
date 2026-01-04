import TeacherBio from "@/components/TeacherBio";
import { getTeacherBySlug, getTeachers } from "@/app/actions/teacher";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TeachersSlider from "@/components/TeachersSlider";
import StickyWrapper from "./StickyWrapper"; // Import the client component

export default async function TeacherDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { success, data: teacher } = await getTeacherBySlug(slug);
  const { success: successTeachers, data: teachersList } = await getTeachers();

  if (!success || !teacher) {
    notFound();
  }

  return (
    <>
      <section className="pager-section">
        <div className="container">
          <div className="pager-content text-center">
            <h2>Teacher Detail</h2>
            <ul>
              <li>
                <Link href="/" title="Home">Home</Link>
              </li>
              <li>
                <span>Teacher Detail</span>
              </li>
            </ul>
          </div>
          <h2 className="page-titlee">E&D</h2>
        </div>
      </section>

      <section className="teacher-single-section">
        <div className="container">
          <div className="teacher-single-page">
            {/* Replaced Bootstrap row with Flexbox for reliable sticky behavior */}
            <div className="flex flex-col lg:flex-row gap-8 relative">



              {/* Left Column - Sticky Image */}
              <div className="w-full lg:w-1/3 flex-shrink-0">
                <StickyWrapper>
                  <div className="teacher-coly">
                    {teacher.image ? (
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        width={500}
                        height={600}
                        className="w-100"
                        style={{ height: 'auto' }}
                      />
                    ) : (
                      <div className="w-100 bg-gray-200" style={{ height: '400px' }}></div>
                    )}
                    <ul className="social-icons">
                      {teacher.socials?.facebook && (
                        <li><a href={teacher.socials.facebook} title="Facebook"><i className="fab fa-facebook-f"></i></a></li>
                      )}
                      {teacher.socials?.twitter && (
                        <li><a href={teacher.socials.twitter} title="Twitter"><i className="fab fa-twitter"></i></a></li>
                      )}
                      {teacher.socials?.linkedin && (
                        <li><a href={teacher.socials.linkedin} title="LinkedIn"><i className="fab fa-linkedin-in"></i></a></li>
                      )}
                      {teacher.socials?.instagram && (
                        <li><a href={teacher.socials.instagram} title="Instagram"><i className="fab fa-instagram"></i></a></li>
                      )}
                    </ul>
                  </div>
                </StickyWrapper>
              </div>

              {/* Right Column - Scrollable Content */}
              <div className="w-full lg:w-2/3">
                <div className="teacher-content">
                  <h3>{teacher.name}</h3>
                  <p>{teacher.role}</p>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-6">
                      <div className="rol-z">
                        <Image src="/webImages/ro2.png" alt="" width={30} height={30} />
                        <div className="rol-info">
                          <h3>Email</h3>
                          <span>{teacher.email || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <TeacherBio content={teacher.bio} />

                  <ul className="tech-detils">
                    <li>
                      <h3>DOB</h3>
                      <span>{teacher.dob || 'N/A'}</span>
                    </li>
                    <li>
                      <h3>Education</h3>
                      <span>{teacher.education || 'N/A'}</span>
                    </li>
                    <li>
                      <h3>Experience</h3>
                      <span>{teacher.experience || 'N/A'}</span>
                    </li>
                  </ul>
                  <div className="skills-tech">
                    <h3>Personal Skills</h3>
                    {teacher.skills.map((skill: any) => (
                      <div className="progess-row" key={skill.id}>
                        <h3>{skill.name}</h3>
                        <div className="progress">
                          <div
                            className="progress-bar wow slideInLeft"
                            role="progressbar"
                            style={{ width: `${skill.percentage}%`, backgroundColor: skill.color || '#ed1b2e', visibility: 'visible' }}
                            aria-valuenow={skill.percentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                        <span>{skill.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="teachers-section">
            <div className="container">
              <div className="section-title text-center">
                <h2>Meet Our<br />Teachers</h2>
                <p>
                  Our teaching team combines strong subject expertise with care and guidance,
                  helping students learn confidently through modern, student-centered methods.
                </p>
              </div>

              <div className="teachers">
                {successTeachers && teachersList ? (
                  <TeachersSlider teachers={teachersList} />
                ) : (
                  <p className="text-center text-red-500">Failed to load teachers.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-sec">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="newsz-ltr-text">
                  <h2>Build Your Career<br />With Us</h2>
                </div>
              </div>
              <div className="col-lg-6">
                <Link href="/career" title="Career Opportunities" className="btn-default">
                  Career Opportunities <i className="fa fa-long-arrow-alt-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
