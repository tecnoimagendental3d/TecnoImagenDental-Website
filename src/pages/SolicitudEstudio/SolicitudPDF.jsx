import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path } from '@react-pdf/renderer';
import Logo from '../../assets/Logo/Logo-Horizontal01.png';

// Facebook Icon Component for PDF
const FacebookIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path fill="#ffffff" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </Svg>
);

// WhatsApp Icon Component for PDF
const WhatsAppIcon = () => (
  <Svg width="10" height="10" viewBox="0 0 24 24">
    <Path fill="#ffffff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </Svg>
);

// Colors
const colors = {
  darkBlue: '#0b5b8a',
  lightBlue: '#12c3cc',
  orange: '#e56c1a',
  black: '#000000',
  gray: '#374151',
  lightGray: '#9ca3af',
};

// Register font
Font.register({
  family: 'Helvetica',
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    paddingBottom: 15,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#e8f4f8',
    padding: 10,
    marginBottom: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  headerLogoSection: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  headerContentSection: {
    width: '70%',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.darkBlue,
    textAlign: 'right',
    marginBottom: 3,
  },
  socialColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginBottom: 4,
  },
  headerContact: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  badge: {
    backgroundColor: colors.darkBlue,
    color: '#ffffff',
    padding: '2 6',
    borderRadius: 3,
    fontSize: 9,
    marginLeft: 4,
  },
  badgeGreen: {
    backgroundColor: '#25D366',
    color: '#ffffff',
    padding: '2 6',
    borderRadius: 3,
    fontSize: 9,
    marginLeft: 4,
  },
  badgeWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    padding: '2 6',
    borderRadius: 3,
  },
  badgeGreenWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    padding: '2 6',
    borderRadius: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 8,
    marginLeft: 3,
  },
  headerSmallText: {
    fontSize: 9,
    color: '#4b5563',
  },
  scheduleWrapper: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  scheduleTitle: {
    fontSize: 8,
    color: '#4b5563',
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 2,
  },
  scheduleColumns: {
    flexDirection: 'row',
    gap: 20,
  },
  scheduleColumn: {
    alignItems: 'center',
  },
  scheduleBold: {
    fontSize: 8,
    color: '#4b5563',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scheduleTime: {
    fontSize: 7,
    color: '#4b5563',
    textAlign: 'center',
  },
  headerAddress: {
    fontSize: 8,
    color: colors.darkBlue,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  
  // Form rows - Black text
  formSection: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: colors.black,
    marginRight: 6,
    fontSize: 11,
  },
  inputContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 2,
    marginRight: 10,
  },
  inputContainerSmall: {
    width: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 2,
    textAlign: 'center',
  },
  inputContainerMedium: {
    width: 55,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: 2,
    textAlign: 'center',
  },
  inputText: {
    fontSize: 11,
    color: colors.gray,
  },
  inputTextCenter: {
    fontSize: 11,
    color: colors.gray,
    textAlign: 'center',
  },
  slash: {
    marginHorizontal: 3,
  },
  
  // Section boxes
  sectionBox2D: {
    marginBottom: 10,
  },
  sectionBox3D: {
    marginBottom: 10,
    flexGrow: 1,
  },
  sectionLine2D: {
    height: 2,
    backgroundColor: colors.darkBlue,
    marginBottom: -10,
  },
  sectionLine3D: {
    height: 2,
    backgroundColor: colors.lightBlue,
    marginBottom: -10,
  },
  sectionHeader2D: {
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionHeader3D: {
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle2D: {
    color: colors.darkBlue,
    fontWeight: 'bold',
    fontSize: 12,
    border: `1.5 solid ${colors.darkBlue}`,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  sectionTitle3D: {
    color: colors.darkBlue,
    fontWeight: 'bold',
    fontSize: 12,
    border: `1.5 solid ${colors.lightBlue}`,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingVertical: 3,
    paddingHorizontal: 12,
  },
  sectionContent: {
    padding: 8,
    paddingVertical: 6,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  
  // Checkboxes
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  // Dark blue checkbox (2D)
  checkboxDark: {
    width: 10,
    height: 10,
    border: `1 solid ${colors.darkBlue}`,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxDarkChecked: {
    width: 10,
    height: 10,
    border: `1 solid ${colors.darkBlue}`,
    backgroundColor: colors.darkBlue,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Light blue checkbox (3D)
  checkboxLight: {
    width: 10,
    height: 10,
    border: `1 solid ${colors.lightBlue}`,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLightChecked: {
    width: 10,
    height: 10,
    border: `1 solid ${colors.lightBlue}`,
    backgroundColor: colors.lightBlue,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Orange checkbox (Ortodoncia)
  checkboxOrange: {
    width: 10,
    height: 10,
    border: `1 solid ${colors.orange}`,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOrangeChecked: {
    width: 10,
    height: 10,
    border: `1 solid ${colors.orange}`,
    backgroundColor: colors.orange,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 8,
  },
  checkboxLabelBlue: {
    fontSize: 10,
    color: colors.darkBlue,
  },
  checkboxLabelBlueSmall: {
    fontSize: 9,
    color: colors.darkBlue,
  },
  checkboxLabelDarkBlue: {
    fontSize: 10,
    color: '#0b3d5e',
  },
  checkboxLabelBlack: {
    fontSize: 10,
    color: colors.black,
  },
  subOptions: {
    marginLeft: 15,
    flexDirection: 'row',
    marginTop: 2,
  },
  subOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  
  // Interpretation section
  interpretationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 30,
  },
  purposeSection: {
    padding: 8,
    paddingTop: 0,
  },
  purposeLabel: {
    textAlign: 'center',
    color: colors.darkBlue,
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 4,
  },
  purposeBox: {
    border: `1 solid ${colors.lightGray}`,
    borderRadius: 4,
    minHeight: 30,
    padding: 6,
    flexGrow: 1,
  },
  purposeText: {
    fontSize: 10,
    color: colors.gray,
  },
  
  // Ortodoncia section - Orange
  ortodonciaContainer: {
    marginBottom: 10,
  },
  ortodonciaLine: {
    height: 2,
    backgroundColor: colors.orange,
    marginBottom: -10,
  },
  ortodonciaHeader: {
    alignItems: 'center',
    marginBottom: 6,
  },
  ortodonciaTitle: {
    backgroundColor: colors.orange,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  ortodonciaOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
    gap: 25,
  },
  
  // Footer
  footer: {
    backgroundColor: colors.darkBlue,
    padding: 8,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  
  // Sexo checkboxes
  sexoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
});

// Checkbox components for different colors
const CheckboxDark = ({ checked, label, small = false }) => (
  <View style={styles.checkboxRow}>
    <View style={checked ? styles.checkboxDarkChecked : styles.checkboxDark}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={small ? styles.checkboxLabelBlueSmall : styles.checkboxLabelBlue}>{label}</Text>
  </View>
);

const CheckboxLight = ({ checked, label, small = false }) => (
  <View style={styles.checkboxRow}>
    <View style={checked ? styles.checkboxLightChecked : styles.checkboxLight}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={small ? styles.checkboxLabelBlueSmall : styles.checkboxLabelBlue}>{label}</Text>
  </View>
);

const CheckboxOrange = ({ checked, label }) => (
  <View style={styles.checkboxRow}>
    <View style={checked ? styles.checkboxOrangeChecked : styles.checkboxOrange}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabelDarkBlue}>{label}</Text>
  </View>
);

const CheckboxBlack = ({ checked, label }) => (
  <View style={styles.checkboxRow}>
    <View style={checked ? styles.checkboxLightChecked : styles.checkboxLight}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabelBlack}>{label}</Text>
  </View>
);

// PDF Document Component
const SolicitudPDF = ({ formData }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {/* Header - 2 Section Layout (1/3 Logo, 2/3 Content) */}
      <View style={styles.header}>
        {/* Section 1: Logo (1/3) */}
        <View style={styles.headerLogoSection}>
          <Image src={Logo} style={styles.logo} />
        </View>
        
        {/* Section 2: All Content (2/3) */}
        <View style={styles.headerContentSection}>
          <Text style={styles.headerTitle}>SOLICITUD DE ESTUDIO RADIOLÓGICO</Text>
          <View style={styles.socialColumn}>
            <View style={styles.badgeWithIcon}>
              <FacebookIcon />
              <Text style={styles.badgeText}>TECNOIMAGEN DENTAL 3D</Text>
            </View>
            <View style={styles.badgeGreenWithIcon}>
              <WhatsAppIcon />
              <Text style={styles.badgeText}>5724-7096</Text>
            </View>
          </View>
          <View style={styles.scheduleWrapper}>
            <Text style={styles.scheduleTitle}>HORARIO DE ATENCIÓN:</Text>
            <View style={styles.scheduleColumns}>
              <View style={styles.scheduleColumn}>
                <Text style={styles.scheduleBold}>Lunes a Viernes</Text>
                <Text style={styles.scheduleTime}>8:30am - 12:00md</Text>
                <Text style={styles.scheduleTime}>1:00pm - 5:00pm</Text>
              </View>
              <View style={styles.scheduleColumn}>
                <Text style={styles.scheduleBold}>Sábado</Text>
                <Text style={styles.scheduleTime}>8:00am - 12:00md</Text>
              </View>
            </View>
          </View>
          <Text style={styles.headerAddress}>CENTRO DE SALUD 1 C. AL NORTE, 20 VARAS AL ESTE, PALACAGÜINA</Text>
        </View>
      </View>

      {/* Patient Information - Black text */}
      <View style={styles.formSection}>
        {/* Fecha */}
        <View style={styles.formRow}>
          <Text style={styles.label}>Fecha:</Text>
          <View style={[styles.inputContainer, { flex: 0.3 }]}>
            <Text style={styles.inputText}>
              {formData.fecha ? new Date(formData.fecha).toLocaleDateString('es-ES') : ''}
            </Text>
          </View>
        </View>

        {/* Nombre del Paciente */}
        <View style={styles.formRow}>
          <Text style={styles.label}>Nombre del Paciente:</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>{formData.nombrePaciente}</Text>
          </View>
        </View>

        {/* Fecha de Nacimiento, Edad */}
        <View style={styles.formRow}>
          <Text style={styles.label}>Fecha de Nacimiento:</Text>
          <View style={[styles.inputContainer, { flex: 0.3 }]}>
            <Text style={styles.inputText}>
              {formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toLocaleDateString('es-ES') : ''}
            </Text>
          </View>
          <Text style={[styles.label, { marginLeft: 20 }]}>Edad:</Text>
          <View style={styles.inputContainerSmall}>
            <Text style={styles.inputTextCenter}>{formData.edad}</Text>
          </View>
        </View>

        {/* Teléfono, Sexo */}
        <View style={styles.formRow}>
          <Text style={styles.label}>Teléfono:</Text>
          <View style={[styles.inputContainer, { flex: 0.5 }]}>
            <Text style={styles.inputText}>{formData.telefono}</Text>
          </View>
          <Text style={[styles.label, { marginLeft: 20 }]}>Sexo:</Text>
          <View style={styles.sexoContainer}>
            <CheckboxBlack checked={formData.sexo === 'M'} label="M" />
            <View style={{ width: 15 }} />
            <CheckboxBlack checked={formData.sexo === 'F'} label="F" />
          </View>
        </View>

        {/* Dr. Solicitante */}
        <View style={styles.formRow}>
          <Text style={styles.label}>Dr. (a) Solicitante:</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>{formData.doctorSolicitante}</Text>
          </View>
        </View>

        {/* Correo Electrónico */}
        <View style={styles.formRow}>
          <Text style={styles.label}>Correo Electrónico:</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputText}>{formData.correoElectronico}</Text>
          </View>
        </View>
      </View>

      {/* Radiografía 2D - Dark blue checkboxes, blue text */}
      <View style={styles.sectionBox2D}>
          <View style={styles.sectionLine2D} />
          <View style={styles.sectionHeader2D}>
            <Text style={styles.sectionTitle2D}>Radiografía 2D</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.column}>
              <CheckboxDark checked={formData.panoramica} label="Panorámica" />
              <CheckboxDark checked={formData.panoramicaDientesHD} label="Panorámica dientes HD" />
              <CheckboxDark checked={formData.lateralCraneo} label="Lateral de cráneo" />
              <CheckboxDark checked={formData.apCraneo} label="A-P de cráneo" />
              <CheckboxDark checked={formData.paCraneo} label="P-A de cráneo" />
              <CheckboxDark checked={formData.atmBocaAbierta} label="ATM Boca Abierta" />
              <CheckboxDark checked={formData.atmBocaCerrada} label="ATM Boca Cerrada" />
            </View>
            <View style={styles.column}>
              <CheckboxDark checked={formData.senosParanasales} label="Senos Paranasales 12x10" />
              <CheckboxDark checked={formData.towneInversa} label="Towne Inversa" />
              <CheckboxDark checked={formData.hirtz} label="Hirtz" />
              <CheckboxDark checked={formData.caldwell} label="Caldwell" />
              <CheckboxDark checked={formData.waters} label="Waters" />
              <CheckboxDark checked={formData.cavum} label="Cavum" />
              <CheckboxDark checked={formData.carpal} label="Carpal" />
            </View>
          </View>
        </View>

        {/* Tomografía 3D (CBCT) - Light blue checkboxes, blue text */}
        <View style={styles.sectionBox3D}>
        <View style={styles.sectionLine3D} />
        <View style={styles.sectionHeader3D}>
          <Text style={styles.sectionTitle3D}>Tomografía 3D (CBCT)</Text>
        </View>
        <View style={styles.sectionContent}>
          <View style={styles.column}>
            <CheckboxLight checked={formData.tomoCampoAmplio} label="Tomografía de campo amplio" />
            <CheckboxLight checked={formData.tomoBimaxilar} label="Tomografía Bimaxilar 12x10" />
            <CheckboxLight checked={formData.tomoMaxilar} label="Tomografía Maxilar 8x10" />
            <CheckboxLight checked={formData.tomoMandibular} label="Tomografía Mandibular 8x10" />
            <CheckboxLight checked={formData.tomoViasAereas} label="Tomografía Vías aéreas 12x10" />
            <CheckboxLight checked={formData.tomoSenosParanasales} label="Tomografía senos paranasales" />
          </View>
          <View style={styles.column}>
            <CheckboxLight checked={formData.tomoAtmUnilateral} label="Tomografía ATM Unilateral 8x8" />
            <View style={styles.subOptions}>
              <View style={styles.subOption}>
                <CheckboxLight checked={formData.tomoAtmUnilateralApertura} label="Apertura" small />
              </View>
              <View style={styles.subOption}>
                <CheckboxLight checked={formData.tomoAtmUnilateralOclusion} label="Oclusión" small />
              </View>
            </View>
            <CheckboxLight checked={formData.tomoAtmBilateral} label="Tomografía ATM Bilateral 8x8" />
            <View style={styles.subOptions}>
              <View style={styles.subOption}>
                <CheckboxLight checked={formData.tomoAtmBilateralApertura} label="Apertura" small />
              </View>
              <View style={styles.subOption}>
                <CheckboxLight checked={formData.tomoAtmBilateralOclusion} label="Oclusión" small />
              </View>
            </View>
            <CheckboxLight checked={formData.tomoZona5x5} label="Tomografía de zona 5x5" />
          </View>
        </View>
        
        {/* Interpretation */}
        <View style={styles.interpretationRow}>
          <CheckboxLight checked={formData.conInterpretacion} label="Con interpretación" />
          <CheckboxLight checked={formData.sinInterpretacion} label="Sin interpretación" />
        </View>
        
        {/* Purpose */}
        <View style={styles.purposeSection}>
          <Text style={styles.purposeLabel}>Indicar el propósito de la Tomografía</Text>
          <View style={styles.purposeBox}>
            <Text style={styles.purposeText}>{formData.propositoTomografia}</Text>
          </View>
        </View>
      </View>

      {/* Estudio de Ortodoncia - Orange, dark blue text */}
      <View style={styles.ortodonciaContainer}>
        <View style={styles.ortodonciaLine} />
        <View style={styles.ortodonciaHeader}>
          <Text style={styles.ortodonciaTitle}>Estudio de Ortodoncia</Text>
        </View>
        <View style={styles.ortodonciaOptions}>
          <CheckboxOrange checked={formData.ortodonciaPanoramica} label="Panorámica" />
          <CheckboxOrange checked={formData.ortodonciaLateralCraneo} label="Lateral de cráneo" />
          <CheckboxOrange checked={formData.ortodonciaCefalometria} label="Cefalometría" />
        </View>
        <View style={styles.ortodonciaOptions}>
          <CheckboxOrange checked={formData.ortodonciaConFoto} label="Con Foto" />
          <CheckboxOrange checked={formData.ortodonciaSinFoto} label="Sin Foto" />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>"IMÁGENES PRECISAS, DIAGNÓSTICOS CONFIABLES"</Text>
      </View>
    </Page>
  </Document>
);

export default SolicitudPDF;
