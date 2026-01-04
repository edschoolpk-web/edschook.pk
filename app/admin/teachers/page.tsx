import { getTeachers } from "@/app/actions/teacher";
import TeachersListClient from "./TeachersListClient";
import { Teacher, Skill, Social } from "@prisma/client";

type TeacherWithRelations = Teacher & {
  skills: Skill[];
  socials: Social | null;
};

export default async function TeachersPage() {
  const { success, data } = await getTeachers();

  if (!success || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-[#A3AED0]">
        <i className="fas fa-exclamation-circle text-4xl mb-4 text-red-400"></i>
        <p>Failed to load teachers data.</p>
      </div>
    );
  }

  const teachers = data as TeacherWithRelations[];

  return <TeachersListClient teachers={teachers} />;
}
