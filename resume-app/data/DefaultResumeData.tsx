const DefaultResumeData = {
  firstName: "James",
  lastName: "Carter",
  jobTitle: "Full Stack Developer",
  address: "525 N Tryon Street, NC 28117",
  phone: "(123)-456-7890",
  email: "example@gmail.com",
  themeColor: "#ff6666",
  summery:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  experience: [
    {
      id: 1,
      title: "Full Stack Developer",
      companyName: "Amazon",
      city: "New York",
      state: "NY",
      startDate: "Jan 2021",
      endDate: "",
      currentlyWorking: true,
      workSummery: `Designed, developed, and maintained full-stack applications using React and Node.js.
• Implemented responsive user interfaces with React, ensuring seamless user experiences across various devices and browsers.
• Maintaining the React Native in-house organization application.
• Created RESTful APIs with Node.js and Express, facilitating data communication between the front-end and back-end systems.`,
    },
    {
      id: 2,
      title: "Frontend Developer",
      companyName: "Google",
      city: "Charlotte",
      state: "NC",
      startDate: "May 2019",
      endDate: "Jan 2021",
      currentlyWorking: false,
      workSummery: `Designed, developed, and maintained full-stack applications using React and Node.js.
• Implemented responsive user interfaces with React, ensuring seamless user experiences across various devices and browsers.
• Maintaining the React Native in-house organization application.
• Created RESTful APIs with Node.js and Express, facilitating data communication between the front-end and back-end systems.`,
    },
  ],
  education: [
    {
      id: 1,
      universityName: "Western Illinois University",
      startDate: "Aug 2018",
      endDate: "Dec 2019",
      degree: "Master",
      major: "Computer Science",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    },
    {
      id: 2,
      universityName: "Western Illinois University",
      startDate: "Aug 2016",
      endDate: "May 2018",
      degree: "Bachelor",
      major: "Computer Science",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
    },
  ],
  skills: [
    {
      id: 1,
      name: "Angular",
      rating: 80,
    },
    {
      id: 2,
      name: "React",
      rating: 100,
    },
    {
      id: 3,
      name: "MySQL",
      rating: 80,
    },
    {
      id: 4,
      name: "React Native",
      rating: 100,
    },
  ],
  projects: [
    {
      id: 1,
      title: "Portfolio Website",
      description:
        "Developed a responsive portfolio website using React and Tailwind CSS.",
      link: "https://myportfolio.com",
      startDate: "Jan 2023",
      endDate: "Feb 2023",
      currentlyWorking: false,
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description:
        "Built an e-commerce platform with shopping cart, payments, and admin dashboard.",
      link: "https://myecommerce.com",
      startDate: "Mar 2023",
      endDate: "",
      currentlyWorking: true,
    },
  ],
  certifications: [],
};

export default DefaultResumeData;
