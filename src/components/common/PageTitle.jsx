import { useEffect } from "react";


export default function PageTitle({ title }) {
    useEffect(() => {
        // Update the page title
        const previousTitle = document.title;
        document.title = "ESN Skövde | " + title;


        return () => {
            document.title = previousTitle;
        };
    }, [title]);


    return null;
}

