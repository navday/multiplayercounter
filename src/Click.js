import React, {Component, useEffect, useState} from "react";
import API, {graphqlOperation} from "@aws-amplify/api";
import * as subscriptions from "./graphql/subscriptions";
import * as mutations from "./graphql/mutations";

function Click(props)  {
    const [value, setValue] = useState("Hi")
    const [initials, setInitials] = useState("")
    useEffect(() => {
        let subscription
        async function setupSubscription() {
            subscription = API.graphql({
                query: subscriptions.counterChange,
                variables: { name: props.name},
                authMode: 'API_KEY',
            }).subscribe({
                next: (data) => {
                    const counterChange = data.value.data.counterChange;
                    setValue(counterChange.value);
                }
            })
        }
        setupSubscription()
        return () => subscription.unsubscribe();
    }, [props.name])
    const sendUpdate = async (e) => {
        let newValue = value + initials;
        await API.graphql(graphqlOperation(mutations.setCounter, { name: props.name, value: newValue}))
    }

    return (
        <div>
            <input onChange={event => setInitials(event.target.value)} />
            <button onClick={sendUpdate}>Click Me</button>
            <h1>{value}</h1>
        </div>
    );
}
export default Click;
