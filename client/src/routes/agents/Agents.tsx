import { AgentCards } from "../../components/ui/AgentCards";
import { portraitForIndex } from "../../lib/siteImages";

export function Agents() {
  const agents = [
    {
      quote:
        "Finding the perfect home for every client is not just my job—it’s my passion. At CrestKreys, we make luxury living accessible and effortless.",
      name: "Riya Mehta",
      designation: "Senior Property Consultant at CrestKreys",
      src: portraitForIndex(0),
    },
    {
      quote:
        "From cozy apartments to sprawling estates, I help clients turn their property dreams into reality with transparent guidance and expert advice.",
      name: "Arjun Singh",
      designation: "Real Estate Advisor at CrestKreys",
      src: portraitForIndex(1),
      
    },
    {
      quote:
        "CrestKreys is more than just a brokerage—it’s a family that truly cares about helping people find homes that match their lifestyle and future goals.",
      name: "Priya Nair",
      designation: "Luxury Property Specialist at CrestKreys",
      src: portraitForIndex(2),
    },
    {
      quote:
        "We go beyond selling properties. We build long-term relationships based on trust, transparency, and results that speak for themselves.",
      name: "Rohan Kapoor",
      designation: "Sales Director at CrestKreys",
      src: portraitForIndex(3),
    },
    {
      quote:
        "My goal is to make every buying and selling experience smooth, strategic, and rewarding. Real estate at CrestKreys means excellence with integrity.",
      name: "Vinay Sharma",
      designation: "Client Relations Manager at CrestKreys",
      src: portraitForIndex(4),
    },
  ];

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-950">
    <AgentCards testimonials={agents} />
  </div>
  ) ;
}
