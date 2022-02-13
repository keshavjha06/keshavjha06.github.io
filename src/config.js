module.exports = {
  siteTitle: 'Keshav Jha | Software Development Engineer In Test',
  siteDescription:
    'Keshav Jha is a SDET at Medibuddy, who loves learning new things and breaking stuff.',
  siteKeywords:
    'Keshav Jha, , Deb, keshav, keshavjha, SDET, software engineer, java, hyderabad, bengaluru, amazon, medibuddy',
  siteUrl: 'https://keshavjha06.github.io/',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-45666519-2',
  googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'Keshav Jha',
  location: 'Hyderabad, India',
  email: 'keshavjha0610@gmail.com',
  github: 'https://github.com/keshavjha06',
  twitterHandle: '@keshavjha06',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/keshavjha06',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/keshavjha06/',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/keshavjha06',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 100,

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
