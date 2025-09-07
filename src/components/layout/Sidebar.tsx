'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiFileText, FiEdit3, FiPlus, FiSettings, FiUser, FiLogOut } from 'react-icons/fi';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'My Resumes',
      href: '/dashboard',
      icon: <FiFileText className="mr-3 h-6 w-6" />,
      current: pathname === '/dashboard',
    },
    {
      name: 'Templates',
      href: '/templates',
      icon: <FiEdit3 className="mr-3 h-6 w-6" />,
      current: pathname === '/templates',
    },
    {
      name: 'Account',
      href: '/account',
      icon: <FiUser className="mr-3 h-6 w-6" />,
      current: pathname === '/account',
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4
          ">
            <h1 className="text-xl font-bold text-indigo-600">ResumeBuilder</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="px-2 mt-4">
            <Link
              href="/resumes/new"
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiPlus className="w-5 h-5 mr-2" />
              New Resume
            </Link>
          </div>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100">
                  <span className="text-indigo-600 font-medium">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
