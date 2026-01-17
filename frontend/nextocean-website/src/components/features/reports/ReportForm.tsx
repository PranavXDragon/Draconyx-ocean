'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, AlertTriangle, Upload, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface IncidentReport {
  latitude: number;
  longitude: number;
  type: 'pollution' | 'wildlife' | 'debris' | 'illegal-activity' | 'weather' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface ReportFormProps {
  onSubmit: (report: IncidentReport) => void;
  onClose: () => void;
}

export default function ReportForm({ onSubmit, onClose }: ReportFormProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useManualAddress, setUseManualAddress] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reportId, setReportId] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [descriptionMode, setDescriptionMode] = useState<'text' | 'voice'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    type: 'pollution' as IncidentReport['type'],
    description: '',
    latitude: '',
    longitude: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    peopleAtRisk: '',
    happeningNow: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate file upload
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one image or video.');
      return;
    }
    
    // Validate description (either text or voice)
    if (descriptionMode === 'text' && !formData.description.trim()) {
      alert('Please provide a description.');
      return;
    }
    if (descriptionMode === 'voice' && !audioBlob) {
      alert('Please record a voice description or switch to text mode.');
      return;
    }
    
    // Validate location
    if (!useManualAddress && (!formData.latitude || !formData.longitude)) {
      alert('Please use current location or enter address manually.');
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmModal(true);
  };

  const confirmSubmit = () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setSubmissionError('');
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Simulate random success/failure for demo (90% success rate)
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          // Generate unique report ID
          const generatedId = `OCN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          onSubmit({
            latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
            longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
            type: formData.type,
            severity: 'medium' as const,
            description: formData.description,
          });
          
          setReportId(generatedId);
          
          // Close form immediately after submission
          onClose();
        } else {
          // Simulate failure
          throw new Error('Submission failed');
        }
        
        setIsSubmitting(false);
      } catch (error) {
        console.error('Error submitting report:', error);
        setSubmissionError('Failed to submit report. Please try again.');
        setIsSubmitting(false);
      }
    }, 2000);
  };

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsSubmitting(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          });
          setUseManualAddress(false);
          setIsSubmitting(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter address manually.');
          setUseManualAddress(true);
          setIsSubmitting(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter address manually.');
      setUseManualAddress(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      if (!isImage && !isVideo) {
        alert(`${file.name} is not a valid image or video file.`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 100MB limit.`);
        return false;
      }
      return true;
    });
    
    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setCameraStream(stream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setUploadedFiles([...uploadedFiles, file]);
            closeCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const startVideoRecording = () => {
    if (cameraStream) {
      const recorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' });
        setUploadedFiles([...uploadedFiles, file]);
        setIsCapturing(false);
        closeCamera();
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsCapturing(true);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorder && isCapturing) {
      mediaRecorder.stop();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="form-modal glass rounded-2xl sm:rounded-3xl w-full max-w-sm sm:max-w-lg md:max-w-xl lg:max-w-2xl my-4 sm:my-8 relative"
      >
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Header */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 md:mb-8 gap-2 sm:gap-4"
          >
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {t('report.title')}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 sm:p-2 hover:bg-white/10 rounded-lg flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          </motion.div>

          <motion.form 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit} 
            className="space-y-3 sm:space-y-4 md:space-y-6"
          >
            {/* Location Section */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 sm:space-y-4"
            >
              <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                {t('report.location')}
              </h3>

              {/* Location Mode Toggle */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={useCurrentLocation}
                  disabled={isSubmitting}
                  className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                    !useManualAddress && formData.latitude && formData.longitude
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{isSubmitting && !useManualAddress ? 'Getting Location...' : 'Use Current Location'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setUseManualAddress(!useManualAddress)}
                  className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                    useManualAddress
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">Enter Address Manually</span>
                </motion.button>
              </div>

              {/* GPS Coordinates Display */}
              <AnimatePresence>
                {!useManualAddress && formData.latitude && formData.longitude && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="p-3 sm:p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg"
                  >
                    <p className="text-xs sm:text-sm text-cyan-300 font-medium mb-1">Current Location Captured:</p>
                    <p className="text-xs text-gray-300">
                      Lat: {formData.latitude}, Lng: {formData.longitude}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Address Fields - shown when manual address is selected */}
              <AnimatePresence>
                {useManualAddress && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                    Address Line 1 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base"
                    placeholder="Street address"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                      State/Province <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base"
                      placeholder="State"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base"
                      placeholder="Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                      ZIP/Postal Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Incident Details Section */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 sm:space-y-4 pt-2 border-t border-white/10"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                Incident Details
              </h3>

              {/* Incident Type */}
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                  {t('report.type')} <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base [&>option]:bg-gray-900 [&>option]:text-white"
                >
                  <option value="pollution" className="bg-gray-900 text-white">{t('report.typePollution')}</option>
                  <option value="tsunami" className="bg-gray-900 text-white">Tsunami / Sea Threat</option>
                  <option value="oil-spill" className="bg-gray-900 text-white">Oil Spill</option>
                  <option value="ship-accident" className="bg-gray-900 text-white">Ship Accident</option>
                  <option value="debris" className="bg-gray-900 text-white">{t('report.typeDebris')}</option>
                  <option value="illegal-activity" className="bg-gray-900 text-white">Illegal Activity</option>
                  <option value="weather" className="bg-gray-900 text-white">Weather Event</option>
                  <option value="other" className="bg-gray-900 text-white">{t('report.typeOther')}</option>
                </select>
              </div>

              {/* Safety Questions */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                    Are people at risk? <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <select
                    value={formData.peopleAtRisk}
                    onChange={(e) => setFormData({ ...formData, peopleAtRisk: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base [&>option]:bg-gray-900 [&>option]:text-white"
                  >
                    <option value="" className="bg-gray-900 text-white">Select...</option>
                    <option value="yes" className="bg-gray-900 text-white">Yes</option>
                    <option value="no" className="bg-gray-900 text-white">No</option>
                    <option value="unknown" className="bg-gray-900 text-white">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200">
                    Is it happening right now? <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <select
                    value={formData.happeningNow}
                    onChange={(e) => setFormData({ ...formData, happeningNow: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all text-sm sm:text-base [&>option]:bg-gray-900 [&>option]:text-white"
                  >
                    <option value="" className="bg-gray-900 text-white">Select...</option>
                    <option value="yes" className="bg-gray-900 text-white">Yes</option>
                    <option value="no" className="bg-gray-900 text-white">No</option>
                    <option value="recent" className="bg-gray-900 text-white">Recently ended</option>
                  </select>
                </div>
              </motion.div>

              {/* Description & Media Upload Section */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
                {/* Description with Mode Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-200">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setDescriptionMode('text')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          descriptionMode === 'text'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        Text
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setDescriptionMode('voice')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          descriptionMode === 'voice'
                            ? 'bg-cyan-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        Voice
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Text Description */}
                  {descriptionMode === 'text' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none transition-all text-sm sm:text-base"
                        placeholder={t('report.descPlaceholder')}
                      />
                    </motion.div>
                  )}
                  
                  {/* Voice Description */}
                  {descriptionMode === 'voice' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col sm:flex-row gap-2">
                        {!audioBlob ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`flex-1 px-3 sm:px-4 py-3 sm:py-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
                              isRecording
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/20'
                            }`}
                          >
                            {isRecording ? (
                              <>
                                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                <span>Stop Recording</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                </svg>
                                <span>Start Voice Recording</span>
                              </>
                            )}
                          </motion.button>
                        ) : (
                          <>
                            <div className="flex-1 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs sm:text-sm text-cyan-300 flex-1">Voice recorded ({(audioBlob.size / 1024).toFixed(1)} KB)</span>
                              <audio controls className="h-8">
                                <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                              </audio>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={deleteRecording}
                              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all text-sm sm:text-base"
                            >
                              Delete
                            </motion.button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* File Upload */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="flex text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 text-gray-200 items-center gap-2">
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                    Upload Photos/Videos <span className="text-red-400">*</span>
                  </label>
                  
                  {/* Upload Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 sm:px-4 py-4 sm:py-5 border-2 border-dashed border-white/20 rounded-lg hover:border-cyan-400 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-cyan-400"
                    >
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="font-medium text-xs sm:text-sm">Upload from Device</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={openCamera}
                      className="px-3 sm:px-4 py-4 sm:py-5 border-2 border-dashed border-white/20 rounded-lg hover:border-cyan-400 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-cyan-400"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium text-xs sm:text-sm">Use Camera</span>
                    </motion.button>
                  </div>
                  
                  <p className="text-xs text-gray-400 text-center mb-3">Max 100MB per file</p>

                {/* Camera Modal */}
                <AnimatePresence>
                  {showCamera && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                      onClick={closeCamera}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 rounded-2xl overflow-hidden max-w-2xl w-full"
                      >
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-auto bg-black"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          
                          {isCapturing && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 animate-pulse">
                              <div className="w-3 h-3 bg-white rounded-full" />
                              Recording
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={capturePhoto}
                            className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Take Photo
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={isCapturing ? stopVideoRecording : startVideoRecording}
                            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                              isCapturing 
                                ? 'bg-red-500 hover:bg-red-600 text-white' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            {isCapturing ? 'Stop Recording' : 'Record Video'}
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={closeCamera}
                            className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
                          >
                            Close
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Uploaded Files Preview */}
                <AnimatePresence mode="popLayout">
                  {uploadedFiles.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 sm:mt-3 space-y-2"
                    >
                      {uploadedFiles.map((file, index) => (
                        <motion.div 
                          key={`${file.name}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs sm:text-sm text-white font-medium truncate">{file.name}</div>
                              <div className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4"
            >
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-cyan-500/50'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('report.submitting')}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    {t('report.submit')}
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-3 sm:py-4 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 font-semibold transition-all text-sm sm:text-base"
              >
                CANCEL
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl"
            >
              {/* Question Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>

              {/* Confirmation Message */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-center mb-3 text-white"
              >
                Submit Report?
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-300 text-center mb-6 text-sm sm:text-base"
              >
                Are you sure you want to submit this incident report? Please review all details before confirming.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 font-semibold transition-all text-sm sm:text-base border border-white/20"
                >
                  No, Review Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmSubmit}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold transition-all hover:shadow-xl hover:shadow-cyan-500/50 text-sm sm:text-base"
                >
                  Yes, Submit Report
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              {/* Success Message */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"
              >
                Report Submitted!
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-center mb-6 text-sm sm:text-base"
              >
                Thank you for reporting this incident. Your report has been received and will be reviewed.
              </motion.p>

              {/* Report ID */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 border border-cyan-500/30 rounded-xl p-4 mb-6"
              >
                <p className="text-xs sm:text-sm text-gray-400 mb-2 text-center">Your Unique Report ID</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-lg sm:text-xl font-mono font-bold text-cyan-400 tracking-wider">
                    {reportId}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      navigator.clipboard.writeText(reportId);
                      alert('Report ID copied to clipboard!');
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Copy Report ID"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Save this ID to track your report status</p>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
                className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-semibold transition-all hover:shadow-xl hover:shadow-cyan-500/50 text-sm sm:text-base"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {submissionError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[80] bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{submissionError}</span>
            <button onClick={() => setSubmissionError('')} className="ml-2 hover:text-red-200">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
