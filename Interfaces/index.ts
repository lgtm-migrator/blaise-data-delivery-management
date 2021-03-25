interface DataDeliveryBatchDates {
    date: Date
    dateString: string
    name: string
}

interface DataDeliveryFile {
    prefix: string
    instrumentName: string
    date: Date
    dateString: string
}

interface DataDeliveryFileStatus {
    batch: string
    dd_filename: string
    state: string
    updated_at: string
    instrumentName: string
}


export type {DataDeliveryFile, DataDeliveryBatchDates, DataDeliveryFileStatus};
