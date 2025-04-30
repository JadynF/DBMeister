import LoginCanvas from "@/components/(authComponents)/loginCanvas";
import LoginForm from "@/components/(authComponents)/loginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with canvas */}
      <div className="hidden md:flex w-1/2 bg-indigo-600 overflow-hidden">
        <LoginCanvas />
      </div>
      
      {/* Right side with form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-50 px-6">
        <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
            <img
              src="/MEISTERLOGO.png"
              alt="DBMeister Logo"
              width="96"
              height="96"
              className="object-contain"
            />
          </div>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to continue to DBMeister</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}