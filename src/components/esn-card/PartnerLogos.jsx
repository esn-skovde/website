import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

// Import partner logos directly
import ryanairLogo from "../../assets/images/partners/ryanair.jpg";
import timetravelsLogo from "../../assets/images/partners/timetravels.png";
import flixbusLogo from "../../assets/images/partners/flixbus.jpg";
import samsungLogo from "../../assets/images/partners/samsung.png";

// Static partner logos
const partnerLogos = [
    {
        id: 1,
        name: "Ryanair",
        logo: ryanairLogo,
    },
    {
        id: 2,
        name: "Timetravels",
        logo: timetravelsLogo,
    },
    {
        id: 3,
        name: "Flixbus",
        logo: flixbusLogo,
    },
    {
        id: 4,
        name: "Samsung",
        logo: samsungLogo,
    }
];

const PartnerLogos = () => {
    const { t } = useTranslation();

    return (
        <div className="mt-12">
            {/* Partner Logos Section */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {t("esnCard.discountPartners")}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">  {/* Partners Description */}
                    {t("esnCard.partnersDescription")}
                </p>
            </div>

            {/* Partner Logos Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                    {partnerLogos.map((partner) => (
                        <div
                            key={partner.id}
                            className="flex items-center justify-center p-4 bg-white dark:bg-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors duration-200 border border-gray-200 dark:border-gray-300 shadow-sm"
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="max-w-full max-h-12 object-contain transition-all duration-300 hover:scale-105"
                            />
                        </div>
                    ))}
                </div>

                {/* View More Button Section */}
                <div className="mt-2 pt-6 text-center">
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                        {t("esnCard.manyMore")}
                    </p>
                    <a
                        href="https://esncard.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        {t("esnCard.viewAllDiscounts")}
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PartnerLogos;

