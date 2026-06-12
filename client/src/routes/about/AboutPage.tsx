import { Users, Award, Home, MessageSquare,Calendar, Shield } from 'lucide-react';
import { AgentCards } from '../../components/ui/AgentCards';
import { LayoutTextFlip } from '../../components/ui/TextFlip';
import { motion } from "motion/react";
import { portraitForIndex } from '../../lib/siteImages';

// Testimonial type
type Testimonial = {
  quote:string;
  name: string;
  designation: string;
  src: string;
  rating?: number;
};

const AboutPage = () => {

  const testimonials: Testimonial[] = [
    {
      quote:
        "CrestKeys helped me find my dream apartment in just two weeks! The process was smooth, transparent, and stress-free. Their team truly understands what modern homebuyers need.",
      name: "Ananya Patel",
      designation: "Software Engineer, Bengaluru",
      rating: 5,
      src: portraitForIndex(0),
    },
    {
      quote:
        "The professionalism and attention to detail from CrestKeys were exceptional. They guided me from shortlisting to final registration with full clarity.",
      name: "Rohit Verma",
      designation: "Entrepreneur, Mumbai",
      rating: 4.8,
      src: portraitForIndex(1),
    },
    {
      quote:
        "As a first-time buyer, I had endless questions—but CrestKeys’ team was patient, knowledgeable, and always available. Their service exceeded my expectations!",
      name: "Megha Sharma",
      designation: "Marketing Executive, Pune",
      rating: 4.9,
      src: portraitForIndex(2),
    },
    {
      quote:
        "I sold my property through CrestKeys and was amazed by their market insights and negotiation skills. They made sure I got the best deal possible.",
      name: "Karan Malhotra",
      designation: "Business Owner, Delhi NCR",
      rating: 5,
      src: portraitForIndex(3),
    },
    {
      quote:
        "CrestKeys combines luxury listings with genuine customer care. Their personalized approach made me feel valued and confident in my investment.",
      name: "Nisha Rao",
      designation: "Architect, Hyderabad",
      rating: 4.7,
      src: portraitForIndex(4),
    },
  ];

  return (
    <div className="bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-950 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">

        <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
        <LayoutTextFlip
          text="Welcome to "
          words={["CrestKeys", "crestKeys", "Crestkeys"]}
        />
        </motion.div>
        <p className="mt-4 text-center text-base text-neutral-600 dark:text-neutral-400">
          Transforming real estate experiences through innovation, personalized service, 
          and AI-powered solutions since 2008.
        </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-[#1f1f1f] bg-opacity-10 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <Home className="text-blue-300 mr-3" size={24} />
                <h3 className="text-xl font-semibold">2000+ Properties</h3>
              </div>
              <p className="text-blue-100">
                Browse our extensive collection of premium listings across the country.
              </p>
            </div>

            <div className="bg-[#1f1f1f] bg-opacity-10 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="text-blue-300 mr-3" size={24} />
                <h3 className="text-xl font-semibold">10,000+ Happy Clients</h3>
              </div>
              <p className="text-blue-100">
                Join thousands of satisfied customers who found their perfect home with us.
              </p>
            </div>

            <div className="bg-[#1f1f1f] bg-opacity-10 p-8 rounded-lg">
              <div className="flex items-center mb-4">
                <Award className="text-blue-300 mr-3" size={24} />
                <h3 className="text-xl font-semibold">200+ Awards</h3>
              </div>
              <p className="text-blue-100">
                Recognized for excellence in real estate services and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-300 mb-4">Client Testimonials</h2>
          <div className="h-1 w-24 bg-gray-600 mx-auto"></div>
        </div>

        <AgentCards testimonials={testimonials}/>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose CrestKeys</h2>
          <div className="h-1 w-24 bg-gray-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
<div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start">
  <div className="w-15 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
    <Shield className="text-gray-600" size={22} />
  </div>
  <div className="text-center sm:text-left">
    <h3 className="text-xl font-semibold text-gray-500 mb-2">Trusted by Thousands</h3>
    <p className="text-gray-300">
      With over 10,000 satisfied clients and a 98% customer satisfaction rate, 
      our reputation speaks for itself.
    </p>
  </div>
</div>

<div className="mb-8 flex flex-col sm:flex-row items-center sm:items-start">
  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
    <Calendar className="text-gray-600" size={22} />
  </div>
  <div className="text-center sm:text-left">
    <h3 className="text-xl font-semibold text-gray-500 mb-2">16+ Years of Experience</h3>
    <p className="text-gray-300">
      Our seasoned team brings decades of combined expertise in the real estate market.
    </p>
  </div>
</div>

<div className="flex flex-col sm:flex-row items-center sm:items-start">
  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
    <MessageSquare className="text-gray-600" size={22} />
  </div>
  <div className="text-center sm:text-left">
    <h3 className="text-xl font-semibold text-gray-500 mb-2">Personalized Support</h3>
    <p className="text-gray-300">
      Our team is available 24/7 to guide you through every step of your property journey.
    </p>
  </div>
</div>

          </div>

          <div className="bg-gray-900 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-semibold mb-6">Ready to Find Your Dream Property?</h3>
            <p className="mb-8">
              Join thousands of satisfied clients who found their perfect home with CrestKeys
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href='/list' className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition w-full sm:w-auto">
                Browse Properties
              </a>
              <a href='/contacts'
              className="border border-white text-white py-3 px-6 rounded-lg hover:bg-white hover:text-gray-900 transition w-full sm:w-auto">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 px-6 bg-[#1f1f1f] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Let's Start Your Property Journey Together
          </h2>
          <p className="text-lg md:text-xl mb-10">
            Whether you're buying, selling, or just exploring options, our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-blue-900 font-semibold py-3 px-8 rounded-lg hover:bg-blue-100 transition w-full sm:w-auto">
              Schedule a Consultation
            </button>
            <a href='/list'
             className="border border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-900 transition w-full sm:w-auto">
              {/* View Our Properties */}
              View Our Properties
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
