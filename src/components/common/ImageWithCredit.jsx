import React from 'react';

const ImageWithCredit = ({
    src,
    alt,
    credit,
    className = "",
    containerClassName = "",
    showCredit = true
}) => {
    return (
        <div className={`relative w-full h-full ${containerClassName}`}>
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover ${className}`}
            />

            {showCredit && credit && (
                <div className="absolute bottom-0 right-0 m-2 z-10">
                    <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/90 font-medium shadow-lg">
                        📷 {credit}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageWithCredit;
