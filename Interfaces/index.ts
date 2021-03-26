interface DataDeliveryBatchData {
    survey?: string
    date: Date
    name: string
}

interface DataDeliveryFile {
    prefix: string
    instrumentName: string
    date: Date
}

interface DataDeliveryFileStatus {
    batch: string
    dd_filename: string
    state: string
    updated_at: string
    instrumentName: string
}


export type {DataDeliveryFile, DataDeliveryBatchData, DataDeliveryFileStatus};
