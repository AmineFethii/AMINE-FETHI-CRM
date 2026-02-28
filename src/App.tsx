function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <span className="font-semibold">AMINE EL FETHI</span>
          </div>
          <p className="text-xs text-gray-400">LEGAL ADVISOR</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            <span>Overview</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m7-7h.01M7 13h.01"></path></svg>
            <span>My Action Items</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.913 9.913 0 01-3.002-.598V21L4 17.002A9.913 9.913 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            <span>Chat & Support</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-md bg-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4-4m0 0l-4-4m4 4H7a4 4 0 00-4 4v7a4 4 0 004 4h10a4 4 0 004-4v-7a4 4 0 00-4-4h-3z"></path></svg>
            <span>Tutorials</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-1-3m-6.75-7L12 3l6.75 7H2.25z"></path></svg>
            <span>Platform Guide</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Documents</span>
          </a>
          <a href="#" className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span>Settings</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <p>ANNUAL MISSION <span className="font-bold">363d left</span></p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Tutorials</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17l-3 3m0 0l-3-3m3 3V3"></path></svg>
            </button>
            <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17l-3 3m0 0l-3-3m3 3V3"></path></svg>
            </button>
          </div>
        </header>

        {/* Featured Tutorial */}
        <section className="mb-8 relative rounded-lg overflow-hidden">
          <img src="https://picsum.photos/seed/featured/1200/400" alt="Featured Tutorial" className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-75"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <span className="bg-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-2 inline-block">FEATURED</span>
            <h2 className="text-4xl font-bold mb-2">Mastering the Admin Portal: Full Course</h2>
            <p className="text-gray-300 text-sm">12:45 • Updated yesterday</p>
          </div>
          <button className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-80 hover:opacity-100" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
          </button>
        </section>

        {/* Categories and Search */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex space-x-2">
            <button className="bg-gray-800 text-white text-sm px-4 py-2 rounded-full">ALL CATEGORIES</button>
            <button className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-full">ONBOARDING</button>
            <button className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-full">FINANCE</button>
            <button className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-full">LEGAL</button>
            <button className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded-full">PLATFORM</button>
          </div>
          <input type="text" placeholder="Search tutorials" className="border border-gray-300 rounded-full px-4 py-2 w-64" />
        </div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Tutorial Card 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="https://picsum.photos/seed/tutorial1/400/200" alt="Tutorial 1" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
            <div className="p-4">
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">NEW</span>
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full mb-2 ml-2 inline-block">BEGINNER</span>
              <h3 className="text-lg font-semibold mb-1">Platform Overview: Getting Started</h3>
              <p className="text-gray-600 text-sm mb-2">1204 watched</p>
              <div className="flex justify-between items-center text-gray-500 text-xs">
                <span>Onboarding</span>
                <span>4:30</span>
              </div>
            </div>
          </div>

          {/* Tutorial Card 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="https://picsum.photos/seed/tutorial2/400/200" alt="Tutorial 2" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
            <div className="p-4">
              <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">ADVANCED</span>
              <h3 className="text-lg font-semibold mb-1">Managing Client Documents</h3>
              <p className="text-gray-600 text-sm mb-2">850 watched</p>
              <div className="flex justify-between items-center text-gray-500 text-xs">
                <span>Platform</span>
                <span>6:15</span>
              </div>
            </div>
          </div>

          {/* Tutorial Card 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="https://picsum.photos/seed/tutorial3/400/200" alt="Tutorial 3" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
            <div className="p-4">
              <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">ADVANCED</span>
              <h3 className="text-lg font-semibold mb-1">Fiscal Declarations Made Easy</h3>
              <p className="text-gray-600 text-sm mb-2">FIX THIS IMAGE</p>
              <div className="flex justify-between items-center text-gray-500 text-xs">
                <span>Finance</span>
                <span>8:45</span>
              </div>
            </div>
          </div>

          {/* Tutorial Card 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src="https://picsum.photos/seed/tutorial4/400/200" alt="Tutorial 4" className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
            <div className="p-4">
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-2 inline-block">BEGINNER</span>
              <h3 className="text-lg font-semibold mb-1">Legal Compliance 101</h3>
              <p className="text-gray-600 text-sm mb-2">940 watched</p>
              <div className="flex justify-between items-center text-gray-500 text-xs">
                <span>Legal</span>
                <span>5:20</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
