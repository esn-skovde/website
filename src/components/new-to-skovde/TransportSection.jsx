import React from 'react';
import { useTranslation } from 'react-i18next';

const TransportSection = () => {
    const { t } = useTranslation();

    return (
        <section id="transport" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.transport.title")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.transport.description")}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Regional Transport */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4 flex items-center">
                            {t("newToCity.sections.transport.regional.title")}
                        </h3>
                        <div className="space-y-3">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>{t("newToCity.sections.transport.regional.coverage")}:</strong> {t("newToCity.sections.transport.regional.coverageDescription")}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>{t("newToCity.sections.transport.regional.app")}:</strong> {t("newToCity.sections.transport.regional.appDescription")}
                            </p>
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.transport.regional.studentBenefits")}:</h4>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {t("newToCity.sections.transport.regional.studentDiscount")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* National Trains */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-green-900 dark:text-green-200 mb-4 flex items-center">
                            {t("newToCity.sections.transport.national.title")}
                        </h3>
                        <div className="space-y-3">
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>{t("newToCity.sections.transport.national.coverage")}:</strong> {t("newToCity.sections.transport.national.coverageDescription")}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <strong>{t("newToCity.sections.transport.national.app")}:</strong> {t("newToCity.sections.transport.national.appDescription")}
                            </p>
                            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.transport.national.studentDeal")}:</h4>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    {t("newToCity.sections.transport.national.studentDealDescription")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket Types */}
                <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t("newToCity.sections.transport.ticketOptions")}</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">🎫</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.transport.singleTickets")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.transport.singleTicketsDescription")}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">📅</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.transport.dayPasses")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.transport.dayPassesDescription")}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("newToCity.sections.transport.periodTickets")}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                {t("newToCity.sections.transport.periodTicketsDescription")}
                            </p>
                        </div>
                    </div>
                </div>



                {/* Pro Tips */}
                <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center">
                        {t("newToCity.sections.transport.tips")}
                    </h4>
                    <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                        {t("newToCity.sections.transport.tipsList", { returnObjects: true }).map((tip, index) => (
                            <li key={index}>• {tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default TransportSection;