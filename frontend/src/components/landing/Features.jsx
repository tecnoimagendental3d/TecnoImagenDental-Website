import { ArrowRight } from "lucide-react"
import { FEATURES } from "../../utils/data"
import { motion } from "framer-motion"

const Features = () => {
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
    <section id="features" className="py-20 lg:py-28 bg-white">
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
            Lorem Ipsum Dolor Sit Amet
          </motion.h2>
          <motion.p
            className="text-xl text-primary-dark max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </motion.p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 border border-gray-100 group"
              variants={cardVariants}
              whileHover={{ y: -12, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-primary-teal/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-orange/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary-dark group-hover:text-primary-orange transition-all duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-4 group-hover:text-primary-teal transition-colors duration-300">{feature.title}</h3>
              <p className="text-primary-dark leading-relaxed mb-4">{feature.description}</p>
              <a
                href="#"
                className="inline-flex items-center text-primary-dark font-medium mt-4 hover:text-primary-teal transition-all duration-300 group-hover:translate-x-2"
              >
                Lorem Ipsum <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
