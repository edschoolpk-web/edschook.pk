export interface Teacher {
  slug: string;
  name: string;
  role: string;
  image: string;
  detailImage: string;
  email: string;
  bio: string;
  dob: string;
  education: string;
  experience: string;
  skills: {
    name: string;
    percentage: number;
    color: string; // Hex or class name
  }[];
  socials: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
  };
}

export const teachers: Teacher[] = [
  {
    slug: 'sir-gohar',
    name: 'Sir Gohar',
    role: 'Math Teacher',
    image: '/webImages/img5.jpg',
    detailImage: '/webImages/tech1.jpg',
    email: 'info@edschool.pk',
    bio: 'Sir Gohar is a dedicated and experienced Mathematics teacher who explains concepts in a simple, logical, and engaging way. He focuses on building strong fundamentals, improving problem-solving skills, and helping students achieve academic success. Students appreciate his clear explanations and supportive teaching style.',
    dob: '15.03.1987',
    education: 'M.Sc. Mathematics', // Corrected from "Music School of Music Arts" which seemed like lorem ipsum
    experience: '10 years',
    skills: [
      { name: 'Teaching', percentage: 100, color: '#ed1b2e' },
      { name: 'Speaking', percentage: 80, color: '#D6D6D6' },
      { name: 'Family Support', percentage: 85, color: '#333333' },
      { name: "Children's Well-being", percentage: 90, color: '#ed1b2e' },
    ],
    socials: {
      facebook: '#',
      linkedin: '#',
      instagram: '#',
    }
  },
  {
    slug: 'miss-ayesha',
    name: 'Miss Ayesha',
    role: 'English Teacher',
    image: '/webImages/img6.jpg',
    detailImage: '/webImages/tech1.jpg', // Placeholder
    email: 'info@edschool.pk',
    bio: 'Miss Ayesha is a passionate English teacher who inspires students to love literature and language.',
    dob: '01.01.1990',
    education: 'M.A. English',
    experience: '5 years',
    skills: [
      { name: 'Teaching', percentage: 95, color: '#ed1b2e' },
      { name: 'Communication', percentage: 90, color: '#D6D6D6' },
    ],
    socials: {
      facebook: '#',
      linkedin: '#',
      instagram: '#',
    }
  },
  {
    slug: 'miss-sumaiqa',
    name: 'Miss Sumaiqa',
    role: 'Biology Teacher',
    image: '/webImages/img7.jpg',
    detailImage: '/webImages/tech1.jpg', // Placeholder
    email: 'info@edschool.pk',
    bio: 'Miss Sumaiqa brings biology to life with practical examples and a hands-on approach to learning.',
    dob: '01.01.1992',
    education: 'M.Sc. Botany',
    experience: '4 years',
    skills: [
        { name: 'Teaching', percentage: 90, color: '#ed1b2e' },
        { name: 'Lab Work', percentage: 85, color: '#D6D6D6' },
    ],
    socials: {
      facebook: '#',
      linkedin: '#',
      instagram: '#',
    }
  },
  {
    slug: 'miss-afsha',
    name: 'Miss Afsha',
    role: 'Islamiat Teacher',
    image: '/webImages/img8.jpg',
    detailImage: '/webImages/tech1.jpg', // Placeholder
    email: 'info@edschool.pk',
    bio: 'Miss Afsha instills strong moral values and detailed knowledge of Islamic studies in her students.',
    dob: '01.01.1988',
    education: 'M.A. Islamic Studies',
    experience: '8 years',
    skills: [
        { name: 'Teaching', percentage: 95, color: '#ed1b2e' },
        { name: 'Guidance', percentage: 90, color: '#D6D6D6' },
    ],
    socials: {
      facebook: '#',
      linkedin: '#',
      instagram: '#',
    }
  }
];
