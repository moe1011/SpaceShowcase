import PropTypes from 'prop-types';

const ImagePlaceholder = ({ aspectRatio }) => {
  const imageStyle = {
    // Fallback to 16:9 if no aspect ratio is provided
    aspectRatio: aspectRatio ? `${1 / aspectRatio}` : "16/9",
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full sm:max-w-[1000px]">
        <div className="flex flex-col w-full h-full items-center justify-center pt-5 sm:pt-0">
          <div className="h-8 shimmer rounded-md w-3/4 mb-4"></div>
          <div className="h-4 shimmer rounded-md w-1/4 mb-7"></div>
          <div
            className="w-full h-auto shimmer rounded-lg"
            style={imageStyle}
          ></div>
          <div className="mt-7 w-full space-y-3">
            <div className="h-4 shimmer rounded-md w-full"></div>
            <div className="h-4 shimmer rounded-md w-full"></div>
            <div className="h-4 shimmer rounded-md w-5/6"></div>
            <div className="h-4 shimmer rounded-md w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

ImagePlaceholder.propTypes = {
  aspectRatio: PropTypes.number,
};

export default ImagePlaceholder; 