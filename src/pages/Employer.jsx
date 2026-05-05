import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, CheckCircle, Users, Globe, FileText,
  ShieldCheck, ArrowRight, Star, Building2, Handshake,
  Plane, Award, ChevronDown, Phone, Mail,
  Factory, Stethoscope, Utensils, Tractor, HardHat, Truck,
  BarChart3, MapPin
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

// ─── SVG ILLUSTRATIONS ────────────────────────────────────────────────────────

const HiringIllustration = () => (
  <svg viewBox="0 0 540 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="540" height="420" rx="20" fill="#F3F6FF"/>
    <circle cx="460" cy="60" r="55" fill="#D4AF3718"/>
    <circle cx="80" cy="360" r="40" fill="#0B1F3A0D"/>

    {/* Building */}
    <rect x="40" y="100" width="140" height="240" rx="6" fill="#0B1F3A"/>
    <rect x="40" y="100" width="140" height="16" rx="6" fill="#1A3360"/>
    {[0,1,2,3].map(row => [0,1,2].map(col => (
      <rect key={`w${row}${col}`}
        x={54 + col * 40} y={132 + row * 44}
        width={22} height={28} rx={3}
        fill={`#D4AF37`} opacity={0.3 + (row + col) * 0.12}
      />
    )))}
    <rect x="88" y="294" width="44" height="46" rx="4" fill="#D4AF37" opacity="0.9"/>
    <circle cx="125" cy="318" r="3" fill="#0B1F3A"/>
    <rect x="40" y="348" width="140" height="24" rx="0" fill="#D4AF37"/>
    <text x="110" y="364" fill="#0B1F3A" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="1.5">SNJ GLOBAL</text>

    {/* Globe */}
    <circle cx="300" cy="210" r="100" fill="#E8EEFF" stroke="#0B1F3A" strokeWidth="1.5"/>
    <ellipse cx="300" cy="210" rx="40" ry="100" fill="none" stroke="#0B1F3A" strokeWidth="1" opacity="0.25"/>
    <ellipse cx="300" cy="210" rx="80" ry="100" fill="none" stroke="#0B1F3A" strokeWidth="1" opacity="0.15"/>
    <line x1="200" y1="210" x2="400" y2="210" stroke="#0B1F3A" strokeWidth="1" opacity="0.25"/>
    <line x1="208" y1="175" x2="392" y2="175" stroke="#0B1F3A" strokeWidth="1" opacity="0.18"/>
    <line x1="208" y1="245" x2="392" y2="245" stroke="#0B1F3A" strokeWidth="1" opacity="0.18"/>
    <line x1="220" y1="145" x2="380" y2="145" stroke="#0B1F3A" strokeWidth="1" opacity="0.12"/>
    <line x1="220" y1="275" x2="380" y2="275" stroke="#0B1F3A" strokeWidth="1" opacity="0.12"/>
    <path d="M255 190 Q268 182 282 186 Q294 180 308 186 Q315 195 307 202 Q295 207 280 202 Q266 205 255 190Z" fill="#D4AF37" opacity="0.75"/>
    <path d="M318 184 Q330 179 342 185 Q348 194 341 202 Q331 205 321 199 Q314 192 318 184Z" fill="#D4AF37" opacity="0.55"/>
    <path d="M248 215 Q260 210 270 218 Q274 228 267 234 Q257 236 250 229 Q244 222 248 215Z" fill="#0B1F3A" opacity="0.45"/>
    <path d="M280 220 Q298 213 316 222 Q323 233 316 241 Q303 244 289 237 Q278 230 280 220Z" fill="#D4AF37" opacity="0.5"/>
    <path d="M330 195 Q342 190 352 198 Q357 207 350 213 Q339 215 331 210 Q325 204 330 195Z" fill="#D4AF37" opacity="0.4"/>

    {/* Worker figures */}
    <circle cx="192" cy="318" r="18" fill="#0B1F3A"/>
    <ellipse cx="192" cy="303" rx="22" ry="9" fill="#D4AF37"/>
    <rect x="178" y="298" width="28" height="8" rx="4" fill="#D4AF37"/>
    <rect x="184" y="336" width="16" height="30" rx="6" fill="#1A3360"/>
    <rect x="175" y="340" width="12" height="22" rx="4" fill="#1A3360"/>
    <rect x="197" y="340" width="12" height="22" rx="4" fill="#1A3360"/>
    <rect x="188" y="354" width="6" height="20" rx="2" fill="#D4AF37"/>
    <rect x="184" y="350" width="14" height="7" rx="2" fill="#D4AF37"/>

    <circle cx="300" cy="312" r="18" fill="#D4AF37"/>
    <rect x="292" y="330" width="16" height="34" rx="6" fill="#0B1F3A" opacity="0.15"/>
    <polygon points="298,334 302,334 305,355 300,358 295,355" fill="#0B1F3A" opacity="0.6"/>
    <rect x="297" y="330" width="6" height="6" rx="1" fill="#0B1F3A" opacity="0.4"/>
    <rect x="286" y="360" width="28" height="18" rx="4" fill="#0B1F3A"/>
    <rect x="293" y="355" width="14" height="7" rx="2" fill="#0B1F3A" opacity="0.6"/>
    <line x1="286" y1="369" x2="314" y2="369" stroke="#D4AF37" strokeWidth="1.5"/>
    <circle cx="300" cy="369" r="2" fill="#D4AF37"/>

    <circle cx="408" cy="318" r="18" fill="#3B82F6"/>
    <ellipse cx="408" cy="302" rx="26" ry="9" fill="#D4AF37"/>
    <rect x="396" y="296" width="24" height="9" rx="5" fill="#D4AF37" opacity="0.85"/>
    <rect x="400" y="336" width="16" height="30" rx="6" fill="#2563EB"/>
    <rect x="390" y="340" width="13" height="22" rx="4" fill="#2563EB"/>
    <rect x="413" y="340" width="13" height="22" rx="4" fill="#2563EB"/>
    <path d="M404 362 Q396 348 400 338" stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="398" cy="341" rx="9" ry="5" fill="#22C55E" opacity="0.8"/>
    <ellipse cx="397" cy="348" rx="7" ry="4" fill="#16A34A" opacity="0.7"/>

    <path d="M220 278 Q220 308 195 316" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5,4" fill="none"/>
    <path d="M300 310 L300 306" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4,3" fill="none"/>
    <path d="M380 278 Q390 300 405 314" stroke="#0B1F3A" strokeWidth="1.5" strokeDasharray="5,4" fill="none" opacity="0.5"/>

    {/* Global HQ pin */}
    <circle cx="296" cy="188" r="8" fill="#D4AF37"/>
    <circle cx="296" cy="188" r="4" fill="#0B1F3A"/>
    <line x1="296" y1="196" x2="296" y2="206" stroke="#D4AF37" strokeWidth="2"/>
    <rect x="256" y="170" width="80" height="16" rx="8" fill="#0B1F3A"/>
    <text x="296" y="182" fill="#D4AF37" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="1">GLOBAL HQ</text>

    {/* Stats chips */}
    <rect x="36" y="46" width="108" height="34" rx="17" fill="#0B1F3A"/>
    <text x="90" y="68" fill="#D4AF37" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">1000+ Hired</text>

    <rect x="396" y="356" width="112" height="34" rx="17" fill="#D4AF37"/>
    <text x="452" y="378" fill="#0B1F3A" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">50+ Countries</text>

    {/* Verified badge */}
    <circle cx="464" cy="110" r="32" fill="#0B1F3A"/>
    <circle cx="464" cy="110" r="26" fill="#1A3360"/>
    <path d="M451 110 L460 119 L477 96" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="464" y="132" fill="#D4AF37" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">VERIFIED</text>
  </svg>
);

