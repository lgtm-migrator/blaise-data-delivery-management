import {GoogleAuth} from "google-auth-library";
import jwt from "jsonwebtoken";

export default class GoogleAuthProvider {
    private readonly DDS_CLIENT_ID: string;
    private auth: GoogleAuth;
    private token: string;

    constructor(DDS_CLIENT_ID: string) {
        this.auth = new GoogleAuth();
        this.DDS_CLIENT_ID = DDS_CLIENT_ID;
        this.token = "";
    }

    async getAuthHeader(): Promise<{ Authorization: string }> {
        if (!this.isValidToken()) {
            await this.getAuthToken();
        }
        return {Authorization: `Bearer ${this.token}`};
    }

    private isValidToken(): boolean {
        if (this.token === "") {
            return false;
        }
        const decodedToken = jwt.decode(this.token, {json: true});
        if (decodedToken === null) {
            console.log("Failed to decode token, Calling for new Google auth Token");
            return false;
        } else if (GoogleAuthProvider.hasTokenExpired(decodedToken["exp"])) {
            console.log("Auth Token Expired, Calling for new Google auth Token");

            return false;
        }

        return true;
    }

    private async getAuthToken() {
        try {
            const {idTokenProvider} = await this.auth.getIdTokenClient(this.DDS_CLIENT_ID);
            this.token = await idTokenProvider.fetchIdToken(this.DDS_CLIENT_ID);
        } catch (error) {
            console.error("Could not get the Google auth token credentials");
        }
    }

    private static hasTokenExpired(expireTimestamp: string): boolean {
        return new Date(expireTimestamp) >= new Date();
    }
}
