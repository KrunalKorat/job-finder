"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  FileText,
  Search,
  ShieldCheck,
  Sliders,
  Sparkles,
  LayoutDashboard,
  LogIn,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { useAuth } from "@/contexts/auth-context";
import { KageLandingPage } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <KageLandingPage
        headingFont="onest"
        bodyFont="onest"
        headingWeight="400"
        bodyWeight="300"
        primaryColor="#e0231c"
        headingSize={46}
        bodySize={17}
        headingLetterSpacing={-0.012}
      />
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const capabilities = [
    {
      icon: Search,
      title: "Resume-Based Discovery",
      desc: "Discovers verified job opportunities matched to your actual resume skills and career criteria, pulling from official career portals and authenticated APIs.",
    },
    {
      icon: Layers,
      title: "Compatibility Scoring",
      desc: "Reviews role compatibility transparently, evaluating requirements against your experience without fabricating answers or qualifications.",
    },
    {
      icon: FileText,
      title: "Application Preparation",
      desc: "Organizes tailored materials, resume alignment, and submission packages while maintaining complete privacy and local data control.",
    },
    {
      icon: Sliders,
      title: "Authorized Workflows",
      desc: "Operates with strict manual review thresholds and configurable daily application limits. Automated actions only proceed with explicit employer consent.",
    },
  ];

  const faqs = [
    {
      q: "What is Job Finder?",
      a: "Job Finder is a personal AI-powered job discovery and application management platform designed to help you find jobs relevant to your resume, review compatibility, prepare application materials, and manage permitted application workflows.",
    },
    {
      q: "How does Job Finder discover job openings?",
      a: "Job Finder discovers opportunities exclusively through official company career pages, documented applicant tracking APIs (such as Greenhouse and Lever public job boards), and explicitly authorized interfaces. We do not rely on fragile, unauthorized web scraping.",
    },
    {
      q: "Does Job Finder automatically submit applications without my approval?",
      a: "No. Application submission is strictly governed by your manual approval settings. You configure daily and weekly submission caps, and automated submissions are only permitted when an employer's integration terms explicitly authorize programmatic delivery.",
    },
    {
      q: "How is my resume and personal profile data protected?",
      a: "Your data is stored locally in your dedicated database and never exposed in application logs or shared with external third-party aggregators. Authentication tokens and database credentials remain securely isolated.",
    },
    {
      q: "Can other people sign up on this installation?",
      a: "No. This application is configured for personal single-user operation. Public registration and signup routes are completely disabled to guarantee personal ownership and security.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col selection:bg-[#2563EB]/10 selection:text-[#2563EB]">
      <LandingNavbar />

      <main className="flex-1">
        {/* HERO & INTRODUCTION SECTION */}
        <section className="relative pt-12 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D0E2FF] text-[#2563EB] text-xs font-semibold mb-6 animate-fade-in shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Personal AI-Powered Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172B4D] tracking-tight max-w-4xl mx-auto leading-tight mb-6">
              Job Finder
            </h1>

            {/* Product Purpose Description */}
            <p className="text-lg sm:text-xl text-[#697586] max-w-3xl mx-auto leading-relaxed mb-8">
              An AI-powered personal job discovery and application management platform that helps me find jobs relevant to my resume, review compatibility, prepare application materials, and manage permitted application workflows.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-sm flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-sm flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Capabilities
                </Button>
              </Link>
            </div>

            {/* THREEUI CENTERPIECE VISUAL EXPERIENCE */}
            <div id="experience" className="max-w-6xl mx-auto pt-2 pb-6">
              <div className="text-left mb-3 px-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <span className="text-xs font-semibold text-[#172B4D] uppercase tracking-wider">
                    Interactive Shader Canvas
                  </span>
                </div>
                <span className="text-xs text-[#697586]">
                  Powered by ThreeUI
                </span>
              </div>
              <Scene />
            </div>
          </div>
        </section>

        {/* CORE CAPABILITIES SECTION */}
        <section id="features" className="py-20 bg-white border-y border-[#E6E8ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                Built For Precision
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mt-2 mb-4">
                Personalized Career Discovery
              </h2>
              <p className="text-base sm:text-lg text-[#697586] leading-relaxed">
                Connect your actual background to high-relevance openings with full transparency, verifiable sources, and zero fabricated claims.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {capabilities.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F8F7F3] border border-[#E6E8ED] hover:border-[#D0E2FF] transition-all hover:shadow-xs group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E6E8ED] flex items-center justify-center text-[#2563EB] mb-5 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#172B4D] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#697586] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUTOMATION GUARDRAILS & PRIVACY */}
        <section id="privacy-automation" className="py-20 bg-[#F8F7F3]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-[#E6E8ED] p-8 sm:p-12 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] text-xs font-semibold mb-4">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Permission-Bound Architecture</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] tracking-tight mb-4">
                    Application Workflows Under Your Strict Control
                  </h2>
                  <p className="text-sm sm:text-base text-[#697586] leading-relaxed mb-6">
                    Unlike indiscriminate automation tools, Job Finder safeguards your professional reputation. Every action adheres to verified carrier protocols, daily submission throttling, and explicit review gates.
                  </p>
                  <ul className="space-y-3 text-sm text-[#263449]">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Review requirements side-by-side with verified resume bullet points.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Configurable daily and weekly application caps prevent rate limit triggers.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                      <span>Automated delivery is restricted solely to authorized employer endpoints.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#F8F7F3] rounded-2xl p-6 border border-[#E6E8ED]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#172B4D] mb-4">
                    Active Governance Configuration
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-[#E6E8ED]">
                      <span className="font-medium text-[#263449]">Manual Review Threshold</span>
                      <span className="font-semibold text-[#2563EB]">100% Required</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-[#E6E8ED]">
                      <span className="font-medium text-[#263449]">Authorized Provider APIs</span>
                      <span className="font-semibold text-[#15803D]">Greenhouse & Lever</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-[#E6E8ED]">
                      <span className="font-medium text-[#263449]">Local Data Residency</span>
                      <span className="font-semibold text-[#172B4D]">Self-Hosted Docker</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-xl bg-white border border-[#E6E8ED]">
                      <span className="font-medium text-[#263449]">Public Registration</span>
                      <span className="font-semibold text-[#DC2626]">Disabled (Personal Instance)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 bg-white border-t border-[#E6E8ED]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                Clarity & Confidence
              </span>
              <h2 className="text-3xl font-extrabold text-[#172B4D] tracking-tight mt-2 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-sm sm:text-base text-[#697586]">
                Answers regarding your personal setup, matching methodology, and data protection.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E6E8ED] bg-[#F8F7F3] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 focus:outline-hidden"
                  >
                    <span className="font-bold text-sm text-[#172B4D]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#697586] transition-transform duration-200 shrink-0 ${
                        openFaqIndex === idx ? "rotate-180 text-[#2563EB]" : ""
                      }`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-6 pb-5 pt-1 text-sm text-[#697586] leading-relaxed border-t border-[#E6E8ED]/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL SIGN IN CTA BANNER */}
        <section className="py-16 bg-[#F8F7F3] border-t border-[#E6E8ED]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E6E8ED] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] mb-3">
                Ready to Discover Your Next Role?
              </h2>
              <p className="text-sm sm:text-base text-[#697586] max-w-xl mx-auto mb-8">
                Sign in to your private personal instance to view career matches, manage applications, and refine your preferences.
              </p>
              <div>
                {user ? (
                  <Link href="/dashboard">
                    <Button variant="primary" size="lg" className="shadow-xs inline-flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Open Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/auth/login">
                    <Button variant="primary" size="lg" className="shadow-xs inline-flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
