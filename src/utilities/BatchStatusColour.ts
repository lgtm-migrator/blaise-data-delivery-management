export function getDDFileStatusStyle(status: string): string {
    switch (status) {
        case "inactive":
            return "dead";
        case "in_arc":
            return "success";

        case "errored":
            return "error";
        default:
            return "pending";
    }
}
