export interface Result {
    success: boolean,
    error: Array<any>,
    userAuth: boolean,
    data?: any
}

export class API {
    private hookPath: string;

    constructor(pathToAPI: string) {
        this.hookPath = pathToAPI;
    }

    public call = async (
        args?: FormData
    ): Promise<Result | false> => {
        try {
            return await fetch(this.hookPath, {
                method: "POST",
                headers: {},
                signal: AbortSignal.timeout(15000),
                body: args ?? undefined
            })
                .then(async (response) => {
                    if (!response.ok) {
                        console.error(response);
                        return false;
                    }
                    const textResponse = await response.text();
                    try {
                        const json = JSON.parse(textResponse) as Result;
                        if (json.success) {
                            return json;
                        } else {
                            json.error
                                ? console.error('[API] Failed request: Error', json.error)
                                : console.error('[API] Failed request: broken @ type Result', json)
                            alert(json.error.join(`\n\n`));
                            return false;
                        }
                    } catch (e) {
                        console.error('Result not JSON:', { inputData: args, resultText: textResponse });
                        console.error(e);
                        return false;
                    }
                })
                .catch((e) => {
                    console.error(e);
                    return false;
                });
        } catch (e) {
            console.error(e, args);
            return false;
        }
    }
}
