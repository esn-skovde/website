/* True only in the headless render that scripts/prerender.js saves as the
   static page. That page is served until the next build, so what is only true
   on the day it was built, such as "In 2 days", has to stay out of it; the app
   adds it when it starts. Set by a flag the script injects, not
   navigator.webdriver: that is also true under the smoke test and the QA
   scripts, which must see the live app. */
export const isPrerender = typeof window !== "undefined" && window.__PRERENDER__ === true;
