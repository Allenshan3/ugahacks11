"use client";

import React, { useRef, useState, useEffect } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeText: string;
  setResumeText: (text: string) => void;
  atsKeywords: string;
  isUploading: boolean;
  onFileUpload: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onSearchComplete?: (results: any[], searchQuery: string) => void; // NEW PROP
}

export default function ResumeModal({
  isOpen,
  onClose,
  resumeText,
  setResumeText,
  atsKeywords,
  isUploading,
  onFileUpload,
  onFileChange,
  onSave,
  onSearchComplete, // NEW PROP
}: ResumeModalProps) {
  // 1. DEFINE ALL HOOKS FIRST (Do not put 'if' statements before these!)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState("Georgia");
  const [employmentType, setEmploymentType] = useState<string>("ALL");
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);

  // Parse keywords into array
  const keywordsArray = atsKeywords
    .split(/[,\n]+/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);

  // 3. NOW IT IS SAFE TO RETURN NULL
  if (!isOpen) return null;

  // ... Rest of the functions ...

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyword)) {
        newSet.delete(keyword);
      } else {
        newSet.add(keyword);
      }
      return newSet;
    });
  };

  const searchOpportunities = async () => {
    if (selectedKeywords.size === 0) {
      alert("Please select at least one keyword to search for opportunities!");
      return;
    }

    if (!location.trim()) {
      alert("Please enter a location!");
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: Array.from(selectedKeywords),
          location: location,
          employmentType: employmentType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('==================== SEARCH COMPLETE ====================');
        console.log('Results:', data.results);
        console.log('Total jobs found:', data.totalJobs);
        console.log('====================================================');

        // Flatten all jobs from all keyword searches
        const allJobs = data.results.flatMap((result: any) => result.jobs);
        
        // Create a descriptive search query
        const searchQuery = `${Array.from(selectedKeywords).join(', ')} in ${location}`;
        
        // Pass results back to parent component
        if (onSearchComplete) {
          onSearchComplete(allJobs, searchQuery);
        }

        // Call onSave to close modal and do any other cleanup
        onSave();
      } else {
        alert('Search failed: ' + data.error);
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('An error occurred while searching for opportunities.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => {
          onFileChange(e);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        className="hidden"
      />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Upload or Paste Your Resume</h2>

        {/* Upload PDF Button */}
        <div className="mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {isUploading ? 'Uploading PDF...' : 'Upload PDF Resume'}
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or paste text</span>
          </div>
        </div>

        {/* Paste Text Area */}
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
        />

        {/* Character count */}
        <p className="text-sm text-gray-500 mt-2">
          {resumeText.length} characters
        </p>

        {/* ATS Keywords Display */}
        {keywordsArray.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              ATS Keywords Found:
            </h3>
            <div className="flex flex-wrap gap-2">
              {keywordsArray.map((keyword, index) => {
                const isSelected = selectedKeywords.has(keyword);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleKeyword(keyword)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {keyword}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Location Input */}
        <div className="mt-4">
          <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
            Preferred Location
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Georgia, Atlanta, Athens"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
          />
        </div>

        {/* Employment Type Dropdown */}
        <div className="mt-4">
            <label htmlFor="employmentType" className="block text-sm font-semibold text-gray-900 mb-2">
                Employment Type
            </label>
            <select
                id="employmentType"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
            <option value="ALL">All Types</option>
            <option value="FULLTIME">Full-Time</option>
            <option value="PARTTIME">Part-Time</option>
            <option value="CONTRACTOR">Contractor</option>
            <option value="INTERN">Intern</option>
            </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-500 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={searchOpportunities}
            disabled={!resumeText.trim() || isSearching} 
            className="px-4 py-2 bg-[#A983B2] text-white rounded-lg hover:bg-[#8F6EA0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSearching ? (
              <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
            ) : (
              'Search Opportunities'
            )}
          </button>

        </div>
      </div>
    </div>
  );
}