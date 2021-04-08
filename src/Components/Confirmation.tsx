import React, {ReactElement, useState} from "react";
import {Link, Redirect, useHistory} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import {sendDataDeliveryRequest} from "../utilities/http";

function Confirmation(): ReactElement {
    const [formError, setFormError] = useState<string>("");
    const [redirect, setRedirect] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const history = useHistory();

    async function confirmOption() {
        if (confirm === null) {
            setFormError("Select an answer");
            return;
        }
        if (!confirm) {
            history.push("/");
            return;
        }

        setLoading(true);
        setMessage("");

        const success = await sendDataDeliveryRequest();

        setLoading(false);

        if (!success) {
            setMessage("Failed to trigger Data Delivery.");
            setRedirect(true);
            return;
        }

        setMessage("Triggered Data Delivery successfully, It may take a few minutes for the run to appear in the table below.");
        setRedirect(true);
    }

    return (
        <>
            {
                redirect && <Redirect
                    to={{
                        pathname: "/",
                        state: {status: message}
                    }}/>
            }
            <p>
                <Link to={"/"}>Previous</Link>
            </p>
            <h1>
                Are you sure you want to trigger Data Delivery?
            </h1>

            {
                message !== "" &&
                <ONSPanel status={message.includes("success") ? "success" : "error"}>
                    <p>{message}</p>
                </ONSPanel>
            }

            <form className="u-mt-m">
                {
                    formError === "" ?
                        confirmDeleteRadios(setConfirm)
                        :
                        <ONSPanel status={"error"}>
                            <p className="panel__error">
                                <strong>{formError}</strong>
                            </p>
                            {confirmDeleteRadios(setConfirm)}
                        </ONSPanel>
                }

                <br/>
                <ONSButton
                    label={"Continue"}
                    primary={true}
                    loading={loading}
                    id="confirm-continue"
                    onClick={() => confirmOption()}/>
                {!loading &&
                <ONSButton
                    label={"Cancel"}
                    primary={false}
                    id="cancel-overwrite"
                    onClick={() => history.push("/")}/>
                }
            </form>
        </>
    );
}

function confirmDeleteRadios(setConfirm: (value: (((prevState: (boolean | null)) => (boolean | null)) | boolean | null)) => void) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset__legend">
            </legend>
            <div className="radios__items">

                <p className="radios__item">
                        <span className="radio">
                        <input
                            type="radio"
                            id="confirm-overwrite"
                            className="radio__input js-radio "
                            value="True"
                            name="confirm-delete"
                            aria-label="No"
                            onChange={() => setConfirm(true)}
                        />
                        <label className="radio__label " htmlFor="confirm-overwrite">
                            Yes, trigger Data Delivery
                        </label>
                    </span></p>
                <br/>
                <p className="radios__item">
                        <span className="radio">
                        <input
                            type="radio"
                            id="cancel-keep"
                            className="radio__input js-radio "
                            value="False"
                            name="confirm-delete"
                            aria-label="Yes"
                            onChange={() => setConfirm(false)}
                        />
                        <label className="radio__label " htmlFor="cancel-keep">
                            No, do not trigger Data Delivery
                        </label>
                    </span>
                </p>
            </div>
        </fieldset>
    );
}

export default Confirmation;
