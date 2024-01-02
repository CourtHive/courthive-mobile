import { renderDefaultPage } from "../pages/courthive/default";
import Navigo from "navigo";
export function router() {
    const routerRoot = window.location.host.startsWith("localhost")
        ? "/"
        : process.env.PUBLIC_URL ?? "/";
    const useHash = true;
    const router = new Navigo(useHash ? "/" : `/${routerRoot}`, {
        hash: useHash,
    });
    router.on(`/default`, () => renderDefaultPage(false));
    router.notFound(() => {
        router.navigate("/default");
    });
    router.resolve();
}
