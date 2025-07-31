'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Official Header */}
      <header className="bg-[#005ea2] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Legislative Document Analysis Tool</h1>
              <p className="text-sm text-blue-100">An AI-Powered Service for Policy Comparison</p>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm">Powered by Advanced AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] mb-4">
              Compare Legislative Documents with Confidence
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Instant AI analysis reveals changes, impacts, and stakeholder effects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/compare"
                className="inline-block bg-[#fa9441] hover:bg-[#e07f2e] text-white font-bold py-3 px-8 rounded-md transition-colors text-center"
              >
                Start Document Analysis
              </Link>
              <a 
                href="#how-it-works" 
                className="inline-block text-[#005ea2] hover:text-[#1a4480] font-semibold py-3 px-8 underline text-center"
              >
                Learn How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-[#e6e6e6] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#005ea2]">500+</div>
              <div className="text-sm text-gray-700">Documents Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#005ea2]">98%</div>
              <div className="text-sm text-gray-700">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#005ea2]">4+ hrs</div>
              <div className="text-sm text-gray-700">Saved Per Analysis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#005ea2]">100%</div>
              <div className="text-sm text-gray-700">Secure & Confidential</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1b1b1b] mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Original Document",
                description: "Upload the original version of the legislative document in PDF or text format"
              },
              {
                step: "2",
                title: "Upload Revised Version",
                description: "Upload the revised or amended version of the same document"
              },
              {
                step: "3",
                title: "Receive Comprehensive Analysis",
                description: "Get instant AI-powered insights on changes, impacts, and stakeholder effects"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto w-16 h-16 bg-[#005ea2] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-[#1b1b1b] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1b1b1b] mb-12">
            Powerful Analysis Features
          </h2>
          <div className="space-y-12">
            {[
              {
                title: "Change Detection",
                description: "Side-by-side comparison with highlighted modifications, additions, and deletions",
                icon: "📊"
              },
              {
                title: "Stakeholder Analysis",
                description: "Identify who benefits and who's affected by the proposed changes",
                icon: "👥"
              },
              {
                title: "Impact Forecasting",
                description: "Economic, social, and political projections for short and long-term effects",
                icon: "📈"
              },
              {
                title: "Executive Summaries",
                description: "Clear, actionable insights designed for quick decision-making",
                icon: "📋"
              },
              {
                title: "Evidence-Based",
                description: "Direct quotes and citations included for verification and transparency",
                icon: "✓"
              }
            ].map((feature, index) => (
              <div key={index} className={`flex flex-col md:flex-row gap-6 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold text-[#1b1b1b] mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-lg">{feature.description}</p>
                </div>
                <div className="flex-1 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <div className="h-48 bg-gradient-to-br from-[#005ea2] to-[#1a4480] rounded opacity-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1b1b1b] mb-12">
            Who Uses This Tool
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Congressional Staff",
              "State Legislators",
              "Policy Analysts",
              "Government Agencies",
              "Public Interest Groups",
              "Citizens & Journalists"
            ].map((useCase) => (
              <div key={useCase} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="border-t-4 border-[#005ea2] -mt-6 mb-4 -mx-6"></div>
                <h3 className="text-lg font-semibold text-[#1b1b1b]">{useCase}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-[#e6e6e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-3xl font-bold text-[#1b1b1b] mb-6">
              Security & Compliance
            </h2>
            <div className="max-w-2xl mx-auto text-left space-y-3">
              {[
                "No data retention - documents are deleted after analysis",
                "Encrypted processing from upload to results",
                "HTTPS secure connection throughout",
                "Privacy protected - no user tracking"
              ].map((item) => (
                <div key={item} className="flex items-start">
                  <span className="text-[#00a91c] mr-2">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#005ea2] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Analyze Legislative Documents?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            No registration required • Free to use
          </p>
          <Link
            href="/compare"
            className="inline-block bg-[#fa9441] hover:bg-[#e07f2e] text-white font-bold py-4 px-10 rounded-md transition-colors text-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a4480] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <p className="text-sm">
              A free service for legislative analysis
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:underline">Terms of Use</a>
              <span>|</span>
              <a href="#" className="hover:underline">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
