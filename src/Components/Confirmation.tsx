import React, {ReactElement, useState} from "react";
import {Link, Redirect, useHistory} from "react-router-dom";
import {ONSButton, ONSPanel} from "blaise-design-system-react-components";
import {sendDataDeliveryRequest} from "../utilities/http";

function Confirmation() : ReactElement{
    const [redirect, setRedirect] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const history = useHistory();

    async function confirmOption() {
        setLoading(true);
        setMessage("");

        if (!confirm) {
            history.push("/");
            return;
        }

        const success = await sendDataDeliveryRequest();

        setLoading(false);

        if (!success) {
            setMessage("Trigger Data Delivery failed");
            return;
        }

        setMessage("Trigger Data Delivery success");
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

            <form onSubmit={() => confirmOption()} className="u-mt-m">
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
                    onClick={() => confirmOption()}/>
                }
            </form>
        </>
    );
}

export default Confirmation;
