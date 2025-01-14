import topImage from "../assets/images/puppet_head.png";   // Head image
import bottomImage from "../assets/images/puppet_body.png"; // Body image

/**
 * ExpertPuppet:
 * - Slides in from right if isVisible = true
 * - Head bobs up/down if isSpeaking = true
 */
// eslint-disable-next-line react/prop-types
function ExpertPuppet({ isVisible, isSpeaking }) {
  return (
    <div
      className={`
        fixed bottom-0 right-0 
        flex flex-col items-center
        transition-transform transform
        ${isVisible ? "translate-x-0" : "translate-x-full"}
        w-[128px] h-[256px]  sm:w-[256px] sm:h-[512px]
        pointer-events-none
      `}
    >
      {/* Position the two images in one container */}
      <div className="relative w-full h-full">
        {/* Body stays still at bottom */}
        <img
          src={bottomImage}
          alt="Puppet body"
          className="absolute bottom-0 left-0 scale-x-[-1]"
        />
        {/* Head uses animate-talk if isSpeaking */}
        <img
          src={topImage}
          alt="Puppet head"
          className={`
            absolute -bottom-2 sm:-bottom-3 left-0 scale-x-[-1]
            ${isSpeaking ? "animate-talk" : ""}
          `}
        />
      </div>
    </div>
  );
}

export default ExpertPuppet;