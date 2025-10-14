import React from 'react';
import { useTranslation } from 'react-i18next';

const PlacesToExploreSection = () => {
    const { t } = useTranslation();

    const places = t("newToCity.sections.placesToExplore.places", { returnObjects: true });

    return (
        <section id="places-to-explore" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.placesToExplore.title")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.placesToExplore.description")}
                </p>

                <div className="space-y-6">
                    {places.map((place, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-4">
                                <div className="text-3xl flex-shrink-0">
                                    {place.icon}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {place.name}
                                        </h3>
                                        {place.social && (
                                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                {place.social}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                                        {place.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {place.activities.map((activity, actIndex) => (
                                            <span
                                                key={actIndex}
                                                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                                            >
                                                {activity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
                        {t("newToCity.sections.placesToExplore.explorationTips")}
                    </h4>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        {t("newToCity.sections.placesToExplore.explorationTipsList", { returnObjects: true }).map((tip, index) => (
                            <li key={index}>• {tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default PlacesToExploreSection;