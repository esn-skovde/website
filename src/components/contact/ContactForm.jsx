import { useTranslation } from "react-i18next";
import { useState } from "react";
import footerData from "../../data/footer.json";

const ContactForm = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        // Create mailto URL with form data
        const { name, subject, message } = formData;
        const emailBody = `Name: ${name}\n\nMessage:\n${message}`;
        const mailtoUrl = `mailto:${footerData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        // Open email client
        window.location.href = mailtoUrl;

        // Reset submitting state after a brief delay
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
                    {t("contact.form.emailTitle")}
                </h2>
            </div>
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    {/* Name */}
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        {t("contact.form.name")}
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                </div>

                <div>
                    {/* Email */}
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        {t("contact.form.email")}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                </div>

                <div>
                    {/* Subject */}
                    <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        {t("contact.form.subject")}
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors"
                    />
                </div>

                <div>
                    {/* Message */}
                    <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300"
                    >
                        {t("contact.form.message")}
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors ${
                        isSubmitting
                            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                    } text-white`}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            {t("contact.form.openingEmail")}
                        </div>
                    ) : (
                        t("contact.form.submit")
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
