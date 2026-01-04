"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage, deleteBulkGalleryImages } from '@/app/actions/gallery';
import toast from 'react-hot-toast';

type GalleryImage = {
  id: string;
  url: string;
  title: string | null;
  category: string;
};

export default function AdminGallery() {
  const [activeTab, setActiveTab] = useState<'home' | 'main'>('home');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    const res = await getGalleryImages(activeTab);
    if (res.success && res.data) {
      setImages(res.data);
    } else {
      toast.error('Failed to load images');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
    setSelectedImages([]); // Reset selection on tab change
  }, [activeTab]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Total Size Limit (30MB)
    const totalSize = Array.from(e.target.files).reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 30 * 1024 * 1024) { // 30MB
      toast.error('Total upload size exceeds 30MB limit.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Client-side limit check for 'home'
    if (activeTab === 'home') {
      if (images.length + e.target.files.length > 10) {
        toast.error(`Limit exceeded. You can add max ${10 - images.length} more images.`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
    }

    setUploading(true);
    const formData = new FormData();

    // Append all selected files
    Array.from(e.target.files).forEach(file => {
      formData.append('image', file);
    });

    formData.append('category', activeTab);

    const res = await uploadGalleryImage(formData);
    if (res.success) {
      toast.success('Images uploaded successfully');
      fetchImages();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      console.error(res.error);
      toast.error(res.error || 'Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    const res = await deleteGalleryImage(id);
    if (res.success) {
      toast.success('Image deleted');
      setImages(images.filter(img => img.id !== id));
      setSelectedImages(selectedImages.filter(sid => sid !== id));
    } else {
      toast.error(res.error || 'Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedImages.length} images?`)) return;

    const res = await deleteBulkGalleryImages(selectedImages);
    if (res.success) {
      toast.success(`${selectedImages.length} images deleted`);
      setImages(images.filter(img => !selectedImages.includes(img.id)));
      setSelectedImages([]);
    } else {
      toast.error(res.error || 'Bulk delete failed');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.id));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gallery Management</h1>
        <p>Manage your website gallery content.</p>
      </div>

      <div className="gallery-layout">
        <div className="gallery-sidebar">
          <div className="sidebar-card">
            <h3>Gallery Type</h3>
            <div className="tabs-vertical">
              <button
                className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <div className="tab-info">
                  <span className="tab-label">Home Slider</span>
                  <span className="tab-count">{images.length}/10</span>
                </div>
                <i className="fas fa-home tab-icon"></i>
              </button>
              <button
                className={`tab-btn ${activeTab === 'main' ? 'active' : ''}`}
                onClick={() => setActiveTab('main')}
              >
                <div className="tab-info">
                  <span className="tab-label">Main Gallery</span>
                  <span className="tab-count">Unlimited</span>
                </div>
                <i className="fas fa-images tab-icon"></i>
              </button>
            </div>
          </div>

          <div className="sidebar-card info-card">
            <i className="fas fa-info-circle info-icon"></i>
            <p>
              {activeTab === 'home'
                ? 'These images appear on the main homepage banner slider. High quality landscape images are recommended.'
                : 'These images appear in the dedicated gallery section of the website. Organizes automatically.'}
            </p>
          </div>
        </div>

        <div className="gallery-main">
          {/* Actions Toolbar */}
          <div className="actions-toolbar">
            <div className="left-actions">
              <button onClick={selectAll} className="btn-secondary">
                <i className={`fas ${selectedImages.length === images.length && images.length > 0 ? 'fa-check-square' : 'fa-square'}`}></i>
                {selectedImages.length === images.length && images.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
              {selectedImages.length > 0 && (
                <span className="selection-count">{selectedImages.length} selected</span>
              )}
            </div>

            <div className="right-actions">
              {selectedImages.length > 0 && (
                <button onClick={handleBulkDelete} className="btn-danger">
                  <i className="fas fa-trash"></i> Delete Selected
                </button>
              )}
              <button
                className={`btn-primary ${activeTab === 'home' && images.length >= 10 ? 'disabled' : ''}`}
                onClick={() => {
                  if (activeTab !== 'home' || images.length < 10) {
                    fileInputRef.current?.click();
                  } else {
                    toast.error('Limit reached (10). Delete images to add more.');
                  }
                }}
              >
                <i className="fas fa-cloud-upload-alt"></i> Upload Images
              </button>
              <input
                type="file"
                hidden
                multiple
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                disabled={uploading || (activeTab === 'home' && images.length >= 10)}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="gallery-content">
            {uploading && (
              <div className="uploading-state">
                <div className="spinner"></div>
                <p>Uploading your images...</p>
              </div>
            )}

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading gallery...</p>
              </div>
            ) : (
              <>
                {images.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon"><i className="fas fa-image"></i></div>
                    <h3>No Images Found</h3>
                    <p>Get started by uploading your first image to this gallery.</p>
                  </div>
                ) : (
                  <div className="gallery-grid">
                    {images.map((img) => (
                      <div
                        className={`gallery-item ${selectedImages.includes(img.id) ? 'selected' : ''}`}
                        key={img.id}
                        onClick={() => toggleSelect(img.id)}
                      >
                        <div className="img-wrapper">
                          <Image src={img.url} alt={img.title || 'Gallery Image'} width={300} height={200} className="gallery-img" unoptimized />
                          <div className={`checkbox-overlay ${selectedImages.includes(img.id) ? 'visible' : ''}`}>
                            <div className="custom-checkbox">
                              {selectedImages.includes(img.id) && <i className="fas fa-check"></i>}
                            </div>
                          </div>
                          <div className="overlay-actions" onClick={(e) => e.stopPropagation()}>
                            <button className="icon-btn delete-btn" onClick={() => handleDelete(img.id)}>
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
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

        .gallery-layout {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 30px;
        }

        @media (max-width: 1024px) {
            .gallery-layout { grid-template-columns: 1fr; }
        }

        /* SIDEBAR */
        .sidebar-card {
            background: white;
            padding: 24px;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            border: 1px solid rgba(0,0,0,0.02);
            margin-bottom: 24px;
        }

        .sidebar-card h3 {
            margin: 0 0 20px;
            color: #2B3674;
            font-size: 18px;
            font-weight: 700;
        }

        .tabs-vertical {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .tab-btn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: transparent;
            border: 1px solid transparent;
            padding: 12px 16px;
            border-radius: 12px;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
        }

        .tab-btn:hover {
            background: #F4F7FE;
        }

        .tab-btn.active {
            background: linear-gradient(90deg, #4318FF 0%, #868CFF 100%);
            color: white;
            box-shadow: 0 4px 10px rgba(67, 24, 255, 0.2);
        }
        
        .tab-info { display: flex; flex-direction: column; }
        .tab-label { font-size: 14px; font-weight: 600; }
        .tab-count { font-size: 12px; opacity: 0.8; }
        
        .tab-btn.active .tab-label, .tab-btn.active .tab-count { color: white; }
        .tab-label { color: #2B3674; }
        .tab-count { color: #A3AED0; }

        .info-card {
            display: flex;
            align-items: start;
            gap: 15px;
            background: #E6F7FF;
            border: none;
        }
        
        .info-icon { color: #0091FF; font-size: 20px; margin-top: 2px; }
        .info-card p { margin: 0; color: #2B3674; font-size: 13px; line-height: 1.5; }

        /* MAIN CONTENT */
        .actions-toolbar {
            background: white;
            padding: 16px 24px;
            border-radius: 20px;
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
            flex-wrap: wrap;
            gap: 15px;
        }

        .left-actions, .right-actions {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .btn-secondary, .btn-primary, .btn-danger {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-secondary { background: #F4F7FE; color: #2B3674; }
        .btn-secondary:hover { background: #E0E5F2; }

        .btn-primary { background: linear-gradient(90deg, #4318FF 0%, #868CFF 100%); color: white; }
        .btn-primary:hover { box-shadow: 0 6px 15px rgba(67, 24, 255, 0.3); transform: translateY(-1px); }
        .btn-primary.disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

        .btn-danger { background: #FFE5E5; color: #E31A1A; }
        .btn-danger:hover { background: #FFD6D6; }

        .selection-count { color: #A3AED0; font-size: 13px; font-weight: 500; }

        /* GALLERY GRID */
        .gallery-content {
            background: white;
            padding: 24px;
            border-radius: 20px;
            min-height: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }

        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
        }

        .gallery-item {
            position: relative;
            border-radius: 16px;
            overflow: hidden;
            aspect-ratio: 4/3;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
        }

        .gallery-item:hover { transform: translateY(-3px); }
        .gallery-item.selected { border-color: #4318FF; }

        .img-wrapper { position: relative; width: 100%; height: 100%; }
        .gallery-img { width: 100%; height: 100%; object-fit: cover; }

        .checkbox-overlay {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 2;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .gallery-item:hover .checkbox-overlay, .gallery-item.selected .checkbox-overlay { opacity: 1; }

        .custom-checkbox {
            width: 24px; height: 24px;
            background: rgba(255,255,255,0.9);
            border-radius: 6px;
            display: flex; align-items: center; justify-content: center;
            color: #4318FF;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .gallery-item.selected .custom-checkbox { background: #4318FF; color: white; }

        .overlay-actions {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: 15px;
            background: linear-gradient(transparent, rgba(0,0,0,0.6));
            display: flex;
            justify-content: flex-end;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .gallery-item:hover .overlay-actions { opacity: 1; }

        .icon-btn.delete-btn {
            width: 32px; height: 32px;
            border-radius: 8px;
            background: white;
            color: #E31A1A;
            border: none;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
            font-size: 14px;
        }
        .icon-btn.delete-btn:hover { background: #FFE5E5; }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: #A3AED0;
            text-align: center;
        }
        
        .empty-icon {
            font-size: 48px;
            margin-bottom: 20px;
            opacity: 0.5;
        }

        .empty-state h3 { margin: 0 0 10px; color: #2B3674; font-size: 18px; }

        .spinner {
            width: 30px; height: 30px;
            border: 3px solid #E0E5F2;
            border-top-color: #4318FF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }

        .uploading-state, .loading-state {
            text-align: center;
            padding: 40px;
            color: #A3AED0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

