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
        if (this.token === "") {
            await this.getAuthToken();
        }
        return {Authorization: `Bearer ${this.token}`};
    }

    private async getAuthToken() {
        const {idTokenProvider} = await this.auth.getIdTokenClient(this.DDS_CLIENT_ID);
        this.token = await idTokenProvider.fetchIdToken(this.DDS_CLIENT_ID);
    }
}
