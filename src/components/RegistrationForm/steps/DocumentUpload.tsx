import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

interface DocumentUploadProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function DocumentUpload({ data, onNext, onBack }: DocumentUploadProps) {
  const [formData, setFormData] = useState({
    photo: data.photo || null,
    aadhaar: data.aadhaar || null,
    birthCert: data.birthCert || null,
    bonafide: data.bonafide || null,
    insuranceProvider: data.insuranceProvider || '',
    insurancePolicy: data.insurancePolicy || '',
    insuranceExpiry: data.insuranceExpiry || '',
    insuranceDoc: data.insuranceDoc || null
  });
  const [errors, setErrors] = useState<any>({});
  const [compressing, setCompressing] = useState<string | null>(null);

  const handleFileChange = (field: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      setCompressing(field);
      
      try {
        // 1. Frontend Compression for Images
        if (file.type.startsWith('image/')) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
            initialQuality: 0.8
          };
          file = await imageCompression(file, options);
          console.log(`Compressed ${field} to ${file.size / 1024 / 1024} MB`);
        }

        // 2. Upload to AWS S3 via API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', field);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (result.success) {
          // Store the S3 URL in formData
          setFormData((prev: any) => ({ ...prev, [field]: result.url }));
          if (errors[field]) setErrors((prev: any) => ({ ...prev, [field]: null }));
        } else {
          alert('Upload failed: ' + result.error);
        }
      } catch (error) {
        console.error("Error during upload/compression", error);
        alert('An error occurred during file processing.');
      } finally {
        setCompressing(null);
      }
    }
  };

  const removeFile = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    let newErrors: any = {};
    if (!formData.photo) newErrors.photo = 'Passport photo is required';
    if (!formData.aadhaar) newErrors.aadhaar = 'Aadhaar card is required';
    if (!formData.birthCert) newErrors.birthCert = 'Birth certificate is required';
    if (!formData.bonafide) newErrors.bonafide = 'School bonafide is required';
    
    // Insurance validation
    if (!formData.insuranceProvider) newErrors.insuranceProvider = 'Provider is required';
    if (!formData.insurancePolicy) newErrors.insurancePolicy = 'Policy number is required';
    if (!formData.insuranceExpiry) newErrors.insuranceExpiry = 'Expiry date is required';
    else if (new Date(formData.insuranceExpiry) < new Date()) newErrors.insuranceExpiry = 'Insurance has expired';
    if (!formData.insuranceDoc) newErrors.insuranceDoc = 'Insurance document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const FileUploadBox = ({ label, field, accept }: { label: string, field: string, accept: string }) => (
    <div className="form-group" style={{ marginBottom: '1rem' }}>
      <label>{label} <span style={{color: 'var(--destructive)'}}>*</span></label>
      <div style={{ border: '1px dashed var(--glass-border)', padding: '1rem', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {compressing === field ? (
          <span style={{ color: 'var(--warning)' }}>Optimizing file...</span>
        ) : (formData as any)[field] ? (
          <>
            <span style={{ color: 'var(--success)' }}>{(formData as any)[field]} (Optimized)</span>
            <button type="button" onClick={() => removeFile(field)} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Remove</button>
          </>
        ) : (
          <>
            <input type="file" id={field} style={{ display: 'none' }} onChange={handleFileChange(field)} accept={accept} />
            <label htmlFor={field} className="btn btn-outline" style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Choose File</label>
          </>
        )}
      </div>
      {errors[field] && <span className="error-message">{errors[field]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="form-step">
      <div className="form-row">
        <FileUploadBox label="Passport Size Photo" field="photo" accept=".jpg,.jpeg,.png" />
        <FileUploadBox label="Aadhaar Card / ID Proof" field="aadhaar" accept=".pdf,.jpg,.png" />
      </div>
      <div className="form-row">
        <FileUploadBox label="Birth Certificate" field="birthCert" accept=".pdf,.jpg,.png" />
        <FileUploadBox label="School Bonafide Certificate" field="bonafide" accept=".pdf,.jpg,.png" />
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px solid var(--warning)', borderRadius: 'var(--radius)', background: 'rgba(245, 158, 11, 0.05)' }}>
        <h4 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>Insurance Details (Required)</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem' }}>Insurance is required to participate in this competition.</p>
        
        <div className="form-row">
          <div className="form-group">
            <label>Insurance Provider Name</label>
            <input type="text" name="insuranceProvider" value={formData.insuranceProvider} onChange={e => {setFormData({...formData, insuranceProvider: e.target.value}); setErrors({...errors, insuranceProvider: null})}} className="form-control" />
            {errors.insuranceProvider && <span className="error-message">{errors.insuranceProvider}</span>}
          </div>
          <div className="form-group">
            <label>Policy Number</label>
            <input type="text" name="insurancePolicy" value={formData.insurancePolicy} onChange={e => {setFormData({...formData, insurancePolicy: e.target.value}); setErrors({...errors, insurancePolicy: null})}} className="form-control" />
            {errors.insurancePolicy && <span className="error-message">{errors.insurancePolicy}</span>}
          </div>
        </div>
        
        <div className="form-row" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label>Valid Till (Expiry Date)</label>
            <input type="date" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={e => {setFormData({...formData, insuranceExpiry: e.target.value}); setErrors({...errors, insuranceExpiry: null})}} className="form-control" />
            {errors.insuranceExpiry && <span className="error-message">{errors.insuranceExpiry}</span>}
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
             <FileUploadBox label="Upload Document" field="insuranceDoc" accept=".pdf,.jpg,.png" />
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button type="button" onClick={onBack} className="btn btn-outline">Back</button>
        <button type="submit" className="btn btn-primary">Next Step</button>
      </div>
    </form>
  );
}
