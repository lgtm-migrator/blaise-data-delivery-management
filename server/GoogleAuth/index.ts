import {GoogleAuth} from "google-auth-library";

export default class GoogleAuthProvider {
    private readonly DDS_CLIENT_ID: string;
    private auth: GoogleAuth;

    constructor(DDS_CLIENT_ID: string) {
        this.auth = new GoogleAuth();
        this.DDS_CLIENT_ID = DDS_CLIENT_ID;
    }

    async getAuthHeader(): Promise<{ Authorization: string }> {
        const {idTokenProvider} = await this.auth.getIdTokenClient(this.DDS_CLIENT_ID);
        const token = await idTokenProvider.fetchIdToken(this.DDS_CLIENT_ID);
        return {Authorization: `Bearer ${token}`};
    }
}