const GlobalNetworkIllustration = () => (
  <svg viewBox="0 0 540 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="540" height="400" rx="20" fill="#F3F6FF"/>
    <circle cx="60" cy="60" r="40" fill="#D4AF3710"/>
    <circle cx="490" cy="350" r="50" fill="#0B1F3A08"/>

    {/* Globe */}
    <circle cx="270" cy="200" r="140" fill="#E8EEFF" stroke="#0B1F3A" strokeWidth="1.5"/>
    <ellipse cx="270" cy="200" rx="55" ry="140" fill="none" stroke="#0B1F3A" strokeWidth="1" opacity="0.2"/>
    <ellipse cx="270" cy="200" rx="110" ry="140" fill="none" stroke="#0B1F3A" strokeWidth="1" opacity="0.12"/>
    <line x1="130" y1="200" x2="410" y2="200" stroke="#0B1F3A" strokeWidth="1" opacity="0.2"/>
    <line x1="138" y1="160" x2="402" y2="160" stroke="#0B1F3A" strokeWidth="0.8" opacity="0.15"/>
    <line x1="138" y1="240" x2="402" y2="240" stroke="#0B1F3A" strokeWidth="0.8" opacity="0.15"/>
    <line x1="148" y1="128" x2="392" y2="128" stroke="#0B1F3A" strokeWidth="0.6" opacity="0.1"/>
    <line x1="148" y1="272" x2="392" y2="272" stroke="#0B1F3A" strokeWidth="0.6" opacity="0.1"/>

    {/* Continents */}
    <path d="M238 170 Q252 162 270 167 Q285 160 300 167 Q310 175 305 184 Q292 189 274 184 Q258 187 245 180 Q234 176 238 170Z" fill="#D4AF37" opacity="0.7"/>
    <path d="M312 164 Q325 159 338 166 Q345 175 338 183 Q327 186 316 180 Q308 173 312 164Z" fill="#D4AF37" opacity="0.5"/>
    <path d="M244 198 Q257 192 268 200 Q273 212 266 220 Q255 224 246 217 Q238 208 244 198Z" fill="#0B1F3A" opacity="0.4"/>
    <path d="M178 188 Q188 183 196 190 Q200 200 193 206 Q183 208 177 201 Q172 195 178 188Z" fill="#D4AF37" opacity="0.45"/>
    <path d="M322 188 Q336 183 350 191 Q356 200 349 208 Q337 211 325 205 Q318 198 322 188Z" fill="#D4AF37" opacity="0.5"/>

    {/* Region pins */}
    {/* Asia */}
    <circle cx="325" cy="174" r="11" fill="#D4AF37" opacity="0.95"/>
    <circle cx="325" cy="174" r="5" fill="#0B1F3A"/>
    <line x1="325" y1="163" x2="325" y2="148" stroke="#D4AF37" strokeWidth="2"/>
    <rect x="298" y="132" width="54" height="16" rx="8" fill="#D4AF37"/>
    <text x="325" y="144" fill="#0B1F3A" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">ASIA</text>

    {/* Africa */}
    <circle cx="255" cy="210" r="11" fill="#0B1F3A" opacity="0.9"/>
    <circle cx="255" cy="210" r="5" fill="#D4AF37"/>
    <line x1="255" y1="221" x2="255" y2="240" stroke="#0B1F3A" strokeWidth="2"/>
    <rect x="228" y="240" width="54" height="16" rx="8" fill="#0B1F3A"/>
    <text x="255" y="252" fill="#D4AF37" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.3">AFRICA</text>

    {/* Americas */}
    <circle cx="180" cy="192" r="11" fill="#3B82F6" opacity="0.9"/>
    <circle cx="180" cy="192" r="5" fill="white"/>
    <line x1="180" y1="181" x2="180" y2="162" stroke="#3B82F6" strokeWidth="2"/>
    <rect x="152" y="146" width="56" height="16" rx="8" fill="#3B82F6"/>
    <text x="180" y="158" fill="white" fontSize="8.5" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.3">AMERICAS</text>

    {/* Global HQ star */}
    <circle cx="270" cy="200" r="16" fill="#D4AF37"/>
    <text x="270" y="205" fill="#0B1F3A" fontSize="16" textAnchor="middle" fontWeight="bold">★</text>
    <rect x="228" y="220" width="84" height="18" rx="9" fill="#0B1F3A"/>
    <text x="270" y="233" fill="#D4AF37" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="1">SNJ GLOBAL HQ</text>

    {/* Connection lines */}
    <line x1="325" y1="185" x2="286" y2="200" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.8"/>
    <line x1="255" y1="210" x2="265" y2="208" stroke="#0B1F3A" strokeWidth="1.5" strokeDasharray="5,4" opacity="0.6"/>
    <line x1="191" y1="196" x2="254" y2="200" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.7"/>

    {/* Bottom label */}
    <rect x="115" y="358" width="310" height="30" rx="15" fill="#0B1F3A"/>
    <text x="270" y="378" fill="#D4AF37" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">Global Recruitment Network — 50+ Countries</text>

    {/* Side stat pills */}
    <rect x="40" y="160" width="70" height="52" rx="12" fill="white" stroke="#0B1F3A" strokeWidth="1" opacity="0.6"/>
    <text x="75" y="182" fill="#0B1F3A" fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">50+</text>
    <text x="75" y="198" fill="#0B1F3A" fontSize="8" fontWeight="500" textAnchor="middle" fontFamily="'Times New Roman', serif" opacity="0.6">Countries</text>

    <rect x="430" y="160" width="70" height="52" rx="12" fill="white" stroke="#0B1F3A" strokeWidth="1" opacity="0.6"/>
    <text x="465" y="182" fill="#0B1F3A" fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">1M+</text>
    <text x="465" y="198" fill="#0B1F3A" fontSize="8" fontWeight="500" textAnchor="middle" fontFamily="'Times New Roman', serif" opacity="0.6">Candidates</text>
  </svg>
);

