'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import FieldWorkers from './components/FieldWorkers';
import Analytics from './components/Analytics';
import BSRReport from './components/analyticsscreen/Lastpoint'
import AIint from './components/analyticsscreen/AIint.jsx'
import Survey from './components/Survey'
import Entry from './components/Entry.jsx'

const current = {
  english: {
    title: "Welcome, Prathamesh (Field-Master) from Seva Flow",
  },
  hindi: {
    title: "स्वागत हे, प्रथमेश (फ़ील्ड-मैसेज) से सेव फ़्लो के लिए",
  }
};


function Overview() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      <p className="text-gray-500 text-center">
        This is the admin dashboard for the PrepAI application. Here you can
        manage your institutes, admins, and rounds.
      </p>
    </div>
  );
}

function VerifyInstitute() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Verify Institute</h1>
      <p className="text-gray-500 text-center">
        This is the Verify Institute page. Here you can verify your institute
        details.
      </p>
    </div>
  );
}



function CheckInstitute() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Check Institute</h1>
      <p className="text-gray-500 text-center">
        This is the Check Institute page. Here you can check your institute
        details.
      </p>
    </div>
  );
}

function AddAdmin() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Add Admin</h1>
      <p className="text-gray-500 text-center">
        This is the Add Admin page. Here you can add your admin details.
      </p>
    </div>
  );
}

function CheckAdmins() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Check Admins</h1>
      <p className="text-gray-500 text-center">
        This is the Check Admins page. Here you can check your admin details.
      </p>
    </div>
  );
}

function Rounds() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Rounds</h1>
      <p className="text-gray-500 text-center">
        This is the Rounds page. Here you can add your rounds details.
      </p>
    </div>
  );
}


export default function FieldMasterDashboard() {
  const [selectedComponent, setSelectedComponent] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      const dataCookie = cookies.find((cookie) => cookie.trim().startsWith('data='));
      if (dataCookie) {
        setUserData(JSON.parse(dataCookie.split('=')[1]));
      } else {
        console.error('No data cookie found');
      }
    }
  }, []);

  const handleSidebarSelect = (value) => {
    setSelectedComponent(value);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  let RenderedComponent;
  switch (selectedComponent) {
    case 'overview':
      RenderedComponent = <Overview />;
      break;
    case 'VerifyInstitute':
      RenderedComponent = <VerifyInstitute />;
      break;
    case 'FieldWorkers':
      RenderedComponent = <FieldWorkers />;
      break;
    case 'checkInstitute':
      RenderedComponent = <Entry />;
      break;
    case 'addAdmin':
      RenderedComponent = <BSRReport/>;
      break;
    case 'checkAdmins':
      RenderedComponent = <AIint />;
      break;
    case 'rounds':
      RenderedComponent = <Rounds />;
      break;
    case 'analytics':
      RenderedComponent = <Analytics />;
      break;
    case 'Survey':
      RenderedComponent = <Survey/>;
      break;
    default:
      RenderedComponent = <Overview/>;
      break;
  }

  return (
    <div className="bg-white">
      {/* Mobile Navbar with Hamburger Button */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md border border-gray-300"
          aria-label="Toggle sidebar"
        >
          {/* Hamburger Icon */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold">
        Welcome, Prathamesh (Field-Master) from Seva Flow
        </h1>
      </div>

      <div className="grid lg:grid-cols-6 min-h-screen relative">
        {/* Sidebar with responsive background color */}
        <div
          className={`fixed lg:static inset-y-0 left-0 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 transition-transform duration-300 ease-in-out lg:col-span-1 bg-[#F0F8FF] lg:bg-[#F0F8FF]-100 p-4 z-20`}
        >
          <Sidebar onSelect={handleSidebarSelect} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-5 lg:border-l pl-8">
          <h1 className="hidden lg:block text-2xl font-bold mb-4 pt-5">
            {current[language].title}
          </h1>
          {RenderedComponent}
        </div>
      </div>

      {/* Overlay to close sidebar on mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-10"
        ></div>
      )}
    </div>
  );
}