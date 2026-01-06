import { getActiveSections } from "@/lib/get-active-sections";
import { getSiteSettings } from "@/lib/get-site-settings";
import Header from "./Header";

/**
 * Wrapper serveur qui charge les sections actives et settings et les passe au Header
 */
export default async function HeaderWrapper() {
  const [sections, settings] = await Promise.all([
    getActiveSections(),
    getSiteSettings(),
  ]);

  return <Header sections={sections} settings={settings} />;
}