const ProcessIllustration = () => (
  <svg viewBox="0 0 540 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="540" height="440" rx="20" fill="#F3F6FF"/>
    <circle cx="480" cy="60" r="45" fill="#D4AF3710"/>
    <circle cx="60" cy="380" r="35" fill="#0B1F3A08"/>

    {/* Step 01 */}
    <circle cx="90" cy="100" r="44" fill="#0B1F3A1A"/>
    <circle cx="90" cy="100" r="34" fill="#0B1F3A"/>
    <text x="90" y="88" fill="#D4AF37" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">01</text>
    <rect x="78" y="92" width="24" height="18" rx="2" fill="white" opacity="0.9"/>
    <rect x="84" y="88" width="12" height="5" rx="2" fill="#D4AF37"/>
    <line x1="82" y1="99" x2="102" y2="99" stroke="#0B1F3A" strokeWidth="1.2" opacity="0.5"/>
    <line x1="82" y1="104" x2="102" y2="104" stroke="#0B1F3A" strokeWidth="1.2" opacity="0.5"/>
    <line x1="82" y1="109" x2="96" y2="109" stroke="#0B1F3A" strokeWidth="1.2" opacity="0.5"/>
    <text x="90" y="155" fill="#0B1F3A" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">Brief</text>

    <line x1="132" y1="100" x2="194" y2="100" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,4"/>
    <polygon points="194,95 204,100 194,105" fill="#D4AF37"/>

    {/* Step 02 */}
    <circle cx="250" cy="100" r="44" fill="#D4AF3720"/>
    <circle cx="250" cy="100" r="34" fill="#D4AF37"/>
    <text x="250" y="88" fill="#0B1F3A" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">02</text>
    <circle cx="247" cy="101" r="9" fill="none" stroke="#0B1F3A" strokeWidth="2.5"/>
    <line x1="253" y1="108" x2="261" y2="116" stroke="#0B1F3A" strokeWidth="2.5" strokeLinecap="round"/>
    <text x="250" y="155" fill="#0B1F3A" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">Source</text>

    <line x1="292" y1="100" x2="354" y2="100" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,4"/>
    <polygon points="354,95 364,100 354,105" fill="#D4AF37"/>

    {/* Step 03 */}
    <circle cx="410" cy="100" r="44" fill="#0B1F3A1A"/>
    <circle cx="410" cy="100" r="34" fill="#0B1F3A"/>
    <text x="410" y="88" fill="#D4AF37" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">03</text>
    <path d="M416 92 L420 96 L420 110 L398 110 L398 92 Z" fill="white" opacity="0.9"/>
    <path d="M416 92 L416 96 L420 96" fill="none" stroke="#0B1F3A" strokeWidth="1" opacity="0.3"/>
    <line x1="402" y1="101" x2="416" y2="101" stroke="#0B1F3A" strokeWidth="1" opacity="0.4"/>
    <line x1="402" y1="105" x2="416" y2="105" stroke="#0B1F3A" strokeWidth="1" opacity="0.4"/>
    <text x="410" y="155" fill="#0B1F3A" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">Documents</text>

    {/* Curved arrow to step 04 */}
    <path d="M450 148 Q490 200 450 260" stroke="#0B1F3A" strokeWidth="2" strokeDasharray="6,4" fill="none" opacity="0.5"/>
    <polygon points="445,256 454,264 459,252" fill="#0B1F3A" opacity="0.5"/>

    {/* Step 04 */}
    <circle cx="450" cy="290" r="44" fill="#D4AF3720"/>
    <circle cx="450" cy="290" r="34" fill="#D4AF37"/>
    <text x="450" y="278" fill="#0B1F3A" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">04</text>
    <rect x="436" y="284" width="28" height="20" rx="3" fill="#0B1F3A" opacity="0.85"/>
    <rect x="440" y="288" width="10" height="12" rx="1" fill="#D4AF37" opacity="0.8"/>
    <line x1="454" y1="290" x2="462" y2="290" stroke="white" strokeWidth="1.2" opacity="0.6"/>
    <line x1="454" y1="294" x2="462" y2="294" stroke="white" strokeWidth="1.2" opacity="0.6"/>
    <line x1="454" y1="298" x2="460" y2="298" stroke="white" strokeWidth="1.2" opacity="0.6"/>
    <text x="450" y="345" fill="#0B1F3A" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">Visa Process</text>

    {/* Curved arrow to step 05 */}
    <path d="M80 148 Q50 210 80 270" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6,4" fill="none" opacity="0.6"/>
    <polygon points="75,266 84,274 89,262" fill="#D4AF37" opacity="0.6"/>

    {/* Step 05 */}
    <circle cx="90" cy="300" r="44" fill="#0B1F3A1A"/>
    <circle cx="90" cy="300" r="34" fill="#0B1F3A"/>
    <text x="90" y="288" fill="#D4AF37" fontSize="9" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.5">05</text>
    <circle cx="90" cy="303" r="11" fill="none" stroke="#D4AF37" strokeWidth="2.2"/>
    <path d="M84 303 L89 308 L97 296" stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="90" y="355" fill="#0B1F3A" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">Onboarding</text>

    <path d="M420 300 Q270 260 130 300" stroke="#D4AF37" strokeWidth="2" strokeDasharray="6,4" fill="none" opacity="0.5"/>
    <polygon points="130,295 121,300 130,305" fill="#D4AF37" opacity="0.5"/>

    {/* Global ready chip */}
    <rect x="150" y="380" width="240" height="44" rx="22" fill="#0B1F3A"/>
    <circle cx="185" cy="402" r="10" fill="#D4AF37" opacity="0.2"/>
    <text x="280" y="400" fill="white" fontSize="10" fontWeight="700" fontFamily="'Times New Roman', serif" textAnchor="middle">Globally Compliant</text>
    <text x="280" y="415" fill="#D4AF37" fontSize="9" fontFamily="'Times New Roman', serif" textAnchor="middle">Work Permit &amp; Visa ✓</text>
  </svg>
);

