import { AgentCards } from "../../components/ui/AgentCards";

export function Agents() {
  const agents = [
    {
      quote:
        "Finding the perfect home for every client is not just my job—it’s my passion. At CrestKreys, we make luxury living accessible and effortless.",
      name: "Riya Mehta",
      designation: "Senior Property Consultant at CrestKreys",
      src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "From cozy apartments to sprawling estates, I help clients turn their property dreams into reality with transparent guidance and expert advice.",
      name: "Arjun Singh",
      designation: "Real Estate Advisor at CrestKreys",
      src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
      
    },
    {
      quote:
        "CrestKreys is more than just a brokerage—it’s a family that truly cares about helping people find homes that match their lifestyle and future goals.",
      name: "Priya Nair",
      designation: "Luxury Property Specialist at CrestKreys",
      src: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "We go beyond selling properties. We build long-term relationships based on trust, transparency, and results that speak for themselves.",
      name: "Rohan Kapoor",
      designation: "Sales Director at CrestKreys",
      src: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      quote:
        "My goal is to make every buying and selling experience smooth, strategic, and rewarding. Real estate at CrestKreys means excellence with integrity.",
      name: "Vinay Sharma",
      designation: "Client Relations Manager at CrestKreys",
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
  ];

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-950">
    <AgentCards testimonials={agents} />
  </div>
  ) ;
}
