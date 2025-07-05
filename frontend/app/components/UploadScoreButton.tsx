"use client";

import toast from 'react-hot-toast';

interface UploadScoreButtonProps {
  auditReport: string;
}

export default function UploadScoreButton({ auditReport }: UploadScoreButtonProps) {
  const handleUpload = async () => {
    // Extract score from the audit report
    const scoreMatch = auditReport.match(/Audit Score: (\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    if (!score) {
      toast.error("Could not find audit score in the report", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
      return;
    }

    try {
      // TODO: Implement actual upload logic
      console.log("Score to upload:", score);
      
      toast.success("Audit score uploaded successfully!", {
        icon: '🚀',
        style: {
          background: '#000',
          color: '#00ff9d',
          border: '1px solid #00ff9d',
          fontFamily: 'monospace',
        },
      });
    } catch (error) {
      console.error("Error uploading score:", error);
      toast.error("Failed to upload score", {
        style: {
          background: '#000',
          color: '#ff4444',
          border: '1px solid #ff4444',
          fontFamily: 'monospace',
        },
      });
    }
  };

  return (
    <button
      onClick={handleUpload}
      className="px-6 py-2 border-2 border-[#00ff9d] text-[#00ff9d] hover:bg-[#00ff9d] hover:text-black 
                transition-all duration-300 font-mono flex items-center gap-2
                bg-black/20 backdrop-blur-sm"
    >
      <svg 
        className="w-5 h-5 transition-transform duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
        />
      </svg>
      Upload Score
    </button>
  );
} 