"use client";

import { deleteTeacher } from "@/app/actions/teacher";
import { useState } from "react";

export function DeleteTeacherButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this teacher?")) return;
        
        setIsDeleting(true);
        try {
            await deleteTeacher(id);
        } catch (error) {
            alert("Failed to delete");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-white text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
        >
            {isDeleting ? (
                <i className="fas fa-spinner fa-spin text-xs"></i>
            ) : (
                <i className="fas fa-trash text-xs"></i>
            )}
        </button>
    );
}
