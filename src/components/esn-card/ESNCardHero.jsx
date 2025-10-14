import { useTranslation } from "react-i18next";
import { Tag } from "lucide-react";
import { getImagePath } from "../../utils/imageUtils";

const ESN_CARD_IMAGE = getImagePath("esn-card.png");

const ESNCardHero = () => {
    const { t } = useTranslation();


    return (
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mb-16">
        {/* Card Image with Floating Animation */}
        <div className="w-full lg:w-2/5 flex justify-center">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-0 bg-blue-600 rounded-xl transform rotate-3 scale-105 shadow-xl opacity-20"></div>
            <img
              src={ESN_CARD_IMAGE}
              alt={t("esnCard.cardName")}
              className="relative z-10 rounded-xl shadow-lg object-cover w-full animate-float"
            />
          </div>
        </div>

        {/* Card Info */}
        <div className="w-full lg:w-3/5">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            {t("esnCard.cardName")}
          </h1>
          <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold mb-6">
            {t("esnCard.tagline")}
          </p>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-3 flex items-center text-gray-900 dark:text-white">
              <Tag className="w-5 h-5 mr-2" />
              {t("esnCard.benefits")}
            </h2>

            <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-4">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {t("esnCard.benefit1")}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {t("esnCard.benefit2")}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {t("esnCard.benefit3")}
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {t("esnCard.benefit4")}
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a
                href="https://sales.seabattle.se/skovde/esncard/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center"
              >
                {t("esnCard.purchaseText")}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
};

export default ESNCardHero;
