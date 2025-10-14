import React from 'react';
import { useTranslation } from 'react-i18next';

const CityHighlightsSection = () => {
    const { t } = useTranslation();

    return (
        <section id="city-highlights" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.cityHighlights.title")}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                        {t("newToCity.sections.cityHighlights.description")}
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                                {t("newToCity.sections.cityHighlights.richHeritage")}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {t("newToCity.sections.cityHighlights.richHeritageDescription")}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                                {t("newToCity.sections.cityHighlights.naturalBeauty")}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {t("newToCity.sections.cityHighlights.naturalBeautyDescription")}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                                {t("newToCity.sections.cityHighlights.studentLife")}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                {t("newToCity.sections.cityHighlights.studentLifeDescription")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6">
                        <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                            {t("newToCity.sections.cityHighlights.whatMakesSkovdeSpecial")}
                        </h4>
                        <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                            {t("newToCity.sections.cityHighlights.whatMakesSkovdeSpecialList", { returnObjects: true }).map((item, index) => (
                                <li key={index}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CityHighlightsSection;