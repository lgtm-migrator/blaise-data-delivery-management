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
        if (this.token === "") {
            await this.getAuthToken();
        }
        await this.verifyToken();
        return {Authorization: `Bearer ${this.token}`};
    }

    private async verifyToken() {
        const decodedToken = jwt.decode(this.token, {json: true});
        if (decodedToken === null) {
            console.log("Failed to decode token, Calling for new Google auth Token");
            await this.getAuthToken();
        } else if (GoogleAuthProvider.hasTokenExpired(decodedToken["exp"])) {
            console.log("Auth Token Expired, Calling for new Google auth Token");
            await this.getAuthToken();
        }
    }

    private async getAuthToken() {
        try {
            const {idTokenProvider} = await this.auth.getIdTokenClient(this.DDS_CLIENT_ID);
            this.token = await idTokenProvider.fetchIdToken(this.DDS_CLIENT_ID);
            // return await this.auth.getRequestHeaders(this.DDS_CLIENT_ID);
        } catch (error) {
            console.error("Could not get the Google auth token credentials");
        }
    }

    private static hasTokenExpired(expireTimestamp: string): boolean {
        return new Date(expireTimestamp) >= new Date();
    }
}
