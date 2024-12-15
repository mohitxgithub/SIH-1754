'use client';
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';

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

function AddInstitute() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Add Institute</h1>
      <p className="text-gray-500 text-center">
        This is the Add Institute page. Here you can add your institute details.
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

function Analytics() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <p className="text-gray-500 text-center">
        This is the Analytics page. Here you can check your analytics details.
      </p>
    </div>
  );
  }

export default function AdminDashboard() {
  const [selectedComponent, setSelectedComponent] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);

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
    setIsSidebarOpen(false); // Close sidebar on mobile when a component is selected
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Conditional rendering based on the selected component
  let RenderedComponent;
  switch (selectedComponent) {
    case 'overview':
      RenderedComponent = <Overview />;
      break;
    case 'VerifyInstitute':
      RenderedComponent = <VerifyInstitute />;
      break;
    case 'addInstitute':
      RenderedComponent = <AddInstitute />;
      break;
    case 'checkInstitute':
      RenderedComponent = <CheckInstitute />;
      break;
    case 'addAdmin':
      RenderedComponent = <AddAdmin />;
      break;
    case 'checkAdmins':
      RenderedComponent = <CheckAdmins />;
      break;
    case 'rounds':
      RenderedComponent = <Rounds />;
      break;
    case 'analytics':
      RenderedComponent = <Analytics />;
      break;
    default:
      RenderedComponent = <Overview />;
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
          Welcome, {userData?.name} ({userData?.role}) from {userData?.Cname}
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
            Welcome, {userData?.name} (Admin) from PrepAI
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