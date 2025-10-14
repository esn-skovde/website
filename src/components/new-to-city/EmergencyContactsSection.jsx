import React from 'react';
import { useTranslation } from 'react-i18next';

const EmergencyContactsSection = () => {
    const { t } = useTranslation();

    return (
        <section id="emergency-contacts" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.emergencyContacts.needHelp")} {t("newToCity.sections.emergencyContacts.title")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.emergencyContacts.description")}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Emergency Services */}
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center">
                            {t("newToCity.sections.emergencyContacts.emergencyServices")}
                        </h3>
                        <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-red-900 dark:text-red-200 mb-2">
                                    112
                                </div>
                                <p className="text-red-800 dark:text-red-300 font-semibold">
                                    {t("newToCity.sections.emergencyContacts.emergencyServicesNumber")}
                                </p>
                                <p className="text-red-700 dark:text-red-400 text-sm mt-2">
                                    {t("newToCity.sections.emergencyContacts.emergencyServicesDescription")}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-red-800 dark:text-red-300">
                            <p><strong>{t("newToCity.sections.emergencyContacts.emergencyServicesWhenToCall")}:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                {t("newToCity.sections.emergencyContacts.emergencyServicesWhenToCallList", { returnObjects: true }).map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* University Contact */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                            {t("newToCity.sections.emergencyContacts.universitySupport")}
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {t("newToCity.sections.emergencyContacts.universityName")}
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    {t("newToCity.sections.emergencyContacts.universitySupportDescription")}
                                </p>
                                <a
                                    href="https://www.his.se/en/contact/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                >
                                    https://www.his.se/en/contact/
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Important Numbers */}
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t("newToCity.sections.emergencyContacts.otherImportantNumbers")}</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">💊</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.emergencyContacts.healthcareInfo")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.emergencyContacts.healthcareInfoDescription")}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">👮</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.emergencyContacts.nonEmergencyPolice")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.emergencyContacts.nonEmergencyPoliceDescription")}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🏠</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.emergencyContacts.housingIssues")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.emergencyContacts.housingIssuesDescription")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Important Notes */}
                <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6">
                    <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center">
                        {t("newToCity.sections.emergencyContacts.importantNotes")}
                    </h4>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        {t("newToCity.sections.emergencyContacts.importantNotesList", { returnObjects: true }).map((item, index) => (
                            <li key={index}>• {item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default EmergencyContactsSection;