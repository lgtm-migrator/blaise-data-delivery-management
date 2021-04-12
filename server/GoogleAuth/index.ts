import {GoogleAuth} from "google-auth-library";

export default class GoogleAuthProvider {
    IdToken: string;

    constructor(DDS_CLIENT_ID: string) {
        let IdToken = "";
        const auth = new GoogleAuth();

        auth.getIdTokenClient(DDS_CLIENT_ID).then(({idTokenProvider}) => {
            idTokenProvider.fetchIdToken(DDS_CLIENT_ID).then((token) => IdToken = token);
        }).catch((error) => {
                console.error(error, "Could not get Google Auth credentials");
            }
        );
        this.IdToken = IdToken;
    }
}
