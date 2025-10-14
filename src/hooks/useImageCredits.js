import { useEffect } from 'react';

const useImageCredits = () => {
    useEffect(() => {
        const addCreditsToImages = () => {
            // Find all images with imageCredit attribute (handle case-insensitivity)
            const imagesWithCredits = document.querySelectorAll('img[image-credit]');

            imagesWithCredits.forEach(img => {
                // Skip if credit overlay already exists
                if (img.parentElement.querySelector('.image-credit-overlay')) {
                    return;
                }

                const credit = img.getAttribute('image-credit');
                if (!credit) return;

                // Ensure the parent has relative positioning
                const parent = img.parentElement;
                if (!parent.style.position && !parent.classList.contains('relative')) {
                    parent.style.position = 'relative';
                }

                // Create credit overlay
                const creditOverlay = document.createElement('div');
                creditOverlay.className = 'image-credit-overlay absolute bottom-1 right-1 z-10 text-xs text-white font-medium pointer-events-none bg-gray-800/60 px-1 py-0.5 rounded';
                creditOverlay.textContent = `📷: ${credit}`;

                parent.appendChild(creditOverlay);
            });
        };

        // Run immediately
        addCreditsToImages();

        // Also run when DOM changes or attributes change (for dynamic content and fallback updates)
        const observer = new MutationObserver(addCreditsToImages);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // Ensure overlays are added when images error or load
        const onImageEvent = () => addCreditsToImages();
        document.addEventListener('error', onImageEvent, true);
        document.addEventListener('load', onImageEvent, true);

        return () => {
            observer.disconnect();
            document.removeEventListener('error', onImageEvent, true);
            document.removeEventListener('load', onImageEvent, true);
        };
    }, []);
};

export default useImageCredits;
