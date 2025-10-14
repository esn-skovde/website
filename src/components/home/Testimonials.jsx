import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";
import testimonialData from "../../data/testimonials.json";
import { getImagePath } from "../../utils/imageUtils";


const Testimonials = () => {
    const { t } = useTranslation();
    const { testimonials } = testimonialData;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Testimonials Title and Subtitle */}
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                    {t("home.testimonials.title")}
                </h2>
                <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
                    {t("home.testimonials.subtitle")}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Testimonials Cards */}
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex items-center mb-6">
                                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4">
                                        <img
                                            src={getImagePath(testimonial.image)}
                                            alt={testimonial.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {testimonial.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200 dark:text-blue-800 transform -scale-x-100" />
                                    <p className="text-gray-600 dark:text-gray-300 pl-6">
                                        "{testimonial.text}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
