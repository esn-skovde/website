// Use Vite's glob import to automatically load all images
const images = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,svg,webp}', {
    eager: true,
    query: '?url',
    import: 'default'
});

// Create a simplified path mapping
const createImageMap = () => {
    const map = {};
    Object.keys(images).forEach(path => {
        // Convert '../assets/images/board/president.jpg' to 'board/president.jpg'
        const key = path.replace('../assets/images/', '');
        map[key] = images[path];
    });
    return map;
};

const imageMap = createImageMap();

export const getImagePath = (filename) => {
    if (!filename) {
        return "";
    }

    // Check if we have the image in our map
    if (imageMap[filename]) {
        return imageMap[filename];
    }



    return "";
};
