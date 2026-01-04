"use client";
import React, { useState, useEffect, useRef } from 'react';
import { getNotice, updateNotice } from '@/app/actions/notice';
import toast from 'react-hot-toast';
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';

export default function AdminNotices() {
  const [notice, setNotice] = useState({
    content: "",
    isActive: false,
    image: null as string | null
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);

  useEffect(() => {
    async function loadNotice() {
      const res = await getNotice();
      if (res.success && res.data) {
        setNotice({
          content: res.data.content,
          isActive: res.data.isActive,
          // @ts-ignore
          image: res.data.image
        });
      }
      setLoading(false);
    }
    loadNotice();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setImageRemoved(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setImageRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('content', notice.content);
    formData.append('isActive', String(notice.isActive));

    if (imageRemoved) {
      formData.append('removeImage', 'true');
    }

    if (fileInputRef.current?.files?.[0]) {
      formData.append('image', fileInputRef.current.files[0]);
    }

    const res = await updateNotice(formData);

    if (res.success) {
      toast.success('Notice updated successfully!');
      if (imageRemoved) {
        setNotice(prev => ({ ...prev, image: null }));
        setImageRemoved(false);
      }
      // Refresh image if new one uploaded
      if (previewImage && !imageRemoved) {
        const refresh = await getNotice();
        if (refresh.success && refresh.data) {
          // @ts-ignore
          setNotice(prev => ({ ...prev, image: refresh.data.image }));
        }
      }
    } else {
      toast.error(res.error || 'Failed to update notice');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const currentDisplayImage = imageRemoved ? null : (previewImage || notice.image);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Notice Management</h1>
        <p>Manage the popup notice that appears on the website.</p>
      </div>

      <div className="content-wrapper">
        {/* Editor Card */}
        <div className="card editor-card">
          <div className="card-header-styled">
            <div className="icon-box">
              <i className="fas fa-edit"></i>
            </div>
            <h3>Edit Notice</h3>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group toggle-group">
              <label>Notice Status</label>
              <div className="toggle-wrapper">
                <div
                  className={`toggle-switch ${notice.isActive ? 'active' : ''}`}
                  onClick={() => setNotice({ ...notice, isActive: !notice.isActive })}
                >
                  <div className="slider"></div>
                </div>
                <span className={`status-badge ${notice.isActive ? 'enabled' : 'disabled'}`}>
                  {notice.isActive ? 'Live' : 'Hidden'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label>Notice Content</label>
              <div className="editor-container">
                <RichTextEditor
                  value={notice.content}
                  onChange={(content) => setNotice({ ...notice, content })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Popup Image (Optional)</label>
              <div className="image-upload-wrapper">
                <div
                  className={`image-upload-box ${!currentDisplayImage ? 'empty' : ''}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {currentDisplayImage ? (
                    <div className="preview-container">
                      <Image
                        src={currentDisplayImage}
                        alt="Preview"
                        fill
                        className="preview-img"
                        unoptimized
                      />
                      <div className="overlay">
                        <i className="fas fa-camera"></i>
                        <span>Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="placeholder">
                      <div className="upload-icon-circle">
                        <i className="fas fa-cloud-upload-alt"></i>
                      </div>
                      <span className="upload-text">Click to upload image</span>
                      <span className="upload-hint">Supports JPG, PNG</span>
                    </div>
                  )}
                </div>
                {currentDisplayImage && (
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                  >
                    <i className="fas fa-trash"></i> Remove Image
                  </button>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-check-circle"></i>}
                {saving ? ' Saving Changes...' : ' Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="card preview-card-wrapper">
          <div className="card-header-styled">
            <div className="icon-box blue">
              <i className="fas fa-eye"></i>
            </div>
            <h3>Live Preview</h3>
          </div>

          <div className="preview-content">
            <p className="preview-desc">This is how the notice will appear to visitors.</p>

            <div className={`preview-popup-container`}>
              <div className="popup-mockup">
                <div className="popup-header">
                  <span>NOTICE</span>
                  <button className="close-preview" type="button">×</button>
                </div>
                <div className="popup-body">
                  {currentDisplayImage && (
                    <div className="popup-img-container">
                      <Image
                        src={currentDisplayImage}
                        alt="Notice"
                        width={400}
                        height={200}
                        className="popup-main-image"
                        unoptimized
                      />
                    </div>
                  )}
                  <div
                    className="popup-message"
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          animation: fadeIn 0.5s ease;
        }

        .page-header { margin-bottom: 30px; }
        .page-header h1 { font-size: 28px; font-weight: 700; color: #2B3674; margin: 0; }
        .page-header p { color: #A3AED0; margin: 5px 0 0; }

        .content-wrapper {
            display: grid;
            grid-template-columns: 3fr 2fr;
            gap: 30px;
            align-items: start;
        }

        @media (max-width: 1024px) {
            .content-wrapper { grid-template-columns: 1fr; }
        }

        .card {
          background: white;
          padding: 0;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.02);
          overflow: hidden;
        }
        
        .card-header-styled {
            padding: 24px;
            border-bottom: 1px solid #F4F7FE;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .icon-box {
            width: 40px; height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, #868CFF 0%, #4318FF 100%);
            display: flex; align-items: center; justify-content: center;
            color: white;
            font-size: 18px;
        }
        
        .icon-box.blue { background: linear-gradient(135deg, #3399ff 0%, #0055cc 100%); }

        .card-header-styled h3 {
            margin: 0;
            color: #2B3674;
            font-size: 18px;
            font-weight: 700;
        }

        form { padding: 24px; }
        .preview-content { padding: 24px; }

        .form-group { margin-bottom: 24px; }
        .form-group label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #2B3674;
          font-size: 14px;
        }

        .editor-container {
            border: 1px solid #E0E5F2;
            border-radius: 12px;
            overflow: hidden;
            background: white;
            transition: border 0.2s;
        }
        .editor-container:focus-within { border-color: #4318FF; }
        
        .toggle-group {
          margin-bottom: 30px;
        }
        
        .toggle-wrapper {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .toggle-switch {
          width: 50px;
          height: 26px;
          background: #E0E5F2;
          border-radius: 13px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }
        .toggle-switch.active { background: #4318FF; }
        
        .slider {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: left 0.3s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .toggle-switch.active .slider { left: 27px; }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .status-badge.enabled { background: #E6F7FF; color: #0091FF; }
        .status-badge.disabled { background: #FFF4F4; color: #E31A1A; }

        /* Image Upload */
        .image-upload-wrapper {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .image-upload-box {
            width: 100%;
            height: 200px;
            border: 2px dashed #E0E5F2;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            overflow: hidden;
            position: relative;
            background: #FAFCFE;
            transition: all 0.2s;
        }
        .image-upload-box:hover { border-color: #4318FF; background: #F4F7FE; }
        .image-upload-box.empty { background: #FAFCFE; }

        .placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            color: #A3AED0;
        }
        
        .upload-icon-circle {
            width: 48px; height: 48px;
            background: white;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 20px;
            color: #4318FF;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            margin-bottom: 5px;
        }
        
        .upload-text { font-weight: 600; color: #2B3674; }
        .upload-hint { font-size: 12px; }

        .preview-container {
            width: 100%;
            height: 100%;
            position: relative;
        }
        .preview-img { object-fit: cover; }
        .overlay {
            position: absolute;
            inset: 0;
            background: rgba(67, 24, 255, 0.4);
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
            justify-content: center;
            color: white;
            opacity: 0;
            transition: opacity 0.2s;
            backdrop-filter: blur(2px);
        }
        .preview-container:hover .overlay { opacity: 1; }

        .remove-image-btn {
            background: #FFE5E5;
            color: #E31A1A;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            align-self: flex-start;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background 0.2s;
        }
        .remove-image-btn:hover { background: #FFD6D6; }

        .save-btn {
          background: linear-gradient(90deg, #4318FF 0%, #868CFF 100%);
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 15px;
          box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2);
        }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(67, 24, 255, 0.3); }
        .save-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* Preview Section */
        .preview-desc { color: #A3AED0; font-size: 14px; margin-bottom: 20px; line-height: 1.5; }

        .preview-popup-container {
            display: flex;
            justify-content: center;
            padding: 20px;
            background: #FAFCFE;
            border-radius: 16px;
            border: 1px dashed #E0E5F2;
        }
        
        .popup-mockup {
            background: white;
            width: 100%;
            max-width: 350px;
            border: 1px solid #E0E5F2;
            box-shadow: 0 10px 40px rgba(0,0,0,0.08);
            border-radius: 8px;
            overflow: hidden;
        }

        .popup-header {
            background: linear-gradient(90deg, #01ffff, #63f101);
            color: #000;
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 800;
            letter-spacing: 1px;
            font-size: 14px;
        }

        .close-preview {
            background: none;
            border: none;
            color: #000;
            font-size: 24px;
            line-height: 1;
            cursor: pointer;
        }

        .popup-body {
            padding: 20px;
        }

        .popup-img-container {
            width: 100%;
            height: 160px;
            position: relative;
            margin-bottom: 15px;
            border: 1px solid #eee;
        }
        .popup-main-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .popup-message {
            font-size: 14px;
            line-height: 1.5;
            color: #000;
            margin: 0;
            overflow-wrap: break-word;
        }
        .popup-message :global(.ql-align-center) { text-align: center; }
        .popup-message :global(.ql-align-right) { text-align: right; }
        .popup-message :global(.ql-align-justify) { text-align: justify; }
        
        .popup-message :global(p) { margin-bottom: 10px; }
        .popup-message :global(strong) { font-weight: 700; }
        .popup-message :global(em) { font-style: italic; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
