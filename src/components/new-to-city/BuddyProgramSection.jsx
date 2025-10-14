import React from 'react';
import { useTranslation } from 'react-i18next';

const BuddyProgramSection = () => {
    const { t } = useTranslation();

    return (
        <section id="buddy-program" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.buddyProgram.sectionTitle")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.buddyProgram.description")}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                            {t("newToCity.sections.buddyProgram.esn.title")}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {t("newToCity.sections.buddyProgram.esn.description")}
                        </p>
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{t("newToCity.sections.buddyProgram.esn.infoTitle")}</h4>
                            <ul className="text-blue-800 dark:text-blue-300 text-sm space-y-1">
                                {t("newToCity.sections.buddyProgram.esn.infoList", { returnObjects: true }).map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center">
                            {t("newToCity.sections.buddyProgram.internationalCommunity.title")}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {t("newToCity.sections.buddyProgram.internationalCommunity.description")}
                        </p>
                        <div className="bg-green-100 dark:bg-green-900/40 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">{t("newToCity.sections.buddyProgram.internationalCommunity.infoTitle")}</h4>
                            <ul className="text-green-800 dark:text-green-300 text-sm space-y-1">
                                {t("newToCity.sections.buddyProgram.internationalCommunity.infoList", { returnObjects: true }).map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-200 mb-4 flex items-center">
                        {t("newToCity.sections.buddyProgram.whenYouNeedHelp.title")}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {t("newToCity.sections.buddyProgram.whenYouNeedHelp.description")}
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🆘</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t("newToCity.sections.buddyProgram.whenYouNeedHelp.emergency.title")}</h4>
                            <p className="text-red-600 dark:text-red-400 text-lg font-bold">{t("newToCity.sections.buddyProgram.whenYouNeedHelp.emergency.description")}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🏫</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t("newToCity.sections.buddyProgram.whenYouNeedHelp.university.title")}</h4>
                            <p className="text-blue-600 dark:text-blue-400 text-sm">{t("newToCity.sections.buddyProgram.whenYouNeedHelp.university.description")}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🤝</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t("newToCity.sections.buddyProgram.whenYouNeedHelp.esn.title")}</h4>
                            <p className="text-green-600 dark:text-green-400 text-sm">{t("newToCity.sections.buddyProgram.whenYouNeedHelp.esn.description")}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center">
                        {t("newToCity.sections.buddyProgram.makingTheMostOfSupport.title")}
                    </h4>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        {t("newToCity.sections.buddyProgram.makingTheMostOfSupport.list", { returnObjects: true }).map((item, index) => (
                            <li key={index}>• {item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default BuddyProgramSection;