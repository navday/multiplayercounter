import React, {Component, useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';
import API, {graphqlOperation} from "@aws-amplify/api";
import * as subscriptions from "./graphql/subscriptions";
import * as mutations from "./graphql/mutations";

function Click(props)  {

    const queryParams = new URLSearchParams(window.location.search);
    const [messages, setMessages] = useState([]);
    const page = queryParams.get('page');
    const user = queryParams.get('user');
    const [value, setValue] = useState("-> Here you will see the latest message that are sent from the other users on this page.")

    const handleAdd = (message) => {
        setMessages([...messages, message]);
    }

    useEffect(() => {
        let subscription
        async function setupSubscription() {
            subscription = API.graphql({
                query: subscriptions.counterChange,
                variables: { name: page},
                authMode: 'API_KEY',
            }).subscribe({
                next: (data) => {
                    let counterChange = data.value.data.counterChange;
                    setValue(counterChange.value);
                    let idValue = counterChange.value.toString().split(" | ")[0];
                    handleAdd({id:idValue, text:Date().toLocaleString()});
                    console.log(messages.length);
                }
            })
        }
        setupSubscription()
        return () => subscription.unsubscribe();
    }, [page])
    const sendUpdate = async (e) => {
        let newValue = user.toUpperCase() + " | " + Date().toLocaleString();
        await API.graphql(graphqlOperation(mutations.setCounter, { name: page, value: newValue}))
    }

    return (
        <div>
            <button onClick={sendUpdate}>Send</button>
            <h1>{value}</h1>
            <ul>
                {messages.map(item => (
                    <p key={item.id}>{item.text}</p>
                ))}
            </ul>
        </div>
    );
}
export default Click;
