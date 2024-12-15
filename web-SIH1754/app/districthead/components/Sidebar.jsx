'use client';
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils"
import { useState } from "react"

export function Sidebar({ onSelect }) {
  const [selectedSection, setSelectedSection] = useState("overview");
  
  const handleSelect = (section) => {
    setSelectedSection(section);
    onSelect(section);
  }

  return (
    <div className={cn("pb-12 lg:block")}>
      <div className="space-y-4 py-4">
        {/* Discover Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button variant={selectedSection === "overview" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("overview")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Overview
            </Button>
            <Button variant={selectedSection === "analytics" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("analytics")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
              </svg>
              Analytics
            </Button>
          </div>
        </div>

        {/* Institute Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          User Management
          </h2>
          <div className="space-y-1">
            <Button variant={selectedSection === "addInstitute" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("addInstitute")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Field Workers
            </Button>
            <Button variant={selectedSection === "checkInstitute" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("checkInstitute")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                <circle cx="17" cy="7" r="5" />
              </svg>
              Public Users
            </Button>
          </div>
        </div>

        {/* Management Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Reports
          </h2>
          <div className="space-y-1">
            <Button variant={selectedSection === "addAdmin" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("addAdmin")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              District
            </Button>
            <Button variant={selectedSection === "checkAdmins" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("checkAdmins")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                <circle cx="17" cy="7" r="5" />
              </svg>
              State
            </Button>
          </div>
        </div>

        {/* Training Section */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Community
          </h2>
          <div className="space-y-1">
            <Button variant={selectedSection === "rounds" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("rounds")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
             Events
            </Button>
            <Button variant={selectedSection === "material" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => handleSelect("material")}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              servey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}