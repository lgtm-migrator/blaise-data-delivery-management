import {GoogleAuth} from "google-auth-library";

export default class GoogleAuthProvider {
    private readonly DDS_CLIENT_ID: string;
    private auth: GoogleAuth;

    constructor(DDS_CLIENT_ID: string) {
        const auth = new GoogleAuth();
        this.auth = auth;
        this.DDS_CLIENT_ID = DDS_CLIENT_ID;
    }

    async getAuthToken(): Promise<string> {
        const {idTokenProvider} = await this.auth.getIdTokenClient(this.DDS_CLIENT_ID);
        return await idTokenProvider.fetchIdToken(this.DDS_CLIENT_ID);
    }
}
