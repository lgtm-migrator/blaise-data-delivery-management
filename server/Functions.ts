import {DataDeliveryBatchData, DataDeliveryFile} from "../Interfaces";

function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function OPN_field_period_generation(instrument_name: string): string {
    const month_number_str: string = instrument_name.substr(5, 2);
    let month_number_int = -1;
    let month = "Unknown";

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    if (isNumber(month_number_str)) {
        month_number_int = parseInt(month_number_str) - 1;
    }

    if (month_number_int >= 0 && month_number_int < 12) {
        month = monthNames[month_number_int];
    }

    return month + " 20" + instrument_name.substr(3, 2);
}

function field_period_to_text(instrument_name: string): string {
    const survey_tla: string = instrument_name.substr(0, 3);

    if (survey_tla === "OPN") {
        return OPN_field_period_generation(instrument_name);
    } else {
        return "Field period unknown";
    }

}

function generateDateFromString(dateString: string, timeString: string): Date {
    const day = dateString.substr(0, 2);
    const month = dateString.substr(2, 2);
    const year = dateString.substr(4, 4);

    const time = timeString.match(/.{1,2}/g);
    let [hours, minutes, seconds] = ["0", "0", "0"];
    if (time != null) {
        if (time.length >= 3) {
            [hours, minutes, seconds] = time;
        }
        [hours, minutes] = time;
    }

    return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
}


export function dd_filename_to_data(dd_filename: string): DataDeliveryFile {
    if (!dd_filename.match(/^[a-zA-Z]{2}_.{8,}_[0-9]{8}_[0-9]{4,}/)) {
        return {
            prefix: "prefix",
            instrumentName: dd_filename,
            date: new Date(0)
        };
    }
    const [prefix, instrumentName, originalDateString, timeString] = dd_filename.split("_");
    const date = generateDateFromString(originalDateString, timeString);

    return {
        prefix: prefix,
        instrumentName: instrumentName,
        date: date
    };
}

export function batch_to_data(batchName: string): DataDeliveryBatchData {
    let [survey, originalDateString, timeString] = ["", "", ""];

    if (batchName.match(/^[0-9]{8}_[0-9]{6}$/)) {
        // example 26032021_080842
        [originalDateString, timeString] = batchName.split("_");
    } else if (batchName.match(/^[a-zA-Z]{3}_[0-9]{8}_[0-9]{6}$/)) {
        // example OPN_26032021_080842
        [survey, originalDateString, timeString] = batchName.split("_");
    } else {
        return {
            date: new Date(0),
            name: batchName
        };
    }

    const date = generateDateFromString(originalDateString, timeString);

    return {
        survey: survey,
        date: date,
        name: batchName
    };
}

export default {field_period_to_text, dd_filename_to_data, batch_to_data};
