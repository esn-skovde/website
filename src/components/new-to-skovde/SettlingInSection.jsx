import React from 'react';
import { useTranslation } from 'react-i18next';

const SettlingInSection = () => {
    const { t } = useTranslation();

    return (
        <section id="settling-in" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.settlingIn.title")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.settlingIn.description")}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center">
                            {t("newToCity.sections.settlingIn.firstWeekChecklist")}
                        </h3>
                        <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                            {t("newToCity.sections.settlingIn.firstWeekChecklistList", { returnObjects: true }).map((item, index) => (
                                <li key={index}>• {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                            {t("newToCity.sections.settlingIn.makingYourPlaceHome")}
                        </h3>
                        <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                            {t("newToCity.sections.settlingIn.makingYourPlaceHomeList", { returnObjects: true }).map((item, index) => (
                                <li key={index}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-200 mb-4 flex items-center">
                            {t("newToCity.sections.settlingIn.dealingWithSwedishWeather.title")}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.settlingIn.dealingWithSwedishWeather.winterPreparation")}</h4>
                                <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                    {t("newToCity.sections.settlingIn.dealingWithSwedishWeather.winterPreparationList", { returnObjects: true }).map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.settlingIn.dealingWithSwedishWeather.yearRoundTips")}</h4>
                                <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                    {t("newToCity.sections.settlingIn.dealingWithSwedishWeather.yearRoundTipsList", { returnObjects: true }).map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center">
                            {t("newToCity.sections.settlingIn.managingYourBudget.title")}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.settlingIn.managingYourBudget.moneySavingTips")}</h4>
                                <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                    {t("newToCity.sections.settlingIn.managingYourBudget.moneySavingTipsList", { returnObjects: true }).map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.settlingIn.managingYourBudget.paymentMethods")}</h4>
                                <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                    {t("newToCity.sections.settlingIn.managingYourBudget.paymentMethodsList", { returnObjects: true }).map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SettlingInSection;