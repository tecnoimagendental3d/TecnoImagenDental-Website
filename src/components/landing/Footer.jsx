import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";
import LOGO from "../../assets/Logo/Logo-Horizontal06.png";
import { motion } from "framer-motion";

const FooterLink = ({ href, to, children }) => {
  const className = "block text-gray-100 hover:text-primary-teal transition-all duration-300 cursor-pointer hover:translate-x-1";
  if (to) {
    return <Link to={to} className={className}>{children}</Link>;
  }
  return <a href={href} className={className}>{children}</a>;
};

const SocialLink = ({ href, children }) => {
  return (
    <motion.a
      href={href}
      className="w-10 h-10 bg-primary-dark/80 hover:bg-primary-teal rounded-lg flex items-center justify-center transition-all duration-300 group border border-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.1, rotate: 6 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-gray-100 group-hover:text-white transition-colors duration-300">{children}</span>
    </motion.a>
  );
};

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
     <motion.footer
      className="bg-primary-dark text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            className="space-y-4 md:col-span-2 lg:col-span-1"
            variants={itemVariants}
          >
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <img
                src={LOGO}
                alt="Logo"
                className="h-14 sm:h-16 transition-all duration-300 group-hover:scale-110 group-hover:opacity-80"
              />
            </Link>
            <p className="text-gray-100 leading-relaxed max-w-sm hover:text-primary-teal transition-colors duration-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold mb-4 text-white hover:text-primary-teal transition-colors duration-300">Lorem Ipsum</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="#features">Lorem Ipsum</FooterLink>
              </li>
              <li>
                <FooterLink href="#testimonials">Dolor Sit</FooterLink>
              </li>
              <li>
                <FooterLink href="#faq">Amet Consectetur</FooterLink>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold mb-4 text-white hover:text-primary-teal transition-colors duration-300">Adipiscing Elit</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/about">Sed Do Eiusmod</FooterLink></li>
              <li><FooterLink to="/contact">Tempor Incididunt</FooterLink></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold mb-4 text-white hover:text-primary-teal transition-colors duration-300">Magna Aliqua</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink to="/privacy">Ut Enim Ad</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms">Minim Veniam</FooterLink>
              </li>
            </ul>
          </motion.div>
        </div>
        <motion.div
          className="border-t border-gray-600 py-8 mt-16"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-100 hover:text-primary-teal transition-colors duration-300">
              &copy; 2025 Lorem Ipsum. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#">
                <Twitter className="w-5 h-5 group-hover:text-primary-orange transition-colors duration-300" />
              </SocialLink>
              <SocialLink href="#">
                <Github className="w-5 h-5 group-hover:text-primary-orange transition-colors duration-300" />
              </SocialLink>
              <SocialLink href="#">
                <Linkedin className="w-5 h-5 group-hover:text-primary-orange transition-colors duration-300" />
              </SocialLink>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
