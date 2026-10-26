"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  Search,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How does Job Finder discover job openings?",
      a: "Job Finder discovers opportunities exclusively through official company career pages, documented applicant tracking APIs (such as Greenhouse and Lever public job boards), and explicitly authorized interfaces. We do not rely on fragile, unauthorized web scraping.",
    },
    {
      q: "Does Job Finder automatically apply to jobs on my behalf?",
      a: "No. Application automation is strictly disabled by default. You have full granular control: you configure the exact approved employers, daily/weekly limits, and required approval settings. Programmatic submission is only permitted when an employer's integration terms explicitly authorize it.",
    },
    {
      q: "What happens if a job application asks questions not in my resume?",
      a: "Our core safety policy guarantees that uncertain profile answers are never fabricated. If an application requires custom answers or unsupported steps, Job Finder hands the application directly to you for manual review.",
    },
    {
      q: "Is an expensive AI subscription required to use Phase 1?",
      a: "No. Phase 1 is designed to be fully self-contained and cost-optimized. You do not need any paid external AI API key to register, navigate the dashboard, set career preferences, or manage your profile.",
    },
    {
      q: "How is my resume and personal contact data protected?",
      a: "Your data is stored with encrypted storage keys and never exposed in application logs. Credentials and private tokens are isolated through environment variables with zero persistent secret storage in public database tables.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F3] flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-24 overflow-hidden border-b border-[#E6E8ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF4FF] border border-[#D0E2FF] text-[#2563EB] text-xs font-semibold mb-8 animate-fade-in">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliant & Authorized Job Automation</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#172B4D] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
              Your Next Opportunity Starts Here.
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-[#697586] max-w-2xl mx-auto leading-relaxed mb-10">
              Upload your resume, discover verified openings from official career pages and authorized APIs, and manage applications with server-side safety guardrails.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-sm">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </Link>
            </div>

            {/* Refined Dashboard Preview */}
            <div className="max-w-5xl mx-auto rounded-2xl p-2 sm:p-4 bg-white/70 border border-[#E6E8ED] shadow-sm">
              <div className="rounded-xl border border-[#E6E8ED] bg-[#F8F7F3] p-4 sm:p-6 text-left">
                {/* Mock Browser Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6E8ED]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#E6E8ED]" />
                    <span className="w-3 h-3 rounded-full bg-[#E6E8ED]" />
                    <span className="w-3 h-3 rounded-full bg-[#E6E8ED]" />
                    <span className="text-xs font-mono text-[#697586] ml-3">
                      jobfinder.app/dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                    <span className="text-xs font-medium text-[#15803D]">
                      Authorized Source Sync Active
                    </span>
                  </div>
                </div>

                {/* Dashboard Inner Shell Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1 */}
                  <div className="bg-white p-5 rounded-xl border border-[#E6E8ED] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#697586] uppercase">
                        Career Profile
                      </span>
                      <Badge variant="primary">Configured</Badge>
                    </div>
                    <div className="text-sm font-bold text-[#172B4D]">
                      Full Stack Engineer
                    </div>
                    <div className="text-xs text-[#697586]">
                      Targeting: Remote, Hybrid • $140,000+
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white p-5 rounded-xl border border-[#E6E8ED] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#697586] uppercase">
                        Verified Sources
                      </span>
                      <Badge variant="success">Official APIs</Badge>
                    </div>
                    <div className="text-sm font-bold text-[#172B4D]">
                      Greenhouse & Lever Boards
                    </div>
                    <div className="text-xs text-[#697586]">
                      Live synchronization without scraping
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-5 rounded-xl border border-[#E6E8ED] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#697586] uppercase">
                        Automation Guard
                      </span>
                      <Badge variant="neutral">Review First</Badge>
                    </div>
                    <div className="text-sm font-bold text-[#172B4D]">
                      Approval Required
                    </div>
                    <div className="text-xs text-[#697586]">
                      Max 5/day • Server-enforced limits
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 border-b border-[#E6E8ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="primary" className="mb-3">
                Workflow
              </Badge>
              <h2 className="text-3xl font-extrabold text-[#172B4D] tracking-tight">
                How Job Finder Works
              </h2>
              <p className="text-[#697586] text-base mt-2">
                A structured four-step path from your resume to verified opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-2">
                  Profile & Preferences
                </h3>
                <p className="text-sm text-[#697586] leading-relaxed">
                  Define your exact target titles, desired salary, remote preferences, and skill priorities.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-2">
                  Authorized Discovery
                </h3>
                <p className="text-sm text-[#697586] leading-relaxed">
                  Fetch live postings directly from official ATS boards and verified company career portals.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-2">
                  Intelligent Matching
                </h3>
                <p className="text-sm text-[#697586] leading-relaxed">
                  Evaluate real compatibility criteria, identify skill overlap, and flag missing requirements.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-[#E6E8ED] relative">
                <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#2563EB] flex items-center justify-center font-bold text-sm mb-4">
                  04
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-2">
                  Controlled Applications
                </h3>
                <p className="text-sm text-[#697586] leading-relaxed">
                  Review prepared materials with complete human oversight and explicit policy enforcement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES PILLARS */}
        <section id="features" className="py-24 border-b border-[#E6E8ED] bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="primary" className="mb-3">
                Features
              </Badge>
              <h2 className="text-3xl font-extrabold text-[#172B4D] tracking-tight">
                Architected for Candidates, Not Bots
              </h2>
              <p className="text-[#697586] text-base mt-2">
                Every feature respects candidate privacy and company application guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl border border-[#E6E8ED] bg-[#F8F7F3] space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E6E8ED] flex items-center justify-center text-[#2563EB]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172B4D]">
                  Resume Intelligence
                </h3>
                <p className="text-sm text-[#697586] leading-relaxed">
                  Structured metadata ingestion designed to extract key skills, work history, and seniority without exposing raw documents in unredacted logs.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl border border-[#E6E8ED] bg-[#F8F7F3] space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E6E8ED] flex items-center justify-center text-[#2563EB]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172B4D]">
                  Authorized Job Matching
                </h3>
                <p className="text-sm text-[#697586] leading-relaxed">
                  Compare listings against your specific career preferences, remote work requirements, compensation floors, and sponsorability status.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl border border-[#E6E8ED] bg-[#F8F7F3] space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#E6E8ED] flex items-center justify-center text-[#2563EB]">
                  <Sliders className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#172B4D]">
                  Server-Side Guardrails
                </h3>
                <p className="text-sm text-[#697586] leading-relaxed">
                  Daily and weekly application caps enforced in the database. Excluded employers and uncertain questionnaire answers trigger mandatory human handoff.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRIVACY & COMPLIANCE SECTION */}
        <section id="privacy-automation" className="py-24 border-b border-[#E6E8ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl border border-[#E6E8ED] p-8 sm:p-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#15803D] bg-[#F0FDF4] px-3 py-1.5 rounded-full border border-[#BBF7D0] mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Strict Safety Manifesto</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight mb-6">
                  Privacy and Authorized Automation
                </h2>
                <p className="text-base text-[#697586] leading-relaxed mb-8">
                  Job applications reflect your personal reputation. Our system is built with strict architectural safeguards:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#263449]">
                      <strong>Disabled by default:</strong> Automation requires explicit user opt-in and provider whitelist approval.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#263449]">
                      <strong>Zero Scraping:</strong> We only discover jobs through documented APIs and official career portals.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#263449]">
                      <strong>Anti-Bot Compliance:</strong> We never bypass CAPTCHA, authentication screens, or rate limits.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                    <span className="text-sm text-[#263449]">
                      <strong>No Fabricated Answers:</strong> Ambiguous questions require your direct review.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section id="faq" className="py-24 border-b border-[#E6E8ED]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="primary" className="mb-3">
                FAQ
              </Badge>
              <h2 className="text-3xl font-extrabold text-[#172B4D] tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-[#697586] text-base mt-2">
                Real information about how Job Finder operates and protects your job search.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-[#E6E8ED] overflow-hidden transition-all duration-150"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 focus-ring cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-bold text-[#172B4D]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#697586] transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-[#2563EB]" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm text-[#697586] leading-relaxed border-t border-[#F4F5F7] pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-[#EEF4FF] border-b border-[#D0E2FF]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B4D] tracking-tight">
              Ready to elevate your job search?
            </h2>
            <p className="text-base text-[#42526E] max-w-xl mx-auto leading-relaxed">
              Create an account in seconds. Configure your preferences and experience organized, authorized career discovery.
            </p>
            <div className="pt-2">
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="shadow-xs">
                  Create Your Account
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
