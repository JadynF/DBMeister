import Link from "next/link";
import LoginCanvas from "@/components/(authComponents)/loginCanvas";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Modern Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-indigo-600">DBMeister</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="https://github.com/JadynF/DBMeister" className="text-gray-600 hover:text-indigo-600 transition-colors">
                GitHub
              </a>
              <a href="https://dbmeister.readthedocs.io/en/latest/" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Docs
              </a>
            </nav>
          </div>
          <img
              src="/DBMEISTER-LOGO.png"
              alt="DBMeister Logo"
              width="72"
              height="72"
              className="object-contain"
            />
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
            Create Free Online Schema Diagrams!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Speed up production and boost understanding in your project by creating a detailed schema. DBMeister allows you to show not only internal data flow, but external as well. The ultimate tool to minimize confusion in your database project.
          </p>
          <Link href="/login">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors inline-flex items-center">
              Create Diagram
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 rounded-lg overflow-hidden shadow-xl border border-gray-200">
          {/* Using LoginCanvas as diagram preview */}
          <div className="w-full h-96 bg-indigo-600 overflow-hidden">
            <LoginCanvas />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">Key Features</h2>
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center mb-24">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">External Mapping</h3>
              <p className="text-gray-600">
                DBMeister gives developers the ability to not only design their internal data flow, but also any external sources accessing their data. Giving everyone the complete picture on the project and minimizing confusion.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-200 rounded-lg h-48 md:h-64 flex items-center justify-center">
                <img 
                  src="ETL-Tools.png" 
                  alt="External Mapping" 
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Increased Collaboration</h3>
              <p className="text-gray-600">
                DBMeister nurtures collaboration within a development team. Groups can be created within DBMeister so that developer teams can seamlessly work together on the same diagram. Members of the group can interact with each other with a group chat, group privilege management, real-time diagram changes, and more!
              </p>
            </div>
            <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg h-48 md:h-64 flex items-center justify-center overflow-hidden">
              <img 
                src="Collaboration.jpg" 
                alt="Collaboration" 
                className="object-cover h-full w-full"
              />
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to streamline your database design?</h2>
          <Link href="/register">
            <button className="bg-white hover:bg-gray-100 text-indigo-600 font-medium py-3 px-8 rounded-lg shadow-md transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-4">DBMeister</h3>
              <p className="text-gray-400 max-w-xs">
                The ultimate tool for creating and sharing database schema diagrams.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DBMeister. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}