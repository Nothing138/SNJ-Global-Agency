import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "What types of visa do you offer?", answer: "We provide services for student visa, work visa, tourist visa, and business visa depending on your needs." },
  { question: "Which countries can I apply for through your agency?", answer: "We work with multiple countries including Serbia, Albania, Spain, Portugal, and other European destinations." },
  { question: "How long does visa processing take?", answer: "Processing time depends on the country but usually ranges from 2 weeks to 3 months." },
  { question: "What documents are required for a visa application?", answer: "Common documents include passport, bank statement, educational documents, and supporting papers based on visa type." },
  { question: "Can you guarantee visa approval?", answer: "While no one can guarantee approval, we maximize your chances by preparing a strong and accurate application." },

  { question: "Do you provide student visa support?", answer: "Yes, we assist with university selection, admission, and full visa processing." },
  { question: "Can you help with university admission?", answer: "Yes, we help you choose the right university and handle the application process." },
  { question: "Do I need IELTS for a student visa?", answer: "Some countries require IELTS, while others may offer alternatives or exemptions." },
  { question: "Can I work while studying abroad?", answer: "Yes, most countries allow part-time work for international students." },

  { question: "Do you provide tourist visa services?", answer: "Yes, we handle tourist visa applications with complete guidance." },
  { question: "Can you help plan my travel itinerary?", answer: "Yes, we assist with travel plans including accommodation and scheduling." },
  { question: "Is travel insurance required?", answer: "Yes, many countries require valid travel insurance for visa approval." },

  { question: "Do you provide flight booking services?", answer: "Yes, we offer competitive flight booking options for our clients." },
  { question: "Can I get the cheapest flight tickets through you?", answer: "We try to provide the best available deals with trusted airlines." },
  { question: "Do you assist with ticket rescheduling?", answer: "Yes, we help with rescheduling and travel support when needed." },

  { question: "What is Citizenship by Investment (CBI)?", answer: "Citizenship by Investment allows you to obtain a second passport by making a government-approved investment." },
  { question: "Which countries offer citizenship programs?", answer: "Popular countries include Dominica, St. Kitts & Nevis, Grenada, and Antigua & Barbuda." },
  { question: "How long does the citizenship process take?", answer: "Most citizenship applications are completed within 3 to 6 months." },
  { question: "What is the minimum investment required?", answer: "The minimum investment usually starts from $100,000 depending on the country." },
  { question: "Can I include my family in the application?", answer: "Yes, you can include your spouse, children, and sometimes parents." },
  { question: "Do I need to travel to get citizenship?", answer: "In most cases, no travel is required during the application process." },
  { question: "Is dual citizenship allowed?", answer: "Yes, most citizenship programs allow dual nationality." },

  { question: "What is SNJ Global Routes?", answer: "SNJ Global Routes is a professional consultancy providing visa, travel, and migration solutions." },
  { question: "Why should I choose SNJ Global Routes?", answer: "We offer trusted service, transparent pricing, and complete guidance from start to finish." },
  { question: "Do you provide complete support?", answer: "Yes, we provide end-to-end support including visa, travel, and documentation." },
  { question: "How experienced is your team?", answer: "Our team consists of experienced professionals in visa and immigration services." },
  { question: "How can I contact your support team?", answer: "You can contact us through phone, WhatsApp, or by visiting our office directly." }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-[#D4AF37] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        
        <h2 className="text-3xl font-bold text-center mb-8">
          Expert <span className="italic text-[#D4AF37]">Intelligence</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-[#D4AF37]/40 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-[#F8F5E6] transition"
              >
                <span className="font-medium text-[#0B1F3A]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`transition-transform duration-300 text-[#D4AF37] ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`px-5 overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 py-4" : "max-h-0"
                }`}
              >
                <p className="text-[#64748B]">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}