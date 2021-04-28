import {DataDeliveryBatchData, DataDeliveryFile} from "../Interfaces";


type DateTypes = [Date, string]

function generateDateFromString(dateString: string, timeString: string): DateTypes {
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

    return [
        new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`),
        `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    ];
}


export function dd_filename_to_data(dd_filename: string): DataDeliveryFile {
    if (!dd_filename.match(/^[a-zA-Z]{2}_.{8,}_[0-9]{8}_[0-9]{4,}/)) {
        return {
            prefix: "dd",
            instrumentName: dd_filename,
        };
    }

    const [prefix, instrumentName, instrumentCohort] = dd_filename.split("_");

    return {
        prefix: prefix,
        instrumentName: `${instrumentName}${(instrumentName.startsWith("LM") ? `_${instrumentCohort}` : "")}`,
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
            date: new Date(),
            dateString: batchName,
            name: batchName
        };
    }

    const [date, dateString] = generateDateFromString(originalDateString, timeString);

    return {
        survey: survey,
        date: date,
        dateString: dateString,
        name: batchName
    };
}

export default {dd_filename_to_data, batch_to_data};
