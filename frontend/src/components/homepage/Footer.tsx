import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card";
  
  const Footer = () => {
    return (
      <footer className="w-full">
        <div className="fixed bottom-4 left-4 z-50">
          <HoverCard openDelay={0} closeDelay={0}>
          <HoverCardTrigger 
            className="bg-[#0077B5] text-white font-semibold text-sm px-4 py-2 rounded shadow-md cursor-pointer"
            >
              Check Us Out On LinkedIn!
            </HoverCardTrigger>
            <HoverCardContent
              className="bg-white backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs text-sm text-black font-normal leading-relaxed"
            >
              <div className="flex flex-col gap-1">
                <a
                  href="https://www.linkedin.com/in/edchan23/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
                >
                  @Edward Chan
                </a>
                <a
                  href="https://www.linkedin.com/in/benjaminliumd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
                >
                  @Ben Li
                </a>
                <a
                  href="https://www.linkedin.com/in/haojiang418/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
                >
                  @Hao Jiang
                </a>
                <a
                  href="https://www.linkedin.com/in/chrisnam28/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-gray-700 hover:text-black transition-colors duration-150"
                >
                  @Chris Nam
                </a>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </footer>
    );
  };

  export default Footer;
