const LANGUAGE_COOKIE = "centaur_language";


function redirect(url, language) {

    const response = Response.redirect(url, 302);

    response.headers.set(
        "Set-Cookie",
        `${LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`
    );

    return response;

}


export async function onRequest(context) {

    const url = new URL(context.request.url);


    /*
     * Explicit English selection.
     *
     * /gr/?lang=en
     */

    const requestedLanguage =
        url.searchParams.get("lang");


    if (requestedLanguage === "en") {

        return redirect(
            "/",
            "en"
        );

    }


    /*
     * Explicit Greek selection.
     *
     * /gr/?lang=el
     *
     * Keep the visitor on /gr/ and save
     * the Greek language preference.
     */

    if (requestedLanguage === "el") {

        const response =
            await context.next();

        response.headers.set(
            "Set-Cookie",
            `${LANGUAGE_COOKIE}=el; Path=/; Max-Age=31536000; SameSite=Lax`
        );

        return response;

    }


    /*
     * /gr/ is always the Greek website.
     */

    return context.next();

}
