import { Button } from './ui/button';
import { Search, MapPin, Users, Shield } from 'lucide-react';
import bubtLogo from 'figma:asset/214c4e35fc9a4a250613608e16c49b5b475361e2.png';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={bubtLogo} alt="BUBT Logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-blue-900">UniFind</h1>
              <p className="text-sm text-gray-600">BUBT Lost & Found</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onNavigate('login')}>
              Login
            </Button>
            <Button onClick={() => onNavigate('register')}>
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block mb-6">
            <img src={bubtLogo} alt="BUBT Logo" className="w-32 h-32 object-contain mx-auto drop-shadow-2xl" />
          </div>
          
          <h2 className="text-gray-900 mb-6">
            Welcome to UniFind
          </h2>
          <p className="text-gray-700 mb-4 max-w-2xl mx-auto">
            The official lost and found platform for{' '}
            <span className="text-blue-600">
              Bangladesh University of Business and Technology (BUBT)
            </span>
          </p>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Lost your ID card, laptop, or books on campus? Found something that belongs to someone else? 
            UniFind connects our university community to help reunite lost items with their rightful owners.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Button size="lg" onClick={() => onNavigate('register')} className="px-8">
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => onNavigate('login')}
              className="px-8"
            >
              Sign In
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Report Lost Items</h3>
              <p className="text-gray-600">
                Quickly report items you've lost on campus with detailed descriptions and photos
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Find & Claim</h3>
              <p className="text-gray-600">
                Browse found items and claim yours, or help others by reporting items you've found
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-3">Community Driven</h3>
              <p className="text-gray-600">
                Connect with students and faculty to reunite lost items with their owners
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Admin Login Link */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onNavigate('admin-login')}
          className="shadow-lg"
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin Login
        </Button>
      </div>
    </div>
  );
}