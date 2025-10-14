import React from 'react';
import { useTranslation } from 'react-i18next';

const AccommodationSection = () => {
    const { t } = useTranslation();

    return (
        <section id="accommodation" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.accommodation.sectionTitle")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.accommodation.description")}
                </p>

                <div className="space-y-8">
                    {/* Primary Option - Skövdebostäder */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                            {t("newToCity.sections.accommodation.skovdebostader.title")}
                        </h3>

                        <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                {t("newToCity.sections.accommodation.skovdebostader.howItWorks")}
                            </h4>
                            <ol className="text-blue-800 dark:text-blue-300 text-sm space-y-1 list-decimal list-inside">
                                {t("newToCity.sections.accommodation.skovdebostader.howItWorksList", { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ol>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    {t("newToCity.sections.accommodation.skovdebostader.pointSystem")}
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {t("newToCity.sections.accommodation.skovdebostader.pointSystemDescription")}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                    {t("newToCity.sections.accommodation.skovdebostader.newListings")}
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {t("newToCity.sections.accommodation.skovdebostader.newListingsDescription")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Alternative Options */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                            {t("newToCity.sections.accommodation.alternativeOptions.title")}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* University Accommodation */}
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                <h4 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-3 flex items-center">
                                    {t("newToCity.sections.accommodation.alternativeOptions.universityAccommodation")}
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                                    {t("newToCity.sections.accommodation.alternativeOptions.universityAccommodationDescription")}
                                </p>
                                <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-lg">
                                    <p className="text-green-800 dark:text-green-300 text-xs">
                                        {t("newToCity.sections.accommodation.alternativeOptions.universityAccommodationContact")}
                                    </p>
                                </div>
                            </div>

                            {/* BostadsZonen */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                                <h4 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center">
                                    BostadsZonen
                                </h4>
                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                                    {t("newToCity.sections.accommodation.alternativeOptions.bostadsZonenDescription")}
                                </p>
                                <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-lg">
                                    <p className="text-purple-800 dark:text-purple-300 text-xs">
                                        {t("newToCity.sections.accommodation.alternativeOptions.bostadsZonenContact")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Options */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-200 mb-4 flex items-center">
                            {t("newToCity.sections.accommodation.socialOptions.title")}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {t("newToCity.sections.accommodation.socialOptions.description")}
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                    {t("newToCity.sections.accommodation.socialOptions.bestFacebookGroups")}
                                </h4>
                                <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                    <li>• Internationals in Skövde</li>
                                    <li>• Studenter vid Högskolan i Skövde</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                                    {t("newToCity.sections.accommodation.socialOptions.tipsForFacebook")}
                                </h4>
                                <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
                                    {t("newToCity.sections.accommodation.socialOptions.tipsForFacebookList", { returnObjects: true }).map((item, index) => (
                                        <li key={index}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center">
                            {t("newToCity.sections.accommodation.emergencyContact.title")}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {t("newToCity.sections.accommodation.emergencyContact.description")}
                        </p>
                        <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg">
                            <a
                                href="mailto:studenthousing@his.se"
                                className="text-red-800 dark:text-red-300 font-semibold hover:underline"
                            >
                                studenthousing@his.se
                            </a>
                            <p className="text-red-700 dark:text-red-400 text-sm mt-2">
                                {t("newToCity.sections.accommodation.emergencyContact.contactDescription")}
                            </p>
                        </div>
                    </div>

                    {/* General Tips */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            {t("newToCity.sections.accommodation.housingSearchTips.title")}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                {t("newToCity.sections.accommodation.housingSearchTips.tipsListOne", { returnObjects: true }).map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                {t("newToCity.sections.accommodation.housingSearchTips.tipsListTwo", { returnObjects: true }).map((item, index) => (
                                    <li key={index}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccommodationSection;