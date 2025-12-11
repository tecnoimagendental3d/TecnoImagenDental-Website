import { Link } from "react-router-dom";
import LOGO from "../../assets/Logo/Logo-Horizontal06.png";
import { motion } from "framer-motion";

const FooterLink = ({ href, to, children }) => {
  const className = "block text-gray-100 hover:text-primary-teal transition-all duration-300 cursor-pointer hover:translate-x-1";
  if (to) {
    return <Link to={to} className={className}>{children}</Link>;
  }
  return <a href={href} className={className}>{children}</a>;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
              Especialistas en imagenología dental 3D. Ofrecemos tecnología de vanguardia para diagnósticos precisos y tratamientos efectivos.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold mb-4 text-white hover:text-primary-teal transition-colors duration-300">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="#features">Tomografía 3D</FooterLink>
              </li>
              <li>
                <FooterLink href="#testimonials">Radiografías Panorámicas</FooterLink>
              </li>
              <li>
                <FooterLink href="#faq">Cefalometrías</FooterLink>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold mb-4 text-white hover:text-primary-teal transition-colors duration-300">Empresa</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/about">Sobre Nosotros</FooterLink></li>
              <li><FooterLink to="/contact">Contacto</FooterLink></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h3 className="text-base font-semibold mb-4 text-white hover:text-primary-teal transition-colors duration-300">Legal</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink to="/privacy">Política de Privacidad</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms">Términos y Condiciones</FooterLink>
              </li>
            </ul>
          </motion.div>
        </div>
        <motion.div
          className="border-t border-gray-600 py-6 mt-12"
          variants={itemVariants}
        >
          <div className="flex justify-center items-center">
            <p className="text-gray-100 hover:text-primary-teal transition-colors duration-300">
              &copy; 2025 TecnoImagen Dental 3D. Todos los derechos reservados.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
