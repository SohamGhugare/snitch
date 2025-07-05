"use client";

interface UploadScoreButtonProps {
  auditReport: string;
}

export default function UploadScoreButton({ auditReport }: UploadScoreButtonProps) {
  const handleUpload = async () => {
    // Extract score from the audit report
    const scoreMatch = auditReport.match(/Audit Score: (\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

    if (!score) {
      alert("Could not find audit score in the report");
      return;
    }

    try {
      // TODO: Implement the actual upload logic here
      console.log("Uploading score:", score);
      alert("Score upload feature coming soon!");
    } catch (error) {
      console.error("Error uploading score:", error);
      alert("Failed to upload score");
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