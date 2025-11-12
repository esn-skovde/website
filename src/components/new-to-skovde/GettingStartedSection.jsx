import React from 'react';
import { useTranslation } from 'react-i18next';

const GettingStartedSection = () => {
    const { t } = useTranslation();

    return (
        <section id="getting-started" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.gettingStarted.title")}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        {t("newToCity.sections.gettingStarted.description")}
                    </p>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">
                                {t("newToCity.sections.gettingStarted.essentialFirstSteps")}
                            </h3>
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                {t("newToCity.sections.gettingStarted.essentialFirstStepsList", { returnObjects: true }).map((step, index) => (
                                    <li key={index}>• {step}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3">
                                {t("newToCity.sections.gettingStarted.proTips")}
                            </h3>
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                {t("newToCity.sections.gettingStarted.proTipsList", { returnObjects: true }).map((tip, index) => (
                                    <li key={index}>• {tip}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GettingStartedSection;