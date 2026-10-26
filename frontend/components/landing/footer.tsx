import React from "react";
import Link from "next/link";
import { Briefcase, ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-white border-t border-[#E6E8ED] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-[#172B4D]">Job Finder</span>
            </div>
            <p className="text-sm text-[#697586] leading-relaxed">
              AI-assisted job discovery and application management operating strictly through official career pages and authorized integrations.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#15803D] font-medium bg-[#F0FDF4] px-3 py-1.5 rounded-lg border border-[#BBF7D0] w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Compliance-First Automation</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[#697586]">
              <li>
                <Link href="#features" className="hover:text-[#2563EB] transition-colors">
                  Resume Intelligence
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[#2563EB] transition-colors">
                  Smart Job Matching
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
                  Application Tracking
                </Link>
              </li>
              <li>
                <Link href="#privacy-automation" className="hover:text-[#2563EB] transition-colors">
                  Automation Guardrails
                </Link>
              </li>
            </ul>
          </div>

          {/* Integrations */}
          <div>
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-4">
              Integrations
            </h4>
            <ul className="space-y-2.5 text-sm text-[#697586]">
              <li>
                <span className="text-[#263449]">Greenhouse Board API</span>
              </li>
              <li>
                <span className="text-[#263449]">Lever Postings API</span>
              </li>
              <li>
                <span className="text-[#263449]">Official Career Portals</span>
              </li>
              <li>
                <span className="text-[#263449]">RESTful JSON Feeds</span>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-bold text-[#172B4D] uppercase tracking-wider mb-4">
              Governance & Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-[#697586]">
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer">Anti-Scraping Compliance</span>
              </li>
              <li>
                <span className="hover:text-[#2563EB] cursor-pointer">Contact Support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E6E8ED] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#697586]">
          <p>© 2026 Job Finder Platform. All rights reserved.</p>
          <p>
            Designed with restrained SaaS aesthetics. No unauthorized web scraping or automated CAPTCHA bypassing.
          </p>
        </div>
      </div>
    </footer>
  );
}
