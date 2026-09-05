const LANGUAGE_COOKIE = "centaur_language";


function getCookie(request, name) {

    const cookieHeader = request.headers.get("Cookie") || "";

    const cookies = cookieHeader.split(";");

    for (const cookie of cookies) {

        const parts = cookie.trim().split("=");

        if (parts[0] === name) {

            return parts.slice(1).join("=");

        }

    }

    return null;

}


function redirect(url, language) {

    const response = Response.redirect(url, 302);

    response.headers.set(
        "Set-Cookie",
        `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`
    );

    return response;

}


export async function onRequest(context) {

    const request = context.request;

    const url = new URL(request.url);

    const cookieLanguage = getCookie(
        request,
        LANGUAGE_COOKIE
    );


    /*
     * Only handle the actual homepage.
     *
     * Everything else should pass through normally.
     */

    if (url.pathname !== "/") {

        return context.next();

    }


    /*
     * 1. Explicit language selection
     */

    const requestedLanguage =
        url.searchParams.get("lang");


    if (requestedLanguage === "el") {

        return redirect(
            "/gr/",
            "el"
        );

    }


    if (requestedLanguage === "en") {

        return redirect(
            "/",
            "en"
        );

    }


    /*
     * 2. Previously selected language
     */

    if (cookieLanguage === "el") {

        return redirect(
            "/gr/",
            "el"
        );

    }


    if (cookieLanguage === "en") {

        return context.next();

    }


    /*
     * 3. Browser language
     */

    const acceptLanguage =
        request.headers.get("Accept-Language") || "";

    const browserIsGreek =
        acceptLanguage
            .toLowerCase()
            .split(",")
            .some(
                language =>
                    language.trim().startsWith("el")
            );


    /*
     * 4. Cloudflare visitor country
     */

    const country =
        request.cf?.country ||
        request.headers.get("CF-IPCountry") ||
        "";

    const visitorIsInGreece =
        country.toUpperCase() === "GR";


    /*
     * Greek visitors go to /gr/.
     */

    if (browserIsGreek || visitorIsInGreece) {

        return redirect(
            "/gr/",
            "el"
        );

    }


    /*
     * Everyone else stays on English.
     */

    return redirect(
        "/",
        "en"
    );

}
