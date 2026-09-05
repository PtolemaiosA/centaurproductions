const LANGUAGE_COOKIE = "centaur_language";


function redirect(request, path, language) {

    const destination =
        new URL(
            path,
            request.url
        ).toString();


    return new Response(
        null,
        {
            status: 302,
            headers: {
                "Location":
                    destination,

                "Set-Cookie":
                    LANGUAGE_COOKIE +
                    "=" +
                    language +
                    "; Path=/; Max-Age=31536000; SameSite=Lax"
            }
        }
    );

}


async function serveGreek(context) {

    const response =
        await context.next();


    const newResponse =
        new Response(
            response.body,
            response
        );


    newResponse.headers.set(
        "Set-Cookie",
        LANGUAGE_COOKIE +
        "=el; Path=/; Max-Age=31536000; SameSite=Lax"
    );


    return newResponse;

}


export async function onRequest(context) {

    const request =
        context.request;


    const url =
        new URL(request.url);


    /*
     * Explicit English selection.
     *
     * /gr/?lang=en
     */

    const requestedLanguage =
        url.searchParams.get("lang");


    if (requestedLanguage === "en") {

        return redirect(
            request,
            "/",
            "en"
        );

    }


    /*
     * Explicit Greek selection.
     *
     * /gr/?lang=el
     *
     * Keep the visitor on /gr/
     * and save the Greek preference.
     */

    if (requestedLanguage === "el") {

        return serveGreek(context);

    }


    /*
     * /gr/ is always the Greek website.
     */

    return context.next();

}