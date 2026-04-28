import React from 'react';
import FeatureCard from './components/FeatureCard';
import GigCard from './components/GigCard';
import API from './api'; // Assume an API utility is set up for making requests



export default function App() {

  const [gigs, setGigs] = React.useState([]);

  React.useEffect(() => {
    API.get('gigs/')
      .then(res => setGigs(res.data.slice(0, 3))) // Show 3 featured gigs
      .catch(err => console.error(err));
  }, []);

  
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-2xl font-bold tracking-tight text-blue-600">PrimeGigs</div>
          <div className="hidden space-x-8 md:flex">
            <a href="#features" className="text-sm font-medium hover:text-blue-600">Features</a>
            <a href="#" className="text-sm font-medium hover:text-blue-600">Explore</a>
            <a href="#" className="text-sm font-medium hover:text-blue-600">Pricing</a>
          </div>
          <button className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 shadow-lg shadow-blue-200">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-700/10">
            Over 10k+ gigs completed this month
          </span>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 lg:text-7xl">
            Get Gigs Done, <span className="text-blue-600">Lightning Fast.</span>
          </h1>
          <p className="mb-10 text-lg leading-8 text-slate-600 sm:text-xl">
            The world's most efficient marketplace for micro-tasks. Connect with top-tier talent or find your next side hustle in seconds.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700 hover:-translate-y-0.5">
              Hire Talent
            </button>
            <button className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition hover:bg-slate-50">
              Start Earning
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="text-4xl font-bold mb-12">How It Works</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <FeatureCard
            title="Post or Offer a Gig"
            description="Freelancers create ready-to-buy gigs; clients hire instantly."
            icon="📌"
          />
          <FeatureCard
            title="Secure Payments"
            description="Pay through safe gateways with milestone tracking."
            icon="💰"
          />
          <FeatureCard
            title="Fast Delivery"
            description="Gigs delivered in 1–7 days depending on task."
            icon="⚡"
          />
          <FeatureCard
            title="Ratings & Reviews"
            description="Build trust with transparent feedback and reviews."
            icon="⭐"
          />
        </div>
      </section>

       
      {/* Popular Gigs */}
      <section className="py-24 text-center">
        <h2 className="text-4xl font-bold mb-12">Popular Gigs</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {gigs.map(gig => (
            <GigCard key={gig.id} gig={gig} />
          ))}
        </div>
      </section>

          {/* Testimonials */}
      <section className="py-24 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="max-w-xs p-6 bg-white rounded shadow">
            <p className="text-gray-700 mb-4">"I completed my first gig in under a day! Amazing platform."</p>
            <h3 className="font-bold">– Jane D., Freelancer</h3>
          </div>
          <div className="max-w-xs p-6 bg-white rounded shadow">
            <p className="text-gray-700 mb-4">"Hiring micro-tasks has never been easier. Highly recommend!"</p>
            <h3 className="font-bold">– Mark S., Client</h3>
          </div>
        </div>
      </section>
    </div>
  );
}