"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean']
        ],
    };

    return (
        <div className="quill-wrapper">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
            />
            <style jsx global>{`
                .quill-wrapper .ql-container {
                    min-height: 150px;
                    font-size: 16px;
                }
                .quill-wrapper .ql-editor {
                    min-height: 150px;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    word-break: normal !important;
                }
                .quill-wrapper .ql-editor * {
                    word-break: normal !important;
                }
                .quill-wrapper .ql-editor ul { padding-left: 1.5rem; list-style-type: disc !important; }
                .quill-wrapper .ql-editor ol { padding-left: 1.5rem; list-style-type: decimal !important; }
                .quill-wrapper .ql-editor li { margin-left: 1rem; list-style: inherit !important; }
            `}</style>
        </div>
    );
}
