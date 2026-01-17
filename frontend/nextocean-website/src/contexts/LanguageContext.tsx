'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 
  | 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' 
  | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'as';

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && languages.some(l => l.code === saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language]?.[key];
    return translation || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.viewAlerts': 'View Alerts',
    'nav.reportIncident': 'Report Incident',
    
    // Hero
    'hero.tagline': 'Report Sea Hazards. Save Lives',
    'hero.description': 'Help protect our oceans by reporting incidents, tracking alerts, and contributing to marine safety worldwide.',
    'hero.reportNow': 'Report Now',
    'hero.viewMap': 'View Map',
    
    // Guide
    'guide.title': 'How to Use SAMUDRASATHI',
    'guide.step1.title': 'Create Account',
    'guide.step1.desc': 'Register with your details to access reporting and alert features',
    'guide.step2.title': 'Report Incident',
    'guide.step2.desc': 'Click Report Incident button and fill in the details of any sea hazard you observe',
    'guide.step3.title': 'Track on Map',
    'guide.step3.desc': 'View all reported incidents on the interactive map with severity indicators',
    'guide.step4.title': 'Stay Alert',
    'guide.step4.desc': 'Receive notifications and check the alerts panel for updates on ocean hazards',
    
    // Footer
    'footer.about': 'About SAMUDRASATHI',
    'footer.aboutDesc': 'A community-driven platform for reporting and tracking ocean incidents to ensure maritime safety.',
    'footer.quickLinks': 'Quick Links',
    'footer.home': 'Home',
    'footer.reportIncident': 'Report Incident',
    'footer.viewAlerts': 'View Alerts',
    'footer.contact': 'Contact',
    'footer.resources': 'Resources',
    'footer.faq': 'FAQ',
    'footer.howToUse': 'How to Use',
    'footer.safetyGuidelines': 'Safety Guidelines',
    'footer.incidentTypes': 'Incident Types',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    'footer.copyright': '© 2026 SAMUDRASATHI. All rights reserved.',
    
    // Auth Modal
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.welcomeBack': 'Welcome Back',
    'auth.loginDesc': 'Login to access all features',
    'auth.joinUs': 'Join SAMUDRASATHI',
    'auth.registerDesc': 'Create an account to report incidents and view alerts',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.city': 'City',
    'auth.state': 'State',
    'auth.confirmPassword': 'Confirm Password',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signUp': 'Sign up',
    'auth.signIn': 'Sign in',
    'auth.passwordMismatch': 'Passwords do not match',
    'auth.fillAllFields': 'Please fill in all fields',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.emailExists': 'Email already registered',
    
    // Alerts Panel
    'alerts.title': 'Live Alerts',
    'alerts.summary': 'Alert Summary',
    'alerts.totalActive': 'Total Active',
    'alerts.critical': 'Critical',
    'alerts.highPriority': 'High Priority',
    'alerts.lastHour': 'Last Hour',
    'alerts.close': 'Close',
    'alerts.type': 'Type',
    'alerts.location': 'Location',
    'alerts.time': 'Time',
    'alerts.severity': 'Severity',
    
    // About Panel
    'about.title': 'About SAMUDRASATHI',
    'about.mission': 'Our Mission',
    'about.missionDesc': 'SAMUDRASATHI is dedicated to protecting our oceans through community-driven incident reporting and real-time monitoring. Together, we create a safer maritime environment for everyone.',
    'about.impact': 'Our Impact',
    'about.reports': 'Reports Submitted',
    'about.countries': 'Countries',
    'about.accuracy': 'Accuracy Rate',
    'about.monitoring': 'Monitoring',
    'about.features': 'Key Features',
    'about.feature1': 'Real-time incident reporting',
    'about.feature2': 'Interactive hazard mapping',
    'about.feature3': 'Instant alert notifications',
    'about.feature4': 'Community verification',
    'about.feature5': 'Multi-language support',
    'about.feature6': '24/7 monitoring system',
    'about.team': 'Our Team',
    'about.teamDesc': 'A passionate group of marine safety experts, developers, and environmental advocates working together to make oceans safer.',
    'about.close': 'Close',
    
    // Report Form
    'report.title': 'Report Ocean Incident',
    'report.type': 'Incident Type',
    'report.typeOilSpill': 'Oil Spill',
    'report.typeShipwreck': 'Shipwreck',
    'report.typeDebris': 'Marine Debris',
    'report.typePollution': 'Pollution',
    'report.typeOther': 'Other',
    'report.severity': 'Severity Level',
    'report.severityCritical': 'Critical',
    'report.severityHigh': 'High',
    'report.severityMedium': 'Medium',
    'report.severityLow': 'Low',
    'report.location': 'Location',
    'report.latitude': 'Latitude',
    'report.longitude': 'Longitude',
    'report.description': 'Description',
    'report.descPlaceholder': 'Provide detailed information about the incident...',
    'report.contactInfo': 'Contact Information (Optional)',
    'report.submit': 'Submit Report',
    'report.submitting': 'Submitting...',
    'report.success': 'Report submitted successfully!',
    
    // Notifications
    'notif.newReport': 'New Incident Reported',
    'notif.viewDetails': 'View Details',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.about': 'के बारे में',
    'nav.viewAlerts': 'अलर्ट देखें',
    'nav.reportIncident': 'घटना रिपोर्ट करें',
    
    // Hero
    'hero.tagline': 'समुद्री खतरों की रिपोर्ट करें। जीवन बचाएं',
    'hero.description': 'घटनाओं की रिपोर्ट करके, अलर्ट ट्रैक करके और दुनिया भर में समुद्री सुरक्षा में योगदान देकर हमारे महासागरों की रक्षा करने में मदद करें।',
    'hero.reportNow': 'अभी रिपोर्ट करें',
    'hero.viewMap': 'मानचित्र देखें',
    
    // Guide
    'guide.title': 'SAMUDRASATHI का उपयोग कैसे करें',
    'guide.step1.title': 'खाता बनाएं',
    'guide.step1.desc': 'रिपोर्टिंग और अलर्ट सुविधाओं तक पहुंचने के लिए अपने विवरण के साथ पंजीकरण करें',
    'guide.step2.title': 'घटना रिपोर्ट करें',
    'guide.step2.desc': 'रिपोर्ट घटना बटन पर क्लिक करें और आपके द्वारा देखे गए किसी भी समुद्री खतरे का विवरण भरें',
    'guide.step3.title': 'मानचित्र पर ट्रैक करें',
    'guide.step3.desc': 'गंभीरता संकेतक के साथ इंटरैक्टिव मानचित्र पर सभी रिपोर्ट की गई घटनाओं को देखें',
    'guide.step4.title': 'सतर्क रहें',
    'guide.step4.desc': 'समुद्री खतरों पर अपडेट के लिए सूचनाएं प्राप्त करें और अलर्ट पैनल की जांच करें',
    
    // Footer
    'footer.about': 'SAMUDRASATHI के बारे में',
    'footer.aboutDesc': 'समुद्री सुरक्षा सुनिश्चित करने के लिए समुद्री घटनाओं की रिपोर्टिंग और ट्रैकिंग के लिए एक समुदाय-संचालित मंच।',
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.home': 'होम',
    'footer.reportIncident': 'घटना रिपोर्ट करें',
    'footer.viewAlerts': 'अलर्ट देखें',
    'footer.contact': 'संपर्क',
    'footer.resources': 'संसाधन',
    'footer.faq': 'अक्सर पूछे जाने वाले प्रश्न',
    'footer.howToUse': 'उपयोग कैसे करें',
    'footer.safetyGuidelines': 'सुरक्षा दिशानिर्देश',
    'footer.incidentTypes': 'घटना के प्रकार',
    'footer.legal': 'कानूनी',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
    'footer.cookies': 'कुकी नीति',
    'footer.copyright': '© 2026 SAMUDRASATHI। सर्वाधिकार सुरक्षित।',
    
    // Auth Modal
    'auth.login': 'लॉगिन',
    'auth.register': 'पंजीकरण',
    'auth.welcomeBack': 'वापसी पर स्वागत है',
    'auth.loginDesc': 'सभी सुविधाओं तक पहुंचने के लिए लॉगिन करें',
    'auth.joinUs': 'SAMUDRASATHI में शामिल हों',
    'auth.registerDesc': 'घटनाओं की रिपोर्ट करने और अलर्ट देखने के लिए एक खाता बनाएं',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.name': 'पूरा नाम',
    'auth.phone': 'फोन नंबर',
    'auth.city': 'शहर',
    'auth.state': 'राज्य',
    'auth.confirmPassword': 'पासवर्ड की पुष्टि करें',
    'auth.loginButton': 'लॉगिन',
    'auth.registerButton': 'पंजीकरण',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.hasAccount': 'पहले से खाता है?',
    'auth.signUp': 'साइन अप करें',
    'auth.signIn': 'साइन इन करें',
    'auth.passwordMismatch': 'पासवर्ड मेल नहीं खाते',
    'auth.fillAllFields': 'कृपया सभी फ़ील्ड भरें',
    'auth.invalidCredentials': 'अमान्य ईमेल या पासवर्ड',
    'auth.emailExists': 'ईमेल पहले से पंजीकृत है',
    
    // Alerts Panel
    'alerts.title': 'लाइव अलर्ट',
    'alerts.summary': 'अलर्ट सारांश',
    'alerts.totalActive': 'कुल सक्रिय',
    'alerts.critical': 'गंभीर',
    'alerts.highPriority': 'उच्च प्राथमिकता',
    'alerts.lastHour': 'पिछले घंटे',
    'alerts.close': 'बंद करें',
    'alerts.type': 'प्रकार',
    'alerts.location': 'स्थान',
    'alerts.time': 'समय',
    'alerts.severity': 'गंभीरता',
    
    // About Panel
    'about.title': 'SAMUDRASATHI के बारे में',
    'about.mission': 'हमारा मिशन',
    'about.missionDesc': 'SAMUDRASATHI समुदाय-संचालित घटना रिपोर्टिंग और रीयल-टाइम निगरानी के माध्यम से हमारे महासागरों की रक्षा के लिए समर्पित है। साथ में, हम सभी के लिए एक सुरक्षित समुद्री वातावरण बनाते हैं।',
    'about.impact': 'हमारा प्रभाव',
    'about.reports': 'रिपोर्ट सबमिट की गई',
    'about.countries': 'देश',
    'about.accuracy': 'सटीकता दर',
    'about.monitoring': 'निगरानी',
    'about.features': 'मुख्य विशेषताएं',
    'about.feature1': 'रीयल-टाइम घटना रिपोर्टिंग',
    'about.feature2': 'इंटरैक्टिव खतरा मैपिंग',
    'about.feature3': 'तत्काल अलर्ट सूचनाएं',
    'about.feature4': 'समुदाय सत्यापन',
    'about.feature5': 'बहु-भाषा समर्थन',
    'about.feature6': '24/7 निगरानी प्रणाली',
    'about.team': 'हमारी टीम',
    'about.teamDesc': 'समुद्री सुरक्षा विशेषज्ञों, डेवलपर्स और पर्यावरण अधिवक्ताओं का एक भावुक समूह जो महासागरों को सुरक्षित बनाने के लिए मिलकर काम कर रहा है।',
    'about.close': 'बंद करें',
    
    // Report Form
    'report.title': 'समुद्री घटना रिपोर्ट करें',
    'report.type': 'घटना का प्रकार',
    'report.typeOilSpill': 'तेल रिसाव',
    'report.typeShipwreck': 'जहाज़ का मलबा',
    'report.typeDebris': 'समुद्री मलबा',
    'report.typePollution': 'प्रदूषण',
    'report.typeOther': 'अन्य',
    'report.severity': 'गंभीरता स्तर',
    'report.severityCritical': 'गंभीर',
    'report.severityHigh': 'उच्च',
    'report.severityMedium': 'मध्यम',
    'report.severityLow': 'कम',
    'report.location': 'स्थान',
    'report.latitude': 'अक्षांश',
    'report.longitude': 'देशांतर',
    'report.description': 'विवरण',
    'report.descPlaceholder': 'घटना के बारे में विस्तृत जानकारी प्रदान करें...',
    'report.contactInfo': 'संपर्क जानकारी (वैकल्पिक)',
    'report.submit': 'रिपोर्ट सबमिट करें',
    'report.submitting': 'सबमिट हो रहा है...',
    'report.success': 'रिपोर्ट सफलतापूर्वक सबमिट की गई!',
    
    // Notifications
    'notif.newReport': 'नई घटना रिपोर्ट की गई',
    'notif.viewDetails': 'विवरण देखें',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
  },
  
  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.about': 'সম্পর্কে',
    'nav.viewAlerts': 'সতর্কতা দেখুন',
    'nav.reportIncident': 'ঘটনা রিপোর্ট করুন',
    
    // Hero
    'hero.tagline': 'সমুদ্রের বিপদ রিপোর্ট করুন। জীবন বাঁচান',
    'hero.description': 'ঘটনা রিপোর্ট করে, সতর্কতা ট্র্যাক করে এবং বিশ্বব্যাপী সামুদ্রিক নিরাপত্তায় অবদান রেখে আমাদের মহাসাগর রক্ষায় সাহায্য করুন।',
    'hero.reportNow': 'এখনই রিপোর্ট করুন',
    'hero.viewMap': 'মানচিত্র দেখুন',
    
    // Guide
    'guide.title': 'SAMUDRASATHI কীভাবে ব্যবহার করবেন',
    'guide.step1.title': 'অ্যাকাউন্ট তৈরি করুন',
    'guide.step1.desc': 'রিপোর্টিং এবং সতর্কতা বৈশিষ্ট্য অ্যাক্সেস করতে আপনার বিবরণ দিয়ে নিবন্ধন করুন',
    'guide.step2.title': 'ঘটনা রিপোর্ট করুন',
    'guide.step2.desc': 'ঘটনা রিপোর্ট বোতামে ক্লিক করুন এবং আপনার পর্যবেক্ষিত যেকোনো সমুদ্র বিপদের বিবরণ পূরণ করুন',
    'guide.step3.title': 'মানচিত্রে ট্র্যাক করুন',
    'guide.step3.desc': 'তীব্রতা সূচক সহ ইন্টারেক্টিভ মানচিত্রে সমস্ত রিপোর্ট করা ঘটনা দেখুন',
    'guide.step4.title': 'সতর্ক থাকুন',
    'guide.step4.desc': 'সমুদ্রের বিপদ সম্পর্কে আপডেটের জন্য বিজ্ঞপ্তি পান এবং সতর্কতা প্যানেল পরীক্ষা করুন',
    
    // Footer
    'footer.about': 'SAMUDRASATHI সম্পর্কে',
    'footer.aboutDesc': 'সামুদ্রিক নিরাপত্তা নিশ্চিত করতে সমুদ্র ঘটনা রিপোর্ট এবং ট্র্যাকিংয়ের জন্য একটি সম্প্রদায়-চালিত প্ল্যাটফর্ম।',
    'footer.quickLinks': 'দ্রুত লিঙ্ক',
    'footer.home': 'হোম',
    'footer.reportIncident': 'ঘটনা রিপোর্ট করুন',
    'footer.viewAlerts': 'সতর্কতা দেখুন',
    'footer.contact': 'যোগাযোগ',
    'footer.resources': 'সম্পদ',
    'footer.faq': 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
    'footer.howToUse': 'কীভাবে ব্যবহার করবেন',
    'footer.safetyGuidelines': 'নিরাপত্তা নির্দেশিকা',
    'footer.incidentTypes': 'ঘটনার ধরন',
    'footer.legal': 'আইনি',
    'footer.privacy': 'গোপনীয়তা নীতি',
    'footer.terms': 'সেবা পাবার শর্ত',
    'footer.cookies': 'কুকি নীতি',
    'footer.copyright': '© 2026 SAMUDRASATHI। সর্বস্বত্ব সংরক্ষিত।',
    
    // Auth Modal
    'auth.login': 'লগইন',
    'auth.register': 'নিবন্ধন',
    'auth.welcomeBack': 'ফিরে আসায় স্বাগতম',
    'auth.loginDesc': 'সমস্ত বৈশিষ্ট্য অ্যাক্সেস করতে লগইন করুন',
    'auth.joinUs': 'SAMUDRASATHI-তে যোগ দিন',
    'auth.registerDesc': 'ঘটনা রিপোর্ট করতে এবং সতর্কতা দেখতে একটি অ্যাকাউন্ট তৈরি করুন',
    'auth.email': 'ইমেইল',
    'auth.password': 'পাসওয়ার্ড',
    'auth.name': 'পুরো নাম',
    'auth.phone': 'ফোন নম্বর',
    'auth.city': 'শহর',
    'auth.state': 'রাজ্য',
    'auth.confirmPassword': 'পাসওয়ার্ড নিশ্চিত করুন',
    'auth.loginButton': 'লগইন',
    'auth.registerButton': 'নিবন্ধন',
    'auth.noAccount': 'অ্যাকাউন্ট নেই?',
    'auth.hasAccount': 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    'auth.signUp': 'সাইন আপ করুন',
    'auth.signIn': 'সাইন ইন করুন',
    'auth.passwordMismatch': 'পাসওয়ার্ড মিলছে না',
    'auth.fillAllFields': 'অনুগ্রহ করে সমস্ত ক্ষেত্র পূরণ করুন',
    'auth.invalidCredentials': 'অবৈধ ইমেল বা পাসওয়ার্ড',
    'auth.emailExists': 'ইমেল ইতিমধ্যে নিবন্ধিত',
    
    // Alerts Panel
    'alerts.title': 'লাইভ সতর্কতা',
    'alerts.summary': 'সতর্কতা সারাংশ',
    'alerts.totalActive': 'মোট সক্রিয়',
    'alerts.critical': 'সংকটপূর্ণ',
    'alerts.highPriority': 'উচ্চ অগ্রাধিকার',
    'alerts.lastHour': 'শেষ ঘন্টা',
    'alerts.close': 'বন্ধ করুন',
    'alerts.type': 'ধরন',
    'alerts.location': 'অবস্থান',
    'alerts.time': 'সময়',
    'alerts.severity': 'তীব্রতা',
    
    // About Panel
    'about.title': 'SAMUDRASATHI সম্পর্কে',
    'about.mission': 'আমাদের মিশন',
    'about.missionDesc': 'SAMUDRASATHI সম্প্রদায়-চালিত ঘটনা রিপোর্টিং এবং রিয়েল-টাইম মনিটরিংয়ের মাধ্যমে আমাদের মহাসাগর রক্ষায় নিবেদিত। একসাথে, আমরা সবার জন্য একটি নিরাপদ সামুদ্রিক পরিবেশ তৈরি করি।',
    'about.impact': 'আমাদের প্রভাব',
    'about.reports': 'রিপোর্ট জমা দেওয়া হয়েছে',
    'about.countries': 'দেশ',
    'about.accuracy': 'নির্ভুলতার হার',
    'about.monitoring': 'পর্যবেক্ষণ',
    'about.features': 'মূল বৈশিষ্ট্য',
    'about.feature1': 'রিয়েল-টাইম ঘটনা রিপোর্টিং',
    'about.feature2': 'ইন্টারেক্টিভ বিপদ ম্যাপিং',
    'about.feature3': 'তাৎক্ষণিক সতর্কতা বিজ্ঞপ্তি',
    'about.feature4': 'সম্প্রদায় যাচাইকরণ',
    'about.feature5': 'বহু-ভাষা সমর্থন',
    'about.feature6': '24/7 পর্যবেক্ষণ ব্যবস্থা',
    'about.team': 'আমাদের দল',
    'about.teamDesc': 'সামুদ্রিক নিরাপত্তা বিশেষজ্ঞ, বিকাশকারী এবং পরিবেশ প্রবক্তাদের একটি উৎসাহী দল যারা মহাসাগরকে নিরাপদ করতে একসাথে কাজ করছে।',
    'about.close': 'বন্ধ করুন',
    
    // Report Form
    'report.title': 'সমুদ্র ঘটনা রিপোর্ট করুন',
    'report.type': 'ঘটনার ধরন',
    'report.typeOilSpill': 'তেল ছিটকে পড়া',
    'report.typeShipwreck': 'জাহাজ ধ্বংস',
    'report.typeDebris': 'সামুদ্রিক ধ্বংসাবশেষ',
    'report.typePollution': 'দূষণ',
    'report.typeOther': 'অন্যান্য',
    'report.severity': 'তীব্রতার স্তর',
    'report.severityCritical': 'সংকটপূর্ণ',
    'report.severityHigh': 'উচ্চ',
    'report.severityMedium': 'মাঝারি',
    'report.severityLow': 'কম',
    'report.location': 'অবস্থান',
    'report.latitude': 'অক্ষাংশ',
    'report.longitude': 'দ্রাঘিমাংশ',
    'report.description': 'বিবরণ',
    'report.descPlaceholder': 'ঘটনা সম্পর্কে বিস্তারিত তথ্য প্রদান করুন...',
    'report.contactInfo': 'যোগাযোগের তথ্য (ঐচ্ছিক)',
    'report.submit': 'রিপোর্ট জমা দিন',
    'report.submitting': 'জমা দেওয়া হচ্ছে...',
    'report.success': 'রিপোর্ট সফলভাবে জমা দেওয়া হয়েছে!',
    
    // Notifications
    'notif.newReport': 'নতুন ঘটনা রিপোর্ট করা হয়েছে',
    'notif.viewDetails': 'বিবরণ দেখুন',
    
    // Common
    'common.loading': 'লোড হচ্ছে...',
    'common.error': 'ত্রুটি',
    'common.success': 'সাফল্য',
    'common.cancel': 'বাতিল করুন',
    'common.confirm': 'নিশ্চিত করুন',
    'common.save': 'সংরক্ষণ করুন',
    'common.delete': 'মুছুন',
    'common.edit': 'সম্পাদনা করুন',
  },
  
  // Additional languages with key translations
  te: {
    'nav.home': 'హోమ్',
    'nav.about': 'గురించి',
    'nav.viewAlerts': 'హెచ్చరికలు చూడండి',
    'nav.reportIncident': 'సంఘటనను నివేదించండి',
    'hero.tagline': 'సముద్ర ప్రమాదాలను నివేదించండి. ప్రాణాలను రక్షించండి',
    'hero.description': 'సంఘటనలను నివేదించడం, హెచ్చరికలను ట్రాకింగ్ చేయడం మరియు ప్రపంచవ్యాప్తంగా సముద్ర భద్రతకు సహకరించడం ద్వారా మన మహాసముద్రాలను రక్షించడంలో సహాయపడండి.',
    'hero.reportNow': 'ఇప్పుడు నివేదించండి',
    'footer.copyright': '© 2026 SAMUDRASATHI. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
    'auth.login': 'లాగిన్',
    'auth.register': 'నమోదు',
    'auth.email': 'ఇమెయిల్',
    'auth.password': 'పాస్‌వర్డ్',
  },
  
  mr: {
    'nav.home': 'होम',
    'nav.about': 'बद्दल',
    'nav.viewAlerts': 'अलर्ट पहा',
    'nav.reportIncident': 'घटना नोंदवा',
    'hero.tagline': 'समुद्र धोके नोंदवा. जीव वाचवा',
    'hero.description': 'घटना नोंदवून, अलर्ट ट्रॅक करून आणि जगभरातील सागरी सुरक्षेत योगदान देऊन आपल्या महासागरांचे संरक्षण करण्यात मदत करा.',
    'hero.reportNow': 'आता नोंदवा',
    'footer.copyright': '© 2026 SAMUDRASATHI. सर्व हक्क राखीव.',
    'auth.login': 'लॉगिन',
    'auth.register': 'नोंदणी',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
  },
  
  ta: {
    'nav.home': 'முகப்பு',
    'nav.about': 'பற்றி',
    'nav.viewAlerts': 'எச்சரிக்கைகளைக் காண்க',
    'nav.reportIncident': 'சம்பவத்தைப் புகாரளிக்கவும்',
    'hero.tagline': 'கடல் அபாயங்களைப் புகாரளிக்கவும். உயிர்களைக் காப்பாற்றவும்',
    'hero.description': 'சம்பவங்களைப் புகாரளித்து, எச்சரிக்கைகளைக் கண்காணித்து, உலகளவில் கடல் பாதுகாப்பிற்கு பங்களிப்பதன் மூலம் நமது கடல்களைப் பாதுகாக்க உதவுங்கள்.',
    'hero.reportNow': 'இப்போது புகாரளிக்கவும்',
    'footer.copyright': '© 2026 SAMUDRASATHI. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'auth.login': 'உள்நுழைக',
    'auth.register': 'பதிவு செய்க',
    'auth.email': 'மின்னஞ்சல்',
    'auth.password': 'கடவுச்சொல்',
  },
  
  gu: {
    'nav.home': 'હોમ',
    'nav.about': 'વિશે',
    'nav.viewAlerts': 'ચેતવણીઓ જુઓ',
    'nav.reportIncident': 'ઘટના જાણ કરો',
    'hero.tagline': 'દરિયાઈ જોખમોની જાણ કરો. જીવન બચાવો',
    'hero.description': 'ઘટનાઓની જાણ કરીને, ચેતવણીઓ ટ્રેક કરીને અને વિશ્વભરમાં દરિયાઈ સુરક્ષામાં યોગદાન આપીને અમારા મહાસાગરોને બચાવવામાં મદદ કરો.',
    'hero.reportNow': 'હવે જાણ કરો',
    'footer.copyright': '© 2026 SAMUDRASATHI. બધા અધિકારો અનામત.',
    'auth.login': 'લૉગિન',
    'auth.register': 'નોંધણી',
    'auth.email': 'ઇમેઇલ',
    'auth.password': 'પાસવર્ડ',
  },
  
  kn: {
    'nav.home': 'ಮುಖಪುಟ',
    'nav.about': 'ಬಗ್ಗೆ',
    'nav.viewAlerts': 'ಎಚ್ಚರಿಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'nav.reportIncident': 'ಘಟನೆಯನ್ನು ವರದಿ ಮಾಡಿ',
    'hero.tagline': 'ಸಮುದ್ರ ಅಪಾಯಗಳನ್ನು ವರದಿ ಮಾಡಿ. ಜೀವಗಳನ್ನು ಉಳಿಸಿ',
    'hero.description': 'ಘಟನೆಗಳನ್ನು ವರದಿ ಮಾಡುವ ಮೂಲಕ, ಎಚ್ಚರಿಕೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವ ಮೂಲಕ ಮತ್ತು ವಿಶ್ವಾದ್ಯಂತ ಸಮುದ್ರ ಸುರಕ್ಷತೆಗೆ ಕೊಡುಗೆ ನೀಡುವ ಮೂಲಕ ನಮ್ಮ ಸಾಗರಗಳನ್ನು ರಕ್ಷಿಸಲು ಸಹಾಯ ಮಾಡಿ.',
    'hero.reportNow': 'ಈಗ ವರದಿ ಮಾಡಿ',
    'footer.copyright': '© 2026 SAMUDRASATHI. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    'auth.login': 'ಲಾಗಿನ್',
    'auth.register': 'ನೋಂದಣಿ',
    'auth.email': 'ಇಮೇಲ್',
    'auth.password': 'ಪಾಸ್‌ವರ್ಡ್',
  },
  
  ml: {
    'nav.home': 'ഹോം',
    'nav.about': 'കുറിച്ച്',
    'nav.viewAlerts': 'അലേർട്ടുകൾ കാണുക',
    'nav.reportIncident': 'സംഭവം റിപ്പോർട്ട് ചെയ്യുക',
    'hero.tagline': 'സമുദ്ര അപകടങ്ങൾ റിപ്പോർട്ട് ചെയ്യുക. ജീവൻ രക്ഷിക്കുക',
    'hero.description': 'സംഭവങ്ങൾ റിപ്പോർട്ട് ചെയ്യുന്നതിലൂടെയും, അലേർട്ടുകൾ ട്രാക്ക് ചെയ്യുന്നതിലൂടെയും, ലോകമെമ്പാടുമുള്ള സമുദ്ര സുരക്ഷയിലേക്ക് സംഭാവന നൽകുന്നതിലൂടെയും നമ്മുടെ സമുദ്രങ്ങളെ സംരക്ഷിക്കാൻ സഹായിക്കുക.',
    'hero.reportNow': 'ഇപ്പോൾ റിപ്പോർട്ട് ചെയ്യുക',
    'footer.copyright': '© 2026 SAMUDRASATHI. എല്ലാ അവകാശങ്ങളും സംരക്ഷിച്ചിരിക്കുന്നു.',
    'auth.login': 'ലോഗിൻ',
    'auth.register': 'രജിസ്റ്റർ',
    'auth.email': 'ഇമെയിൽ',
    'auth.password': 'പാസ്‌വേഡ്',
  },
  
  or: {
    'nav.home': 'ହୋମ୍',
    'nav.about': 'ବିଷୟରେ',
    'nav.viewAlerts': 'ସତର୍କତା ଦେଖନ୍ତୁ',
    'nav.reportIncident': 'ଘଟଣା ରିପୋର୍ଟ କରନ୍ତୁ',
    'hero.tagline': 'ସମୁଦ୍ର ବିପଦ ରିପୋର୍ଟ କରନ୍ତୁ। ଜୀବନ ବଞ୍ଚାନ୍ତୁ',
    'hero.description': 'ଘଟଣା ରିପୋର୍ଟ କରି, ସତର୍କତା ଟ୍ରାକିଂ କରି ଏବଂ ବିଶ୍ୱବ୍ୟାପୀ ସାମୁଦ୍ରିକ ସୁରକ୍ଷାରେ ଯୋଗଦାନ କରି ଆମର ମହାସାଗରକୁ ସୁରକ୍ଷା କରିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ।',
    'hero.reportNow': 'ବର୍ତ୍ତମାନ ରିପୋର୍ଟ କରନ୍ତୁ',
    'footer.copyright': '© 2026 SAMUDRASATHI. ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ।',
    'auth.login': 'ଲଗଇନ୍',
    'auth.register': 'ପଞ୍ଜୀକରଣ',
    'auth.email': 'ଇମେଲ୍',
    'auth.password': 'ପାସୱାର୍ଡ',
  },
  
  pa: {
    'nav.home': 'ਹੋਮ',
    'nav.about': 'ਬਾਰੇ',
    'nav.viewAlerts': 'ਅਲਰਟ ਦੇਖੋ',
    'nav.reportIncident': 'ਘਟਨਾ ਦੀ ਰਿਪੋਰਟ ਕਰੋ',
    'hero.tagline': 'ਸਮੁੰਦਰੀ ਖਤਰਿਆਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ। ਜਾਨਾਂ ਬਚਾਓ',
    'hero.description': 'ਘਟਨਾਵਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰਕੇ, ਅਲਰਟ ਟ੍ਰੈਕ ਕਰਕੇ ਅਤੇ ਦੁਨੀਆ ਭਰ ਵਿੱਚ ਸਮੁੰਦਰੀ ਸੁਰੱਖਿਆ ਵਿੱਚ ਯੋਗਦਾਨ ਪਾ ਕੇ ਸਾਡੇ ਸਮੁੰਦਰਾਂ ਦੀ ਰੱਖਿਆ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰੋ।',
    'hero.reportNow': 'ਹੁਣੇ ਰਿਪੋਰਟ ਕਰੋ',
    'footer.copyright': '© 2026 SAMUDRASATHI. ਸਾਰੇ ਅਧਿਕਾਰ ਰਾਖਵੇਂ ਹਨ।',
    'auth.login': 'ਲਾਗਇਨ',
    'auth.register': 'ਰਜਿਸਟਰ',
    'auth.email': 'ਈਮੇਲ',
    'auth.password': 'ਪਾਸਵਰਡ',
  },
  
  as: {
    'nav.home': 'হোম',
    'nav.about': 'বিষয়ে',
    'nav.viewAlerts': 'সতৰ্কবাণী চাওক',
    'nav.reportIncident': 'ঘটনা ৰিপোৰ্ট কৰক',
    'hero.tagline': 'সাগৰৰ বিপদ ৰিপোৰ্ট কৰক। জীৱন ৰক্ষা কৰক',
    'hero.description': 'ঘটনা ৰিপোৰ্ট কৰি, সতৰ্কবাণী ট্ৰেক কৰি আৰু বিশ্বব্যাপী সামুদ্ৰিক সুৰক্ষাত অৱদান আগবঢ়াই আমাৰ মহাসাগৰবোৰ সুৰক্ষিত কৰাত সহায় কৰক।',
    'hero.reportNow': 'এতিয়াই ৰিপোৰ্ট কৰক',
    'footer.copyright': '© 2026 SAMUDRASATHI. সকলো অধিকাৰ সংৰক্ষিত।',
    'auth.login': 'লগইন',
    'auth.register': 'পঞ্জীয়ন',
    'auth.email': 'ইমেইল',
    'auth.password': 'পাছৱৰ্ড',
  },
};
