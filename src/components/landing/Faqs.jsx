import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../../utils/data";

const FaqItem = ({ faq, isOpen, onClick, index }) => (
  <div 
    className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary-dark/50 transition-colors duration-200 animate-fade-in"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <button 
      onClick={onClick} 
      className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 cursor-pointer transition-colors duration-200"
    >
      <span className="text-lg font-medium text-primary-dark pr-4 text-left">{faq.question}</span>
      <ChevronDown className={`w-6 h-6 text-primary-dark transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
    </button>
    {isOpen && (
      <div className="px-6 pt-6 pb-6 text-primary-dark leading-relaxed border-t border-gray-100 animate-slide-down bg-gray-50">
        {faq.answer}
      </div>
    )}
  </div>
);

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-dark mb-4 animate-slide-up">Lorem Ipsum Dolor Sit Amet</h2>
          <p className="text-xl text-primary-dark max-w-3xl mx-auto animate-slide-up animation-delay-100">Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <FaqItem 
              key={index} 
              faq={faq} 
              isOpen={openIndex === index} 
              onClick={() => handleClick(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
};

export default Faqs;
