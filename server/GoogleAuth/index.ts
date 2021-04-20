import {GoogleAuth} from "google-auth-library";

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
        // if (this.token === "") {
        //     await this.getAuthToken();
        // }
        await this.getAuthToken();
        return {Authorization: `Bearer ${this.token}`};
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
}
