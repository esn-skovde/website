import { Globe2, Lightbulb, ShoppingCart, Wine } from "lucide-react";

import GuideSection from "./GuideSection";
import useSection from "./useSection";
import Reveal from "../ui/Reveal";
import InfoCard from "../ui/InfoCard";
import Callout from "../ui/Callout";
import BulletList from "../ui/BulletList";

const CHAINS = ["ica", "hemkop", "lidl", "coop"];
const INTERNATIONAL = ["toppLivs", "siamFood"];

/* Name on top, what it actually is underneath — the same shape for a chain and
   for an international grocer, so the two lists scan as one vocabulary. */
const Store = ({ name, detail }) => (
    <div className="rounded-2xl border border-hairline/[var(--hairline-opacity)] bg-surface-2 px-4 py-3.5">
        <p className="font-display font-bold text-ink">{name}</p>
        <p className="mt-0.5 text-[0.875rem] leading-relaxed text-ink-muted">{detail}</p>
    </div>
);

const ShoppingSection = () => {
    const { at, list } = useSection("shopping");

    return (
        <GuideSection sectionKey="shopping" title={at("sectionTitle")} lead={at("description")}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[3fr_2fr]">
                <Reveal>
                    <InfoCard icon={ShoppingCart} title={at("food.mainGroceryStores.title")}>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {CHAINS.map((key) => (
                                <Store
                                    key={key}
                                    name={at(`food.mainGroceryStores.${key}.title`)}
                                    detail={at(`food.mainGroceryStores.${key}.description`)}
                                />
                            ))}
                        </div>
                    </InfoCard>
                </Reveal>

                <Reveal delay={90}>
                    <InfoCard icon={Globe2} title={at("food.internationalFoods.title")}>
                        <div className="grid gap-3">
                            {INTERNATIONAL.map((key) => (
                                <Store
                                    key={key}
                                    name={at(`food.internationalFoods.${key}.title`)}
                                    detail={at(`food.internationalFoods.${key}.description`)}
                                />
                            ))}
                        </div>
                    </InfoCard>
                </Reveal>
            </div>

            <Reveal delay={150} className="mt-5">
                {/* Buying alcohol anywhere but Systembolaget is not a thing here, and
                    the age is 20 rather than 18 — worth flagging, not burying. */}
                <Callout icon={Wine} tone="urgent" title={at("alcohol.swedishAlcoholLaws")}>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                        {at("alcohol.swedishAlcoholLawsDescription")}
                    </p>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                {at("alcohol.systembolagetLocations.title")}
                            </h4>
                            <BulletList
                                className="mt-3"
                                iconClassName="text-esn-magenta"
                                items={[
                                    at("alcohol.systembolagetLocations.centrum"),
                                    at("alcohol.systembolagetLocations.nearElinsEsplanad"),
                                ]}
                            />
                        </div>
                        <div>
                            <h4 className="font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] text-ink-faint">
                                {at("alcohol.importantRequirements.title")}
                            </h4>
                            <BulletList
                                className="mt-3"
                                iconClassName="text-esn-magenta"
                                items={[
                                    at("alcohol.importantRequirements.legalAge"),
                                    at("alcohol.importantRequirements.alwaysBringValidID"),
                                ]}
                            />
                        </div>
                    </div>
                </Callout>
            </Reveal>

            <Reveal delay={210} className="mt-5">
                <InfoCard icon={Lightbulb} title={at("shoppingTips.title")}>
                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                        <BulletList items={list("shoppingTips.tipsListOne")} />
                        <BulletList items={list("shoppingTips.tipsListTwo")} />
                    </div>
                </InfoCard>
            </Reveal>
        </GuideSection>
    );
};

export default ShoppingSection;
