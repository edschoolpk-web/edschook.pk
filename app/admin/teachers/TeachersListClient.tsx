"use client";

import Link from "next/link";
import Image from "next/image";
import { DeleteTeacherButton } from "./DeleteTeacherButton";
import { Teacher, Skill, Social } from "@prisma/client";

type TeacherWithRelations = Teacher & {
    skills: Skill[];
    socials: Social | null;
};

export default function TeachersListClient({ teachers }: { teachers: TeacherWithRelations[] }) {
    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Teachers</h1>
                    <p>Manage your academic staff and their profiles.</p>
                </div>
                <Link
                    href="/admin/teachers/new"
                    className="add-btn"
                >
                    <i className="fas fa-plus"></i> Add New Teacher
                </Link>
            </div>

            <div className="teachers-grid">
                {teachers.map((teacher) => (
                    <div key={teacher.id} className="teacher-card group">

                        {/* Action Overlay */}
                        <div className="absolute top-3 right-3 flex gap-2 z-10">
                            <DeleteTeacherButton id={teacher.id} />
                            <Link href={`/admin/teachers/${teacher.id}`} className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                                <i className="fas fa-edit text-xs"></i>
                            </Link>
                        </div>

                        <div className="card-image-wrapper relative h-[200px] bg-[#F4F7FE]">
                            {teacher.image ? (
                                <Image
                                    src={teacher.image}
                                    alt={teacher.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E0E5F2] to-[#F4F7FE]">
                                    <div className="w-20 h-20 rounded-full bg-white text-[#4318FF] text-3xl font-bold flex items-center justify-center shadow-sm">
                                        {teacher.name.charAt(0)}
                                    </div>
                                </div>
                            )}
                            <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-[#2B3674] shadow-sm">
                                {teacher.role}
                            </div>
                        </div>

                        <div className="card-content">
                            <h3 className="teacher-name">{teacher.name}</h3>
                            <div className="teacher-stats">
                                <div className="stat">
                                    <i className="fas fa-graduation-cap"></i>
                                    <span>{teacher.education}</span>
                                </div>
                                <div className="stat">
                                    <i className="fas fa-briefcase"></i>
                                    <span>{teacher.experience}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {teachers.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon-box">
                            <i className="fas fa-chalkboard-teacher"></i>
                        </div>
                        <h3>No Teachers Found</h3>
                        <p>Get started by adding your first teacher profile to the system.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
        .page-container {
            animation: fadeIn 0.5s ease;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .page-header h1 { font-size: 28px; font-weight: 700; color: #2B3674; margin: 0; }
        .page-header p { color: #A3AED0; margin: 5px 0 0; }

        .add-btn {
            background: linear-gradient(90deg, #4318FF 0%, #868CFF 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s;
            box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2);
        }
        .add-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(67, 24, 255, 0.3); }

        .teachers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 24px;
        }

        .teacher-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            border: 1px solid rgba(0,0,0,0.02);
            position: relative;
            transition: all 0.3s;
        }
        .teacher-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.08); }

        .card-image-wrapper {
            position: relative;
            height: 200px;
            background: #F4F7FE;
        }
        .edit-btn:hover { background: #4318FF; color: white; }

        .card-content {
            padding: 20px;
        }

        .teacher-name {
            margin: 0 0 10px;
            color: #2B3674;
            font-size: 18px;
            font-weight: 700;
        }

        .teacher-stats {
            display: flex;
            gap: 15px;
            color: #A3AED0;
            font-size: 13px;
        }
        
        .stat { display: flex; align-items: center; gap: 6px; }

        .empty-state {
            grid-column: 1 / -1;
            padding: 60px 20px;
            text-align: center;
            background: white;
            border-radius: 20px;
            border: 1px dashed #E0E5F2;
        }
        
        .empty-icon-box {
            width: 60px; height: 60px;
            border-radius: 50%;
            background: #F4F7FE;
            color: #A3AED0;
            display: flex; align-items: center; justify-content: center;
            font-size: 24px;
            margin: 0 auto 20px;
        }
        
        .empty-state h3 { color: #2B3674; margin: 0 0 10px; }
        .empty-state p { color: #A3AED0; margin: 0; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
}
