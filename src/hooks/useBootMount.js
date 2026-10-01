import { useState } from "react";
import { boot } from "../lib/boot";

/**
 * True for a component that mounted in the first commit over prerendered HTML.
 *
 * That HTML has already played the entrance animations and shown what is in
 * view. The client render replaces its nodes with new ones, so anything that
 * animates on mount would blank and replay content already on screen. Fixed
 * at mount: what mounts later (a client navigation, data arriving) animates
 * as usual.
 */
const useBootMount = () => useState(() => boot.overPrerender && !boot.done)[0];

export default useBootMount;