const WorkerCategoryIllustration = () => (
  <svg viewBox="0 0 540 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="540" height="400" rx="20" fill="#F3F6FF"/>
    <circle cx="50" cy="50" r="35" fill="#D4AF3710"/>
    <circle cx="490" cy="360" r="45" fill="#0B1F3A08"/>

    {/* Blue-collar card */}
    <rect x="30" y="60" width="148" height="200" rx="16" fill="white" stroke="#0B1F3A" strokeWidth="1.2" opacity="0.15"/>
    <rect x="30" y="60" width="148" height="48" rx="16" fill="#0B1F3A"/>
    <rect x="30" y="92" width="148" height="16" rx="0" fill="#0B1F3A"/>
    <circle cx="104" cy="160" r="28" fill="#0B1F3A1A"/>
    <circle cx="104" cy="163" r="20" fill="#0B1F3A"/>
    <ellipse cx="104" cy="147" rx="26" ry="11" fill="#D4AF37"/>
    <rect x="88" y="140" width="32" height="10" rx="5" fill="#D4AF37"/>
    <circle cx="99" cy="159" r="2.5" fill="white" opacity="0.7"/>
    <circle cx="109" cy="159" r="2.5" fill="white" opacity="0.7"/>
    <path d="M99 166 Q104 170 109 166" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="93" y="183" width="22" height="28" rx="6" fill="#1A3360"/>
    <rect x="84" y="187" width="12" height="20" rx="4" fill="#1A3360"/>
    <rect x="112" y="187" width="12" height="20" rx="4" fill="#1A3360"/>
    <rect x="100" y="209" width="5" height="16" rx="1.5" fill="#D4AF37"/>
    <rect x="96" y="207" width="13" height="5" rx="1.5" fill="#D4AF37"/>
    <text x="104" y="237" fill="#0B1F3A" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">BLUE-COLLAR</text>
    <text x="104" y="250" fill="#0B1F3A" fontSize="8" textAnchor="middle" fontFamily="'Times New Roman', serif" opacity="0.55">Construction · Logistics</text>

    {/* White-collar card */}
    <rect x="196" y="60" width="148" height="200" rx="16" fill="white" stroke="#D4AF37" strokeWidth="2"/>
    <rect x="196" y="60" width="148" height="48" rx="16" fill="#D4AF37"/>
    <rect x="196" y="92" width="148" height="16" rx="0" fill="#D4AF37"/>
    <circle cx="270" cy="158" r="28" fill="#D4AF3720"/>
    <circle cx="270" cy="161" r="20" fill="#D4AF37"/>
    <rect x="259" y="181" width="22" height="30" rx="7" fill="#0B1F3A" opacity="0.12"/>
    <polygon points="267,184 273,184 276,205 270,208 264,205" fill="#0B1F3A" opacity="0.55"/>
    <circle cx="265" cy="157" r="2.5" fill="#0B1F3A" opacity="0.5"/>
    <circle cx="275" cy="157" r="2.5" fill="#0B1F3A" opacity="0.5"/>
    <path d="M265 164 Q270 168 275 164" stroke="#0B1F3A" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
    <rect x="255" y="208" width="30" height="20" rx="4" fill="#0B1F3A"/>
    <rect x="262" y="203" width="16" height="7" rx="2" fill="#0B1F3A" opacity="0.6"/>
    <line x1="255" y1="218" x2="285" y2="218" stroke="#D4AF37" strokeWidth="1.5"/>
    <circle cx="270" cy="218" r="2" fill="#D4AF37"/>
    <text x="270" y="240" fill="#0B1F3A" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">WHITE-COLLAR</text>
    <text x="270" y="253" fill="#0B1F3A" fontSize="8" textAnchor="middle" fontFamily="'Times New Roman', serif" opacity="0.55">Healthcare · Office</text>

    {/* Seasonal card */}
    <rect x="362" y="60" width="148" height="200" rx="16" fill="white" stroke="#0B1F3A" strokeWidth="1.2" opacity="0.15"/>
    <rect x="362" y="60" width="148" height="48" rx="16" fill="#0B1F3A"/>
    <rect x="362" y="92" width="148" height="16" rx="0" fill="#0B1F3A"/>
    <circle cx="436" cy="158" r="28" fill="#3B82F620"/>
    <circle cx="436" cy="161" r="20" fill="#3B82F6"/>
    <ellipse cx="436" cy="143" rx="28" ry="10" fill="#D4AF37"/>
    <rect x="420" y="136" width="32" height="10" rx="5" fill="#D4AF37" opacity="0.9"/>
    <circle cx="431" cy="157" r="2.5" fill="white" opacity="0.7"/>
    <circle cx="441" cy="157" r="2.5" fill="white" opacity="0.7"/>
    <path d="M431 164 Q436 168 441 164" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="425" y="181" width="22" height="28" rx="6" fill="#2563EB"/>
    <rect x="416" y="185" width="12" height="20" rx="4" fill="#2563EB"/>
    <rect x="444" y="185" width="12" height="20" rx="4" fill="#2563EB"/>
    <path d="M430 207 Q422 193 426 183" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="424" cy="185" rx="8" ry="5" fill="#22C55E" opacity="0.85"/>
    <ellipse cx="422" cy="192" rx="7" ry="4" fill="#16A34A" opacity="0.75"/>
    <text x="436" y="237" fill="#0B1F3A" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif">SEASONAL</text>
    <text x="436" y="250" fill="#0B1F3A" fontSize="8" textAnchor="middle" fontFamily="'Times New Roman', serif" opacity="0.55">Agriculture · Farms</text>

    {/* Bottom banner */}
    <rect x="30" y="290" width="480" height="40" rx="20" fill="#0B1F3A"/>
    <circle cx="60" cy="310" r="12" fill="#D4AF37" opacity="0.2"/>
    <path d="M53 310 L59 316 L68 304" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <text x="270" y="315" fill="#D4AF37" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="'Times New Roman', serif" letterSpacing="0.4">All Workers Legally Documented &amp; Pre-Screened Worldwide</text>

    <text x="46" y="80" fill="#D4AF37" fontSize="14" opacity="0.5">★</text>
    <text x="482" y="80" fill="#D4AF37" fontSize="10" opacity="0.4">★</text>
    <text x="264" y="46" fill="#D4AF37" fontSize="8" opacity="0.3">★</text>
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────

const whyPoints = [
  { icon: <ShieldCheck size={22} />, title: 'Legally Compliant Hiring', desc: 'Full adherence to international labor laws and immigration regulations in every destination country.' },
  { icon: <FileText size={22} />, title: 'End-to-End Documentation', desc: 'From job offer to work permit and national visa — we manage every document globally.' },
  { icon: <Users size={22} />, title: 'Pre-Screened Talent Pool', desc: 'Verified candidates from Asia, Africa, EU, Americas & CIS — skilled, semi-skilled, and general workers.' },
  { icon: <Globe size={22} />, title: 'Global Sourcing Network', desc: 'Recruitment operations spanning 50+ countries across 6 continents.' },
  { icon: <Handshake size={22} />, title: 'Transparent Contracts', desc: 'Clear pricing, zero hidden charges, and honest timelines upfront — every time.' },
  { icon: <Award size={22} />, title: 'Trusted by 1000+ Employers', desc: 'Companies across Europe, the Middle East, North America, Asia-Pacific, and Africa.' },
];

const solutions = [
  {
    icon: <Building2 size={28} />,
    title: 'Register as an Employer Partner',
    desc: 'Hiring skilled or semi-skilled workers for your company anywhere in the world? SNJ GlobalRoutes connects you with reliable international talent. We provide complete legal recruitment support, work permit processing, and end-to-end onboarding solutions tailored to your country and industry.',
    cta: 'Register as Employer',
    path: '/register/employer',
    highlight: true,
  },
  {
    icon: <Users size={28} />,
    title: 'Job Seekers Registration',
    desc: 'Looking for a job abroad? SNJ GlobalRoutes connects you with verified global employers offering legal job offers and work permits. We provide full visa support, document preparation, and transparent migration services worldwide.',
    cta: 'Job Seekers',
    path: '/register/candidate',
  },
  {
    icon: <Handshake size={28} />,
    title: 'Register as a Recruitment Partner',
    desc: 'Are you a recruiter aiming to supply workers globally? SNJ GlobalRoutes offers trusted employer connections, verified job contracts, work permit assistance, and complete visa support across 50+ countries. Grow your recruitment business by partnering with a worldwide migration leader.',
    cta: 'Recruiter',
    path: '/register/recruiter',
  },
];

const industries = [
  { icon: <HardHat size={20} />, name: 'Construction', desc: 'Skilled laborers, welders, bricklayers, electricians, plumbers' },
  { icon: <Truck size={20} />, name: 'Logistics', desc: 'Warehouse assistants, professional drivers, forklift operators' },
  { icon: <Factory size={20} />, name: 'Manufacturing', desc: 'Machine operators, production line staff, assembly workers' },
  { icon: <Tractor size={20} />, name: 'Agriculture', desc: 'Seasonal farm labor, greenhouse staff, fruit & vegetable pickers' },
  { icon: <Utensils size={20} />, name: 'Hospitality', desc: 'Hotel housekeepers, restaurant waitstaff, kitchen assistants, chefs' },
  { icon: <Stethoscope size={20} />, name: 'Healthcare', desc: 'Certified nurses, elderly caregivers, medical support staff' },
];

const steps = [
  { num: '01', title: 'Share Your Hiring Needs', desc: 'Provide us with your job role, skill requirements, number of workers needed, salary range, and destination country.' },
  { num: '02', title: 'We Source & Screen Globally', desc: 'We source and screen candidates from Asia, Africa, the Americas, and the EU who match your needs and qualify for work permits in your target country.' },
  { num: '03', title: 'Employer Prepares Documents', desc: 'You issue the employment contract, confirm job details, and sign the necessary paperwork required by your country\'s immigration authority.' },
  { num: '04', title: 'SNJ Manages the Visa Process', desc: 'We handle embassy appointments, cover letters, invitation letters, and all supporting documentation for the national work visa in your destination country.' },
  { num: '05', title: 'Arrival & Onboarding Worldwide', desc: 'We assist workers with travel arrangements, accommodation setup, local registration, and onboarding so they are work-ready from day one — anywhere in the world.' },
];

const categories = [
  { label: 'Blue-Collar Workers', detail: 'Construction workers, welders, electricians, plumbers, drivers, warehouse staff, machine operators' },
  { label: 'White-Collar Workers', detail: 'Hospitality professionals, nurses, caregivers, sales representatives, IT support, office assistants' },
  { label: 'Seasonal & Agricultural Workers', detail: 'Fruit and vegetable pickers, greenhouse workers, livestock assistants, and production line helpers' },
];

const stats = [
  { value: '1000+', label: 'Visa Successes', icon: <ShieldCheck size={20} /> },
  { value: '1M+',   label: 'Candidates Guided', icon: <Users size={20} /> },
  { value: '50+',   label: 'Destination Countries', icon: <Globe size={20} /> },
  { value: '5+',    label: 'Global Offices', icon: <Building2 size={20} /> },
];

const faqs = [
  { q: 'How long does the work permit process take?', a: 'Typically 4–10 weeks depending on the destination country and its immigration authority. We track your application and keep you updated throughout the process.' },
  { q: 'Which countries do you source workers from?', a: 'Asia (India, Nepal, Bangladesh, Vietnam, Sri Lanka, Philippines, Pakistan, Indonesia), Africa (Kenya, Nigeria, Ghana, Morocco, Egypt, Uganda), Americas (Mexico, Brazil, Colombia), and EU/EEA countries.' },
  { q: 'Which destination countries do you operate in?', a: 'We operate globally — including Europe (Poland, Germany, UK, Netherlands), the Middle East (UAE, Saudi Arabia, Qatar), Asia-Pacific, North America, and Africa. Contact us to confirm coverage in your specific country.' },
  { q: 'What documents does an employer need to provide?', a: 'A signed employment contract, job offer letter, company registration documents, and proof of legal business activity in your country. Requirements vary by destination — our team will guide you precisely.' },
  { q: 'Do you handle accommodation and onboarding?', a: 'Yes. We assist with accommodation search, local registration, health insurance, and full onboarding to ensure smooth integration — regardless of the destination country.' },
  { q: 'Is there a minimum number of workers per order?', a: 'No minimum. We support both single placements and bulk recruitment of 100+ workers for large industrial projects across any country.' },
];

// ═════════════════════════════════════════════════════════════════════════════
export default function EmployerPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white text-[#0B1F3A] font-['Times_New_Roman',_serif] overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 lg:px-16 overflow-hidden bg-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0B1F3A]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#0B1F3A]/8 border border-[#0B1F3A]/20 rounded-full px-5 py-2 text-[#0B1F3A] text-xs font-black uppercase tracking-[0.3em] mb-8">
              <Briefcase size={14} className="text-[#D4AF37]" /> Employer Solutions
            </motion.div>
            <motion.h1
  variants={fadeUp}
  className="text-2xl lg:text-4xl font-semibold uppercase leading-snug tracking-tight mb-4 text-[#0B1F3A]"
>
  Engage <span className="text-[#D4AF37]">Skilled Legal Professionals</span> Globally Through{' '}
  <span className="text-[#0B1F3A]">SNJ</span>{' '}
  <span className="text-[#D4AF37]">GlobalRoutes</span>
</motion.h1>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/70 text-base leading-relaxed mb-8 max-w-xl">
              SNJ GlobalRoutes is a licensed international recruitment consultancy specializing in the legal supply of skilled, semi-skilled, and general workers for employers across the globe. We help companies in every country overcome workforce shortages by connecting them with qualified international candidates from Asia, Africa, the Americas, and beyond.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/register/employer" className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:bg-[#D4AF37] hover:text-[#0B1F3A] transition-all shadow-lg text-sm border-2 border-[#0B1F3A]">
                Register as Employer <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 border-2 border-[#0B1F3A]/30 text-[#0B1F3A] font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-sm">
                How It Works
              </a>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
              <HiringIllustration />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="bg-white border-2 border-[#0B1F3A]/10 rounded-xl p-4 flex flex-col gap-2 hover:border-[#D4AF37] transition-all shadow-sm">
                  <div className="text-[#D4AF37]">{s.icon}</div>
                  <p className="text-2xl font-black text-[#0B1F3A]">{s.value}</p>
                  <p className="text-xs text-[#0B1F3A]/60 font-bold uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT / INTRO ─────────────────────────────────────────────────── */}
      <section className="py-16 px-6 lg:px-16 bg-[#0B1F3A]/3 border-y border-[#0B1F3A]/8">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-3 gap-8 text-[#0B1F3A]/70 text-sm leading-relaxed">
          <p>Our global recruitment process ensures full legal compliance with international immigration laws and labor standards in every destination country. We handle everything from candidate sourcing and screening to work permit processing and visa application support worldwide.</p>
          <p>We work closely with employers across every continent to understand their staffing needs and deliver tailored workforce solutions through verified, compliant procedures. Our approach is transparent, reliable, and focused on long-term employment success — globally.</p>
          <p>Trusted by hundreds of companies across Europe, the Middle East, Asia-Pacific, North America, and Africa — SNJ GlobalRoutes is your end-to-end workforce partner for international hiring, wherever your business operates.</p>
        </div>
      </section>

      {/* ── COMPREHENSIVE RECRUITMENT SUPPORT ─────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-6 text-[#0B1F3A]">
              Comprehensive <span className="text-[#D4AF37]">Recruitment Support</span> for Employers Worldwide
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/70 text-sm leading-relaxed mb-8">
              At SNJ GlobalRoutes, we provide full-cycle recruitment solutions to help employers across the globe legally hire skilled, semi-skilled, and general workers from Asia, Africa, the Americas, and the EU. Our process is fully compliant with each destination country's labor and immigration regulations.
            </motion.p>
            <motion.div variants={stagger} className="space-y-4">
              {[
                { title: 'Work Permit Assistance', desc: 'We prepare and submit all required documents for work permits in your destination country, including official job offers and employment contracts tailored to local law.' },
                { title: 'Visa Documentation Support', desc: 'Our team handles the entire visa application process — embassy appointments, invitation letters, document verification, and follow-up — for any destination worldwide.' },
                { title: 'Pre-Screened Global Candidates', desc: 'All workers are pre-verified, skilled, and ready to work. We source talent from reputable international labor markets based on your specific requirements.' },
                { title: 'Post-Arrival Services', desc: 'We assist with accommodation, local registration, health insurance, and onboarding services to ensure smooth integration — no matter the destination country.' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} className="flex gap-4 p-4 bg-white border-2 border-[#0B1F3A]/8 rounded-xl hover:border-[#D4AF37] transition-all shadow-sm">
                  <CheckCircle size={18} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#0B1F3A] font-black text-sm uppercase tracking-wider mb-1">{item.title}</p>
                    <p className="text-[#0B1F3A]/60 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
            <WorkerCategoryIllustration />
          </motion.div>
        </div>
      </section>

      {/* ── RECRUITMENT REGIONS ───────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-gray-50 border-y border-[#0B1F3A]/8">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
            <GlobalNetworkIllustration />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-6 text-[#0B1F3A]">
              Global Sourcing <span className="text-[#D4AF37]">Regions</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/70 text-sm leading-relaxed mb-6">
              SNJ GlobalRoutes specializes in sourcing and legally deploying skilled, semi-skilled, and general workers for employers' labor markets worldwide. All activities comply with international immigration law and the labor standards of each destination country.
            </motion.p>
            <motion.ul variants={stagger} className="space-y-3 text-sm">
              {[
                'Asia — India, Nepal, Bangladesh, Vietnam, Sri Lanka, Philippines, Pakistan, Indonesia',
                'Africa — Kenya, Nigeria, Ghana, Morocco, Egypt, Uganda, Tanzania, Ethiopia',
                'Americas — Mexico, Brazil, Colombia, Peru, Dominican Republic',
                'EU & EEA — Romania, Bulgaria, Croatia, Hungary, Lithuania, Slovakia, Latvia',
              ].map((item, i) => (
                <motion.li key={i} variants={fadeUp} custom={i} className="flex items-start gap-3 p-3 bg-white border border-[#0B1F3A]/10 rounded-lg">
                  <CheckCircle size={16} className="text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span className="text-[#0B1F3A]/80">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/50 text-xs mt-6 leading-relaxed">
              Each candidate is vetted, pre-screened, and processed according to the immigration laws of the destination country, ensuring legal compliance and successful integration into the local workforce.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── WORKER CATEGORIES ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-6 text-[#0B1F3A]">
              Worker <span className="text-[#D4AF37]">Categories</span> We Supply
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/70 text-sm leading-relaxed mb-8">
              At SNJ GlobalRoutes, we deliver end-to-end workforce solutions tailored to meet the diverse hiring needs of companies across every continent. Every candidate is legally documented, pre-screened, and fully qualified under the labor regulations of their destination country.
            </motion.p>
            <motion.div variants={stagger} className="space-y-4">
              {categories.map((cat, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} className="p-5 bg-white border-2 border-[#0B1F3A]/10 rounded-2xl hover:border-[#D4AF37] transition-all shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-[#D4AF37] rounded-full" />
                    <p className="text-[#0B1F3A] font-black text-sm uppercase tracking-wider">{cat.label}</p>
                  </div>
                  <p className="text-[#0B1F3A]/60 text-xs leading-relaxed pl-5">{cat.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-4">
            {[
              { pct: 85, label: 'Blue-Collar / Industrial', color: '#D4AF37' },
              { pct: 70, label: 'Hospitality & Healthcare', color: '#3B82F6' },
              { pct: 60, label: 'Agricultural & Seasonal', color: '#10B981' },
              { pct: 45, label: 'White-Collar / Office', color: '#8B5CF6' },
            ].map((bar, i) => (
              <div key={i} className="bg-white border-2 border-[#0B1F3A]/8 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between mb-3">
                  <p className="text-xs font-black uppercase tracking-wider text-[#0B1F3A]">{bar.label}</p>
                  <p className="text-xs font-black text-[#D4AF37]">{bar.pct}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: bar.color }}
                  />
                </div>
              </div>
            ))}
            <p className="text-[#0B1F3A]/40 text-xs text-center mt-4">We specialize in sourcing talent from Asia, Africa, the Americas, and the EU to fill high-demand roles in manufacturing, logistics, agriculture, healthcare, and hospitality — globally.</p>
          </motion.div>
        </div>
      </section>

      {/* ── INDUSTRIES WE SERVE ───────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-gray-50 border-y border-[#0B1F3A]/8">
        <div className="max-w-[1300px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#0B1F3A]/8 border border-[#0B1F3A]/20 rounded-full px-5 py-2 text-[#0B1F3A] text-xs font-black uppercase tracking-[0.3em] mb-6">
              <Factory size={14} className="text-[#D4AF37]" /> Sectors
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-4 text-[#0B1F3A]">
              Industries <span className="text-[#D4AF37]">We Serve</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/60 text-sm max-w-2xl mx-auto">
              SNJ GlobalRoutes partners with employers worldwide to deliver targeted recruitment solutions that address critical workforce shortages across all key industries.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="p-6 bg-white border-2 border-[#0B1F3A]/8 rounded-2xl hover:border-[#D4AF37] hover:shadow-md transition-all group cursor-default shadow-sm">
                <div className="w-12 h-12 bg-[#0B1F3A]/6 rounded-xl flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37]/15 transition-all">
                  {ind.icon}
                </div>
                <h3 className="text-[#0B1F3A] font-black text-sm uppercase tracking-wider mb-2">{ind.name}</h3>
                <p className="text-[#0B1F3A]/60 text-xs leading-relaxed">{ind.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
            <ProcessIllustration />
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-10 text-[#0B1F3A]">
              How the <span className="text-[#D4AF37]">Global Recruitment Process</span> Works
            </motion.h2>
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} custom={i} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#0B1F3A]/6 border-2 border-[#0B1F3A]/15 rounded-xl flex items-center justify-center text-[#0B1F3A] font-black text-sm group-hover:bg-[#0B1F3A] group-hover:text-[#D4AF37] group-hover:border-[#0B1F3A] transition-all">
                    {step.num}
                  </div>
                  <div>
                    <p className="text-[#0B1F3A] font-black text-sm uppercase tracking-wider mb-1">{step.title}</p>
                    <p className="text-[#0B1F3A]/60 text-xs leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHY CHOOSE SNJ ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-[#0B1F3A]">
        <div className="max-w-[1300px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-5 py-2 text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em] mb-6">
              <Star size={14} /> Why SNJ
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-4 text-white">
              Why Choose Us for <span className="text-[#D4AF37]">Global Hiring?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-sm max-w-2xl mx-auto">
              SNJ GlobalRoutes is a trusted worldwide recruitment agency delivering legally compliant and end-to-end staffing solutions tailored to employers across every continent.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPoints.map((pt, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-[#D4AF37]/50 transition-all group">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center text-[#D4AF37] mb-4 group-hover:bg-[#D4AF37]/20 transition-all">
                  {pt.icon}
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider mb-2">{pt.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{pt.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
            <Link to="/register/employer" className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0B1F3A] font-black uppercase tracking-[0.2em] px-10 py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-xl text-sm">
              Register Now <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── OUR SOLUTIONS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#0B1F3A]/8 border border-[#0B1F3A]/20 rounded-full px-5 py-2 text-[#0B1F3A] text-xs font-black uppercase tracking-[0.3em] mb-6">
              <BarChart3 size={14} className="text-[#D4AF37]" /> Solutions
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase leading-tight mb-3 text-[#0B1F3A]">
              Our <span className="text-[#D4AF37]">Solutions</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/60 text-sm">
              Connecting employers, job seekers, and recruitment agencies across 50+ countries worldwide.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid lg:grid-cols-3 gap-6">
            {solutions.map((sol, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className={`flex flex-col p-8 rounded-2xl border-2 transition-all group shadow-sm ${sol.highlight ? 'bg-[#0B1F3A] border-[#D4AF37]/40 hover:border-[#D4AF37]' : 'bg-white border-[#0B1F3A]/10 hover:border-[#D4AF37]'}`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${sol.highlight ? 'bg-[#D4AF37] text-[#0B1F3A]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'} transition-all group-hover:scale-110`}>
                  {sol.icon}
                </div>
                <h3 className={`font-black text-base uppercase tracking-wide mb-3 ${sol.highlight ? 'text-white' : 'text-[#0B1F3A]'}`}>{sol.title}</h3>
                <p className={`text-xs leading-relaxed flex-grow mb-6 ${sol.highlight ? 'text-gray-400' : 'text-[#0B1F3A]/60'}`}>{sol.desc}</p>
                <Link to={sol.path} className={`inline-flex items-center gap-2 font-black uppercase tracking-[0.15em] px-6 py-3 rounded-xl text-xs transition-all self-start ${sol.highlight ? 'bg-[#D4AF37] text-[#0B1F3A] hover:bg-yellow-400' : 'border-2 border-[#0B1F3A]/20 text-[#0B1F3A] hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}>
                  {sol.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-gray-50 border-y border-[#0B1F3A]/8">
        <div className="max-w-[900px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-14">
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-black uppercase mb-4 text-[#0B1F3A]">
              Do You Have Any <span className="text-[#D4AF37]">Questions?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#0B1F3A]/60 text-sm">
              At SNJ GlobalRoutes, we guide you every step of the way — from job search assistance to global work visa applications, anywhere in the world.
            </motion.p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white border-2 border-[#0B1F3A]/8 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-all"
                >
                  <span className="text-[#0B1F3A] font-black text-sm uppercase tracking-wider pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-[#D4AF37] flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-[#0B1F3A]/60 text-xs leading-relaxed border-t border-[#0B1F3A]/8 pt-4">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-[1300px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="relative bg-[#0B1F3A] border-2 border-[#D4AF37]/30 rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.4em] mb-4">Get Started Today</p>
              <h2 className="text-3xl lg:text-4xl font-black uppercase mb-4 text-white">
                Ready to Hire <span className="text-[#D4AF37]">Legal Workers</span> Anywhere in the World?
              </h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto mb-10">
                Contact us today to discuss your global workforce needs. We make the recruitment process smooth, safe, and successful for companies seeking international workers in any country.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:+8801348992268" className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl px-6 py-4 hover:border-[#D4AF37]/40 transition-all group">
                  <Phone size={20} className="text-[#D4AF37]" />
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Call Us</p>
                    <p className="text-white font-black text-sm">+880 1348-992268</p>
                  </div>
                </a>
                <a href="mailto:info@snjglobalroutes.com" className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl px-6 py-4 hover:border-[#D4AF37]/40 transition-all group">
                  <Mail size={20} className="text-[#D4AF37]" />
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Us</p>
                    <p className="text-white font-black text-sm">info@snjglobalroutes.com</p>
                  </div>
                </a>
                <Link to="/register/employer" className="flex items-center gap-3 bg-[#D4AF37] rounded-2xl px-8 py-4 hover:bg-yellow-400 transition-all">
                  <Briefcase size={20} className="text-[#0B1F3A]" />
                  <span className="text-[#0B1F3A] font-black text-sm uppercase tracking-wider">Register as Employer</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}