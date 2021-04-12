import {GoogleAuth} from "google-auth-library";

export default async function getAuthToken(DDS_CLIENT_ID: string): Promise<string> {
    try {
        const auth = new GoogleAuth();
        const {idTokenProvider} = await auth.getIdTokenClient(DDS_CLIENT_ID);
        return await idTokenProvider.fetchIdToken(DDS_CLIENT_ID);
    } catch {
        console.log("Could not get Google Auth credentials");
        return "";
    }
}
