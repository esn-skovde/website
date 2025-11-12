import React from 'react';
import { useTranslation } from 'react-i18next';

const UsefulAppsSection = () => {
    const { t } = useTranslation();

    const facebookGroups = [
        "Internationals in Skövde",
        "Studenter vid Högskolan i Skövde",
        "Köp och Sälj Skövde"
    ];

    const studentUnionAccounts = [
        "@hifsskovde",
        "@vitae.sis",
        "@histek",
        "@skovdesexmasteri"
    ];

    const universityAccounts = [
        "@hogskolaniskovde", "@uniofskovde"
    ];

    return (
        <section id="useful-apps" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.usefulApps.sectionTitle")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.usefulApps.description")}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Facebook Groups */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                            {t("newToCity.sections.usefulApps.facebookGroups")}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                            {t("newToCity.sections.usefulApps.facebookGroupsDescription")}
                        </p>
                        <div className="space-y-3">
                            {facebookGroups.map((group, index) => (
                                <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {group}
                                    </h4>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-xs text-blue-800 dark:text-blue-300">
                            {t("newToCity.sections.usefulApps.facebookGroupsTips")}
                        </div>
                    </div>

                    {/* Instagram Accounts */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-4 flex items-center">
                            {t("newToCity.sections.usefulApps.instagramAccounts")}
                        </h3>

                        <div className="space-y-4">
                            {/* Student Union Accounts */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                    {t("newToCity.sections.usefulApps.studentUnionAccounts")}
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {studentUnionAccounts.map((account, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                                        >
                                            {account}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* University Accounts */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                    {t("newToCity.sections.usefulApps.universityAccounts")}
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {universityAccounts.map((account, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                                        >
                                            {account}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 text-xs text-purple-800 dark:text-purple-300">
                            {t("newToCity.sections.usefulApps.instagramAccountsTips")}
                        </div>
                    </div>
                </div>

                {/* Essential Apps */}
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        {t("newToCity.sections.usefulApps.essentialApps")}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🚌</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Västtrafik</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.usefulApps.regionalPublicTransport")}
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🚄</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">SJ</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.usefulApps.nationalTrainTickets")}
                            </p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">💳</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Swish</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.usefulApps.mobilePaymentSystem")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tips for Social Media */}
                <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
                        {t("newToCity.sections.usefulApps.socialMediaTips")}
                    </h4>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        {t("newToCity.sections.usefulApps.socialMediaTipsList", { returnObjects: true }).map((tip, index) => (
                            <li key={index}>• {tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default UsefulAppsSection;