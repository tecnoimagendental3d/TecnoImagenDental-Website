import React from 'react'
import { Quote } from 'lucide-react'
import { TESTIMONIALS } from '../../utils/data'
import DESIGN_IMG_4 from '../../assets/Design/04-Diseño-Feed.png';
import DESIGN_IMG_5 from '../../assets/Design/05-Diseño-Feed.png';
import DESIGN_PROFILE from '../../assets/Design/Diseño-Perfil.png';
import { motion } from "framer-motion";

const Testimonials = () => {
  const avatarImages = [DESIGN_PROFILE, DESIGN_IMG_4, DESIGN_IMG_5];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };
  
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-extrabold text-primary-dark mb-4"
            variants={itemVariants}
          >
            Lorem Ipsum Dolor Sit
          </motion.h2>
          <motion.p
            className="text-xl text-primary-dark max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </motion.p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 relative group border border-gray-100"
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute -top-4 left-8 w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                <Quote className="w-5 h-5" />
              </div>
              <p className="text-primary-dark mb-6 leading-relaxed italic text-lg group-hover:text-primary-teal transition-colors duration-300">"{testimonial.quote}"</p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary-orange transition-all duration-300 group-hover:scale-110">
                  <img
                    src={avatarImages[index % avatarImages.length]}
                    alt={testimonial.author}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-primary-dark group-hover:text-primary-teal transition-colors duration-300">{testimonial.author}</p>
                  <p className="text-primary-dark text-sm group-hover:text-primary-orange transition-colors duration-300">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
