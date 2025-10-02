import React from 'react';
import ReactTypingEffect from 'react-typing-effect';
import Tilt from 'react-parallax-tilt';
import profileImage from '../../assets/sam-img.png';

const About = () => {
  return (
<section
  id="about"
  className="w-full py-4 font-sans mt-16 md:mt-24 lg:mt-32"
>
  <div className="max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center px-4 md:px-8 lg:px-16">
    {/* Left Side */}
    <div className="md:w-1/2 text-center md:text-left mt-8 md:mt-0">
      {/* Greeting */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
        Hi, I am
      </h1>

      {/* Name */}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
        Samadhan Gore
      </h2>

      {/* Skills Heading with Typing Effect */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-[#8245ec] leading-tight">
        <span className="text-white">I am a </span>
        <ReactTypingEffect
          text={[
            "Fullstack Developer",
            "Front End Developer",
            "React Js Developer",
            "Web Developer",
            "Coder",
          ]}
          speed={100}
          eraseSpeed={50}
          typingDelay={500}
          eraseDelay={2000}
          cursorRenderer={(cursor) => (
            <span className="text-[#8245ec]">{cursor}</span>
          )}
        />
      </h3>

      {/* About Me Paragraph */}
      <p className="text-base sm:text-lg md:text-lg text-gray-400 mb-10 mt-8 leading-relaxed">
        I am a Full Stack Developer with 2.5 years of experience, specializing
        in building modern, scalable, and user-focused web applications. With
        strong expertise in HTML, CSS, JavaScript, React.js, Tailwind CSS, PHP,
        Bootstrap, MySQL, and WordPress, I deliver high-quality solutions that
        are responsive, cross-browser compatible, and performance-driven.
      </p>

      {/* Resume Button */}
      <a
        href="https://drive.google.com/file/d/1pmPgcAB7OlFVHREF6kza4Xcyt4VUjNvA/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-white py-3 px-8 rounded-full mt-5 text-lg font-bold transition duration-300 transform hover:scale-105"
        style={{
          background: "linear-gradient(90deg, #8245ec, #a855f7)",
          boxShadow: "0 0 2px #8245ec, 0 0 2px #8245ec, 0 0 40px #8245ec",
        }}
      >
        DOWNLOAD CV
      </a>
    </div>

    {/* Right Side */}
    <div className="md:w-1/2 flex justify-center md:justify-end">
      <Tilt
        className="w-48 h-48 sm:w-64 sm:h-64 md:w-[30rem] md:h-[30rem] border-4 border-purple-700 rounded-full"
        tiltMaxAngleX={20}
        tiltMaxAngleY={20}
        perspective={1000}
        scale={1.05}
        transitionSpeed={1000}
        gyroscope={true}
      >
        <img
          src={profileImage}
          alt="Samadhan Gore"
          className="w-full h-full rounded-full object-contain drop-shadow-[0_10px_20px_rgba(130,69,236,0.5)] bg-white"
        />
      </Tilt>
    </div>
  </div>
</section>

  );
};

export default About;
