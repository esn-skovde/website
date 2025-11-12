import React from 'react';
import { useTranslation } from 'react-i18next';

const ShoppingSection = () => {
    const { t } = useTranslation();

    return (
        <section
            id="shopping"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    {t("newToCity.sections.shopping.sectionTitle")}
                </h2>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {t("newToCity.sections.shopping.description")}
                </p>

                <div className="space-y-8">
                    {/* Food Shopping */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-green-900 dark:text-green-200 mb-6 flex items-center">
                            {t("newToCity.sections.shopping.food.title")}
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Main Grocery Stores */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t(
                                        "newToCity.sections.shopping.food.mainGroceryStores.title"
                                    )}
                                </h4>
                                <div className="space-y-3">
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.ica.title"
                                            )}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.ica.description"
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.hemkop.title"
                                            )}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.hemkop.description"
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.lidl.title"
                                            )}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.lidl.description"
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.coop.title"
                                            )}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t(
                                                "newToCity.sections.shopping.food.mainGroceryStores.coop.description"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Specialty Food Stores */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t(
                                        "newToCity.sections.shopping.food.internationalFoods.title"
                                    )}
                                </h4>
                                <div className="space-y-3">
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {t(
                                                "newToCity.sections.shopping.food.internationalFoods.toppLivs.title"
                                            )}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t(
                                                "newToCity.sections.shopping.food.internationalFoods.toppLivs.description"
                                            )}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {t(
                                                "newToCity.sections.shopping.food.internationalFoods.siamFood.title"
                                            )}
                                        </h5>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {t(
                                                "newToCity.sections.shopping.food.internationalFoods.siamFood.description"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alcohol Shopping - Special Rules */}
                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold text-red-900 dark:text-red-200 mb-4 flex items-center">
                            {t("newToCity.sections.shopping.alcohol.title")}
                        </h3>

                        <div className="bg-red-100 dark:bg-red-900/40 p-4 rounded-lg mb-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                                {t(
                                    "newToCity.sections.shopping.alcohol.swedishAlcoholLaws"
                                )}
                            </h4>
                            <p className="text-red-800 dark:text-red-300 text-sm">
                                {t(
                                    "newToCity.sections.shopping.alcohol.swedishAlcoholLawsDescription"
                                )}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t(
                                        "newToCity.sections.shopping.alcohol.systembolagetLocations.title"
                                    )}
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <span className="mr-2">📍</span>
                                        <span>
                                            {t(
                                                "newToCity.sections.shopping.alcohol.systembolagetLocations.centrum"
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                                        <span className="mr-2">📍</span>
                                        <span>
                                            {t(
                                                "newToCity.sections.shopping.alcohol.systembolagetLocations.nearElinsEsplanad"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    {t(
                                        "newToCity.sections.shopping.alcohol.importantRequirements.title"
                                    )}
                                </h4>
                                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                                    <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                                        {t(
                                            "newToCity.sections.shopping.alcohol.importantRequirements.legalAge"
                                        )}
                                    </p>
                                    <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                                        {t(
                                            "newToCity.sections.shopping.alcohol.importantRequirements.alwaysBringValidID"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shopping Tips */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3 flex items-center">
                            {t(
                                "newToCity.sections.shopping.shoppingTips.title"
                            )}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-6">
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                {t(
                                    "newToCity.sections.shopping.shoppingTips.tipsListOne",
                                    { returnObjects: true }
                                ).map((tip, index) => (
                                    <li key={index}>• {tip}</li>
                                ))}
                            </ul>
                            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                                {t(
                                    "newToCity.sections.shopping.shoppingTips.tipsListTwo",
                                    { returnObjects: true }
                                ).map((tip, index) => (
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

export default ShoppingSection;