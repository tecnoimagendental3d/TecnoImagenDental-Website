import DESIGN_IMG_1 from "../../assets/Design/01-Diseño-Feed.png";
import DESIGN_IMG_2 from "../../assets/Design/02-Diseño-Feed.png";
import DESIGN_IMG_3 from "../../assets/Design/03-Diseño-Feed.png";
import { motion } from "framer-motion";

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-primary-dark leading-tight mb-6"
            variants={itemVariants}
          >
            TecnoImagen Dental 3D
          </motion.h1>
          {/* <motion.p
            className="text-base sm:text-xl text-primary-dark mb-8 leading-relaxed max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
          </motion.p> */}
        </motion.div>
        <motion.div
          className="mt-12 sm:mt-16 relative max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              variants={imageVariants}
            >
              <img
                src={DESIGN_IMG_1}
                alt="Design 1"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-orange opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </motion.div>
            <motion.div
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              variants={imageVariants}
              transition={{ delay: 0.2 }}
            >
              <img
                src={DESIGN_IMG_1}
                alt="Design 2"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-teal opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </motion.div>
            <motion.div
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              variants={imageVariants}
              transition={{ delay: 0.4 }}
            >
              <img
                src={DESIGN_IMG_1}
                alt="Design 3"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary-orange opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
