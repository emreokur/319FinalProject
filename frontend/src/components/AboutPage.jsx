import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Asray from '../assets/asray.JPG';
import Emre from '../assets/emre.jpg';
import AskQuestion from './AskQuestion';

function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col pt-16 bg-white text-gray-800">
        <section className="py-20 container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">About TheOnlyGoodCameraStore</h1>
          <div className="max-w-4xl mx-auto text-lg space-y-6">
            <p>
              TheOnlyGoodCameraStore is more than a marketplace—it's a platform built by photographers, for photographers.
              We understand the gear matters, and that’s why we’ve created a trusted hub where professionals and
              enthusiasts alike can access top-tier equipment.
            </p>
            <p>
              Our mission is simple: Revolutionize how photographers interact with their gear—from selection to purchase and beyond.
              Whether you’re buying your first DSLR or upgrading to a full-frame mirrorless system, we’re here to guide and support you.
            </p>
            <p>
              We're proud to provide a seamless and secure experience, backed by dedicated support and curated inventory.
              Join our growing community and see why thousands trust TheOnlyGoodCameraStore.
            </p>
          </div>
        </section>

        {/* Authors Section */}
        <section className="pb-20 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet the Authors</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
              <img
                src={Asray}
                alt="Asray Gopa"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
              />
              <div>
                <h3 className="text-xl font-semibold">Asray Gopa</h3>
                <p className="text-gray-600">Student @ COMS 3190</p>
              </div>
            </div>
            <div className="flex items-center gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
              <img
                src={Emre}
                alt="Emre Okur"
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600"
              />
              <div>
                <h3 className="text-xl font-semibold">Emre Okur</h3>
                <p className="text-gray-600">Student @ COMS 3190</p>
              </div>
            </div>
          </div>
        </section>
      <AskQuestion />

      </main>
      <Footer />
    </>
  );
}

export default AboutPage;
